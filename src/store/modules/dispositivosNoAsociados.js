import axios from 'axios'
import { getSavedState, saveState } from '../helpers'

export const mutations = {
  setAllDispositivosNoAsociados (state, newValue) {
    state.dispositivosNoAsociados = newValue
  },
  setDispositivoNoAsociadoActual (state, newValue) {
    state.dispositivoNoAsociadoActual = newValue
    saveState('dispositivosNoAsociados.dispositivoNoAsociadoActual', newValue)
  }
}

export const getters = {
  getAllDispositivosNoAsociados (state) {
    return state.dispositivosNoAsociados
  },
  getDispositivoNoAsociado (state) {
    return state.dispositivoNoAsociadoActual
  }
}

export const actions = {
  async getAllDispositivosNoAsociados ({ commit }) {
    const dispositivos = await axios.get('/api/dispositivo-no-asociados')
    commit('setAllDispositivosNoAsociados', dispositivos.data)
    return dispositivos
  },
  async getDispositivo ({ commit }, id) {
    const dispositivo = await axios.get(`/api/dispositivo-no-asociados/${id}`)
    commit('setDispositivoNoAsociadoActual', dispositivo.data)
    return dispositivo
  }
}

export const state = {
  dispositivosNoAsociados: [],
  dispositivoNoAsociadoActual: getSavedState('dispositivosNoAsociados.dispositivoNoAsociadoActual')
}
