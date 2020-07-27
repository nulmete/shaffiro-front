import { mount, createLocalVue } from '@vue/test-utils'
import AsociarDispositivo from '@/router/views/dispositivos-no-asociados/AsociarDispositivo'
import Vuelidate from 'vuelidate'
import axios from 'axios'

jest.mock('axios')

describe('Componente: AsociarDispositivo', () => {
  const localVue = createLocalVue()
  localVue.use(Vuelidate)
  let wrapper

  const mockPush = jest.fn()

  const $router = {
    push: mockPush
  }

  describe('sin methods mockeados', () => {
    beforeEach(() => {
      wrapper = mount(AsociarDispositivo, {
        localVue,
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
