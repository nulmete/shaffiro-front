import { mount, createLocalVue } from '@vue/test-utils'
import EditarDispositivo from '@/router/views/dispositivos/EditarDispositivo'
import Vuelidate from 'vuelidate'
import axios from 'axios'

jest.mock('axios')

describe('Componente: EditarDispositivo', () => {
  const localVue = createLocalVue()
  localVue.use(Vuelidate)
  let wrapper

  const mockPush = jest.fn()
  const $router = {
    push: mockPush
  }

  const mockCommit = jest.fn()
  const mockGetters = jest.fn(() => {
    return {
      id: '1',
      nombre: 'Sensor_Lampara',
      tipo: 'SENSOR',
      activo: true,
      configuracion: 'LUMENES'
    }
  })
  const $store = {
    commit: mockCommit,
    getters: mockGetters
  }

  beforeEach(() => {
    wrapper = mount(EditarDispositivo, {
      localVue,
      mocks: {
        $router,
        $store
      },
      propsData: {
        identificador: '1'
      }
      // data () {
      //   return {
      //     id: '1',
      //     nombre: 'Sensor_Lampara',
      //     tipo: 'SENSOR',
      //     activo: true,
      //     configuracion: 'LUMENES'
      //   }
      // }
    })
  })

  it('debe asignar las propiedades recibidas de `getters[dispositivos/getDispositivoActual]` a data() ', async () => {
    const beforeRouteEnter = wrapper.vm.$options.beforeRouteEnter
    const nextMock = jest.fn()
    beforeRouteEnter.call(wrapper.vm, 'toObj', 'fromObj', nextMock)
    await wrapper.vm.$nextTick()
    expect(nextMock).toHaveBeenCalled()
  })

  it('error debe ser null si el método editarDispositivo() no falla', async () => {
    axios.put.mockReturnValue(Promise.resolve())
    await wrapper.find('.form').trigger('submit.prevent')
    expect(wrapper.vm.error).toBe(null)
    expect(mockPush).toHaveBeenCalledWith({ name: 'dispositivos' })
  })

  it('error no debe ser null si el método editarDispositivo() falla', async () => {
    axios.put.mockReturnValue(Promise.reject(Error('Se produjo un error')))
    await wrapper.find('.form').trigger('submit.prevent')
    expect(wrapper.vm.error).toBe('Se produjo un error')
  })

  it('debe haber un commit de dispositivos/setDispositivoActual al cambiar de ruta', async () => {
    const beforeRouteLeave = wrapper.vm.$options.beforeRouteLeave
    const nextMock = jest.fn()
    beforeRouteLeave.call(wrapper.vm, 'toObj', 'fromObj', nextMock)
    expect(mockCommit).toHaveBeenCalledWith('dispositivos/setDispositivoActual', {})
  })
})
