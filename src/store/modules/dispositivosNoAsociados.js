import mainApi from '@/utils/mainApi'
import { getSavedState, saveState } from '../helpers'

export const state = {
  dispositivosNoAsociados: [],
  dispositivoNoAsociadoActual: getSavedState('dispositivosNoAsociados.dispositivoNoAsociadoActual')
}

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
    const dispositivos = await mainApi.get('/api/dispositivo-no-asociados')
    commit('setAllDispositivosNoAsociados', dispositivos.data)
    return dispositivos
  },

  async getDispositivo ({ commit }, id) {
    const dispositivo = await mainApi.get(`/api/dispositivo-no-asociados/${id}`)
    commit('setDispositivoNoAsociadoActual', dispositivo.data)
    return dispositivo
  }
}
