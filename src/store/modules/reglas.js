import axios from 'axios'
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
    const reglas = await axios.get('/api/reglas')
    commit('setAllReglas', reglas.data)
    return reglas
  },

  async getRegla ({ commit }, id) {
    const regla = await axios.get(`/api/reglas/${id}`)
    commit('setReglaActual', regla.data)
    return regla
  },

  async eliminarRegla ({ commit }, regla) {
    await axios.delete(`/api/reglas/${regla.id}`)
    commit('eliminarRegla', regla.id)
  }
}
