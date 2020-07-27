describe('Administración de Dispositivos: Asociar (dar de alta)', () => {
  const dispositivoNoAsociado = {
    mac: '00:A0:C9:14:DE:FG',
    uuid: '3c69fa64-cfbc-asdqwe'
  }

  const usuario = {
    username: 'admin',
    password: 'admin',
    rememberMe: false
  }

  let token
  let authorities

  before(() => {
    // logear al usuario y crear un dispositivo no asociado
    cy
      .request('POST', 'http://localhost:8080/api/authenticate', usuario)
      .then(response => {
        expect(response.status).to.eq(200)
        expect(response.body).to.have.property('id_token')
        token = response.body.id_token
        return token
      })
      .then(token => {
        return cy
          .request({
            method: 'POST',
            url: 'http://localhost:8080/api/dispositivo-no-asociados',
            body: dispositivoNoAsociado,
            auth: {
              bearer: token
            }
          })
      })
      .then(response => {
        expect(response.status).to.eq(201)
        return cy.request({
          url: 'http://localhost:8080/api/account',
          auth: {
            bearer: token
          }
        })
      })
      .then(finalResponse => {
        expect(finalResponse.status).to.eq(200)
        expect(finalResponse.body).to.have.property('authorities')
        authorities = finalResponse.body.authorities
      })
  })

  beforeEach(() => {
    cy.visit('/', {
      onBeforeLoad (window) {
        const user = {
          username: usuario.username,
          token,
          authorities
        }

        window.localStorage.setItem('auth.currentUser', JSON.stringify(user))
      }
    })
  })

  it('está logeado', () => {
    cy.wait(2000)
    cy.visit('/reglas')
    cy.wait(1000)
    cy.visit('/dispositivos/detectar')
    cy.wait(1000)
    cy.contains(dispositivoNoAsociado.mac)
    cy.contains('Reglas')
  })
})
