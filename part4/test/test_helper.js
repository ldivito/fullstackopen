const jwt = require('jsonwebtoken')
const config = require('../utils/config')
const Blog = require('../models/blog')
const User = require('../models/user')

const blogFixtures = [
	{
		'title': 'Hello World',
		'author': 'Carl',
		'url': 'http://localhost:3003',
		'likes': 12,
		'user': '5e9ce38e8b0fa755c6f25dc3'
	},
	{
		'title': 'This is a blog post',
		'author': 'Ramson',
		'url': 'http://localhost:3003',
		'likes': 3,
		'user': '5e9ce4608b0fa755c6f25dc4'
	}
]

const userFixtures = [
	{
		'username': 'root',
		'name': 'Root User',
		'passwordHash': '88787d8ff144c502c7f5cffaafe2cc588d86079f9de88326b0cb99ce91c6',
		'blogs': []
	}
]

const blogsInDb = async () => {
	const blogs = await Blog.find({})
	return blogs.map(blog => blog.toJSON())
}

const usersInDb = async () => {
	const users = await User.find({})
	return users.map(u => u.toJSON())
}

const getTokenForUser = (user) => {
	const jwt_user = {
		username: user.username,
		id: user.id
	}
	return jwt.sign(jwt_user, config.JWT_SECRET)
}

module.exports = {
	blogFixtures,
	blogsInDb,
	getTokenForUser,
	userFixtures,
	usersInDb
}