import axios from 'axios'
import { getSavedState, saveState } from '../helpers'

export const mutations = {
  setAllDispositivos (state, newValue) {
    state.dispositivos = newValue
  },
  setDispositivoActual (state, newValue) {
    state.dispositivoActual = newValue
    saveState('dispositivos.dispositivoActual', newValue)
  },
  modificarEstado (state, dispositivoModificado) {
    const dispositivo = state.dispositivos.find(disp => disp.id === dispositivoModificado.id)
    dispositivo.activo = dispositivoModificado.activo
  }
}

export const getters = {
  getAllDispositivos (state) {
    return state.dispositivos
  },
  getDispositivo (state) {
    return state.dispositivoActual
  },
  /* eslint no-shadow: ["error", { "allow": ["getters"] }] */
  getSensores (state, getters) {
    return getters.getAllDispositivos.filter(dispositivo => dispositivo.tipo === 'SENSOR')
  },
  /* eslint no-shadow: ["error", { "allow": ["getters"] }] */
  getActuadores (state, getters) {
    return getters.getAllDispositivos.filter(dispositivo => dispositivo.tipo === 'ACTUADOR')
  },
  /* eslint no-shadow: ["error", { "allow": ["getters"] }] */
  getSensoresLabels (state, getters) {
    return getters.getSensores.map(sensor => `Nombre: ${sensor.nombre}`)
  },
  /* eslint no-shadow: ["error", { "allow": ["getters"] }] */
  getActuadoresLabels (state, getters) {
    return getters.getActuadores.map(actuador => `Nombre: ${actuador.nombre}`)
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
  },
  async modificarEstado ({ commit }, dispositivoModificado) {
    const respuesta = await axios.put('/api/dispositivos', dispositivoModificado)
    commit('modificarEstado', respuesta.data)
    return respuesta
  }
}

export const state = {
  dispositivos: [],
  dispositivoActual: getSavedState('dispositivos.dispositivoActual')
}
