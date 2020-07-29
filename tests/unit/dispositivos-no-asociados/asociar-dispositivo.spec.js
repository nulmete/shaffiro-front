import { mount, createLocalVue } from '@vue/test-utils'
import AsociarDispositivo from '@/router/views/dispositivos-no-asociados/AsociarDispositivo'
import Vuelidate from 'vuelidate'
import Vuex from 'vuex'
import axios from 'axios'

const localVue = createLocalVue()
localVue.use(Vuelidate)
localVue.use(Vuex)

jest.mock('axios')

describe('Componente: AsociarDispositivo', () => {
  let wrapper

  const dispositivos = [
    {
      id: 1,
      mac: 'AAAAA',
      uuid: 'qwertyuiop-asdfghj0123'
    },
    {
      id: 2,
      mac: 'BBBBB',
      uuid: 'zxcvbnmpoiuy8765'
    }
  ]

  const getters = { getDispositivoNoAsociadoActual: (state) => state.dispositivoNoAsociadoActual }
  const mutations = { setDispositivoNoAsociadoActual: jest.fn() }
  const state = { dispositivoNoAsociadoActual: dispositivos[0] }
  const dispositivosNoAsociadosModule = {
    namespaced: true,
    state,
    getters,
    mutations
  }

  const store = new Vuex.Store({
    modules: {
      dispositivosNoAsociados: dispositivosNoAsociadosModule
    }
  })

  const mockCommit = jest.fn()
  store.commit = mockCommit

  const mockPush = jest.fn()

  const $router = {
    push: mockPush
  }

  describe('sin methods mockeados', () => {
    beforeEach(() => {
      wrapper = mount(AsociarDispositivo, {
        localVue,
        store,
        mocks: {
          $router
        },
        data () {
          return {
            configuracionesPosibles: [],
            configuracionesPosiblesLabels: []
          }
        }
      })
    })

    it('debe asignar las propiedades recibidas de `getters[dispositivosNoAsociados/getDispositivoNoAsociadoActual]` a data() antes de renderizar', async () => {
      const beforeRouteEnter = wrapper.vm.$options.beforeRouteEnter
      beforeRouteEnter.call(wrapper.vm, { name: 'editarUsuario' }, 'from', cb => cb(wrapper.vm))
      expect(wrapper.vm.id).toBe(dispositivos[0].id)
      expect(wrapper.vm.mac).toBe(dispositivos[0].mac)
      expect(wrapper.vm.uuid).toBe(dispositivos[0].uuid)
    })

    it('debe hacer commit de `dispositivosNoAsociados/setDispositivoNoAsociadoActual(null)` al dejar la ruta', () => {
      const nextMock = jest.fn()
      const beforeRouteLeave = wrapper.vm.$options.beforeRouteLeave
      beforeRouteLeave.call(wrapper.vm, 'to', 'from', nextMock)
      expect(mockCommit).toHaveBeenCalledWith('dispositivosNoAsociados/setDispositivoNoAsociadoActual', null)
      expect(nextMock).toHaveBeenCalled()
    })

    it('error debe ser null si el método asociar no falla', async () => {
      await wrapper.find('.form').trigger('submit.prevent')
      expect(wrapper.vm.error).toBe(null)
      expect(mockPush).toHaveBeenCalledWith({ name: 'dispositivos' })
    })

    it('error debe ser distinto de null si el método asociar falla', async () => {
      axios.post.mockReturnValue(Promise.reject(Error('Se produjo un error')))
      await wrapper.find('.form').trigger('submit.prevent')
      expect(wrapper.vm.error).toBe('Se produjo un error')
    })

    it('al seleccionar el tipo de dispositivo `SENSOR`, configuracionesPosibles debe ser `LUMENES` y su label `el Flujo Luminoso`', async () => {
      expect(wrapper.vm.configuracionesPosibles).toEqual([])
      expect(wrapper.vm.configuracionesPosiblesLabels).toEqual(wrapper.vm.configuracionesPosibles)
      const selectTipoDispositivo = wrapper.find('#tipo')
      selectTipoDispositivo.element.value = 'SENSOR'
      selectTipoDispositivo.trigger('change')
      expect(wrapper.vm.configuracionesPosibles).toEqual(['LUMENES'])
      expect(wrapper.vm.configuracionesPosiblesLabels).toEqual(['el Flujo Luminoso'])
    })

    it('al seleccionar el tipo de dispositivo `ACTUADOR`, configuracionesPosibles y sus labels deben ser `Lámpara LED, Lámpara fluorescente, Lámpara halógena, Lámpara bajo consumo`', async () => {
      expect(wrapper.vm.configuracionesPosibles).toEqual([])
      expect(wrapper.vm.configuracionesPosiblesLabels).toEqual([])
      const selectTipoDispositivo = wrapper.find('#tipo')
      selectTipoDispositivo.element.value = 'ACTUADOR'
      selectTipoDispositivo.trigger('change')
      expect(wrapper.vm.configuracionesPosibles).toEqual(['Lámpara LED', 'Lámpara fluorescente', 'Lámpara halógena', 'Lámpara bajo consumo'])
      expect(wrapper.vm.configuracionesPosiblesLabels).toEqual(wrapper.vm.configuracionesPosibles)
    })
  })

  describe('con methods mockeado', () => {
    const methods = {
      mostrarOpciones: jest.fn()
    }

    beforeEach(() => {
      wrapper = mount(AsociarDispositivo, {
        localVue,
        methods
      })
    })

    it('el método mostrarOpciones() debe ser invocado al seleccionar el tipo de dispositivo', async () => {
      await wrapper.find('#tipo').trigger('change')
      expect(methods.mostrarOpciones).toHaveBeenCalled()
    })
  })
})
