import Vuex from 'vuex'
import { mount, createLocalVue } from '@vue/test-utils'
import Reglas from '@/router/views/reglas/Reglas'

const localVue = createLocalVue()
localVue.use(Vuex)

const getters = {
  'reglas/getAllReglas': (state) => state.reglas,
  'dispositivos/getSensores': (state) => ['Sensor 1', 'Sensor 2'],
  'dispositivos/getActuadores': (state) => ['Actuador 1', 'Actuador 2']
}
const actions = {
  'dispositivos/getAllDispositivos': jest.fn(),
  'reglas/getAllReglas': jest.fn()
}
const mutations = {
  'reglas/setReglaActual': jest.fn()
}
const state = {
  reglas: ['Reglita', 'ReglaLuminosa']
}

const store = new Vuex.Store({
  getters,
  actions,
  mutations,
  state
})

describe('Componente: Reglas', () => {
  let wrapper

  const methods = {
    crear: jest.fn(),
    editar: jest.fn(),
    fetchData: jest.fn()
  }

  beforeEach(() => {
    wrapper = mount(Reglas, {
      localVue,
      stubs: ['BaseButton'],
      store,
      methods,
      data () {
        return {
          selectedItem: 0
        }
      },
      computed: {
        reglasParseadas () { return [] },
        reglasFiltradas () { return [] }
      }
    })
  })

  it('Es renderizado correctamente', () => {
    expect(wrapper.exists()).toBeTruthy()
    expect(methods.fetchData).toHaveBeenCalled()
    expect(wrapper.vm.reglas).toStrictEqual(['Reglita', 'ReglaLuminosa'])
    expect(wrapper.vm.sensores).toStrictEqual(['Sensor 1', 'Sensor 2'])
    expect(wrapper.vm.actuadores).toStrictEqual(['Actuador 1', 'Actuador 2'])
  })

  it('Debe invocar al método crear luego de hacer click en el botón "Crear regla"', async () => {
    await wrapper.vm.$refs.crearReglaBtn.$emit('click')
    expect(methods.crear).toHaveBeenCalled()
  })

  it('Debe invocar al método editar luego de hacer click en el botón "Editar"', async () => {
    await wrapper.vm.$refs.editarReglaBtn.$emit('click')
    expect(methods.editar).toHaveBeenCalledWith('Reglita')
  })
})
