const { ApolloServer } = require('@apollo/server')
const { startStandaloneServer } = require('@apollo/server/standalone')
const mongoose = require('mongoose')
mongoose.set('strictQuery', false)
const Book = require('./models/book')
const Author = require('./models/author')
const { GraphQLError } = require('graphql')

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
	type Book {
		title: String!
		author: Author!
		published: Int!
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
			const books = await Book.find({})
			return books
		},
		allAuthors: async () => {
			const authors = await Author.find({})
			return authors
		}
	},
	Author : {
		bookCount: (root) => {
			const books = Book.find({ author: root._id })
			return books.length
		}
	},
	Mutation: {
		addBook: async (root, args) => {
			const author = await Author.findOne({ name: args.author })
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
		editAuthor: async (root, args) => {
			const author = await Author.findOne({ name: args.name })
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
	},
}

const server = new ApolloServer({
	typeDefs,
	resolvers,
})

startStandaloneServer(server, {
	listen: { port: 4000 },
}).then(({ url }) => {
	console.log(`Server ready at ${url}`)
})