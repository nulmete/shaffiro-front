import Vuex from 'vuex'
import { createLocalVue } from '@vue/test-utils'
import dispositivosNoAsociadosModule from '@/store/modules/dispositivosNoAsociados'
import { cloneDeep } from 'lodash'
import axios from 'axios'
import MockAdapter from 'axios-mock-adapter'

const localVue = createLocalVue()
localVue.use(Vuex)

describe('Store dispositivos no asociados module', () => {
  let store
  let dispositivosNoAsociados = [
    {
      id: 1,
      mac: 'AA:BB:CC:DD:EE:FF',
      uuid: '8900c34a-cea8-11ea-87d0-0242ac130003'
    },
    {
      id: 2,
      mac: 'GG:HH:II:JJ:KK:LL',
      uuid: '8900c34a-cea8-11ea-87d0-0242ac130004'
    }
  ]

  beforeEach(() => {
    store = new Vuex.Store(cloneDeep(dispositivosNoAsociadosModule))
    window.localStorage.clear()
  })

  it('mutations.setDispositivosNoAsociados guarda en state.dispositivosNoAsociados uno o más dispositivos', () => {
    store.commit('setDispositivosNoAsociados', dispositivosNoAsociados)
    expect(store.state.dispositivosNoAsociados).toEqual(dispositivosNoAsociados)
  })

  it('mutations.setDispositivoNoAsociadoActual guarda en state.dispositivosNoAsociados un dispositivo', () => {
    store.commit('setDispositivoNoAsociadoActual', dispositivosNoAsociados[0])
    expect(store.state.dispositivoNoAsociadoActual).toEqual(dispositivosNoAsociados[0])
  })

  it('mutations.setDispositivoNoAsociadoActual guarda un dispositivo no asociado en localStorage correctamente', () => {
    let savedDispositivoNoAsociadoActual = JSON.parse(
      window.localStorage.getItem('dispositivosNoAsociados.dispositivoNoAsociadoActual')
    )
    expect(savedDispositivoNoAsociadoActual).toEqual(null)

    const expectedDispositivoNoAsociadoActual = dispositivosNoAsociados[0]
    store.commit('setDispositivoNoAsociadoActual', expectedDispositivoNoAsociadoActual)

    savedDispositivoNoAsociadoActual = JSON.parse(
      window.localStorage.getItem('dispositivosNoAsociados.dispositivoNoAsociadoActual')
    )
    expect(savedDispositivoNoAsociadoActual).toEqual(expectedDispositivoNoAsociadoActual)
  })

  it('actions.getAllDispositivosNoAsociados hace un commit de mutations.setDispositivosNoAsociados y los dispositivos no asociados se guardan en state.dispositivosNoAsociados', async () => {
    const mock = new MockAdapter(axios)
    mock.onGet('/api/dispositivo-no-asociados').reply(200, dispositivosNoAsociados)
    await store.dispatch('getAllDispositivosNoAsociados')
    expect(store.state.dispositivosNoAsociados).toEqual(dispositivosNoAsociados)
  })

  it('getters.getAllDispositivosNoAsociados retorna los dispositivos no asociados guardados en state.dispositivosNoAsociados', () => {
    store.commit('setDispositivosNoAsociados', dispositivosNoAsociados)
    expect(store.getters.getAllDispositivosNoAsociados).toEqual(dispositivosNoAsociados)
  })

  it('getters.getDispositivoNoAsociadoActual retorna el dispositivo no asociado guardado en state.dispositivoNoAsociadoActual', () => {
    store.commit('setDispositivoNoAsociadoActual', dispositivosNoAsociados[1])
    expect(store.getters.getDispositivoNoAsociadoActual).toEqual(dispositivosNoAsociados[1])
  })
})
