const usersRouter = require('express').Router()
const bcrypt = require('bcrypt')

const User = require('../models/user')

usersRouter.get('/', async (request, response) => {
	const users = await User.find({})
	return response.json(users.map(u => u.toJSON()))
})

usersRouter.post('/', async (request, response) => {
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