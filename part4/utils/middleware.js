const errorHandler = (error, request, response, next) => {

	if (error.name === 'ValidationError') {
		return response.status(400).json({ error: error.message })
	}
	else if (error.name === 'JsonWebTokenError') {
		return response.status(401).json({ error: error.message })
	}

	next(error)
}

const tokenExtractor = (request, response, next) => {
	const authorization = request.get('authorization')
	request.token = null
	if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
		request.token = authorization.substring(7)
	}

	next()
}

module.exports = {
	errorHandler, tokenExtractor
}