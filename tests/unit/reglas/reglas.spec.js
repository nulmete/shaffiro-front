import Vuex from 'vuex'
import { mount, createLocalVue } from '@vue/test-utils'
import Reglas from '@/router/views/reglas/Reglas'

describe('Componente: Reglas', () => {
  const localVue = createLocalVue()
  let wrapper

  describe('con methods mockeado', () => {
    localVue.use(Vuex)

    const actionsReglas = { getAllReglas: jest.fn() }
    const gettersReglas = { getAllReglas: (state) => state.reglas }
    const mutationsReglas = { setReglaActual: jest.fn() }
    const stateReglas = { reglas: ['Reglita', 'ReglaLuminosa'] }
    const reglasModule = {
      namespaced: true,
      state: stateReglas,
      getters: gettersReglas,
      actions: actionsReglas,
      mutations: mutationsReglas
    }
    const actionsDispositivos = { getAllDispositivos: jest.fn() }
    const gettersDispositivos = {
      getSensores: (state) => ['Sensor 1', 'Sensor 2'],
      getActuadores: (state) => ['Actuador 1', 'Actuador 2']
    }
    const dispositivosModule = {
      namespaced: true,
      actions: actionsDispositivos,
      getters: gettersDispositivos
    }

    const methods = {
      crear: jest.fn(),
      editar: jest.fn(),
      fetchData: jest.fn()
    }

    const store = new Vuex.Store({
      modules: {
        reglas: reglasModule,
        dispositivos: dispositivosModule
      }
    })

    beforeEach(() => {
      wrapper = mount(Reglas, {
        localVue,
        store,
        methods,
        data: () => ({ selectedItem: 0 }),
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

    it('Debe invocar al método crear luego de hacer click en el botón `Crear regla`', async () => {
      await wrapper.vm.$refs.crearReglaBtn.$emit('click')
      expect(methods.crear).toHaveBeenCalled()
    })

    it('Debe invocar al método editar luego de hacer click en el botón `Editar`', async () => {
      await wrapper.vm.$refs.editarReglaBtn.$emit('click')
      expect(methods.editar).toHaveBeenCalledWith('Reglita')
    })
  })

  describe('sin methods mockeado', () => {
    const mockDispatch = jest.fn(() => Promise.resolve())
    const mockCommit = jest.fn()
    const $store = {
      dispatch: mockDispatch,
      commit: mockCommit
    }

    const mockPush = jest.fn()
    const $router = {
      push: mockPush
    }

    beforeEach(() => {
      const localVue = createLocalVue()

      wrapper = mount(Reglas, {
        localVue,
        mocks: {
          $store,
          $router
        },
        data: () => ({ selectedItem: 1 }),
        computed: {
          reglas () { return ['Regla 1', 'Regla 2'] },
          sensores () { return ['Sensor 1', 'Sensor 2'] },
          actuadores () { return ['Actuador 1', 'Actuador 2'] },
          reglasParseadas () { return [] },
          reglasFiltradas () { return [] }
        }
      })
    })

    it('Debe hacer dispatch de reglas.getAllReglas y dispositivos.getAllDispositivos al ser creado', async () => {
      expect(mockDispatch).toHaveBeenCalledWith('dispositivos/getAllDispositivos')
      expect(mockDispatch).toHaveBeenCalledWith('reglas/getAllReglas')
    })

    it('Debe redirigir a `crearRegla` luego de hacer click en el botón `Crear regla`', async () => {
      await wrapper.vm.$refs.crearReglaBtn.$emit('click')
      expect(mockPush).toHaveBeenCalledWith({ name: 'crearRegla' })
    })

    it('Debe hacer commit de reglas/setReglaActual(regla) redirigir a `editarRegla` luego de hacer click en el botón `Crear regla`', async () => {
      await wrapper.vm.$refs.editarReglaBtn.$emit('click')
      expect(mockCommit).toHaveBeenCalledWith('reglas/setReglaActual', 'Regla 2')
      expect(mockPush).toHaveBeenCalledWith({ name: 'crearRegla' })
    })
  })
})
