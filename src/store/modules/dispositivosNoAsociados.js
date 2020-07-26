import axios from 'axios'
import { getSavedState, saveState } from '../helpers'

const mutations = {
  setDispositivosNoAsociados (state, newValue) {
    state.dispositivosNoAsociados = newValue
  },
  setDispositivoNoAsociadoActual (state, newValue) {
    state.dispositivoNoAsociadoActual = newValue
    saveState('dispositivosNoAsociados.dispositivoNoAsociadoActual', newValue)
  }
}

const getters = {
  getAllDispositivosNoAsociados (state) {
    return state.dispositivosNoAsociados
  },
  getDispositivoNoAsociadoActual (state) {
    return state.dispositivoNoAsociadoActual
  }
}

const actions = {
  async getAllDispositivosNoAsociados ({ commit }) {
    const dispositivos = await axios.get('/api/dispositivo-no-asociados')
    commit('setDispositivosNoAsociados', dispositivos.data)
    // todo catch error
  }
}

const state = {
  dispositivosNoAsociados: [],
  dispositivoNoAsociadoActual: getSavedState('dispositivosNoAsociados.dispositivoNoAsociadoActual')
}

export default {
  namespaced: true,
  state,
  actions,
  mutations,
  getters
}
