const { ApolloServer } = require('@apollo/server')
const { startStandaloneServer } = require('@apollo/server/standalone')
const mongoose = require('mongoose')
mongoose.set('strictQuery', false)
const Book = require('./models/book')
const Author = require('./models/author')
const User = require('./models/user')
const { GraphQLError } = require('graphql')
const jwt = require('jsonwebtoken')

require('dotenv').config()

const MONGODB_URI = process.env.MONGODB_URI

console.log('connecting to', MONGODB_URI)

mongoose.connect(MONGODB_URI)
	.then(() => {
		console.log('connected to MongoDB')
	})
	.catch((error) => {
		console.log('error connection to MongoDB:', error.message)
	})

const typeDefs = `
	type User {
		username: String!
		favoriteGenre: String!
		id: ID!
	}
	type Token {
		value: String!
	}
	type Query {
		me: User
	}
	type Book {
		title: String!
		author: Author!
		published: Int!
		id: ID!
		genres: [String!]!
	}
	type Author {
		name: String!
		id: ID!
		bookCount: Int
		born: Int
	}
	type Mutation {
		addBook(
			title: String!
			author: String!
			published: Int!
			genres: [String!]!
		): Book
		editAuthor(
			name: String!
			setBornTo: Int!
		): Author
		createUser(
			username: String!
			favoriteGenre: String!
		): User
		login(
			username: String!
			password: String!
		): Token
	}
  type Query {
    bookCount: Int!
    authorCount: Int!
    allBooks: [Book!]!
    allAuthors: [Author!]!
  }
`

const resolvers = {
	Query: {
		bookCount: async () => Book.collection.countDocuments(),
		authorCount: async () => Author.collection.countDocuments(),
		allBooks: async () => {
			const books = await Book.find({}).populate('author')
			return books
		},
		allAuthors: async () => {
			const authors = await Author.find({})
			return authors
		},
		me: (root, args, context) => {
			return context.currentUser
		}
	},
	Author : {
		bookCount: async (root) => {
			const books = await Book.find({ author: root._id })
			return books.length
		}
	},
	Mutation: {
		addBook: async (root, args, context) => {
			const author = await Author.findOne({ name: args.author })
			const currentUser = context.currentUser

			if (!currentUser) {
				throw new GraphQLError('not authenticated', {
					extensions: {
						code: 'UNAUTHENTICATED'
					}
				})
			}

			if (!author) {
				// Check if new author name is at least 4 characters long
				if (args.author.length < 4) {
					throw new GraphQLError('Author name must be at least 4 characters long', {
						extensions: {
							code: 'BAD_USER_INPUT'
						}
					})
				}

				const newAuthor = new Author({ name: args.author })
				try {
					await newAuthor.save()
				}
				catch (error) {
					throw new GraphQLError(error.message, {
						extensions: {
							code: 'BAD_USER_INPUT'
						}
					})
				}
			}
			const book = new Book({ ...args, author: author })

			if (args.title.length < 5) {
				throw new GraphQLError('Book title must be at least 5 characters long', {
					extensions: {
						code: 'BAD_USER_INPUT'
					}
				})
			}

			try {
				const savedBook = await book.save()
				return savedBook
			}
			catch (error) {
				throw new GraphQLError(error.message, {
					extensions: {
						code: 'BAD_USER_INPUT'
					}
				})
			}
		},
		editAuthor: async (root, args, context) => {
			const author = await Author.findOne({ name: args.name })
			const currentUser = context.currentUser

			if (!currentUser) {
				throw new GraphQLError('not authenticated', {
					extensions: {
						code: 'UNAUTHENTICATED'
					}
				})
			}

			if (!author) {
				return null
			}
			author.born = args.setBornTo
			try {
				await author.save()
			}
			catch (error) {
				throw new GraphQLError(error.message, {
					extensions: {
						code: 'BAD_USER_INPUT'
					}
				})
			}
		},
		createUser: async (root, args) => {
			const user = new User({ ...args })
			try {
				await user.save()
			}
			catch (error) {
				throw new GraphQLError(error.message, {
					extensions: {
						code: 'BAD_USER_INPUT'
					}
				})
			}
			return user
		},
		login: async (root, args) => {
			const user = await User.findOne({ username: args.username })
			if (!user || args.password !== 'secret') {
				throw new GraphQLError('wrong credentials', {
					extensions: {
						code: 'BAD_USER_INPUT'
					}
				})
			}

			const userForToken = {
				username: user.username,
				id: user._id,
			}

			return { value: jwt.sign(userForToken, process.env.JWT_SECRET) }
		},
	},
}

const server = new ApolloServer({
	typeDefs,
	resolvers,
})

startStandaloneServer(server, {
	listen: { port: 4000 },
	context: async ({ req }) => {
		const auth = req ? req.headers.authorization : null
		if (auth && auth.toLowerCase().startsWith('bearer ')) {
			const decodedToken = jwt.verify(
				auth.substring(7), process.env.JWT_SECRET
			)
			const currentUser = await User.findById(decodedToken.id)
			return { currentUser }
		}

	}
}).then(({ url }) => {
	console.log(`Server ready at ${url}`)
})