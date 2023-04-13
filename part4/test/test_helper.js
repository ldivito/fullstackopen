const Blog = require('../models/blog')

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

const blogsInDb = async () => {
	const blogs = await Blog.find({})
	return blogs.map(blog => blog.toJSON())
}

module.exports = {blogFixtures, blogsInDb}