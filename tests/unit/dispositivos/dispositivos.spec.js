import { mount, createLocalVue } from '@vue/test-utils'
import Dispositivos from '@/router/views/dispositivos/ListarDispositivos'
import Vuex from 'vuex'

const localVue = createLocalVue()
localVue.use(Vuex)

describe('Componente: Dispositivos', () => {
  describe('con action mockeada', () => {
    let wrapper
    const methods = {
      detectar: jest.fn(),
      editar: jest.fn()
    }
    const mockAction = jest.fn(() => Promise.resolve())

    beforeEach(() => {
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
          dispositivosFiltrados () { return [] }
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
  })

  describe('sin action mockeada', () => {
    const gettersDispositivos = {
      getAllDispositivos: (state) => state.dispositivos
    }

    const stateDispositivos = {
      dispositivos: ['Sensor 1', 'Actuador 1']
    }

    const actionsDispositivos = {
      getAllDispositivos: jest.fn(() => Promise.resolve())
    }

    const dispositivosModule = {
      namespaced: true,
      state: stateDispositivos,
      getters: gettersDispositivos,
      actions: actionsDispositivos
    }

    const store = new Vuex.Store({
      modules: {
        dispositivos: dispositivosModule
      }
    })

    const methods = {
      modificarEstado: jest.fn()
    }

    const wrapper = mount(Dispositivos, {
      localVue,
      store,
      methods,
      data () {
        return {
          headings: ['Nombre', 'Tipo', 'Estado', 'Reglas'],
          fields: ['nombre', 'tipo', 'activo', 'reglas']
        }
      },
      computed: {
        dispositivosParseados () { return [] },
        dispositivosFiltrados () { return [{ nombre: 'disp', tipo: 'SENSOR', activo: 'Deshabilitado', reglas: [] }] }
      }
    })

    it('getters[`dispositivos/getAllDispositivos]` devuelve store.state.dispositivos', () => {
      expect(wrapper.vm.dispositivos).toStrictEqual(['Sensor 1', 'Actuador 1'])
    })

    it('Hacer click en el botón que muestra el estado de un dispositivo invoca al método modificarEstado', async () => {
      await wrapper.find('.disabled').trigger('click')
      expect(methods.modificarEstado).toHaveBeenCalled()
    })
  })
})
