import axios from 'axios'

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
    return !!getters.loggedIn && !!state.currentUser.authorities && !!state.currentUser.authorities.includes('ROLE_ADMIN')
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
        const user = firstResponse.data
        const authorities = secondResponse.data.authorities
        const token = state.currentUser.token
        commit('setCurrentUser', { user, token, authorities })
        return user
      })
      .catch(error => {
        console.log(error.response)
        commit('setCurrentUser', null)
        return null
      })
  },

  // Registro
  async signUp ({ commit }, formData) {
    const { login: user, email } = formData
    await axios.post('/api/register', formData)
    commit('setCurrentUser', { user, email })
  },

  // Activar usuario
  async activate (context, activationKey) {
    await axios.get(`/api/activate?key=${activationKey}`)
  },

  // Login
  async logIn ({ commit }, formData) {
    const response = await axios.post('/api/authenticate', formData)
    const token = response.data.id_token
    commit('setCurrentUser', { token })
  },

  // Cierra la sesión de un usuario logeado
  async logOut ({ commit }) {
    console.log('logout!!')
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

// Obtener estado guardado en localStorage
function getSavedState (key) {
  return JSON.parse(window.localStorage.getItem(key))
}

// Guardar estado en localStorage
function saveState (key, state) {
  window.localStorage.setItem(key, JSON.stringify(state))
}

// Si hay un usuario logeado, setear el header 'Authorization' a 'Bearer <token>'
function setDefaultAuthHeaders (state) {
  axios.defaults.headers.common.Authorization = state.currentUser
    ? `Bearer ${state.currentUser.token}`
    : ''
}
