require('dotenv').config()

let JWT_SECRET = process.env.JWT_SECRET
let PORT = process.env.PORT
let MONGODB_URI = process.env.MONGODB_URI

if (process.env.NODE_ENV === 'test') {
	MONGODB_URI = process.env.TEST_MONGODB_URI
}

module.exports = { JWT_SECRET, MONGODB_URI, PORT }