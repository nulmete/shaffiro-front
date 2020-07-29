describe('Administración de Dispositivos: Asociar (dar de alta)', () => {
  const dispositivosNoAsociados = [
    {
      mac: 'AAAA',
      puerto: 0,
      uuid: 'BBB'
    },
    {
      mac: 'CCCC',
      puerto: 0,
      uuid: 'DDDD'
    },
    {
      mac: 'EEEE',
      puerto: 0,
      uuid: 'FFFF'
    },
    {
      mac: 'GGGG',
      puerto: 0,
      uuid: 'HHHH'
    }
  ]

  let user
  let tercerDispositivo
  let cuartoDispositivo

  before(() => {
    cy
      .login()
      .then(response => {
        user = response
      })
      .then(() => {
        return cy
          .request({
            method: 'POST',
            url: 'http://localhost:8080/api/dispositivo-no-asociados',
            body: dispositivosNoAsociados[0],
            auth: {
              bearer: user.token
            }
          })
      })
      .then(() => {
        return cy
          .request({
            method: 'POST',
            url: 'http://localhost:8080/api/dispositivo-no-asociados',
            body: dispositivosNoAsociados[1],
            auth: {
              bearer: user.token
            }
          })
      })
      .then(() => {
        return cy
          .request({
            method: 'POST',
            url: 'http://localhost:8080/api/dispositivo-no-asociados',
            body: dispositivosNoAsociados[2],
            auth: {
              bearer: user.token
            }
          })
      })
      .then(response => {
        tercerDispositivo = response.body.id
        return cy
          .request({
            method: 'POST',
            url: 'http://localhost:8080/api/dispositivo-no-asociados',
            body: dispositivosNoAsociados[3],
            auth: {
              bearer: user.token
            }
          })
      })
      .then(response => {
        cuartoDispositivo = response.body.id
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
      .then(response => {
        // dirigirse a 'Listado de Dispositivos No Asociados'
        cy.get('.button').contains('Detectar dispositivos').click()
        cy.url('should.include', '/dispositivos/detectar')
      })
  })

  it('un usuario administrador puede asociar (dar de alta) un dispositivo detectado (1)', () => {
    cy.contains(dispositivosNoAsociados[0].mac)
    cy.get('.radio__input').first().check({ force: true })
    cy.get('.button').contains('Asociar').click()
    cy.get('#nombre').type('Sensor_Detectado_1')
    cy.get('#tipo').select('SENSOR')
    cy.get('.button').contains('Asociar').click()
    cy.url().should('include', '/dispositivos', () => {
      cy.get('.table').contains('Sensor_Detectado_1')
    })
    cy.visit('/dispositivos/detectar')
    cy.contains('Sensor_Detectado_1').should('not.exist')
  })

  it('un usuario administrador puede asociar (dar de alta) un dispositivo detectado (2)', () => {
    cy.contains(dispositivosNoAsociados[1].mac)
    cy.get('.radio__input').first().check({ force: true })
    cy.get('.button').contains('Asociar').click()
    cy.get('#nombre').type('Actuador_Detectado_1')
    cy.get('#tipo').select('ACTUADOR')
    cy.get('#configuracion').select('Lámpara LED')
    cy.get('.button').contains('Asociar').click()
    cy.url().should('include', '/dispositivos', () => {
      cy.get('.table').contains('Actuador_Detectado_1')
    })
    cy.visit('/dispositivos/detectar')
    cy.contains('Actuador_Detectado_1').should('not.exist')
  })

  it('un usuario administrador puede asociar (dar de alta) un dispositivo detectado (3)', () => {
    cy.contains(dispositivosNoAsociados[2].mac)
    cy.get('.radio__input').first().check({ force: true })
    cy.get('.button').contains('Asociar').click()
    cy.get('#nombre').type('Actuador_Incompleto')
    cy.get('.button').contains('Asociar').should('be.disabled')
    // eliminar el tercer dispositivo ya que no fue asociado
    cy
      .request({
        method: 'DELETE',
        url: `http://localhost:8080/api/dispositivo-no-asociados/${tercerDispositivo}`,
        auth: {
          bearer: user.token
        }
      })
  })

  it('un usuario administrador puede asociar (dar de alta) un dispositivo detectado (4)', () => {
    cy.contains(dispositivosNoAsociados[3].mac)
    cy.get('.radio__input').first().check({ force: true })
    cy.get('.button').contains('Asociar').click()
    cy.get('#nombre').type('Actuador_Vacio')
    cy.get('#nombre').focus().clear()
    cy.get('.input-error').should('exist').and('contain.text', 'Por favor, ingrese el nombre del dispositivo')
    cy.get('.button').contains('Asociar').should('be.disabled')
    // eliminar el cuarto dispositivo ya que no fue asociado
    cy
      .request({
        method: 'DELETE',
        url: `http://localhost:8080/api/dispositivo-no-asociados/${cuartoDispositivo}`,
        auth: {
          bearer: user.token
        }
      })
  })
})
