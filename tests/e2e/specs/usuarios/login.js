describe('Administración de Usuarios: Login', () => {
  const correctUsername = 'admin'
  const correctPassword = 'admin'
  const incorrectUsername = 'incorrectusername'
  const incorrectPassword = 'incorrectpassword'

  const notActivatedUser = {
    email: 'nicoulmete1@gmail.com',
    langKey: 'es',
    login: 'nicolas123',
    password: 'Nicolas987'
  }

  const credentialsError = 'Nombre de usuario o contraseña incorrectos.'
  const notActivatedError = 'El usuario ingresado no se encuentra habilitado. Por favor, revise su casilla de correo electrónico para completar el proceso de activación.'

  beforeEach(() => {
    cy.visit('/login')
  })

  it('(1) - si el usuario ingresa las credenciales correctas, debe iniciar sesión y ser redirigido a /reglas', () => {
    cy.get('#username').type(correctUsername)
    cy.get('#password').type(`${correctPassword}{enter}`)

    cy.url().should('include', '/reglas', () => {
      expect(JSON.parse(localStorage.getItem('auth.currentUser')).token).to.exist()
    })
  })

  it('(2) - si el usuario ingresa una contraseña incorrecta, debe mostrar `nombre de usuario o contraseña incorrectos`', () => {
    cy.get('#username').type(correctUsername)
    cy.get('#password').type(`${incorrectPassword}{enter}`)

    cy.url().should('not.include', '/reglas', () => {
      expect(JSON.parse(localStorage.getItem('auth.currentUser')).token).to.not.exist()
    })

    cy.get('.error.card').contains(credentialsError)
  })

  it('(3) - si el usuario ingresa un nombre de usuario incorrecto, debe mostrar `nombre de usuario o contraseña incorrectos`', () => {
    cy.get('#username').type(incorrectUsername)
    cy.get('#password').type(`${correctPassword}{enter}`)

    cy.url().should('not.include', '/reglas', () => {
      expect(JSON.parse(localStorage.getItem('auth.currentUser')).token).to.not.exist()
    })

    cy.get('.error.card').contains(credentialsError)
  })

  it('(4) - si el nombre de usuario ingresado no está habilitado, debe mostrar un mensaje de error de activación', () => {
    // crear un usuario (por defecto tiene el estado deshabilitado)
    cy
      .request('POST', 'http://localhost:8080/api/register', notActivatedUser)
      .then(response => {
        expect(response.status).to.eq(201)
      })

    cy.get('#username').type(notActivatedUser.login)
    cy.get('#password').type(`${notActivatedUser.password}{enter}`)

    cy.url().should('not.include', '/reglas', () => {
      expect(JSON.parse(localStorage.getItem('auth.currentUser')).token).to.not.exist()
    })

    cy.get('.error.card').contains(notActivatedError)
  })
})
