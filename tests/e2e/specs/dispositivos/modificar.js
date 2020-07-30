describe('Administración de Dispositivos: usuario administrador puede modificar dispositivos asociados', () => {
  let user
  let primerDispositivo
  let segundoDispositivo

  before(() => {
    cy
      .login()
      .then(response => {
        user = response
        return cy.crearDispositivos(user)
      })
      .then(response => {
        primerDispositivo = response.primerDispositivo
        segundoDispositivo = response.segundoDispositivo
      })
  })

  beforeEach(() => {
    cy
      .visit('/dispositivos', {
        // dirigirse a 'Listado de Dispositivos' y guardar el JWT en localStorage
        onBeforeLoad (window) {
          window.localStorage.setItem('auth.currentUser', JSON.stringify(user))
        }
      })
  })

  it('(1) - El usuario administrador puede editar y guardar un dispositivo si no modifica ninguno de sus campos', () => {
    cy.contains('Sensor_Lampara')
    cy.get('.radio__input').first().check({ force: true })
    cy.get('.button').contains('Editar').click()
    cy.wait(500)
    cy.get('#submit').click()
    cy.contains('Sensor_Lampara').should('exist')
  })

  it('(2) - El usuario administrador puede editar y guardar un dispositivo si modifica su nombre y estado', () => {
    cy.contains('Sensor_Lampara')
    cy.get('.radio__input').first().check({ force: true })
    cy.get('.button').contains('Editar').click()
    cy.wait(500)
    cy.get('#nombre').type(' 2.0')
    cy.get('#device-state').uncheck({ force: true })
    cy.get('#submit').click()
    cy.contains('Sensor_Lampara 2.0').should('exist')
    cy.get('#modificar').contains('Deshabilitado')
  })

  it('(3) - El usuario administrador NO puede editar y guardar un dispositivo si modifica su nombre y lo deja vacío', () => {
    cy.contains('Sensor_Lampara 2.0')
    cy.get('.radio__input').first().check({ force: true })
    cy.get('.button').contains('Editar').click()
    cy.wait(500)
    cy.get('#nombre').clear()
    cy.get('.input-error').should('exist').and('contain.text', 'Por favor, ingrese el nombre del dispositivo')
    cy.get('#submit').should('be.disabled')
  })

  // eliminar dispositivos que fueron asociados
  after(() => {
    return cy
      .request({
        method: 'DELETE',
        url: `http://localhost:8080/api/dispositivos/${primerDispositivo}`,
        auth: {
          bearer: user.token
        }
      })
      .then(response => {
        expect(response.status).to.eq(200)
        return cy
          .request({
            method: 'DELETE',
            url: `http://localhost:8080/api/dispositivos/${segundoDispositivo}`,
            auth: {
              bearer: user.token
            }
          })
      })
      .then(response => {
        expect(response.status).to.eq(200)
      })
  })
})
