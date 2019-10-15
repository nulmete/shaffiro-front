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

import { getStore } from './utils'

Cypress.Commands.add(
  'logInUser',

  // Asignar username y password al objeto vacío del miembro derecho como valores default
  // Si no se escribe {} en la parte derecha, la función tendría que ser invocada con algún parámetro
  // En este caso, se puede invocar la función sin parámetros
  ({ username = 'nulmete', password = 'Testpassword1' } = {}) => {
    cy.location('pathname').then(pathname => {
      if (pathname === 'blank') {
        cy.visit('/')
      }
    })
    getStore().then(store =>
      store.dispatch('auth/logIn', { username, password })
    )
  }
)
