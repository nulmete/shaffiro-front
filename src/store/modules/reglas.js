import ruleEngineApi from '@/utils/ruleEngineApi'
import { getSavedState, saveState } from '../helpers'

export const state = {
  reglas: [],
  reglaActual: getSavedState('regla.reglaActual')
}

export const mutations = {
  setAllReglas (state, newValue) {
    state.reglas = newValue
  },

  setReglaActual (state, newValue) {
    state.reglaActual = newValue
    saveState('regla.reglaActual', newValue)
  },

  eliminarRegla (state, id) {
    const index = state.reglas.findIndex(regla => regla.id === id)
    state.reglas.splice(index, 1)
  }
}

export const getters = {
  getAllReglas (state) {
    return state.reglas
  },

  getRegla (state) {
    return state.reglaActual
  }
}

export const actions = {
  async getAllReglas ({ commit }) {
    const reglas = await ruleEngineApi.get('/rules')
    commit('setAllReglas', reglas.data)
    return reglas
  }

  // async getRegla ({ commit }, id) {
  //   const regla = await ruleEngineApi.get(`/api/reglas/${id}`)
  //   commit('setReglaActual', regla.data)
  //   return regla
  // },

  // async eliminarRegla ({ commit }, regla) {
  //   await ruleEngineApi.delete(`/api/reglas/${regla.id}`)
  //   commit('eliminarRegla', regla.id)
  // }
}
