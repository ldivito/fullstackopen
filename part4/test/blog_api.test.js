// Third-Party Dependencies
const mongoose = require('mongoose')
const supertest = require('supertest')

// My Dependencies
const app = require('../app')
const helper = require('./test_helper')
const Blog = require('../models/blog')

const api = supertest(app)

beforeAll(async () => {
	await Blog.deleteMany({})
	for (let blog of helper.blogFixtures) {
		await new Blog(blog).save()
	}
})

describe('list all blogs endpoint', () => {

	test('the blogs contain the fixture data', async () => {
		const response = await api
			.get('/api/blogs')
			.expect(200)
			.expect('Content-Type', /application\/json/)

		const body = response.body.map(blog => {
			delete blog.id
			return blog
		})
		expect(body).toEqual(helper.blogFixtures)
	})

	test('the blogs contain an "id" property', async () => {
		const response = await api.get('/api/blogs')

		response.body.forEach(blog => {
			expect(blog.id).toBeDefined()
		})
	})
})

describe('add new blog endpoint', () => {

	test('can add a new blog', async () => {
		const blogsAtStart = await helper.blogsInDb()

		const newBlog = {
			title: 'Hello there',
			author: 'Ben Kenobi',
			url: 'http://www.fullstackopen.com',
			likes: 99
		}
		const post_response = await api
			.post('/api/blogs')
			.send(newBlog)
			.expect(201)
			.expect('Content-Type', /application\/json/)

		expect(post_response.body.id).toBeDefined()

		delete post_response.body.id
		expect(post_response.body).toEqual(newBlog)

		const blogsAtEnd = await helper.blogsInDb()
		expect(blogsAtEnd.length).toBe(blogsAtStart.length + 1)
	})

	test('can add a new blog without likes and they default to 0', async () => {
		const newBlog = {
			title: 'Fake post',
			author: 'Olso',
			url: 'http://www.fullstackopen.com'
		}
		const response = await api
			.post('/api/blogs')
			.send(newBlog)
			.expect(201)
			.expect('Content-Type', /application\/json/)

		expect(response.body.likes).toBe(0)
	})

	test('cannot add a new blog without a title', async () => {
		const blogsAtStart = await helper.blogsInDb()

		const newBlog = {
			author: 'Fake post',
			url: 'http://www.fullstackopen.com'
		}
		const post_response = await api
			.post('/api/blogs')
			.send(newBlog)
			.expect(400)

		expect(post_response.body.error).toBeDefined()

		const blogsAtEnd = await helper.blogsInDb()
		expect(blogsAtEnd.length).toBe(blogsAtStart.length)
	})

	test('cannot add a new blog without a url', async () => {
		const blogsAtStart = await helper.blogsInDb()

		const newBlog = {
			title: 'Fake post',
			author: 'Jhonny'
		}
		const post_response = await api
			.post('/api/blogs')
			.send(newBlog)
			.expect(400)

		expect(post_response.body.error).toBeDefined()

		const blogsAtEnd = await helper.blogsInDb()
		expect(blogsAtEnd.length).toBe(blogsAtStart.length)
	})
})

describe('delete blog post', () => {

	test('can delete an existing blog post', async () => {
		const blogsAtStart = await helper.blogsInDb()
		const blogIdToDelete = blogsAtStart[blogsAtStart.length - 1].id

		await api
			.delete('/api/blogs/' + blogIdToDelete)
			.expect(204)

		const blogsAtEnd = await helper.blogsInDb()
		expect(blogsAtEnd.length).toBe(blogsAtStart.length - 1)
	})

	test('deleting a non existing blog post has no effect', async () => {
		const blogsAtStart = await helper.blogsInDb()
		await api.delete('/api/blogs/5e962f0db69261c21414f95d').expect(204)

		const blogsAtEnd = await helper.blogsInDb()
		expect(blogsAtEnd.length).toBe(blogsAtStart.length)
	})
})

describe('update blog', () => {

	test('user can update a blog', async () => {
		const blogsAtStart = await helper.blogsInDb()

		const nBlog = {
			title: 'New new',
			author: 'Mee',
			url: 'http://www.google.com',
			likes: 10,
		}
		const response = await api.put('/api/blogs/' + blogsAtStart[0].id).send(nBlog)

		expect(response.body.id).toBe(blogsAtStart[0].id)

		delete response.body.id
		expect(response.body).toEqual(nBlog)

		const blogsAtEnd = await helper.blogsInDb()
		expect(blogsAtEnd.length).toBe(blogsAtStart.length)

		delete blogsAtEnd[0].id
		expect(blogsAtEnd[0]).toEqual(nBlog)
	})

	test('cant update blog without a title', async () => {
		const blogsAtStart = await helper.blogsInDb()

		const newBlog = {
			author: 'Test',
			url: 'http://www.google.com'
		}
		const response = await api.put('/api/blogs/' + blogsAtStart[0].id).send(newBlog)

		// Make sure the user got an error message
		expect(response.body.error).toBeDefined()

		// the number of blogs in the system is unchanged
		const blogsAtEnd = await helper.blogsInDb()
		expect(blogsAtEnd.length).toBe(blogsAtStart.length)
	})

	test('cannot update an existing blog without a url', async () => {
		const blogsAtStart = await helper.blogsInDb()

		const newBlog = {
			title: 'Wrong',
			author: 'Me'
		}
		const response = await api.put('/api/blogs/' + blogsAtStart[0].id).send(newBlog)

		expect(response.body.error).toBeDefined()

		const blogsAtEnd = await helper.blogsInDb()
		expect(blogsAtEnd.length).toBe(blogsAtStart.length)
	})

	test('can update an existing blog without likes and they default to 0', async () => {
		const blogsAtStart = await helper.blogsInDb()
		const newBlog = {
			title: 'Another blog',
			author: 'Lisa',
			url: 'http://www.microsoft.com'
		}
		const response = await api.put('/api/blogs/' + blogsAtStart[0].id).send(newBlog)

		expect(response.body.likes).toBe(0)
	})
})

afterAll(async () => {
	await mongoose.connection.close()
})