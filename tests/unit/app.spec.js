import { mount, createLocalVue } from '@vue/test-utils'
import App from '@/App'
import Vuex from 'vuex'

const localVue = createLocalVue()
localVue.use(Vuex)

describe('Componente: App', () => {
  const getters = {
    getSessionExpired: jest.fn()
  }
  const store = new Vuex.Store({
    modules: {
      auth: {
        namespaced: true,
        getters
      }
    }
  })
  const $route = {
    fullPath: '/'
  }

  it('Se renderiza correctamente', () => {
    const wrapper = mount(App, { localVue, store, mocks: { $route }, stubs: ['router-view', 'router-link'] })
    expect(wrapper.exists()).toBeTruthy()
  })
})
