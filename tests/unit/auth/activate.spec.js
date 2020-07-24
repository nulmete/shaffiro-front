import { mount, createLocalVue } from '@vue/test-utils'
import Activate from '@/router/views/auth/Activate'
import Vuex from 'vuex'

const localVue = createLocalVue()
localVue.use(Vuex)

describe('Componente: Activate', () => {
  const getters = {
    getActivationEmail: (state) => state.activationEmail
  }
  const state = {
    activationEmail: 'test@test.com'
  }
  const store = new Vuex.Store({
    modules: {
      auth: {
        namespaced: true,
        state,
        getters
      }
    }
  })

  it('Se renderiza correctamente', () => {
    const wrapper = mount(Activate, { localVue, store, stubs: ['BaseCard'] })
    expect(wrapper.exists()).toBeTruthy()
    expect(wrapper.vm.email).toEqual('test@test.com')
  })
})
