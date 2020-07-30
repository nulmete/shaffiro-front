// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add("login", (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add("drag", { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add("dismiss", { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This is will overwrite an existing command --
// Cypress.Commands.overwrite("visit", (originalFn, url, options) => { ... })

// Custom login
Cypress.Commands.add('login', () => {
  let token, authorities

  const usuario = {
    username: 'admin',
    password: 'admin',
    rememberMe: false
  }

  return cy
    .request('POST', 'http://localhost:8080/api/authenticate', usuario)
    .then(response => {
      expect(response.status).to.eq(200)
      expect(response.body).to.have.property('id_token')
      token = response.body.id_token
      return token
    })
    .then(token => {
      return cy.request({
        url: 'http://localhost:8080/api/account',
        auth: {
          bearer: token
        }
      })
    })
    .then(response => {
      expect(response.status).to.eq(200)
      expect(response.body).to.have.property('authorities')
      authorities = response.body.authorities
      return authorities
    })
    .then(() => {
      return {
        username: usuario.username,
        token,
        authorities
      }
    })
})

// Agregar dispositivos antes de las pruebas de reglas
Cypress.Commands.add('crearDispositivos', (user) => {
  const dispositivos = [
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

  let primerDispositivo, segundoDispositivo

  return cy
    .request({
      method: 'POST',
      url: 'http://localhost:8080/api/dispositivos',
      body: dispositivos[0],
      auth: {
        bearer: user.token
      }
    })
    .then(response => {
      primerDispositivo = response.body.id
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
    .then(response => {
      segundoDispositivo = response.body.id
      return {
        primerDispositivo,
        segundoDispositivo
      }
    })
})

// Delay entre comandos
// const COMMAND_DELAY = 1200

// for (const command of ['visit', 'click', 'trigger', 'type', 'clear', 'reload', 'contains']) {
//   Cypress.Commands.overwrite(command, (originalFn, ...args) => {
//     const origVal = originalFn(...args)

//     return new Promise((resolve) => {
//       setTimeout(() => {
//         resolve(origVal)
//       }, COMMAND_DELAY)
//     })
//   })
// }
