import ruleEngineApi from '@/utils/ruleEngineApi'
import { getSavedState, saveState } from '../helpers'

export const mutations = {
  setAllReglas (state, newValue) {
    state.reglas = newValue
  },
  setReglaActual (state, newValue) {
    state.reglaActual = newValue
    saveState('regla.reglaActual', newValue)
  }
}

export const getters = {
  getAllReglas (state) {
    return state.reglas
  },
  getReglaActual (state) {
    return state.reglaActual
  }
}

export const actions = {
  async getAllReglas ({ commit }) {
    const reglas = await ruleEngineApi.get('/rules')
    commit('setAllReglas', reglas.data)
    return reglas
  }
}

export const state = {
  reglas: [],
  reglaActual: getSavedState('regla.reglaActual')
}
