import { mount, createLocalVue } from '@vue/test-utils'
import ResetPasswordInit from '@/router/views/auth/ResetPasswordInit'
import Vuelidate from 'vuelidate'
import MockAdapter from 'axios-mock-adapter'
import axios from 'axios'
import flushPromises from 'flush-promises'

const localVue = createLocalVue()
localVue.use(Vuelidate)

describe('Componente: ResetPasswordInit', () => {
  let wrapper

  const mockPush = jest.fn()
  const $router = { push: mockPush }

  beforeEach(() => {
    wrapper = mount(ResetPasswordInit, {
      localVue,
      mocks: { $router }
    })
  })

  it('redirige a `resetPasswordFinish` si la llamada de axios luego de enviar el formulario es exitosa', async () => {
    const mock = new MockAdapter(axios)
    mock.onPost('/api/account/reset-password/init').replyOnce(200)
    await wrapper.find('.form').trigger('submit.prevent')
    await flushPromises()
    expect(mockPush).toHaveBeenCalledWith({ name: 'resetPasswordFinish' })
  })

  it('si el e-mail no corresponde a un usuario activo, el formulario debe retornar un error', async () => {
    const mock = new MockAdapter(axios)
    mock.onPost('/api/account/reset-password/init').replyOnce(400)
    await wrapper.find('.form').trigger('submit.prevent')
    await flushPromises()
    expect(wrapper.vm.emailError).toBe('La dirección de email no corresponde a ningún usuario activo.')
  })

  it('si ocurre un problema de conexión al enviar el formulario, debe retornar un error', async () => {
    const mock = new MockAdapter(axios)
    mock.onPost('/api/account/reset-password/init').replyOnce(500)
    await wrapper.find('.form').trigger('submit.prevent')
    await flushPromises()
    expect(wrapper.vm.serverError).toBe('Hubo un problema de conexión. Intente nuevamente.')
  })
})
