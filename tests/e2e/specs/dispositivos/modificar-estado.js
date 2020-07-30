describe('Administración de Dispositivos: usuario administrador puede modificar estado de dispositivos asociados', () => {
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

  it('(1) - El usuario administrador puede cambiar el estado de un dispositivo a Deshabilitado', () => {
    cy.get('#modificar').click()
    cy.get('#modificar').contains('Deshabilitado')
  })

  it('(2) - El usuario administrador puede cambiar el estado de un dispositivo a Habilitado', () => {
    cy.get('#modificar').click()
    cy.get('#modificar').contains('Habilitado')
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
