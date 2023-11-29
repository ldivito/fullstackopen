const { ApolloServer } = require('@apollo/server')
const { startStandaloneServer } = require('@apollo/server/standalone')
const { v1: uuid } = require('uuid')
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
    allBooks(author: String, genres: String): [Book!]!
    allAuthors: [Author!]!
    editAuthor(name: String!, setBornTo: Int!): Author
  }
`

const resolvers = {
	Query: {
		/*bookCount: () => books.length,
		authorCount: () => authors.length,
		allBooks: (root, args) => {
			if (args.author && args.genres) {
				return books.filter(
					b =>
						b.author === args.author &&
						b.genres.includes(args.genres)
				)
			}
			if (args.genres) {
				return books.filter(b => b.genres.includes(args.genres))
			}
			if (args.author) {
				return books.filter(b => b.author === args.author)
			}
			return books
		},
		allAuthors: () => authors,*/
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
		/*
		editAuthor: (root, args) => {
			const author = authors.find(a => a.name === args.name)
			if (!author) return null
			const updatedAuthor = { ...author, born: args.setBornTo }
			authors = authors.map(a => (a.name === args.name ? updatedAuthor : a))
			return updatedAuthor
		},*/
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