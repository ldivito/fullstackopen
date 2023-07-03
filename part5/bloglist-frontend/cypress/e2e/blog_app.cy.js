describe('Blog app', function() {
  beforeEach(function() {
    cy.request('POST', 'http://localhost:3001/api/testing/reset')
    const user = {
      name: 'Matti Luukkainen',
      username: 'mluukkai',
      password: 'salainen'
    }
    cy.request('POST', 'http://localhost:3001/api/users/', user)

    const userAlt = {
      name: 'Leandro',
      username: 'ldivito',
      password: 'root'
    }
    cy.request('POST', 'http://localhost:3001/api/users/', userAlt)

    cy.visit('http://localhost:3000')
  })

  it('Login for is shown', function() {
    cy.visit('http://localhost:3000/')
    cy.contains('Log in to application')
  })

  describe('Login',function() {
    it('succeeds with correct credentials', function() {
      cy.contains('log in').click()
      cy.get('#username').type('mluukkai')
      cy.get('#password').type('salainen')
      cy.get('#login-button').click()

      cy.contains('Matti Luukkainen logged in')
    })

    it('fails with wrong credentials', function() {
      cy.contains('log in').click()
      cy.get('#username').type('mluukkai')
      cy.get('#password').type('wrong')
      cy.get('#login-button').click()

      cy.contains('Wrong credentials')
    })
  })

  describe('When logged in', function() {
    beforeEach(function() {
      cy.get('#username').type('mluukkai')
      cy.get('#password').type('salainen')
      cy.get('#login-button').click()

    })

    it('A blog can be created', function() {
      cy.contains('New blog').click()
      cy.get('#title').type('New blog')
      cy.get('#author').type('Matti')
      cy.get('#url').type('google.com')
      cy.contains('save').click()

      cy.contains('New blog Matti')
    })

    it('A blog can be liked', function () {
      cy.contains('New blog').click()
      cy.get('#title').type('New blog')
      cy.get('#author').type('Matti')
      cy.get('#url').type('google.com')
      cy.contains('save').click()

      cy.contains('View').click()
      cy.contains('Like').click()

      cy.contains('Likes: 1')
    })

    it('A blog can be deleted', function () {
      cy.contains('New blog').click()
      cy.get('#title').type('New blog')
      cy.get('#author').type('Matti')
      cy.get('#url').type('google.com')
      cy.contains('save').click()

      cy.contains('View').click()
      cy.contains('Remove').click()

      cy.contains('New blog Matti').should('not.exist')
    })

    it('A blog cannot be deleted by another user', function () {
      cy.contains('New blog').click()
      cy.get('#title').type('New blog')
      cy.get('#author').type('Matti')
      cy.get('#url').type('google.com')
      cy.contains('save').click()

      cy.contains('Logout').click()

      cy.get('#username').type('ldivito')
      cy.get('#password').type('root')
      cy.get('#login-button').click()

      cy.contains('View').click()
      cy.contains('Delete').should('not.exist')
    })

    it('Blogs are ordered by like count in descending order', function () {
      cy.contains('New blog').click()
      cy.get('#title').type('First')
      cy.get('#author').type('Matti')
      cy.get('#url').type('google.com')
      cy.contains('save').click()

      cy.contains('View').click()
      cy.contains('Like').click()
      cy.contains('Like').click()

      cy.contains('New blog').click()
      cy.get('#title').type('Second')
      cy.get('#author').type('Matti')
      cy.get('#url').type('google.com')
      cy.contains('save').click()

      cy.contains('Second Matti')
          .contains('View').click()
      cy.contains('Second Matti').get('.likes').eq(1).contains('Like').click()


      cy.contains('New blog').click()
      cy.get('#title').type('Third')
      cy.get('#author').type('Matti')
      cy.get('#url').type('google.com')
      cy.contains('save').click()

      cy.contains('Third Matti')
          .contains('View').click()

      cy.contains('First Matti').get('.likes').eq(0).contains('Likes: 2')
      cy.contains('Second Matti').get('.likes').eq(1).contains('Likes: 1')
      cy.contains('Third Matti').get('.likes').eq(2).contains('Likes: 0')

    })

  })
})