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
      methods,
      stubs: ['router-link']
    })
  })

  it('Es renderizado correctamente', () => {
    expect(wrapper.exists()).toBeTruthy()
  })

  it('Debe invocar al método login luego de hacer click en el botón "Iniciar Sesión"', async () => {
    await wrapper.find('.form').trigger('submit.prevent')
    expect(methods.login).toHaveBeenCalled()
  })

  it('error no debe ser null si el método login falla', async () => {
    const mockFail = jest.fn(() => { throw new Error('error de login') })
    const actions = {
      'auth/login': mockFail
    }
    const store = new Vuex.Store({
      actions
    })
    const loginWithStore = mount(Login, {
      localVue,
      store,
      stubs: ['router-link']
    })

    await loginWithStore.find('.form').trigger('submit.prevent')
    expect(mockFail).toHaveBeenCalled()
    expect(loginWithStore.vm.error).toBe('error de login')
  })
})
