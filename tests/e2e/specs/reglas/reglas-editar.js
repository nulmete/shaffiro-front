describe('Administración de Reglas: Editar', () => {
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
        return response
      })
      .then(response => {
        // crear regla a ser editada
        const regla = {
          name: 'Apagar la luz del living',
          antecedents: [
            {
              id1: primerDispositivo,
              op: '>',
              vs: '5000',
              unit: 'LUMENES'
            }
          ],
          consequences: [
            {
              id2: segundoDispositivo,
              action: 'off'
            }
          ]
        }

        cy.request('POST', 'http://localhost:5000/ruleEngine/create', regla)
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
  })

  it('(1) - El usuario puede editar y guardar una regla si no modifica ninguno de sus campos', () => {
    cy.contains('Apagar la luz del living')
    cy.get('.radio__input').check({ force: true })
    cy.get('.button').contains('Editar').click()
    cy.url('should.include', '/reglas/editar')
    cy.wait(500)
    cy.get('#submit').click()
    cy.contains('Apagar la luz del living').should('exist')
    cy.contains('Si el Flujo Luminoso es mayor a 5000 LUMENES ENTONCES Apagar Lámpara LED')
  })

  it('(2) - El usuario puede editar y guardar una regla si modifica el campo Nombre', () => {
    cy.contains('Apagar la luz del living')
    cy.get('.radio__input').check({ force: true })
    cy.get('.button').contains('Editar').click()
    cy.url('should.include', '/reglas/editar')
    cy.wait(500)
    // modificar nombre
    cy.get('#nombre').type(' 2.0')
    cy.get('#submit').click()
    cy.contains('Apagar la luz del living 2.0').should('exist')
    cy.contains('Si el Flujo Luminoso es mayor a 5000 LUMENES ENTONCES Apagar Lámpara LED')
  })

  it('(3) - El usuario NO puede editar y guardar una regla si elimina todas sus condiciones', () => {
    cy.contains('Apagar la luz del living 2.0')
    cy.get('.radio__input').check({ force: true })
    cy.get('.button').contains('Editar').click()
    cy.url('should.include', '/reglas/editar')
    cy.wait(500)
    // eliminar condicion
    cy.get('#eliminar').click()
    cy.get('.button').contains('Guardar Regla').should('be.disabled')
  })

  it('(4) - El usuario puede editar y guardar una regla si agrega una condición y modifica el conector', () => {
    cy.contains('Apagar la luz del living 2.0')
    cy.get('.radio__input').check({ force: true })
    cy.get('.button').contains('Editar').click()
    cy.url('should.include', '/reglas/editar')
    cy.wait(500)
    // condición 2
    cy.get('#magnitud').select('el Horario')
    cy.get('#operador').select('mayor a')
    cy.get('#horario').click()
    cy.get('.hours > [data-key="22"]').click()
    cy.get('.minutes > [data-key="00"]').click()
    cy.get('.time-picker-overlay').click()
    // agregar condicion 2
    cy.get('#agregar').click()
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
    // guardar la regla
    cy.get('.button').contains('Guardar Regla').click()
    cy.url().should('include', '/reglas')
    cy.contains('Apagar la luz del living 2.0').should('exist')
    cy.contains('Si el Flujo Luminoso es mayor a 5000 LUMENES o el Horario es mayor a 22:00 horas o el Horario es menor a 08:00 horas ENTONCES Apagar Lámpara LED')
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
