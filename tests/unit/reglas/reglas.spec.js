import Vuex from 'vuex'
import { mount, createLocalVue } from '@vue/test-utils'
import Reglas from '@/router/views/reglas/Reglas'

const localVue = createLocalVue()
localVue.use(Vuex)

describe('Componente: Reglas', () => {
  let wrapper

  const actionsReglas = {
    getAllReglas: jest.fn()
  }
  const gettersReglas = {
    getAllReglas: (state) => state.reglas
  }
  const mutationsReglas = {
    setReglaActual: jest.fn()
  }
  const stateReglas = {
    reglas: ['Reglita', 'ReglaLuminosa']
  }
  const reglasModule = {
    namespaced: true,
    state: stateReglas,
    getters: gettersReglas,
    actions: actionsReglas,
    mutations: mutationsReglas
  }

  const actionsDispositivos = {
    getAllDispositivos: jest.fn()
  }
  const gettersDispositivos = {
    getSensores: (state) => ['Sensor 1', 'Sensor 2'],
    getActuadores: (state) => ['Actuador 1', 'Actuador 2']
  }
  const dispositivosModule = {
    namespaced: true,
    actions: actionsDispositivos,
    getters: gettersDispositivos
  }

  const store = new Vuex.Store({
    modules: {
      reglas: reglasModule,
      dispositivos: dispositivosModule
    }
  })

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

  it('Es renderizado correctamente', async () => {
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
