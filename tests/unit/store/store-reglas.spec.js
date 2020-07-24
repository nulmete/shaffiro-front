import Vuex from 'vuex'
import { createLocalVue } from '@vue/test-utils'
import reglasModule from '@/store/modules/reglas'
import { cloneDeep } from 'lodash'
import ruleEngineApi from '@/utils/ruleEngineApi'
import MockAdapter from 'axios-mock-adapter'

const localVue = createLocalVue()
localVue.use(Vuex)

describe('Store reglas module', () => {
  let store
  let regla = {
    _id: {
      $oid: '5f0f910b93529887b6b14505'
    },
    name: 'Prender la luz del living',
    antecedents: [
      {
        id1: 2,
        op: '<',
        vs: '22:00',
        unit: 'horas'
      },
      {
        conector: '&&'
      },
      {
        id1: 2,
        op: '>',
        vs: '08:00',
        unit: 'horas'
      },
      {
        conector: '&&'
      },
      {
        id1: 2,
        op: '<',
        vs: '500',
        unit: 'LUMENES'
      }
    ],
    consequences: [
      {
        id2: 1,
        action: 'on'
      }
    ]
  }

  beforeEach(() => {
    store = new Vuex.Store(cloneDeep(reglasModule))
    window.localStorage.clear()
  })

  it('mutations.setRegla guarda en state.reglas una regla', () => {
    store.commit('setRegla', regla)
    expect(store.state.reglas).toEqual(regla)
  })

  it('mutations.setReglaActual guarda en state.reglaActual una regla', () => {
    store.commit('setReglaActual', regla)
    expect(store.state.reglaActual).toEqual(regla)
  })

  it('mutations.setReglaActual guarda una regla en localStorage correctamente', () => {
    let savedReglaActual = JSON.parse(window.localStorage.getItem('regla.reglaActual'))
    expect(savedReglaActual).toEqual(null)

    const expectedReglaActual = regla
    store.commit('setReglaActual', expectedReglaActual)

    savedReglaActual = JSON.parse(window.localStorage.getItem('regla.reglaActual'))
    expect(savedReglaActual).toEqual(expectedReglaActual)
  })

  it('actions.getAllReglas hace un commit de mutations.setRegla y las reglas se guardan en state.reglas', async () => {
    const mock = new MockAdapter(ruleEngineApi)

    mock.onGet('/rules').reply(200, regla)

    await store.dispatch('getAllReglas')
    expect(store.state.reglas).toEqual(regla)
  })

  it('getters.getAllReglas retorna las reglas guardadas en state.reglas', () => {
    store.commit('setRegla', regla)
    expect(store.getters.getAllReglas).toEqual(regla)
  })
})
