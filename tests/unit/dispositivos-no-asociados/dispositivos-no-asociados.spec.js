import { mount, createLocalVue } from '@vue/test-utils'
import DetectarDispositivos from '@/router/views/dispositivos-no-asociados/DetectarDispositivos'
import Vuex from 'vuex'

const localVue = createLocalVue()
localVue.use(Vuex)

describe('Componente: Dispositivos', () => {
  let wrapper

  describe('con methods mockeados', () => {
    const methods = {
      asociar: jest.fn()
    }
    const mockAction = jest.fn(() => Promise.resolve())

    beforeEach(() => {
      const store = new Vuex.Store({
        modules: {
          dispositivosNoAsociados: {
            namespaced: true,
            actions: {
              getAllDispositivosNoAsociados: mockAction
            }
          }
        }
      })

      wrapper = mount(DetectarDispositivos, {
        localVue,
        store,
        methods,
        data () {
          return {
            selectedItem: 0
          }
        },
        computed: {
          dispositivosNoAsociados () { return ['Sensor_Lampara', 'Actuador_Lampara'] }
        }
      })
    })

    it('Se renderiza correctamente y en el hook created() hace dispatch de `dispositivosNoAsociados/getAllDispositivosNoAsociados`', async () => {
      expect(wrapper.exists()).toBeTruthy()
      expect(mockAction).toHaveBeenCalled()
    })

    it('Debe invocar al método asociar luego de hacer click en el botón `Asociar`', async () => {
      await wrapper.findComponent({ name: 'BaseButton' }).trigger('click')
      expect(methods.asociar).toHaveBeenCalled()
    })
  })

  describe('sin methods mockeados', () => {
    const gettersDispositivosNoAsociados = {
      getAllDispositivosNoAsociados: (state) => state.dispositivosNoAsociados
    }

    const stateDispositivosNoAsociados = {
      dispositivosNoAsociados: ['Sensor 1', 'Actuador 1']
    }

    const actionsDispositivosNoAsociados = {
      getAllDispositivosNoAsociados: jest.fn(() => Promise.resolve())
    }

    const dispositivosNoAsociadosModule = {
      namespaced: true,
      state: stateDispositivosNoAsociados,
      getters: gettersDispositivosNoAsociados,
      actions: actionsDispositivosNoAsociados
    }

    const store = new Vuex.Store({
      modules: {
        dispositivosNoAsociados: dispositivosNoAsociadosModule
      }
    })

    store.commit = jest.fn()

    const mockPush = jest.fn()
    const $router = {
      push: mockPush
    }

    beforeEach(() => {
      wrapper = mount(DetectarDispositivos, {
        localVue,
        store,
        mocks: {
          $router
        },
        data: () => ({ selectedItem: 0 })
      })
    })

    it('getters[`dispositivosNoAsociados/getAllDispositivosNoAsociados]` devuelve store.state.dispositivosNoAsociados', () => {
      expect(wrapper.vm.dispositivosNoAsociados).toStrictEqual(['Sensor 1', 'Actuador 1'])
    })

    it('Debe hacer commit de `dispositivosNoAsociados/setDispositivoNoAsociadoActual` y redirigir a `asociarDispositivo` luego de hacer click en el botón `Asociar`', async () => {
      await wrapper.findComponent({ name: 'BaseButton' }).trigger('click')
      expect(store.commit).toHaveBeenCalledWith('dispositivosNoAsociados/setDispositivoNoAsociadoActual', 'Sensor 1')
      expect(mockPush).toHaveBeenCalledWith({ name: 'asociarDispositivo' })
    })
  })
})
