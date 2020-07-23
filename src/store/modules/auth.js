import axios from 'axios'
import { getSavedState, saveState } from '../helpers'

// Si hay un usuario logeado, setear el header 'Authorization' a 'Bearer <token>'
function setDefaultAuthHeaders (authState) {
  axios.defaults.headers.common.Authorization = authState.currentUser
    ? `Bearer ${authState.currentUser.token}`
    : ''
}

const mutations = {
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

const getters = {
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

const actions = {
  async validate ({ commit, state }) {
    // Si no hay usuario logeado, retornar
    if (!state.currentUser) return Promise.resolve(null)

    // Setear header Authorization para poder hacer las calls a la API
    setDefaultAuthHeaders(state)

    return Promise.all([
      // Retorna username
      axios.get('/api/authenticate'),
      // Retorna toda la info del usuario, lo que importa son las authorities
      axios.get('/api/account')
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
    try {
      // Obtener token
      const responseAuth = await axios.post('/api/authenticate', { username, password })
      const token = responseAuth.data.id_token
      // Obtener authorities
      const responseAcc = await axios.get('/api/account', {
        headers: { Authorization: 'Bearer ' + token }
      })
      const authorities = responseAcc.data.authorities
      commit('setCurrentUser', { username, token, authorities })
      commit('setSessionExpired', false)
    } catch (error) {
      if (error.response && error.response.status === 400) {
        console.log(error.response)
        throw new Error('Nombre de usuario o contraseña incorrectos.')
      } else if (error.response && error.response.status === 401) {
        if (error.response.data.detail === 'Bad credentials') {
          throw new Error('Nombre de usuario o contraseña incorrectos.')
        } else {
          throw new Error('El usuario ingresado no se encuentra habilitado. Por favor, revise su casilla de correo electrónico para activar su usuario.')
        }
      } else {
        throw new Error('Hubo un problema de conexión. Intente nuevamente.')
      }
    }
  },
  async logOut ({ commit }) {
    localStorage.clear()
    commit('setCurrentUser', null)
  },
  // Recuperar contraseña
  async resetPasswordInit (context, email) {
    await axios.post('/api/account/reset-password/init', email, {
      headers: {
        'Content-Type': 'text/plain'
      }
    })
  },
  async resetPasswordFinish (context, formData) {
    await axios.post('/api/account/reset-password/finish', formData)
  },
  // Cambiar contraseña de un usuario logeado
  async changePassword (context, formData) {
    await axios.post('/api/account/change-password', formData)
  }
}

const state = {
  currentUser: getSavedState('auth.currentUser'),
  activationEmail: getSavedState('auth.activationEmail'),
  sessionExpired: false
}

export default {
  namespaced: true,
  state,
  actions,
  mutations,
  getters
}
