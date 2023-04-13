const mongoose = require('mongoose')
const supertest = require('supertest')
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

afterAll(() => {
	mongoose.connection.close()
}) 