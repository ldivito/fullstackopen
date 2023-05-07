const usersRouter = require('express').Router()
const bcrypt = require('bcrypt')

const User = require('../models/user')

usersRouter.get('/', async (request, response) => {
	const users = await User.find({}).populate('blogs', {url: 1, title: 1, author: 1})
	return response.json(users.map(u => u.toJSON()))
})

usersRouter.post('/', async (request, response) => {
	// eslint-disable-next-line no-prototype-builtins
	if (!request.body.hasOwnProperty('password')) {
		return response.status(400).json({error: 'Please provide a password'})
	}
	if (request.body.password.length < 3) {
		return response.status(400).json({ error: 'Password must be at least 3 characters' })
	}

	const saltRounds = 10
	const passwordHash = await bcrypt.hash(request.body.password, saltRounds)

	const u = new User({
		username: request.body.username,
		name: request.body.name,
		passwordHash: passwordHash
	})
	const result = await u.save()
	return response.status(201).json(result)
})

module.exports = usersRouter