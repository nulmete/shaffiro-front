import { mount, createLocalVue } from '@vue/test-utils'
import LoginError from '@/components/LoginError'

const localVue = createLocalVue()

describe('Componente: LoginError', () => {
  it('Se renderiza correctamente', () => {
    const wrapper = mount(LoginError, { localVue })
    expect(wrapper.exists()).toBeTruthy()
  })

  it('Al hacer click en `Iniciar sesión`, el modal se cierra', async () => {
    const methods = { closeModal: jest.fn() }
    const wrapper = mount(LoginError, { localVue, methods })
    await wrapper.findComponent({ name: 'BaseButton' }).trigger('click')
    expect(methods.closeModal).toHaveBeenCalled()
  })

  it('Al hacer click en `Iniciar sesión`, se hace un commit a `auth/setSessionExpired` con el parámetro `false`', async () => {
    const mockCommit = jest.fn()
    const $store = { commit: mockCommit }
    const wrapper = mount(LoginError, { localVue, mocks: { $store } })
    await wrapper.findComponent({ name: 'BaseButton' }).trigger('click')
    expect(mockCommit).toHaveBeenCalled()
  })
})
