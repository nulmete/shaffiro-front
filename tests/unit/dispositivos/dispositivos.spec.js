import { mount, createLocalVue } from '@vue/test-utils'
import Dispositivos from '@/router/views/dispositivos/ListarDispositivos'
import Vuex from 'vuex'

const localVue = createLocalVue()
localVue.use(Vuex)

describe('Componente: ListarDispositivos', () => {
  let wrapper

  describe('con methods mockeados', () => {
    const methods = {
      detectar: jest.fn(),
      editar: jest.fn(),
      modificarEstado: jest.fn()
    }

    const mockAction = jest.fn(() => Promise.resolve())

    const store = new Vuex.Store({
      modules: {
        dispositivos: {
          namespaced: true,
          actions: {
            getAllDispositivos: mockAction
          }
        }
      }
    })

    beforeEach(() => {
      wrapper = mount(Dispositivos, {
        localVue,
        store,
        methods,
        data () {
          return {
            selectedItem: 0
          }
        },
        computed: {
          dispositivos () { return ['Sensor_Lampara', 'Actuador_Lampara'] },
          dispositivosParseados () { return [] },
          dispositivosFiltrados () { return [{ nombre: 'disp', tipo: 'SENSOR', activo: 'Deshabilitado', reglas: [] }] }
        }
      })
    })

    it('Se renderiza correctamente y en el hook created() hace dispatch de `dispositivos/getAllDispositivos`', async () => {
      expect(wrapper.exists()).toBeTruthy()
      expect(mockAction).toHaveBeenCalled()
    })

    it('Debe invocar al método detectar luego de hacer click en el botón `Detectar dispositivos`', async () => {
      await wrapper.vm.$refs.detectar.$emit('click')
      expect(methods.detectar).toHaveBeenCalled()
    })

    it('Debe invocar al método editar luego de hacer click en el botón `Editar`', async () => {
      await wrapper.vm.$refs.editar.$emit('click')
      expect(methods.editar).toHaveBeenCalledWith('Sensor_Lampara')
    })

    it('Hacer click en el botón que muestra el estado de un dispositivo invoca al método modificarEstado', async () => {
      await wrapper.find('.disabled').trigger('click')
      expect(methods.modificarEstado).toHaveBeenCalled()
    })
  })

  describe('sin methods mockeados', () => {
    const dispositivos = [
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
    const actions = { getAllDispositivos: jest.fn() }
    const getters = { getAllDispositivos: (state) => state.dispositivos }
    const mutations = { setDispositivoActual: jest.fn() }
    const state = { dispositivos }
    const dispositivosModule = {
      namespaced: true,
      state,
      getters,
      actions,
      mutations
    }

    const store = new Vuex.Store({
      modules: {
        dispositivos: dispositivosModule
      }
    })

    const mockCommit = jest.fn()
    store.commit = mockCommit

    const mockDispatch = jest.fn()
    store.dispatch = mockDispatch

    const mockPush = jest.fn()
    const $router = {
      push: mockPush
    }

    beforeEach(() => {
      wrapper = mount(Dispositivos, {
        localVue,
        store,
        mocks: {
          $router
        },
        data () {
          return {
            search: '',
            selectedItem: 0
          }
        }
      })
    })

    it('Las computed properties son correctas', async () => {
      const dispositivosParseados = dispositivos.map(disp => {
        const activo = disp.activo ? 'Habilitado' : 'Deshabilitado'
        return { ...disp, activo }
      })
      expect(wrapper.vm.dispositivos).toEqual(dispositivos)
      expect(wrapper.vm.dispositivosParseados).toEqual(dispositivosParseados)
      expect(wrapper.vm.dispositivosFiltrados).toEqual(dispositivosParseados)
    })

    it('Debe redirigir a `detectarDispositivos` luego de hacer click en el botón `Detectar dispositivos`', async () => {
      await wrapper.vm.$refs.detectar.$emit('click')
      expect(mockPush).toHaveBeenCalledWith({ name: 'detectarDispositivos' })
    })

    it('Debe hacer commit de `dispositivos/setDispositivoActual` y redirigir a `editarDispositivo` luego de hacer click en el botón `Editar`', async () => {
      await wrapper.vm.$refs.editar.$emit('click')
      expect(mockCommit).toHaveBeenCalledWith('dispositivos/setDispositivoActual', dispositivos[0])
      expect(mockPush).toHaveBeenCalledWith({ name: 'editarDispositivo', params: { identificador: '1' } })
    })

    it('Debe hacer dispatch de `dispositivos/modificarEstado` luego de hacer click en el botón `Habilitado/Deshabilitado`', async () => {
      const dispositivo = { ...dispositivos[0], activo: !dispositivos[0].activo }
      await wrapper.find('#modificar').trigger('click')
      expect(mockDispatch).toHaveBeenLastCalledWith('dispositivos/modificarEstado', dispositivo)
    })
  })
})
