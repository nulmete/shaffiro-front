// https://docs.cypress.io/api/introduction/api.html

import { getStore } from '../support/utils'

describe('Autenticación', () => {
  it('Un usuario dado de alta previamente y habilitado puede iniciar sesión', () => {
    // Visitar página de login
    cy.visit('/login')

    // Ingresar credenciales
    cy.get('input[name="username"]').type('nulmete')
    cy.get('input[name="password"]').type('Testpassword1')

    // Hacer click en el botón "Iniciar sesión"
    cy.contains('button', 'Iniciar sesión').click()

    // Verificar que el sistema redirecciona al usuario a /dashboard
    cy.location('pathname').should('equal', '/dashboard')

    // Verificar que el sistema muestra el botón "Cerrar sesión" en la barra de navegación
    cy.contains('a', 'Cerrar sesión')

    // Verificar que existe un token en el store
    getStore().its('state').its('auth.currentUser.token').should('exist').and('not.equal', 'null')
  })

  it('El formulario de inicio de sesión muestra un error si las credenciales ingresadas son incorrectas', () => {
    // Visitar página de login
    cy.visit('/login')

    // Ingresar credenciales incorrectas
    cy.get('input[name="username"]').type('incorrectUser')
    cy.get('input[name="password"]').type('incorrectPassword')

    // Hacer click en el botón "Iniciar sesión"
    cy.contains('button', 'Iniciar sesión').click()

    // Se muestra el mensaje de error
    cy.contains('Nombre de usuario o contraseña incorrectos')

    // Verificar que no existe un token en el store
    getStore().its('state').its('auth.currentUser.token').should('not.exist')
  })

  // it('El sistema envía un email para recuperar la contraseña un usuario con e-mail válido', () => {
  //   cy
  //     .request(
  //       'POST',
  //       'http://localhost:8080/api/account/reset-password/init',
  //       'nicoulmete1@gmail.com'
  //     )
  //     .then(response => {
  //       expect(response.status).to.eq(200)
  //     })
  // })

  it('El botón "Cerrar sesión" finaliza la sesión de un usuario que está logeado', () => {
    cy.logInUser()

    getStore().its('state').its('auth.currentUser.username').should('exist').and('equal', 'nulmete')
    getStore().its('state').its('auth.currentUser.token').should('exist')

    cy.wait(2000)

    // Hacer click en el botón "Cerrar sesión"
    cy.contains('a', 'Cerrar sesión').click()

    // Confirmar que el usuario ya no está logeado
    cy.contains('a', 'Iniciar sesión')

    // Verificar que no existe un token en el store
    getStore().its('state').its('auth.currentUser.token').should('not.exist')
  })

  /*
  it('Se muestran los links "Registrarse" e "Iniciar sesión" al no estar logeado', () => {
    cy.visit('/')
    cy.contains('a', 'Registrarse').should('have.attr', 'href', '/signup')
    cy.contains('a', 'Iniciar sesión').should('have.attr', 'href', '/login')
  })

  it('El formulario de inicio de sesión muestra un error si las credenciales ingresadas son incorrectas', () => {
    cy.visit('/login')

    // Ingresar credenciales incorrectas
    cy.get('input[name="username"]').type('usuarioIncorrecto')
    cy.get('input[name="password"]').type('contraseniaIncorrecta')

    // Hacer click en el botón "Iniciar sesión"
    cy.contains('button', 'Iniciar sesión').click()

    // Se muestra el mensaje de error
    cy.contains('Nombre de usuario o contraseña incorrectos')
  })

  it('Intentar acceder a una ruta que requiere autenticación sin estar logeado redirecciona a /login', () => {
    // Visitar ruta que requiere autenticación
    cy.visit('/abm')

    // Confirmar que se redirecciona a /login
    cy.location('pathname').should('include', '/login')
  })

  it('Iniciar sesión exitosamente redirecciona a /dashboard', () => {
    cy.visit('/login')

    // Ingresar credenciales válidas
    cy.get('input[name="username"]').type('admin')
    cy.get('input[name="password"]').type('admin')

    // Hacer click en el botón "Iniciar sesión"
    cy.contains('button', 'Iniciar sesión').click()

    // Verificar que se redirecciona a /dashboard
    cy.location('pathname').should('equal', '/dashboard')

    // Verificar que existe el botón "Cerrar sesión"
    cy.contains('a', 'Cerrar sesión')
  })

  it('Un inicio de sesión exitoso, después de haber intentado visitar una ruta que requiere autenticación, redirecciona a esta ruta', () => {
    // Visitar ruta que requiere autenticación
    cy.visit('/abm')

    // Verificar que se redirecciona a /login
    cy.location('pathname').should('equal', '/login')

    // Ingresar credenciales válidas
    cy.get('input[name="username"]').type('admin')
    cy.get('input[name="password"]').type('admin')

    // Hacer click en el botón "Iniciar sesión"
    cy.contains('button', 'Iniciar sesión').click()

    // Verificar que se redirecciona a /abm
    cy.location('pathname').should('equal', '/abm')

    // Verificar que existe el botón "Cerrar sesión"
    cy.contains('a', 'Cerrar sesión')
  })
  */
})
