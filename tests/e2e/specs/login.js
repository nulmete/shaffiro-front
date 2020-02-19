// https://docs.cypress.io/api/introduction/api.html

import { getStore } from '../support/utils'

describe('Un usuario dado de alta previamente y con estado "Habilitado" puede iniciar sesión en la aplicación', () => {
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
  })

  // Entrada 2: usuario correcto y contraseña incorrecta; usuario "habilitado"
  it('El formulario de inicio de sesión muestra un error si se ingresa un nombre de usuario correcto y una contraseña incorrecta', () => {
    // Visitar página de login
    cy.visit('/login')

    // Ingresar credenciales incorrectas
    cy.get('input[name="username"]').type('admin')
    cy.get('input[name="password"]').type('incorrecto')

    // Hacer click en el botón "Iniciar sesión"
    cy.contains('button', 'Iniciar sesión').click()

    // Se muestra el mensaje de error
    cy.contains('Nombre de usuario o contraseña incorrectos')

    // Verificar que no existe un token en el store
    getStore().its('state').its('auth.currentUser.token').should('not.exist')

    cy.wait(2000)
  })

  // Entrada 3: Usuario y contraseña incorrectos
  it('El formulario de inicio de sesión muestra un error si se ingresa un nombre de usuario y una contraseña incorrectos', () => {
    // Visitar página de login
    cy.visit('/login')

    // Ingresar credenciales incorrectas
    cy.get('input[name="username"]').type('incorrecto')
    cy.get('input[name="password"]').type('incorrecto')

    // Hacer click en el botón "Iniciar sesión"
    cy.contains('button', 'Iniciar sesión').click()

    // Se muestra el mensaje de error
    cy.contains('Nombre de usuario o contraseña incorrectos')

    // Verificar que no existe un token en el store
    getStore().its('state').its('auth.currentUser.token').should('not.exist')

    cy.wait(2000)
  })

  // Entrada 4: nombre usuario correcto, pero con estado "deshabilitado"
  it('El formulario de inicio de sesión muestra un error si el nombre de usuario ingresado no se encuentra "Habilitado"', () => {
    // Visitar página de login
    cy.visit('/login')

    // Ingresar credenciales incorrectas
    cy.get('input[name="username"]').type('test')
    cy.get('input[name="password"]').type('noesimportante')

    // Hacer click en el botón "Iniciar sesión"
    cy.contains('button', 'Iniciar sesión').click()

    // Se muestra el mensaje de error
    cy.contains('El usuario ingresado no se encuentra habilitado')

    // Verificar que no existe un token en el store
    getStore().its('state').its('auth.currentUser.token').should('not.exist')

    cy.wait(2000)
  })
})
