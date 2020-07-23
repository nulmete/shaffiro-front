import Vuex from 'vuex'
import { createLocalVue } from '@vue/test-utils'
import * as authModule from '@/store/modules/auth'
import { cloneDeep } from 'lodash'
import axios from 'axios'
import MockAdapter from 'axios-mock-adapter'

const localVue = createLocalVue()
localVue.use(Vuex)

describe('Store auth module', () => {
  let store
  let user = {
    authorities: ['ROLE_ADMIN', 'ROLE_USER'],
    token: 'token',
    username: 'admin'
  }

  beforeEach(() => {
    store = new Vuex.Store(cloneDeep(authModule))
    window.localStorage.clear()
  })

  it('mutations.setCurrentUser guarda en state la información del usuario con sesión iniciada', () => {
    store.commit('setCurrentUser', user)
    expect(store.state.currentUser).toEqual(user)
  })

  it('mutations.setCurrentUser actualiza correctamente el header Authorization de axios', () => {
    axios.defaults.headers.common.Authorization = ''

    store.commit('setCurrentUser', user)
    expect(axios.defaults.headers.common.Authorization).toEqual('Bearer token')

    store.commit('setCurrentUser', null)
    expect(axios.defaults.headers.common.Authorization).toEqual('')
  })

  it('mutations.setCurrentUser guarda en localStorage la información del usuario con sesión iniciada', () => {
    let savedCurrentUser = JSON.parse(window.localStorage.getItem('auth.currentUser'))
    expect(savedCurrentUser).toEqual(null)

    const expectedCurrentUser = user
    store.commit('setCurrentUser', expectedCurrentUser)
    savedCurrentUser = JSON.parse(window.localStorage.getItem('auth.currentUser'))
    expect(savedCurrentUser).toEqual(expectedCurrentUser)
  })

  it('getters.isLoggedIn retorna true cuando state.currentUser es no nulo', () => {
    store.commit('setCurrentUser', user)
    expect(store.getters.isLoggedIn).toEqual(true)
  })

  it('getters.isLoggedIn retorna false cuando state.currentUser es nulo', () => {
    store.commit('setCurrentUser', null)
    expect(store.getters.isLoggedIn).toEqual(false)
  })

  it('actions.login hace un commit de mutations.setCurrentUser y la información del usuario que inicia sesión se guarda en state.currentUser', async () => {
    const mock = new MockAdapter(axios)

    mock.onPost('/api/authenticate', {
      username: 'admin',
      password: 'admin'
    }).reply(200, {
      id_token: 'token'
    })
    mock.onGet('/api/account').reply(200, {
      authorities: ['ROLE_ADMIN', 'ROLE_USER']
    })

    await store.dispatch('login', { username: 'admin', password: 'admin' })
    expect(store.state.currentUser).toEqual(user)
  })

  it('actions.login retorna un error un mensaje de error si un usuario intenta iniciar sesión y ocurre un problema de conexión', async () => {
    expect.assertions(1)

    const mock = new MockAdapter(axios)
    mock.onPost('/api/authenticate').networkError()

    try {
      await store.dispatch('login', { username: 'random', password: 'random' })
    } catch (error) {
      expect(error.message).toEqual('Hubo un problema de conexión. Intente nuevamente.')
    }
  })

  it('actions.login retorna el mensaje de error "Nombre de usuario o contraseña incorrectos" si un usuario intenta iniciar sesión con las credenciales incorrectas', async () => {
    expect.assertions(1)

    const mock = new MockAdapter(axios)
    mock.onPost('/api/authenticate').reply(401, {
      detail: 'Bad credentials'
    })

    try {
      await store.dispatch('login', { username: 'incorrecto', password: 'incorrecta' })
    } catch (error) {
      expect(error.message).toEqual('Nombre de usuario o contraseña incorrectos.')
    }
  })

  it('actions.login retorna un mensaje de error si un usuario intenta iniciar sesión pero no está habilitado', async () => {
    expect.assertions(1)

    const mock = new MockAdapter(axios)
    mock.onPost('/api/authenticate').reply(401, {
      detail: 'User deshabilitado was not activated'
    })

    try {
      await store.dispatch('login', { username: 'deshabilitado', password: 'random' })
    } catch (error) {
      expect(error.message).toEqual('El usuario ingresado no se encuentra habilitado. Por favor, revise su casilla de correo electrónico para activar su usuario.')
    }
  })
})
