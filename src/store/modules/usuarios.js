import axios from 'axios'
import { getSavedState, saveState } from '../helpers'

const mutations = {
  setUsers (state, newValue) {
    state.users = newValue
  },
  setCurrentUser (state, newValue) {
    state.currentUser = newValue
    saveState('users.currentUser', newValue)
  },
  modificarEstado (state, usuarioModificado) {
    const index = state.users.findIndex(usuario => usuario.id === usuarioModificado.id)
    state.users.splice(index, 1, usuarioModificado)
  }
}

const getters = {
  getUsers (state) {
    return state.users
  },
  getUser (state) {
    return state.currentUser
  }
}

const actions = {
  async getUsers ({ commit }) {
    const users = await axios.get('api/users')
    commit('setUsers', users.data)
    // todo catch error
  },
  async getUser ({ commit }, username) {
    const user = await axios.get(`/api/users/${username}`)
    commit('setCurrentUser', user.data)
    // todo catch error
  },
  async modificarEstado ({ commit }, usuarioModificado) {
    const respuesta = await axios.put('/api/users', usuarioModificado)
    commit('modificarEstado', respuesta.data)
    // todo catch error
  }
}

const state = {
  users: [],
  currentUser: getSavedState('users.currentUser')
}

export default {
  namespaced: true,
  state,
  actions,
  mutations,
  getters
}
