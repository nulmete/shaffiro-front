describe('Administración de Reglas: Dar de Alta', () => {
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
      .visit('/reglas', {
        // dirigirse a 'Listado de Reglas' y guardar el JWT en localStorage
        onBeforeLoad (window) {
          window.localStorage.setItem('auth.currentUser', JSON.stringify(user))
        }
      })
      .then(response => {
        // dirigirse a 'Crear Regla'
        cy.get('.button').contains('Crear regla').click()
        cy.url('should.include', '/reglas/crear')
      })
  })

  it('(1) - El usuario puede crear una regla si ingresa y selecciona todos los campos (1 condición)', () => {
    cy.get('#nombre').type('Apagar la luz del living 1')
    cy.get('#sensor').select('Nombre: Sensor_Lampara')
    cy.get('#actuador').select('Nombre: Actuador_Lampara')
    // condicion 1
    cy.get('#magnitud').select('el Flujo Luminoso')
    cy.get('#operador').select('mayor a')
    cy.get('#valor').type('5000')
    // agregar condicion 1
    cy.get('#agregar').contains('Agregar').click()
    // cambiar acción a "Apagar"
    cy.get('#accion').select('Apagar')
    // crear regla
    cy.get('.button').contains('Crear Regla').click()
    // verificar que estoy en el listado de reglas y que la nueva regla existe
    cy.url().should('include', '/reglas')
    cy.contains('Apagar la luz del living 1').should('exist')
  })

  it('(2) - El usuario NO puede crear una regla no ingresa o selecciona: `Nombre de la regla`, `Sensor asociado`, `Actuador asociado` o no agrega condiciones', () => {
    cy.get('#nombre').type('Prender la luz del living')
    // verificar que el botón "Crear Regla" tiene el atributo disabled
    cy.get('.button').contains('Crear Regla').should('be.disabled')
  })

  it('(3) - El usuario puede crear una regla si ingresa y selecciona todos los campos (3 condiciones)', () => {
    cy.get('#nombre').type('Apagar la luz del living 2')
    cy.get('#sensor').select('Nombre: Sensor_Lampara')
    cy.get('#actuador').select('Nombre: Actuador_Lampara')
    // condición 1
    cy.get('#magnitud').select('el Flujo Luminoso')
    cy.get('#operador').select('mayor a')
    cy.get('#valor').type('5000')
    // agregar condicion 1
    cy.get('#agregar').contains('Agregar').click()
    // condición 2
    cy.get('#magnitud').select('el Horario')
    cy.get('#operador').select('mayor a')
    cy.get('#horario').click()
    cy.get('.hours > [data-key="22"]').click()
    cy.get('.minutes > [data-key="00"]').click()
    cy.get('.time-picker-overlay').click()
    // agregar condicion 2
    cy.get('#agregar').contains('Agregar').click()
    // condición 3
    cy.get('#magnitud').select('el Horario')
    cy.get('#operador').select('menor a')
    cy.get('#horario').click()
    cy.get('.hours > [data-key="08"]').click()
    cy.get('.minutes > [data-key="00"]').click()
    cy.get('.time-picker-overlay').click()
    // agregar condicion 3
    cy.get('#agregar').click()
    // cambiar el conector a "o"
    cy.get('#conector').select('o')
    // cambiar acción a apagar
    cy.get('#accion').select('Apagar')
    // crear la regla
    cy.get('.button').contains('Crear Regla').click()
    // verificar que estoy en el listado de reglas y que la nueva regla existe
    cy.url().should('include', '/reglas')
    cy.contains('Apagar la luz del living 2').should('exist')
  })

  it('(4) - El usuario NO puede crear una regla si elimina todas las condiciones', () => {
    cy.get('#nombre').type('Apagar la luz del living')
    cy.get('#sensor').select('Nombre: Sensor_Lampara')
    cy.get('#actuador').select('Nombre: Actuador_Lampara')
    // condicion 1
    cy.get('#magnitud').select('el Flujo Luminoso')
    cy.get('#operador').select('mayor a')
    cy.get('#valor').type('5000')
    // agregar condicion 1
    cy.get('#agregar').click()
    // eliminar condicion 1
    cy.get('#eliminar').click()
    // cambiar acción a apagar
    cy.get('#accion').select('Apagar')
    // verificar que el botón "Crear Regla" tiene el atributo disabled
    cy.get('.button').contains('Crear Regla').should('be.disabled')
  })

  // eliminar reglas y dispositivos creados
  after(() => {
    return cy
      .request('POST', 'http://localhost:5000/ruleEngine/drop')
      .then(response => {
        return cy
          .request({
            method: 'DELETE',
            url: `http://localhost:8080/api/dispositivos/${primerDispositivo}`,
            auth: {
              bearer: user.token
            }
          })
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
