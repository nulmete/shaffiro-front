import { mount, createLocalVue } from '@vue/test-utils'
import EditarDispositivo from '@/router/views/dispositivos/EditarDispositivo'
import Vuex from 'vuex'
import Vuelidate from 'vuelidate'
import axios from 'axios'

const localVue = createLocalVue()
localVue.use(Vuelidate)
localVue.use(Vuex)

jest.mock('axios')

describe('Componente: EditarDispositivo', () => {
  let wrapper

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

  const getters = { getDispositivoActual: (state) => state.dispositivoActual }
  const mutations = { setDispositivoActual: jest.fn() }
  const state = { dispositivoActual: dispositivos[0] }
  const dispositivosModule = {
    namespaced: true,
    state,
    getters,
    mutations
  }

  const store = new Vuex.Store({
    modules: {
      dispositivos: dispositivosModule
    }
  })

  const mockCommit = jest.fn()
  store.commit = mockCommit

  const mockPush = jest.fn()
  const $router = {
    push: mockPush
  }

  beforeEach(() => {
    wrapper = mount(EditarDispositivo, {
      localVue,
      store,
      mocks: {
        $router
      }
    })
  })

  it('debe asignar las propiedades recibidas de `getters[dispositivos/getDispositivoActual]` a data() antes de renderizar', async () => {
    const beforeRouteEnter = wrapper.vm.$options.beforeRouteEnter
    beforeRouteEnter.call(wrapper.vm, 'to', 'from', cb => cb(wrapper.vm))
    expect(wrapper.vm.id).toBe('1')
    expect(wrapper.vm.nombre).toBe('Sensor_Lampara')
    expect(wrapper.vm.tipo).toBe('SENSOR')
    expect(wrapper.vm.activo).toBe(true)
    expect(wrapper.vm.configuracion).toBe('LUMENES')
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
