import { mount, createLocalVue } from '@vue/test-utils'
import NavBar from '@/components/NavBar'
import Vuex from 'vuex'

const localVue = createLocalVue()
localVue.use(Vuex)

describe('Componente: NavBar', () => {
  const getters = {
    isLoggedIn: (state) => !!state.currentUser && !!state.currentUser.token,
    isAdmin: (state, getters) => !!getters.isLoggedIn && !!state.currentUser.authorities.includes('ROLE_ADMIN')
  }
  const state = {
    currentUser: { username: 'admin', token: 'token', authorities: ['ROLE_ADMIN', 'ROLE_USER'] }
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
    const wrapper = mount(NavBar, { localVue, store, stubs: ['router-link'] })
    expect(wrapper.exists()).toBeTruthy()
    expect(wrapper.vm.isLoggedIn).toEqual(true)
    expect(wrapper.vm.isAdmin).toEqual(true)
  })
})
