import { mount, createLocalVue } from '@vue/test-utils'
import ResetPasswordFinish from '@/router/views/auth/ResetPasswordFinish'
import Vuelidate from 'vuelidate'
import MockAdapter from 'axios-mock-adapter'
import axios from 'axios'
import flushPromises from 'flush-promises'

const localVue = createLocalVue()
localVue.use(Vuelidate)

describe('Componente: ResetPasswordFinish', () => {
  let wrapper

  const mockPush = jest.fn()
  const $router = { push: mockPush }

  beforeEach(() => {
    wrapper = mount(ResetPasswordFinish, {
      localVue,
      mocks: { $router }
    })
  })

  afterEach(() => {
    window.localStorage.clear()
  })

  it('Guarda resetted:true en localstorage si la llamada de axios luego de enviar el formulario es exitosa y redirectToLogin() funciona', async () => {
    const mock = new MockAdapter(axios)
    mock.onPost('/api/account/reset-password/finish').replyOnce(200)
    await wrapper.find('.form').trigger('submit.prevent')
    await flushPromises()
    expect(wrapper.vm.resetted).toBe(true)
    expect(JSON.parse(window.localStorage.getItem('resetted'))).toBe(true)
    await wrapper.vm.$refs.loginBtn.$emit('click')
    expect(mockPush).toHaveBeenCalledWith({ name: 'login' })
  })

  it('Guarda resetted: true en localstorage si la llamada de axios luego de enviar el formulario es exitosa', async () => {
    const mock = new MockAdapter(axios)
    mock.onPost('/api/account/reset-password/finish').replyOnce(500, { title: 'No user was found for this reset key' })
    await wrapper.find('.form').trigger('submit.prevent')
    await flushPromises()
    expect(wrapper.vm.userError).toBe('El código ingresado no corresponde a ningún usuario activo.')
    expect(wrapper.vm.resetted).toBe(false)
    expect(JSON.parse(window.localStorage.getItem('resetted'))).toBe(null)
  })

  it('Guarda resetted: true en localstorage si la llamada de axios luego de enviar el formulario es exitosa', async () => {
    const mock = new MockAdapter(axios)
    mock.onPost('/api/account/reset-password/finish').replyOnce(500)
    await wrapper.find('.form').trigger('submit.prevent')
    await flushPromises()
    expect(wrapper.vm.serverError).toBe('Hubo un problema de conexión. Intente nuevamente.')
    expect(wrapper.vm.resetted).toBe(false)
    expect(JSON.parse(window.localStorage.getItem('resetted'))).toBe(null)
  })

  it('debe limpiar localstorage al dejar la ruta', () => {
    const nextMock = jest.fn()
    const beforeRouteLeave = wrapper.vm.$options.beforeRouteLeave
    beforeRouteLeave.call(wrapper.vm, 'to', 'from', nextMock)
    expect(JSON.parse(window.localStorage.getItem('resetted'))).toBe(null)
    expect(nextMock).toHaveBeenCalled()
  })
})
