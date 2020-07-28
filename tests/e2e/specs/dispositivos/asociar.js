describe('Administración de Dispositivos: Asociar (dar de alta)', () => {
  const dispositivoNoAsociado = {
    mac: '00:A0:C9:14:DE:FG',
    uuid: '3c69fa64-cfbc-asdqwe'
  }

  let dispositivoId
  let user

  before(() => {
    cy
      .login()
      .then(response => {
        user = response
      })
  })

  beforeEach(() => {
    cy.wait(1000)
    cy
      .visit('/dispositivos', {
        // dirigirse a 'Listado de Dispositivos' y guardar el JWT en localStorage
        onBeforeLoad (window) {
          window.localStorage.setItem('auth.currentUser', JSON.stringify(user))
        }
      })
      .then(() => {
        // crear dispositivo no asociado
        return cy
          .request({
            method: 'POST',
            url: 'http://localhost:8080/api/dispositivo-no-asociados',
            body: dispositivoNoAsociado,
            auth: {
              bearer: user.token
            }
          })
      })
      .then(response => {
        dispositivoId = response.body.id
        // dirigirse a 'Listado de Dispositivos No Asociados'
        cy.get('.button').contains('Detectar dispositivos').click()
        cy.url('should.include', '/dispositivos/detectar')
      })
  })

  it('un usuario administrador puede asociar (dar de alta) un dispositivo detectado (1)', () => {
    cy.contains(dispositivoNoAsociado.mac)
    cy.get('.radio__input').check({ force: true })
    cy.get('.button').contains('Asociar').click()
    cy.get('#nombre').type('Sensor_Lámpara_Living')
    cy.get('#tipo').select('SENSOR')
    cy.get('#device-state').check({ force: true })
    cy.get('.button').contains('Asociar').click()
    cy.url().should('include', '/dispositivos', () => {
      cy.get('.table').contains('Sensor_Lámpara_Living')
    })
    cy.visit('/dispositivos/detectar')
    cy.contains('Sensor_Lámpara_Living').should('not.exist')
  })

  it('un usuario administrador puede asociar (dar de alta) un dispositivo detectado (2)', () => {
    cy.contains(dispositivoNoAsociado.mac)
    cy.get('.radio__input').check({ force: true })
    cy.get('.button').contains('Asociar').click()
    cy.get('#nombre').type('Actuador_Lámpara_Living')
    cy.get('#tipo').select('ACTUADOR')
    cy.get('#configuracion').select('Lámpara LED')
    cy.get('#device-state').check({ force: true })
    cy.get('.button').contains('Asociar').click()
    cy.url().should('include', '/dispositivos', () => {
      cy.get('.table').contains('Actuador_Lámpara_Living')
    })
    cy.visit('/dispositivos/detectar')
    cy.contains('Actuador_Lámpara_Living').should('not.exist')
  })

  it('un usuario administrador puede asociar (dar de alta) un dispositivo detectado (3)', () => {
    cy.contains(dispositivoNoAsociado.mac)
    cy.get('.radio__input').check({ force: true })
    cy.get('.button').contains('Asociar').click()
    cy.get('#nombre').type('Actuador_Lámpara_Living')
    cy.get('#device-state').check({ force: true })
    cy.get('.button').contains('Asociar').should('be.disabled')

    // borrar el dispositivo asociado creado en beforeEach()
    cy
      .request({
        method: 'DELETE',
        url: `http://localhost:8080/api/dispositivo-no-asociados/${dispositivoId}`,
        auth: {
          bearer: user.token
        }
      })
      .then(response => {
        expect(response.status).to.eq(200)
      })
  })

  it('un usuario administrador puede asociar (dar de alta) un dispositivo detectado (4)', () => {
    cy.contains(dispositivoNoAsociado.mac)
    cy.get('.radio__input').check({ force: true })
    cy.get('.button').contains('Asociar').click()
    cy.get('#nombre').type('Actuador_Lámpara_Living')
    cy.get('#device-state').check({ force: true })
    cy.get('#nombre').focus().clear()
    cy.get('.input-error').should('exist').and('contain.text', 'Por favor, ingrese el nombre del dispositivo')
    cy.get('.button').contains('Asociar').should('be.disabled')

    // borrar el dispositivo asociado creado en beforeEach()
    cy
      .request({
        method: 'DELETE',
        url: `http://localhost:8080/api/dispositivo-no-asociados/${dispositivoId}`,
        auth: {
          bearer: user.token
        }
      })
      .then(response => {
        expect(response.status).to.eq(200)
      })
  })
})
