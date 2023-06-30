describe('Blog app', function() {
  beforeEach(function() {
    cy.request('POST', 'http://localhost:3001/api/testing/reset')
    cy.visit('http://localhost:3000')
  })

  it('Login for is shown', function() {
    cy.visit('http://localhost:3000/')
    cy.contains('Log in to application')
  })
})