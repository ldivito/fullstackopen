const blogsRouter = require('express').Router()
const Blog = require('../models/blog')

blogsRouter.get('/api/blogs', (request, response) => {
	Blog
		.find({})
		.then(blogs => {
			return response.json(blogs.map(blog => blog.toJSON()))
		})
})

blogsRouter.post('/api/blogs', async (request, response) => {
	const blog = new Blog(request.body)

	const result = await blog.save()
	return response.status(201).json(result)
})

module.exports = blogsRouter