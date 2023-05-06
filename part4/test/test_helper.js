const Blog = require('../models/blog')
const User = require('../models/user')

const blogFixtures = [
	{
		'title': 'Hello World',
		'author': 'Carl',
		'url': 'http://localhost:3003',
		'likes': 12
	},
	{
		'title': 'This is a blog post',
		'author': 'Ramson',
		'url': 'http://localhost:3003',
		'likes': 3
	}
]

const userFixtures = [
	{
		'username': 'root',
		'name': 'Root User',
		'passwordHash': '88787d8ff144c502c7f5cffaafe2cc588d86079f9de88326b0cb99ce91c6'
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

module.exports = {blogFixtures, blogsInDb, userFixtures, usersInDb}