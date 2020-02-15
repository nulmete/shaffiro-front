import axios from 'axios'
import { getSavedState, saveState } from '../helpers'

export const state = {
  users: [],
  currentUser: getSavedState('users.currentUser')
}

export const mutations = {
  setAllUsers (state, newValue) {
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

export const getters = {
  getAllUsers (state) {
    // const fields = ['id', 'login', 'email', 'activated', 'authorities']

    return (fields) => {
      return state.users.map(user => {
        const filtered = Object.keys(user)
          .filter(key => fields.includes(key))
          .reduce((obj, key) => {
            return {
              ...obj,
              [key]: user[key]
            }
          }, {})

        return filtered
      })
    }
  },

  getUser (state) {
    return state.currentUser
  }
}

export const actions = {
  getAllUsers ({ commit }) {
    return axios
      .get('/api/users')
      .then(response => {
        const users = response.data
        commit('setAllUsers', users)
        return users
      })
  },

  async getUser ({ commit }, username) {
    const user = await axios.get(`/api/users/${username}`)
    commit('setCurrentUser', user.data)
    return user
  },

  async modificarEstado ({ commit }, usuarioModificado) {
    const respuesta = await axios.put('/api/users', usuarioModificado)
    commit('modificarEstado', respuesta.data)
    return respuesta
  }
}
