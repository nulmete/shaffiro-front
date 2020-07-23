import Vuex from 'vuex'
import { mount, createLocalVue } from '@vue/test-utils'
import ReglaForm from '@/router/views/reglas/ReglaForm'

const localVue = createLocalVue()
localVue.use(Vuex)

const store = new Vuex.Store({
  getters: {
    'reglas/getAllReglas': jest.fn(),
    'dispositivos/getSensores': jest.fn(),
    'dispositivos/getActuadores': jest.fn(),
    'dispositivos/getSensoresLabels': jest.fn(),
    'dispositivos/getActuadoresLabels': jest.fn()
  },
  actions: {
    'dispositivos/getAllDispositivos': jest.fn(),
    'reglas/getAllReglas': jest.fn(),
    'reglas/getReglaActual': jest.fn(),
    'dispositivos/getSensores': jest.fn(),
    'dispositivos/getActuadores': jest.fn()
  },
  mutations: {
    'dispositivos/setAllDispositivos': jest.fn(),
    'reglas/setReglaActual': jest.fn()
  }
})

describe('Componente: ReglaForm', () => {
  let wrapper

  const methods = {
    crearRegla: jest.fn()
  }

  beforeEach(() => {
    wrapper = mount(ReglaForm, {
      localVue,
      stubs: ['BaseButton', 'BaseInput', 'BaseInputSelect', 'VueTimepicker'],
      store,
      methods,
      computed: {
        reglas () { return ['regla 1', 'regla 2', 'regla 3'] },
        reglasParseadas () { return jest.fn() },
        reglasParseadasActuadorAsociado () { return ['regla 1', 'regla 2'] },
        operadoresPosiblesTexto () { return ['mayor a', 'menor a', 'mayor o igual a', 'menor o igual a'] },
        unidad () { return jest.fn() },
        conectoresPosiblesTexto () { return ['y', 'o'] },
        accionesPosiblesLabels () { return jest.fn() },
        condicionesCombinadasString () { return jest.fn() }
      }
    })
  })

  it('Es renderizado correctamente', () => {
    expect(wrapper.exists()).toBeTruthy()
  })
})
