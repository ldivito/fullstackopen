const config = require('../utils/config')
const User = require('../models/user')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const loginRouter = require('express').Router()

loginRouter.post('/', async (request, response) => {

	const user = await User.findOne({ username: request.body.username })
	if (!(user && await bcrypt.compare(request.body.password, user.passwordHash))) {
		return response.status(401).json({ error: 'Username or Password is incorrect' })
	}

	const userForToken = {
		username: user.username,
		id: user._id,
	}

	// eslint-disable-next-line no-undef
	const token = jwt.sign(userForToken, process.env.JWT_SECRET)

	response
		.status(200)
		.send({ token, username: user.username, name: user.name })
})

module.exports = loginRouter