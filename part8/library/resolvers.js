const Book = require("./models/book");
const Author = require("./models/author");
const {GraphQLError} = require("graphql/index");
const User = require("./models/user");
const jwt = require("jsonwebtoken");

const { PubSub } = require('graphql-subscriptions')
const pubsub = new PubSub()

const resolvers = {
	Query: {
		bookCount: async () => Book.collection.countDocuments(),
		authorCount: async () => Author.collection.countDocuments(),
		allBooks: async (root, args) => {
			// If a genre is specified, return books of that genre
			if (args.genres) {
				const books = await Book.find({ genres: { $in: [args.genres] } }).populate('author')
				return books
			}

			// If no genre is specified, return all books
			const books = await Book.find({}).populate('author')
			return books
		},
		allAuthors: async () => {
			const authors = await Author.find({}).populate('books')
			return authors
		},
		allGenres: async () => {
			const books = await Book.find({})
			const genres = books.reduce((acc, book) => {
				book.genres.forEach(genre => {
					acc.add(genre)
				})
				return acc
			}, new Set())
			return Array.from(genres)
		},
		me: (root, args, context) => {
			return context.currentUser
		}
	},
	Author : {
		bookCount: async (root) => {
			/*
			const books = await Book.find({ author: root._id })
			return books.length
			*/
			return root.books.length
		}
	},
	Mutation: {
		addBook: async (root, args, context) => {
			let author = await Author.findOne({ name: args.author });

			/*
			const currentUser = context.currentUser

			if (!currentUser) {
				throw new GraphQLError('not authenticated', {
					extensions: {
						code: 'UNAUTHENTICATED'
					}
				})
			}
			*/

			if (!author) {
				// Check if new author name is at least 4 characters long
				if (args.author.length < 4) {
					throw new GraphQLError('Author name must be at least 4 characters long', {
						extensions: {
							code: 'BAD_USER_INPUT'
						}
					})
				}

				author = new Author({ name: args.author });
				try {
					await author.save();

					pubsub.publish('AUTHOR_ADDED', { authorAdded: author })
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

				author.books = author.books.concat(savedBook._id)
				await author.save()

				pubsub.publish('BOOK_ADDED', { bookAdded: savedBook })
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
	Subscription: {
		bookAdded: {
			subscribe: () => pubsub.asyncIterator(['BOOK_ADDED'])
		},
		authorAdded: {
			subscribe: () => pubsub.asyncIterator(['AUTHOR_ADDED'])
		}
	}
}

module.exports = resolvers