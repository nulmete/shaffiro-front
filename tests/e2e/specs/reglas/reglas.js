describe('Administración de Reglas: Dar de Alta', () => {
  let dispositivos = [
    {
      nombre: 'Sensor_Lampara',
      tipo: 'SENSOR',
      activo: true,
      configuracion: 'LUMENES',
      puerto: 0
    },
    {
      nombre: 'Actuador_Lampara',
      tipo: 'ACTUADOR',
      activo: true,
      configuracion: 'Lámpara LED',
      puerto: 0
    }
  ]

  let user

  before(() => {
    cy
      .login()
      .then(response => {
        user = response
        return response
      })
      .then(response => {
        return cy
          .request({
            method: 'POST',
            url: 'http://localhost:8080/api/dispositivos',
            body: dispositivos[0],
            auth: {
              bearer: user.token
            }
          })
      })
      .then(response => {
        return cy
          .request({
            method: 'POST',
            url: 'http://localhost:8080/api/dispositivos',
            body: dispositivos[1],
            auth: {
              bearer: user.token
            }
          })
      })
  })

  beforeEach(() => {
    cy.wait(1000)
    cy
      .visit('/reglas', {
        // dirigirse a 'Listado de Dispositivos' y guardar el JWT en localStorage
        onBeforeLoad (window) {
          window.localStorage.setItem('auth.currentUser', JSON.stringify(user))
        }
      })
      .then(response => {
        // dirigirse a 'Listado de Dispositivos No Asociados'
        cy.get('.button').contains('Crear regla').click()
        cy.url('should.include', '/reglas/crear')
      })
  })

  it('un usuario puede dar de alta una regla (1)', () => {
    cy.get('#nombre').type('Prender la luz del living')
    cy.get('#sensor').select('Nombre: Sensor_Lampara')
    cy.get('#actuador').select('Nombre: Actuador_Lampara')
    cy.get('#magnitud').select('el Flujo Luminoso')
    cy.get('#operador').select('mayor a')
    cy.get('#valor').type('5000')
    cy.get('.btn--condicion').click()
    cy.get('#accion').select('Apagar')
    cy.get('.button').contains('Crear Regla').click()
    cy.url().should('include', '/reglas')
    cy.contains('Prender la luz del living').should('exist')
  })
})
