// https://docs.cypress.io/api/introduction/api.html

describe('Autenticación', () => {
  it('Se muestran los links "Registrarse" e "Iniciar sesión" al no estar logeado', () => {
    cy.visit('/')
    cy.contains('a', 'Registrarse').should('have.attr', 'href', '/signup')
    cy.contains('a', 'Iniciar sesión').should('have.attr', 'href', '/signin')
  })

  it('El formulario de inicio de sesión muestra un error si las credenciales ingresadas son incorrectas', () => {
    cy.visit('/signin')

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
    cy.location('pathname').should('include', '/signin')
  })

  it('Iniciar sesión exitosamente redirecciona a /dashboard', () => {
    cy.visit('/signin')

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
    cy.location('pathname').should('equal', '/signin')

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

  it('El botón "Cerrar sesión" finaliza la sesión de un usuario que está logeado', () => {
    cy.visit('/signin')

    // Ingresar credenciales válidas
    cy.get('input[name="username"]').type('admin')
    cy.get('input[name="password"]').type('admin')

    // Hacer click en el botón "Iniciar sesión"
    cy.contains('button', 'Iniciar sesión').click()

    // Hacer click en el botón "Cerrar sesión"
    cy.contains('a', 'Cerrar sesión').click()

    // Confirmar que el usuario ya no está logeado
    cy.contains('a', 'Iniciar sesión')
  })
})
