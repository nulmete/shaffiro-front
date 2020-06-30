// https://docs.cypress.io/api/introduction/api.html

import { getStore } from '../support/utils'

describe('Un usuario dado de alta previamente y con estado "Habilitado" puede iniciar sesión en la aplicación y asociar un dispositivo', () => {
  // Entrada 1: usuario y contraseña correctos; usuario "habilitado"
  it('Usuario y contraseña correctos', () => {
    // Visitar página de login
    cy.visit('/login')

    // Ingresar credenciales
    cy.get('input[name="username"]').type('admin')
    cy.get('input[name="password"]').type('admin')

    cy.wait(2000)

    // Hacer click en el botón "Iniciar sesión"
    cy.contains('button', 'Iniciar sesión').click()

    // Verificar que el sistema redirecciona al usuario a /dashboard
    // cy.location('pathname').should('equal', '/')

    // Verificar que el sistema muestra el botón "Cerrar sesión" en la barra de navegación
    cy.contains('a', 'Cerrar sesión')

    // Verificar que existe un token en el store
    getStore().its('state').its('auth.currentUser.token').should('exist').and('not.equal', 'null')

    cy.wait(2000)

    cy.visit('/dispositivos')
    cy.contains('button', 'Detectar dispositivos').click()
    cy.wait(2000)
    cy.contains('button', 'Asociar').click()
    cy.wait(2000)
    cy.get('input[name="nombre"]').type('Test disp 1')
    cy.get('tipo').select('ACTUADOR')
    cy.get('[type="checkbox"]').check()
    cy.contains('button', 'Asociar').click()
  })
})
