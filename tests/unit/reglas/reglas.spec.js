import Vuex from 'vuex'
import { mount, createLocalVue } from '@vue/test-utils'
import Reglas from '@/router/views/reglas/Reglas'

const localVue = createLocalVue()
localVue.use(Vuex)

const store = new Vuex.Store({
  getters: {
    'reglas/getAllReglas': jest.fn(),
    'dispositivos/getSensores': jest.fn(),
    'dispositivos/getActuadores': jest.fn()
  },
  actions: {
    'dispositivos/getAllDispositivos': jest.fn(),
    'reglas/getAllReglas': jest.fn()
  }
})

const $router = { push: jest.fn() }
const $route = { name: 'crearRegla' }

describe('Componente: Reglas', () => {
  let wrapper

  const methods = {
    crear: jest.fn(),
    editar: jest.fn()
  }

  beforeEach(() => {
    wrapper = mount(Reglas, {
      localVue,
      stubs: ['BaseButton'],
      mocks: {
        $route,
        $router
      },
      store,
      methods,
      data () {
        return {
          selectedItem: 0
        }
      },
      computed: {
        reglas () { return ['regla 1', 'regla 2', 'regla 3'] },
        reglasParseadas () { return jest.fn() },
        reglasFiltradas () { return ['regla 1', 'regla 2'] }
      }
    })
  })

  it('Es renderizado correctamente', () => {
    expect(wrapper.exists()).toBeTruthy()
  })

  it('Debe invocar al método crear luego de hacer click en el botón "Crear regla"', async () => {
    await wrapper.vm.$refs.crearReglaBtn.$emit('click')
    expect(methods.crear).toHaveBeenCalled()
  })

  it('Debe invocar al método editar luego de hacer click en el botón "Editar"', async () => {
    await wrapper.vm.$refs.editarReglaBtn.$emit('click')
    expect(methods.editar).toHaveBeenCalledWith('regla 1')
  })
})
