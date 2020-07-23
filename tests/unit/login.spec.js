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

  const store = new Vuex.Store({
    modules: {
      auth: {
        namespaced: true
      }
    }
  })

  beforeEach(() => {
    wrapper = mount(Login, {
      localVue,
      stubs: ['BaseLink', 'BaseInput'],
      methods,
      store
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

  // todo
  // it('error no debe ser null si el método login falla', async () => {
  // })
})
