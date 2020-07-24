import axios from 'axios'
import { getSavedState, saveState } from '../helpers'

const mutations = {
  setDispositivo (state, newValue) {
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

const getters = {
  getAllDispositivos (state) {
    return state.dispositivos
  },
  getDispositivoActual (state) {
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

const actions = {
  async getAllDispositivos ({ commit }) {
    try {
      const dispositivos = await axios.get('/api/dispositivos')
      commit('setDispositivo', dispositivos.data)
    } catch (error) {
      throw new Error('No se pudo obtener ningún dispositivo. Intente nuevamente.')
    }
  },
  async modificarEstado ({ commit }, dispositivoModificado) {
    try {
      const respuesta = await axios.put('/api/dispositivos', dispositivoModificado)
      commit('modificarEstado', respuesta.data)
    } catch (error) {
      throw new Error('No se pudo modificar el dispositivo. Intente nuevamente.')
    }
  }
}

const state = {
  dispositivos: [],
  dispositivoActual: getSavedState('dispositivos.dispositivoActual')
}

export default {
  namespaced: true,
  state,
  actions,
  mutations,
  getters
}
