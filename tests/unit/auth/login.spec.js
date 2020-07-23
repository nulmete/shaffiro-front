import Vuelidate from 'vuelidate'
import Vuex from 'vuex'
import { mount, createLocalVue } from '@vue/test-utils'
import Login from '@/router/views/auth/LogIn.vue'

const localVue = createLocalVue()
localVue.use(Vuelidate)
localVue.use(Vuex)

describe('Componente: Login', () => {
  let wrapper

  let methods = {
    login: jest.fn()
  }

  beforeEach(() => {
    wrapper = mount(Login, {
      localVue,
      stubs: ['BaseLink', 'BaseInput', 'BaseButton', 'BaseCard'],
      methods
    })
  })

  it('Es renderizado correctamente', () => {
    expect(wrapper.exists()).toBeTruthy()
  })

  it('Debe invocar al método login luego de hacer click en el botón "Iniciar Sesión"', async () => {
    wrapper.find('.form').trigger('submit.prevent')
    await wrapper.vm.$nextTick()
    expect(methods.login).toHaveBeenCalled()
  })

  it('error no debe ser null si el método login falla', async () => {
    const actions = {
      'auth/login': jest.fn(() => { throw new Error('error de login') })
    }
    const store = new Vuex.Store({
      actions
    })
    const loginWithStore = mount(Login, {
      localVue,
      stubs: ['BaseLink', 'BaseButton', 'BaseInput', 'BaseCard'],
      store
    })

    loginWithStore.find('.form').trigger('submit.prevent')
    await loginWithStore.vm.$nextTick()
    expect(actions['auth/login']).toHaveBeenCalled()
    expect(loginWithStore.vm.error).toBe('error de login')
  })
})
