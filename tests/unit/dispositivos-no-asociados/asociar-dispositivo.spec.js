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

  beforeEach(() => {
    wrapper = mount(AsociarDispositivo, {
      localVue,
      mocks: {
        $router
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
})
