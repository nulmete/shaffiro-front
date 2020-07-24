import { mount, createLocalVue } from '@vue/test-utils'
import SignUp from '@/router/views/auth/SignUp.vue'
import Vuelidate from 'vuelidate'
import Vuex from 'vuex'

const localVue = createLocalVue()
localVue.use(Vuelidate)
localVue.use(Vuex)

describe('Componente: Signup', () => {
  describe('sin store', () => {
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

  describe('con store', () => {
    const createStore = (actionFn) => {
      const actions = {
        signup: actionFn
      }

      let auth = {
        namespaced: true,
        actions
      }

      return new Vuex.Store({
        modules: {
          auth
        }
      })
    }

    it('Debe hacer dispatch de la acción `auth/signup` luego de hacer click en el botón "Registrarse"', async () => {
      const signupMock = jest.fn(() => Promise.resolve())
      const store = createStore(signupMock)
      const wrapperWithStore = mount(SignUp, {
        localVue,
        store,
        stubs: ['BaseLink', 'BaseInput', 'BaseButton']
      })
      await wrapperWithStore.find('.form').trigger('submit.prevent')
      expect(signupMock).toHaveBeenCalled()
    })

    it('Si la acción `auth/signup` arroja el error `userexists`, usernameError debe ser true', async () => {
      const signupMockError = jest.fn(() => { throw new Error('userexists') })
      const store = createStore(signupMockError)
      const wrapperWithStore = mount(SignUp, {
        localVue,
        store,
        stubs: ['BaseLink', 'BaseInput', 'BaseButton']
      })
      await wrapperWithStore.find('.form').trigger('submit.prevent')
      expect(signupMockError).toHaveBeenCalled()
      expect(wrapperWithStore.vm.usernameError).toBe(true)
      expect(wrapperWithStore.vm.emailError).toBe(false)
    })

    it('Si la acción `auth/signup` arroja el error `emailexists`, emailError debe ser true', async () => {
      const signupMockError = jest.fn(() => { throw new Error('emailexists') })
      const store = createStore(signupMockError)
      const wrapperWithStore = mount(SignUp, {
        localVue,
        store,
        stubs: ['BaseLink', 'BaseInput', 'BaseButton']
      })
      await wrapperWithStore.find('.form').trigger('submit.prevent')
      expect(signupMockError).toHaveBeenCalled()
      expect(wrapperWithStore.vm.usernameError).toBe(false)
      expect(wrapperWithStore.vm.emailError).toBe(true)
    })
  })
})
