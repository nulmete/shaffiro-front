import axios from 'axios'

export const state = {
  dispositivos: [],
  dispositivoActual: {}
}

export const mutations = {
  setAllDispositivos (state, newValue) {
    state.dispositivos = newValue
  },

  setDispositivoActual (state, newValue) {
    state.dispositivoActual = newValue
  }
}

export const getters = {
  getAllDispositivos (state) {
    return state.dispositivos
  },

  getDispositivo (state) {
    return state.dispositivoActual
  }
}

export const actions = {
  async getAllDispositivos ({ commit }) {
    const dispositivos = await axios.get('/api/dispositivos')
    commit('setAllDispositivos', dispositivos.data)
    return dispositivos
  },

  async getDispositivo ({ commit }, id) {
    const dispositivo = await axios.get(`/api/dispositivos/${id}`)
    commit('setDispositivoActual', dispositivo.data)
    return dispositivo
  }
}
