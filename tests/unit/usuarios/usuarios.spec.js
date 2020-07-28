import { mount, createLocalVue } from '@vue/test-utils'
import Usuarios from '@/router/views/usuarios/ListarUsuarios'
import Vuex from 'vuex'

const localVue = createLocalVue()
localVue.use(Vuex)

describe('Componente: ListarUsuarios', () => {
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

  const actions = { getUsers: jest.fn() }
  const getters = { getUsers: (state) => state.usuarios }
  const mutations = { setCurrentUser: jest.fn() }
  const state = { usuarios }
  const usuariosModule = {
    namespaced: true,
    state,
    getters,
    actions,
    mutations
  }

  const store = new Vuex.Store({
    modules: {
      usuarios: usuariosModule
    }
  })

  const mockDispatch = jest.fn()
  store.dispatch = mockDispatch

  const mockCommit = jest.fn()
  store.commit = mockCommit

  const mockPush = jest.fn()
  const $router = { push: mockPush }

  beforeEach(() => {
    wrapper = mount(Usuarios, {
      localVue,
      store,
      mocks: {
        $router
      },
      data () {
        return {
          selectedItem: 1
        }
      }
    })
  })

  it('debe redirigir a `crearUsuario` luego de hacer click en el botón `Crear Usuario`', async () => {
    await wrapper.vm.$refs.crear.$emit('click')
    expect(mockPush).toHaveBeenCalledWith({ name: 'crearUsuario' })
  })

  it('debe hacer commit de `usuarios/setCurrentUser` y redirigir a `editarUsuario` luego de hacer click en el botón `Editar`', async () => {
    await wrapper.vm.$refs.editar.$emit('click')
    expect(mockCommit).toHaveBeenCalledWith('usuarios/setCurrentUser', usuarios[1])
    expect(mockPush).toHaveBeenCalledWith({ name: 'editarUsuario' })
  })

  it('debe hacer dispatch de `usuarios/modificarEstado` luego de hacer click en el botón `Habilitado/Deshabilitado`', async () => {
    const usuario = { ...usuarios[0], activated: !usuarios[0].activated }
    await wrapper.find('#modificar').trigger('click')
    expect(mockDispatch).toHaveBeenCalledWith('usuarios/modificarEstado', usuario)
  })
})
