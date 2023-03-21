require('http');
const app = require('./app') // the actual Express application
const config = require('./utils/config')
const logger = require('./utils/logger')

const PORT = process.env.PORT
app.listen(PORT, () => {
  logger.info(`Server running on port ${config.PORT}`)
})