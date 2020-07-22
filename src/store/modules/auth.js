import mainApi from '@/utils/mainApi'
import { getSavedState, saveState } from '../helpers'

export const mutations = {
  setCurrentUser (state, newValue) {
    state.currentUser = newValue
    saveState('auth.currentUser', newValue)
    setDefaultAuthHeaders(state)
  },
  setActivationEmail (state, email) {
    state.activationEmail = email
    saveState('auth.activationEmail', email)
  },
  setSessionExpired (state, newValue) {
    state.sessionExpired = newValue
  }
}

export const getters = {
  isLoggedIn (state) {
    return !!state.currentUser && !!state.currentUser.token
  },
  /* eslint no-shadow: ["error", { "allow": ["getters"] }] */
  isAdmin (state, getters) {
    return !!getters.isLoggedIn && !!state.currentUser.authorities.includes('ROLE_ADMIN')
  },
  getSessionExpired (state) {
    return state.sessionExpired
  },
  getActivationEmail (state) {
    return state.activationEmail
  }
}

export const actions = {
  async validate ({ commit, state }) {
    // Si no hay usuario logeado, retornar
    if (!state.currentUser) return Promise.resolve(null)

    // Setear header Authorization para poder hacer las calls a la API
    setDefaultAuthHeaders(state)

    return Promise.all([
      // Retorna username
      mainApi.get('/api/authenticate'),
      // Retorna toda la info del usuario, lo que importa son las authorities
      mainApi.get('/api/account')
    ])
      .then(([firstResponse, secondResponse]) => {
        const username = firstResponse.data
        const authorities = secondResponse.data.authorities
        const token = state.currentUser.token
        commit('setCurrentUser', { username, token, authorities })
        commit('setSessionExpired', false)
        return token
      })
      .catch(error => {
        // Fallan las 2 requests al server porque el usuario no está logeado
        // o expiró su token
        console.warn(error)
        commit('setCurrentUser', null)
        commit('setSessionExpired', true)
        return null
      })
  },
  async login ({ commit }, { username, password } = {}) {
    // Obtener token
    const responseAuth = await mainApi.post('/api/authenticate', { username, password })
    const token = responseAuth.data.id_token
    // Obtener authorities
    const responseAcc = await mainApi.get('/api/account', {
      headers: { Authorization: 'Bearer ' + token }
    })
    const authorities = responseAcc.data.authorities
    commit('setCurrentUser', { username, token, authorities })
    commit('setSessionExpired', false)
  },
  async logOut ({ commit }) {
    localStorage.clear()
    commit('setCurrentUser', null)
  },
  // Recuperar contraseña
  async resetPasswordInit (context, email) {
    await mainApi.post('/api/account/reset-password/init', email, {
      headers: {
        'Content-Type': 'text/plain'
      }
    })
  },
  async resetPasswordFinish (context, formData) {
    await mainApi.post('/api/account/reset-password/finish', formData)
  },
  // Cambiar contraseña de un usuario logeado
  async changePassword (context, formData) {
    await mainApi.post('/api/account/change-password', formData)
  }
}

export const state = {
  currentUser: getSavedState('auth.currentUser'),
  activationEmail: getSavedState('auth.activationEmail'),
  sessionExpired: false
}

// ==========
// Helpers
// ==========

// Si hay un usuario logeado, setear el header 'Authorization' a 'Bearer <token>'
function setDefaultAuthHeaders (authState) {
  mainApi.defaults.headers.common.Authorization = authState.currentUser
    ? `Bearer ${authState.currentUser.token}`
    : ''
}
