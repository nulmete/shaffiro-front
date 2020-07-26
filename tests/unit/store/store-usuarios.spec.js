import Vuex from 'vuex'
import { createLocalVue } from '@vue/test-utils'
import usuariosModule from '@/store/modules/usuarios'
import { cloneDeep } from 'lodash'
import axios from 'axios'
import MockAdapter from 'axios-mock-adapter'

const localVue = createLocalVue()
localVue.use(Vuex)

describe('Store users module', () => {
  let store
  let users = [
    {
      id: 1,
      login: 'admin',
      email: 'admin@localhost',
      activated: true,
      authorities: [
        'ROLE_USER',
        'ROLE_ADMIN'
      ]
    },
    {
      id: 2,
      login: 'user',
      email: 'user@localhost',
      activated: true,
      authorities: [
        'ROLE_USER'
      ]
    }
  ]

  beforeEach(() => {
    store = new Vuex.Store(cloneDeep(usuariosModule))
    window.localStorage.clear()
  })

  it('mutations.setUsers guarda usuarios en state.users', () => {
    store.commit('setUsers', users)
    expect(store.state.users).toEqual(users)
  })

  it('mutations.setCurrentUser guarda al usuario actual en state.currentUser', () => {
    store.commit('setCurrentUser', users[0])
    expect(store.state.currentUser).toEqual(users[0])
  })

  it('mutations.setCurrentUser guarda un usuario en localStorage correctamente', () => {
    let savedCurrentUser = JSON.parse(window.localStorage.getItem('users.currentUser'))
    expect(savedCurrentUser).toEqual(null)

    const expectedCurrentUser = users[0]
    store.commit('setCurrentUser', expectedCurrentUser)

    savedCurrentUser = JSON.parse(window.localStorage.getItem('users.currentUser'))
    expect(savedCurrentUser).toEqual(expectedCurrentUser)
  })

  it('mutations.modificarEstado guarda un usuario con estado modificado en state.currentUser', () => {
    store.commit('setUsers', users)
    const modifiedUser = { ...users[0] }
    modifiedUser.activated = !modifiedUser.activated
    store.commit('modificarEstado', modifiedUser)
    expect(store.state.users[0]).toEqual(modifiedUser)
  })

  it('getters.users retorna los usuarios guardados en state.users', () => {
    store.commit('setUsers', users)
    expect(store.getters.getUsers).toEqual(users)
  })

  it('getters.getUser retorna el usuario guardado en state.getUser', () => {
    store.commit('setCurrentUser', users[1])
    expect(store.getters.getUser).toEqual(users[1])
  })

  it('actions.getUsers hace un commit de mutations.setUsers y los usuarios se guardan en state.users', async () => {
    const mock = new MockAdapter(axios)
    mock.onGet('/api/users').reply(200, users)

    await store.dispatch('getUsers')
    expect(store.state.users).toEqual(users)
  })

  it('actions.getUser hace un commit de mutations.setCurrentUser y el usuario actual se guarda en state.currentUser', async () => {
    const username = users[0].login

    const mock = new MockAdapter(axios)
    mock.onGet(`/api/users/${username}`).reply(200, users[0])

    await store.dispatch('getUser', username)
    expect(store.state.currentUser).toEqual(users[0])
  })

  it('actions.modificarEstado hace un commit de mutations.modificarEstado y el usuario con estado modificado se guarda en state.users', async () => {
    store.commit('setUsers', users)
    const modifiedUser = { ...users[0] }
    modifiedUser.activated = !modifiedUser.activated

    const mock = new MockAdapter(axios)
    mock.onPut('/api/users').reply(200, modifiedUser)

    await store.dispatch('modificarEstado')
    expect(store.state.users[0]).toEqual(modifiedUser)
  })
})
