const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const helper = require('./test_helper')
const User = require('../models/user')

const api = supertest(app)

beforeAll(async () => {
	await User.deleteMany({})
	for (let u of helper.userFixtures) {
		await new User(u).save()
	}
})

describe('New user test', () => {

	test('a user can be added', async () => {
		const usersAtStart = await helper.usersInDb()

		const newUser = {
			username: 'test',
			name: 'User',
			password: 'passwordtest'
		}
		const response = await api
			.post('/api/users')
			.send(newUser)
			.expect(201)
			.expect('Content-Type', /application\/json/)

		expect(response.body.id).toBeDefined()
		expect(response.body.username).toBe(newUser.username)
		expect(response.body.name).toEqual(newUser.name)

		const usersAtEnd = await helper.usersInDb()
		expect(usersAtEnd.length).toBe(usersAtStart.length + 1)
	})

	test('cannot add a user with the same username as another user', async () => {
		const usersAtStart = await helper.usersInDb()

		const newUser = {
			username: 'test',
			name: 'Test User',
			password: 's3cret'
		}
		const response = await api
			.post('/api/users')
			.send(newUser)
			.expect(400)
			.expect('Content-Type', /application\/json/)

		expect(response.body.error).toEqual(expect.stringContaining('expected `username` to be unique'))

		const usersAtEnd = await helper.usersInDb()
		expect(usersAtEnd.length).toBe(usersAtStart.length)
	})

	test('cannot add a user without a username', async () => {
		const usersAtStart = await helper.usersInDb()

		const newUser = {
			name: 'Test User',
			password: 's3cret'
		}
		const response = await api
			.post('/api/users')
			.send(newUser)
			.expect(400)
			.expect('Content-Type', /application\/json/)

		expect(response.body.error).toEqual(expect.stringContaining('Path `username` is required'))

		const usersAtEnd = await helper.usersInDb()
		expect(usersAtEnd.length).toBe(usersAtStart.length)
	})

	test('cannot add a user without a password', async () => {
		const usersAtStart = await helper.usersInDb()

		// Add new user
		const newUser = {
			username: 'nopassword',
			name: 'Usertest'
		}
		const response = await api
			.post('/api/users')
			.send(newUser)
			.expect(400)
			.expect('Content-Type', /application\/json/)

		expect(response.body.error).toBe('Please provide a password')

		const usersAtEnd = await helper.usersInDb()
		expect(usersAtEnd.length).toBe(usersAtStart.length)
	})

	test('cannot add a user with a username < 3 characters', async () => {
		const usersAtStart = await helper.usersInDb()

		// Add new user
		const newUser = {
			username: 'te',
			name: 'Test User',
			password: 's3cret'
		}
		const response = await api
			.post('/api/users')
			.send(newUser)
			.expect(400)
			.expect('Content-Type', /application\/json/)

		// Make sure the correct error message was returned
		expect(response.body.error).toEqual(expect.stringContaining('is shorter than the minimum allowed length'))

		// Verify that the total number of users is unchanged
		const usersAtEnd = await helper.usersInDb()
		expect(usersAtEnd.length).toBe(usersAtStart.length)
	})

	test('cannot add a user with a password < 3 characters', async () => {
		const usersAtStart = await helper.usersInDb()

		// Add new user
		const newUser = {
			username: 'shortpassword',
			name: 'Test User',
			password: 's3'
		}
		const response = await api
			.post('/api/users')
			.send(newUser)
			.expect(400)
			.expect('Content-Type', /application\/json/)

		// Make sure the correct error message was returned
		expect(response.body.error).toBe('Password must be at least 3 characters')

		// Verify that the total number of users is unchanged
		const usersAtEnd = await helper.usersInDb()
		expect(usersAtEnd.length).toBe(usersAtStart.length)
	})
})

afterAll(() => {
	mongoose.connection.close()
})