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

	const jwt_user = {
		username: user.username,
		id: user._id
	}
	const jwt_token = jwt.sign(jwt_user, config.JWT_SECRET)

	return response.status(200).json({ token: jwt_token })
})

module.exports = loginRouter