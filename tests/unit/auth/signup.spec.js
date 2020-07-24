import { mount, createLocalVue } from '@vue/test-utils'
import SignUp from '@/router/views/auth/SignUp.vue'
import Vuelidate from 'vuelidate'

const localVue = createLocalVue()
localVue.use(Vuelidate)

describe('Componente: Signup', () => {
  let wrapper

  let methods = {
    signup: jest.fn()
  }

  beforeEach(() => {
    wrapper = mount(SignUp, {
      localVue,
      stubs: ['BaseLink', 'BaseInput', 'BaseButton'],
      methods
    })
  })

  it('Es renderizado correctamente', () => {
    expect(wrapper.exists()).toBeTruthy()
  })

  it('Debe invocar al método signup luego de hacer click en el botón "Registrarse"', async () => {
    await wrapper.find('.form').trigger('submit.prevent')
    expect(methods.signup).toHaveBeenCalled()
  })
})
