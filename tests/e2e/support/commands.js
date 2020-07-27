// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add("login", (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add("drag", { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add("dismiss", { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This is will overwrite an existing command --
// Cypress.Commands.overwrite("visit", (originalFn, url, options) => { ... })

Cypress.Commands.add('login', () => {
  let token, authorities

  const usuario = {
    username: 'admin',
    password: 'admin',
    rememberMe: false
  }

  return cy
    .request('POST', 'http://localhost:8080/api/authenticate', usuario)
    .then(response => {
      expect(response.status).to.eq(200)
      expect(response.body).to.have.property('id_token')
      token = response.body.id_token
      return token
    })
    .then(token => {
      return cy.request({
        url: 'http://localhost:8080/api/account',
        auth: {
          bearer: token
        }
      })
    })
    .then(response => {
      expect(response.status).to.eq(200)
      expect(response.body).to.have.property('authorities')
      authorities = response.body.authorities
      return authorities
    })
    .then(() => {
      return {
        username: usuario.username,
        token,
        authorities
      }
    })
})
