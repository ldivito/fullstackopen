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
		Book: [Book!]!
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
    allBooks(genres: String): [Book!]!
    allAuthors: [Author!]!
    allGenres: [String!]!
  }
  type Subscription {
  	bookAdded: Book!
  	authorAdded: Author!
	}
`

module.exports = typeDefs