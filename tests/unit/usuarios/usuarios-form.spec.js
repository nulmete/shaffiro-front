import { mount, createLocalVue } from '@vue/test-utils'
import UsuarioForm from '@/router/views/usuarios/UsuarioForm'
import Vuex from 'vuex'
import Vuelidate from 'vuelidate'

const localVue = createLocalVue()
localVue.use(Vuex)
localVue.use(Vuelidate)

describe('Componente: UsuarioForm', () => {
  let wrapper

  const usuarios = [
    {
      id: 1,
      login: 'admin',
      email: 'admin@admin.com',
      authorities: ['ROLE_ADMIN', 'ROLE_USER'],
      activated: true
    },
    {
      id: 2,
      login: 'user',
      email: 'user@user.com',
      authorities: ['ROLE_USER'],
      activated: true
    }
  ]

  const getters = { getUsers: (state) => state.usuarios }
  const mutations = { setCurrentUser: jest.fn() }
  const state = { usuarios }
  const usuariosModule = {
    namespaced: true,
    state,
    getters,
    mutations
  }

  const store = new Vuex.Store({
    modules: {
      usuarios: usuariosModule
    }
  })

  const mockPush = jest.fn()
  const $router = { push: mockPush }

  const mockDispatch = jest.fn()
  store.dispatch = mockDispatch

  beforeEach(() => {
    wrapper = mount(UsuarioForm, {
      localVue,
      store,
      mocks: {
        $router
      }
    })
  })

  it('computed properties', async () => {
    expect(wrapper.vm.authoritiesOptionsSpanish).toEqual(['Administrador', 'Cliente'])
  })
})
