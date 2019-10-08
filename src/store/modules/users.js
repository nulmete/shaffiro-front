import axios from 'axios'

export const state = {
  users: [],
  userBeingEdited: getSavedState('users.userBeingEdited')
}

export const mutations = {
  setAllUsers (state, newValue) {
    state.users = newValue
  },

  setUserBeingEdited (state, newValue) {
    state.userBeingEdited = newValue
    saveState('users.userBeingEdited', newValue)
  }
}

export const getters = {
  getAllUsers (state) {
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

  getUserBeingEdited (state) {
    return state.userBeingEdited
  }
}

export const actions = {
  async getAllUsers ({ commit }) {
    const allUsers = await axios.get('/api/users')
    commit('setAllUsers', allUsers.data)
    return allUsers
  },

  async createUser ({ commit }, formData) {
    await axios.post('/api/users')
  }
}

// Guardar estado en localStorage
function saveState (key, state) {
  window.localStorage.setItem(key, JSON.stringify(state))
}

// Obtener estado guardado en localStorage
function getSavedState (key) {
  return JSON.parse(window.localStorage.getItem(key))
}
