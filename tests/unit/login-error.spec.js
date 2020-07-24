import { mount, createLocalVue } from '@vue/test-utils'
import LoginError from '@/components/LoginError'

const localVue = createLocalVue()

describe('Componente: LoginError', () => {
  let methods = {
    closeModal: jest.fn()
  }

  let wrapper

  beforeEach(() => {
    wrapper = mount(LoginError, { localVue, methods })
  })

  it('Se renderiza correctamente', () => {
    expect(wrapper.exists()).toBeTruthy()
  })

  it('Al hacer click en `Iniciar sesión`, el modal se cierra', async () => {
    await wrapper.findComponent({ name: 'BaseButton' }).trigger('click')
    expect(methods.closeModal).toHaveBeenCalled()
  })
})
