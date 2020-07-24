import ruleEngineApi from '@/utils/ruleEngineApi'
import { getSavedState, saveState } from '../helpers'

const mutations = {
  setRegla (state, newValue) {
    state.reglas = newValue
  },
  setReglaActual (state, newValue) {
    state.reglaActual = newValue
    saveState('regla.reglaActual', newValue)
  }
}

const getters = {
  getAllReglas (state) {
    return state.reglas
  },
  getReglaActual (state) {
    return state.reglaActual
  }
}

const actions = {
  async getAllReglas ({ commit }) {
    const reglas = await ruleEngineApi.get('/rules')
    commit('setRegla', reglas.data)
    return reglas
  }
}

const state = {
  reglas: [],
  reglaActual: getSavedState('regla.reglaActual')
}

export default {
  namespaced: true,
  state,
  actions,
  mutations,
  getters
}
