import axios from 'axios'
import { cpus } from 'os'

export const state = {
  users: [],
  currentUser: {}
}

export const mutations = {
  setAllUsers (state, newValue) {
    state.users = newValue
  },

  setCurrentUser (state, newValue) {
    state.currentUser = newValue
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
  }
}
