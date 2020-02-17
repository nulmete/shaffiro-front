import axios from 'axios'
import { getSavedState, saveState } from '../helpers'

export const state = {
  dispositivos: [],
  dispositivoActual: getSavedState('dispositivos.dispositivoActual')
}

export const mutations = {
  setAllDispositivos (state, newValue) {
    state.dispositivos = newValue
  },

  setDispositivoActual (state, newValue) {
    state.dispositivoActual = newValue
    saveState('dispositivos.dispositivoActual', newValue)
  },

  modificarEstado (state, dispositivoModificado) {
    // const index = state.dispositivos.findIndex(dispositivo => dispositivo.id === dispositivoModificado.id)
    // state.dispositivos.splice(index, 1, dispositivoModificado)

    const dispositivo = state.dispositivos.find(dispositivo => dispositivo.id === dispositivoModificado.id)
    dispositivo.activo = dispositivoModificado.activo
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
    console.log('getdispositivos')
    const dispositivos = await axios.get('/api/dispositivos')
    commit('setAllDispositivos', dispositivos.data)
    return dispositivos
  },

  async getDispositivo ({ commit }, id) {
    const dispositivo = await axios.get(`/api/dispositivos/${id}`)
    commit('setDispositivoActual', dispositivo.data)
    return dispositivo
  },

  async modificarEstado ({ commit }, dispositivoModificado) {
    const respuesta = await axios.put('/api/dispositivos', dispositivoModificado)
    console.log(dispositivoModificado)
    commit('modificarEstado', respuesta.data)
    console.log(respuesta.data)
    return respuesta
  }
}
