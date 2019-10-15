import axios from 'axios'
import { getSavedState, saveState } from '../helpers'

export const state = {
  currentUser: getSavedState('auth.currentUser')
}

export const mutations = {
  setCurrentUser (state, newValue) {
    state.currentUser = newValue
    saveState('auth.currentUser', newValue)
    setDefaultAuthHeaders(state)
  }
}

export const getters = {
  // Verifica si el usuario está logeado
  loggedIn (state) {
    return !!state.currentUser && !!state.currentUser.token
  },

  isAdmin (state, getters) {
    return !!getters.loggedIn &&
      !!state.currentUser.authorities &&
      !!state.currentUser.authorities.includes('ROLE_ADMIN')
  }
}

export const actions = {
  // Validar usuario
  async validate ({ commit, state }) {
    // Si no hay usuario logeado, retornar
    if (!state.currentUser) return Promise.resolve(null)

    setDefaultAuthHeaders(state)

    return Promise.all([
      axios.get('/api/authenticate'),
      axios.get('/api/account')
    ])
      .then(([firstResponse, secondResponse]) => {
        const username = firstResponse.data
        const authorities = secondResponse.data.authorities
        const token = state.currentUser.token
        commit('setCurrentUser', { username, token, authorities })
        return token
      })
      .catch(error => {
        console.warn(error)
        commit('setCurrentUser', null)
        return null
      })
  },

  // Registro
  async signUp ({ commit }, formData) {
    const { login: username, email } = formData
    await axios.post('/api/register', formData)
    commit('setCurrentUser', { username, email })
  },

  // Activar usuario
  async activate (context, activationKey) {
    await axios.get(`/api/activate?key=${activationKey}`)
  },

  // Login
  async logIn ({ commit }, { username, password } = {}) {
    const response = await axios.post('/api/authenticate', { username, password })
    const token = response.data.id_token
    commit('setCurrentUser', { username, token })
  },

  // Cierra la sesión de un usuario logeado
  async logOut ({ commit }) {
    commit('setCurrentUser', null)
  },

  // Iniciar restablecimiento de contraseña
  async resetPasswordInit (context, email) {
    await axios.post('/api/account/reset-password/init', email, {
      headers: {
        'Content-Type': 'text/plain'
      }
    })
  },

  // Terminar restablecimiento de contraseña
  async resetPasswordFinish (context, formData) {
    await axios.post('/api/account/reset-password/finish', formData)
  },

  // Cambiar contraseña de un usuario logeado
  async changePassword (context, formData) {
    await axios.post('/api/account/change-password', formData)
  }
}

// ==========
// Helpers
// ==========

// Si hay un usuario logeado, setear el header 'Authorization' a 'Bearer <token>'
function setDefaultAuthHeaders (state) {
  axios.defaults.headers.common.Authorization = state.currentUser
    ? `Bearer ${state.currentUser.token}`
    : ''
}
