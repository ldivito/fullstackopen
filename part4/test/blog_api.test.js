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

		const get_response = await api.get('/api/blogs')
		expect(get_response.body.length).toEqual(helper.blogFixtures.length + 1)
	})
})

afterAll(() => {
	mongoose.connection.close()
}) 