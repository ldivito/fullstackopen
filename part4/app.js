const express = require('express')
const app = express()
require('express-async-errors')
const cors = require('cors')
const mongoose = require('mongoose')

const config = require('./utils/config')
const loginRouter = require('./controllers/login')
const blogsRouter = require('./controllers/blogs')
const usersRouter = require('./controllers/users')
const logger = require('./utils/logger')
const middleware = require('./utils/middleware')

logger.info('connecting to', config.MONGODB_URI)

mongoose.connect(config.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
	.then(() => {
		logger.info('connected to MongoDB')
	})
	.catch((error) => {
		logger.error('error connecting to MongoDB:', error.message)
	})
mongoose.set('strictQuery', false)
mongoose.set('useFindAndModify', false)
mongoose.set('useCreateIndex', true)

app.use(cors())
app.use(express.static('build'))
app.use(express.json())
app.use(middleware.tokenExtractor)

app.use('/api/blogs', blogsRouter)
app.use('/api/login', loginRouter)
app.use('/api/users', usersRouter)

if (process.env.NODE_ENV === 'test') {
	const testingRouter = require('./controllers/testing')
	app.use('/api/testing', testingRouter)
}

app.use(middleware.errorHandler)

module.exports = app