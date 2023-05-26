// Third-Party Imports
const blogsRouter = require('express').Router()
// My Imports
const Blog = require('../models/blog')
const User = require('../models/user')
const jsonwebtoken = require('jsonwebtoken')
const config = require('../utils/config')

blogsRouter.get('/', async (request, response) => {
	const blogs = await Blog.find({}).populate('user', { username: 1, name: 1 })
	return response.json(blogs.map(blog => blog.toJSON()))
})

blogsRouter.post('/', async (request, response) => {

	const decodedToken = jsonwebtoken.verify(request.token, config.JWT_SECRET)

	// eslint-disable-next-line no-prototype-builtins
	if (!request.body.hasOwnProperty('title')) {
		return response.status(400).json({error: 'Missing title property'})
	}
	// eslint-disable-next-line no-prototype-builtins
	if (!request.body.hasOwnProperty('url')) {
		return response.status(400).json({error: 'Missing url property'})
	}

	const loggedInUser = await User.findById(decodedToken.id)

	const blog = new Blog({
		title: request.body.title,
		author: request.body.author,
		url: request.body.url,
		likes: request.body.likes === undefined ? 0 : request.body.likes,
		user: loggedInUser._id
	})

	const savedBlog = await blog.save()

	loggedInUser.blogs = loggedInUser.blogs.concat(savedBlog._id)
	await loggedInUser.save()

	return response.status(201).json(savedBlog)
})

blogsRouter.delete('/:id', async (request, response) => {
	const decodedToken = jsonwebtoken.verify(request.token, config.JWT_SECRET)

	const blogToRemove = await Blog.findById(request.params.id)
	if (!blogToRemove) {
		return response.status(204).end()
	}

	if (blogToRemove.user.toString() === decodedToken.id.toString()) {
		await Blog.findByIdAndRemove(request.params.id)
		return response.status(204).end()
	}
	else {
		return response.status(400).json({error: 'User has no permission to delete this blog'})
	}
})

blogsRouter.put('/:id', async (request, response) => {

	if (!request.body.hasOwnProperty('title')) {
		return response.status(400).json({error: 'Missing title'})
	}

	if (!request.body.hasOwnProperty('url')) {
		return response.status(400).json({error: 'Missing url'})
	}

	const nBlog = {
		title: request.body.title,
		author: request.body.author,
		url: request.body.url,
		likes: request.body.likes === undefined ? 0 : request.body.likes
	}

	const updateBlog = await Blog.findByIdAndUpdate(request.params.id, nBlog, {new: true})
	return response.json(updateBlog.toJSON())
})

module.exports = blogsRouter