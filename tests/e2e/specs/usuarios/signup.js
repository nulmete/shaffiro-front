describe('Administración de Usuarios: Alta', () => {
  const correctEmail = 'shaffiro123@gmail.com'
  const correctUsername = 'shaffiro123'
  const correctPassword = 'Shaffiro123'
  const incorrectEmail = 'shaffi'
  const incorrectUsername = 'user'
  const incorrectPassword = 'password'

  const user = {
    email: 'existinguser@gmail.com',
    id: 4,
    langKey: 'es',
    login: 'existinguser',
    activated: true,
    authorities: ['ROLE_USER']
  }

  // modificar "user" para que tenga un email valido
  before(() => {
    cy
      .login()
      .then(response => {
        return cy
          .request({
            method: 'PUT',
            url: 'http://localhost:8080/api/users',
            body: user,
            auth: {
              bearer: response.token
            }
          })
      })
      .then(response => {
        expect(response.status).to.eq(200)
      })
  })

  beforeEach(() => {
    cy.visit('/signup')
  })

  it('(1) - si un usuario ingresa los campos E-mail, Nombre, Contraseña y Confirmar Contraseña correctos, debe poder darse de alta', () => {
    cy.get('#email').type(correctEmail)
    cy.get('#username').type(correctUsername)
    cy.get('#password').type(correctPassword)
    cy.get('#confirm-password').type(`${correctPassword}{enter}`)
    cy.url().should('include', '/activate')
    cy.contains('Activar usuario')
    cy.contains('Usuario dado de alta con éxito')
  })

  it('(2) - si un usuario ingresa un Nombre de usuario en uso, NO debe poder darse de alta', () => {
    cy.get('#email').type(user.email)
    cy.get('#username').type(user.login)
    cy.get('#password').type(correctPassword)
    cy.get('#confirm-password').type(`${correctPassword}{enter}`)
    cy.url().should('not.include', '/activate')
    cy.contains('El nombre de usuario ingresado ya está en uso')
  })

  it('(3) - si un usuario ingresa un E-mail en uso, NO debe poder darse de alta', () => {
    cy.get('#email').type(user.email)
    cy.get('#username').type(correctUsername)
    cy.get('#password').type(correctPassword)
    cy.get('#confirm-password').type(`${correctPassword}{enter}`)
    cy.url().should('not.include', '/activate')
    cy.contains('El e-mail ingresado ya está en uso')
  })

  it('(4) - si el usuario ingresa una contraseña incorrecta, debe mostrar `nombre de usuario o contraseña incorrectos`', () => {
    cy.get('#email').type(user.email).clear()
    cy.get('#username').type(correctUsername).clear()
    cy.get('#password').type(correctPassword).clear()
    cy.get('#confirm-password').type(`${correctPassword}`).clear()
    cy.contains('Por favor, ingrese su e-mail')
    cy.contains('Por favor, ingrese su nombre de usuario')
    cy.contains('Por favor, ingrese su contraseña')
    cy.contains('Por favor, confirme su contraseña')
    cy.get('#submit').should('be.disabled')
  })

  it('(5) - si el usuario ingresa una contraseña incorrecta, debe mostrar `nombre de usuario o contraseña incorrectos`', () => {
    cy.get('#email').type(incorrectEmail)
    cy.get('#username').type(incorrectUsername)
    cy.get('#password').type(incorrectPassword)
    cy.get('#confirm-password').type('hola')
    cy.contains('Ingrese un e-mail válido (ejemplo: shaffiro@gmail.com)')
    cy.contains('Use entre 8 y 20 caracteres')
    cy.contains('Use entre 8 y 20 caracteres, y al menos una mayúscula y un número')
    cy.contains('Las contraseñas no coinciden')
    cy.get('#submit').should('be.disabled')
  })
})
