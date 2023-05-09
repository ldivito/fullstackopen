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
		const fixturesWithNullUsers = helper.blogFixtures.map(blog => {
			const newBlog = {...blog}
			newBlog.user = null
			return newBlog
		})

		expect(body).toEqual(fixturesWithNullUsers)
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
		const usersAtStart = await helper.usersInDb()
		const token = helper.getTokenForUser(usersAtStart[0])

		const newBlog = {
			title: 'Hello there',
			author: 'Ben Kenobi',
			url: 'http://www.fullstackopen.com',
			likes: 99
		}
		const post_response = await api
			.post('/api/blogs')
			.set('Authorization', `bearer ${process.env.TOKEN}`)
			.send(newBlog)
			.expect(201)
			.expect('Content-Type', /application\/json/)

		expect(post_response.body.id).toBeDefined()

		expect(post_response.body.title).toEqual(newBlog.title)
		expect(post_response.body.author).toEqual(newBlog.author)
		expect(post_response.body.url).toEqual(newBlog.url)
		expect(post_response.body.likes).toEqual(newBlog.likes)
		expect(post_response.body.user).toEqual(usersAtStart[0].id)

		const blogsAtEnd = await helper.blogsInDb()
		expect(blogsAtEnd.length).toBe(blogsAtStart.length + 1)
	})

	test('A new blog cannot be added without a token', async () => {
		const blogsAtStart = await helper.blogsInDb()

		const newBlog = {
			title: 'New test blog',
			author: 'Tester',
			url: 'http://www.google.com',
			likes: 12
		}
		const response = await api
			.post('/api/blogs')
			.send(newBlog)
			.expect(401)
			.expect('Content-Type', /application\/json/)

		expect(response.body.error).toBeDefined()

		const blogsAtEnd = await helper.blogsInDb()
		expect(blogsAtEnd.length).toBe(blogsAtStart.length)
	})

	test('A new blog cannot be added with an invalid JWT', async () => {
		const blogsAtStart = await helper.blogsInDb()

		const newBlog = {
			title: 'New test blog',
			author: 'Tester',
			url: 'http://www.google.com',
			likes: 12
		}
		const response = await api
			.post('/api/blogs')
			.set('Authorization', 'Bearer invalid_token')
			.send(newBlog)
			.expect(401)
			.expect('Content-Type', /application\/json/)

		expect(response.body.error).toBeDefined()

		const blogsAtEnd = await helper.blogsInDb()
		expect(blogsAtEnd.length).toBe(blogsAtStart.length)
	})
	
	test('can add a new blog without likes and they default to 0', async () => {
		const newBlog = {
			title: 'Fake post',
			author: 'Olso',
			url: 'http://www.fullstackopen.com'
		}
		const response = await api
			.post('/api/blogs')
			.set('Authorization', `Bearer ${token}`)
			.send(newBlog)
			.expect(201)
			.expect('Content-Type', /application\/json/)

		expect(response.body.likes).toBe(0)
	})

	test('cannot add a new blog without a title', async () => {
		const blogsAtStart = await helper.blogsInDb()
		const usersAtStart = await helper.usersInDb()
		const token = helper.getTokenForUser(usersAtStart[0])

		const newBlog = {
			author: 'Fake post',
			url: 'http://www.fullstackopen.com'
		}
		const response = await api
			.post('/api/blogs')
			.set('Authorization', `Bearer ${token}`)
			.send(newBlog)
			.expect(400)
			.expect('Content-Type', /application\/json/)

		expect(response.body.error).toBe('Missing title property')

		const blogsAtEnd = await helper.blogsInDb()
		expect(blogsAtEnd.length).toBe(blogsAtStart.length)
	})

	test('cannot add a new blog without a url', async () => {
		const blogsAtStart = await helper.blogsInDb()
		const usersAtStart = await helper.usersInDb()
		const token = helper.getTokenForUser(usersAtStart[0])

		const newBlog = {
			title: 'Fake post',
			author: 'Jhonny'
		}
		const response = await api
			.post('/api/blogs')
			.set('Authorization', `Bearer ${token}`)
			.send(newBlog)
			.expect(400)
			.expect('Content-Type', /application\/json/)

		expect(response.body.error).toBe('Missing url property')

		const blogsAtEnd = await helper.blogsInDb()
		expect(blogsAtEnd.length).toBe(blogsAtStart.length)
	})
})

describe('delete your blog post', () => {

	test('can delete an existing blog post', async () => {
		const blogsAtStart = await helper.blogsInDb()
		const blogIdToDelete = blogsAtStart[blogsAtStart.length - 1].id
		const usersAtStart = await helper.usersInDb()
		const token = helper.getTokenForUser(usersAtStart[0])


		await api
			.delete('/api/blogs/' + blogIdToDelete)
			.set('Authorization', `Bearer ${token}`)
			.expect(204)

		const blogsAtEnd = await helper.blogsInDb()
		expect(blogsAtEnd.length).toBe(blogsAtStart.length - 1)
	})

	test('cannot delete another users blog', async () => {
		const blogsAtStart = await helper.blogsInDb()
		const blogIdToDelete = blogsAtStart[0].id
		const usersAtStart = await helper.usersInDb()
		const token = helper.getTokenForUser(usersAtStart[0])

		const response = await api
			.delete('/api/blogs/' + blogIdToDelete)
			.set('Authorization', `Bearer ${token}`)
			.expect(400)
			.expect('Content-Type', /application\/json/)

		// Make sure the user got an error message
		expect(response.body.error).toBe('Only the user who posted the blog can delete it')

		// the number of blogs in the system is unchanged
		const blogsAtEnd = await helper.blogsInDb()
		expect(blogsAtEnd.length).toBe(blogsAtStart.length)
	})

	test('deleting a non existing blog post has no effect', async () => {
		const blogsAtStart = await helper.blogsInDb()
		const usersAtStart = await helper.usersInDb()
		const token = helper.getTokenForUser(usersAtStart[0])

		await api
			.delete('/api/blogs/5e962f0db69261c21414f95d')
			.set('Authorization', `Bearer ${token}`)
			.expect(204)

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
		delete response.body.user
		expect(response.body).toEqual(nBlog)

		const blogsAtEnd = await helper.blogsInDb()
		expect(blogsAtEnd.length).toBe(blogsAtStart.length)

		delete blogsAtEnd[0].id
		delete blogsAtEnd[0].user
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