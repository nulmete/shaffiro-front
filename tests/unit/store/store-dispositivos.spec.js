import Vuex from 'vuex'
import { createLocalVue } from '@vue/test-utils'
import dispositivosModule from '@/store/modules/dispositivos'
import { cloneDeep } from 'lodash'
import axios from 'axios'
import MockAdapter from 'axios-mock-adapter'

const localVue = createLocalVue()
localVue.use(Vuex)

describe('Store dispositivos module', () => {
  let store
  let dispositivos = [
    {
      id: 1,
      nombre: 'Sensor_Lampara',
      tipo: 'SENSOR',
      activo: true,
      configuracion: 'LUMENES',
      reglas: []
    },
    {
      id: 2,
      nombre: 'Actuador_Lampara',
      tipo: 'ACTUADOR',
      activo: true,
      configuracion: 'Lámpara',
      reglas: []
    }
  ]

  beforeEach(() => {
    store = new Vuex.Store(cloneDeep(dispositivosModule))
    window.localStorage.clear()
  })

  it('mutations.setDispositivo guarda en state.dispositivos uno o más dispositivos', () => {
    store.commit('setDispositivo', dispositivos[0])
    expect(store.state.dispositivos).toEqual(dispositivos[0])
  })

  it('mutations.setDispositivoActual guarda en state.dispositivoActual un dispositivo', () => {
    store.commit('setDispositivoActual', dispositivos[1])
    expect(store.state.dispositivoActual).toEqual(dispositivos[1])
  })

  it('mutations.setDispositivoActual guarda una regla en localStorage correctamente', () => {
    let savedDispositivoActual = JSON.parse(window.localStorage.getItem('dispositivos.dispositivoActual'))
    expect(savedDispositivoActual).toEqual(null)

    const expectedDispositivoActual = dispositivos[0]
    store.commit('setDispositivoActual', expectedDispositivoActual)

    savedDispositivoActual = JSON.parse(window.localStorage.getItem('dispositivos.dispositivoActual'))
    expect(savedDispositivoActual).toEqual(expectedDispositivoActual)
  })

  it('mutations.modificarEstado guarda en modifica la propiedad `activo` de un dispositivo', () => {
    store.commit('setDispositivo', dispositivos)
    const dispositivo = { ...dispositivos[0] }
    dispositivo.activo = !dispositivo.activo
    store.commit('modificarEstado', dispositivo)
    expect(store.state.dispositivos[0].activo).toEqual(dispositivo.activo)
  })

  it('actions.getAllDispositivos hace un commit de mutations.setDispositivo y los dispositivos se guardan en state.dispositivos', async () => {
    const mock = new MockAdapter(axios)

    mock.onGet('/api/dispositivos').reply(200, dispositivos)

    await store.dispatch('getAllDispositivos')
    expect(store.state.dispositivos).toEqual(dispositivos)
  })

  it('actions.getAllDispositivos retorna un mensaje de error si ocurre un problema de conexión', async () => {
    expect.assertions(1)

    const mock = new MockAdapter(axios)
    mock.onGet('/api/dispositivos').networkError()

    try {
      await store.dispatch('getAllDispositivos')
    } catch (error) {
      expect(error.message).toEqual('No se pudo obtener ningún dispositivo. Intente nuevamente.')
    }
  })

  it('actions.modificarEstado hace un commit de mutations.modificarEstado y el dispositivo modificado se guarda en state.dispositivos', async () => {
    const mock = new MockAdapter(axios)
    store.commit('setDispositivo', dispositivos)
    const dispositivo = { ...dispositivos[0] }
    dispositivo.activo = !dispositivo.activo
    mock.onPut('/api/dispositivos').reply(200, dispositivo)
    await store.dispatch('modificarEstado')
    expect(store.state.dispositivos[0]).toEqual(dispositivo)
  })

  it('actions.modificarEstado retorna un mensaje de error si ocurre un problema de conexión', async () => {
    expect.assertions(1)

    const mock = new MockAdapter(axios)
    mock.onGet('/api/dispositivos').networkError()

    try {
      await store.dispatch('modificarEstado')
    } catch (error) {
      expect(error.message).toEqual('No se pudo modificar el dispositivo. Intente nuevamente.')
    }
  })

  it('getters.getAllDispositivos retorna los dispositivos guardados en state.dispositivos', () => {
    store.commit('setDispositivo', dispositivos)
    expect(store.getters.getAllDispositivos).toEqual(dispositivos)
  })

  it('getters.getDispositivoActual retorna el dispositivo guardado en state.dispositivoActual', () => {
    store.commit('setDispositivoActual', dispositivos[0])
    expect(store.getters.getDispositivoActual).toEqual(dispositivos[0])
  })

  it('getters.getSensores retorna los dispositivos tipo SENSOR guardados en state.dispositivos', () => {
    store.commit('setDispositivo', dispositivos)
    expect(store.getters.getSensores).toEqual([dispositivos[0]])
  })

  it('getters.getActuadores retorna los dispositivos tipo ACTUADOR guardados en state.dispositivos', () => {
    store.commit('setDispositivo', dispositivos)
    expect(store.getters.getActuadores).toEqual([dispositivos[1]])
  })

  it('getters.getSensoresLabels retorna los nombres de los dispositivos tipo SENSOR guardados en state.dispositivos', () => {
    store.commit('setDispositivo', dispositivos)
    expect(store.getters.getSensoresLabels).toEqual([`Nombre: ${dispositivos[0].nombre}`])
  })

  it('getters.getActuadoresLabels retorna los nombres de los dispositivos tipo ACTUADOR guardados en state.dispositivos', () => {
    store.commit('setDispositivo', dispositivos)
    expect(store.getters.getActuadoresLabels).toEqual([`Nombre: ${dispositivos[1].nombre}`])
  })
})
