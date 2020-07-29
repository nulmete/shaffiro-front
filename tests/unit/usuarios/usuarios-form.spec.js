import { mount, createLocalVue } from '@vue/test-utils'
import UsuarioForm from '@/router/views/usuarios/UsuarioForm'
import Vuex from 'vuex'
import Vuelidate from 'vuelidate'
import axios from 'axios'
import MockAdapter from 'axios-mock-adapter'
import flushPromises from 'flush-promises'

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

  const getters = { getUser: (state) => state.currentUser }
  const mutations = { setCurrentUser: jest.fn() }
  const state = { usuarios, currentUser: usuarios[1] }
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

  const mockCommit = jest.fn()
  store.commit = mockCommit

  const nextMock = jest.fn()

  beforeEach(() => {
    wrapper = mount(UsuarioForm, {
      localVue,
      store,
      mocks: {
        $router
      }
    })
  })

  it('debe asignar las propiedades recibidas de `getters[usuarios/getUser]` a data() si la ruta es /editar', async () => {
    const beforeRouteEnter = wrapper.vm.$options.beforeRouteEnter
    beforeRouteEnter.call(wrapper.vm, { name: 'editarUsuario' }, 'from', cb => cb(wrapper.vm))
    expect(wrapper.vm.editMode).toBe(true)
    expect(wrapper.vm.pageTitle).toBe('Editar')
    expect(wrapper.vm.id).toBe('2')
    expect(wrapper.vm.username).toBe('user')
    expect(wrapper.vm.email).toBe('user@user.com')
    expect(wrapper.vm.activated).toBe(true)
    expect(wrapper.vm.selectedAuthorities).toEqual(['ROLE_USER'])
  })

  it('no debe asignar ninguna propiedad a data() si la ruta es /crear', async () => {
    const beforeRouteEnter = wrapper.vm.$options.beforeRouteEnter
    beforeRouteEnter.call(wrapper.vm, { name: 'crearUsuario' }, 'from', nextMock)
    expect(wrapper.vm.editMode).toBe(false)
    expect(wrapper.vm.pageTitle).toBe('Crear')
    expect(wrapper.vm.id).toBe('')
    expect(wrapper.vm.username).toBe('')
    expect(wrapper.vm.email).toBe('')
    expect(wrapper.vm.activated).toBe(null)
    expect(wrapper.vm.selectedAuthorities).toEqual([])
  })

  it('authoritiesOptionsSpanish muestra los roles del usuario en español', async () => {
    expect(wrapper.vm.authoritiesOptionsSpanish).toEqual(['Administrador', 'Cliente'])
  })

  it('debe hacer commit de `usuarios/setCurrentUser(null)` al dejar la ruta', () => {
    const beforeRouteLeave = wrapper.vm.$options.beforeRouteLeave
    beforeRouteLeave.call(wrapper.vm, 'to', 'from', nextMock)
    expect(mockCommit).toHaveBeenCalledWith('usuarios/setCurrentUser', null)
    expect(nextMock).toHaveBeenCalled()
  })

  it('usernameError, emailError y networkError deben ser null si la request de axios es exitosa', async () => {
    const mock = new MockAdapter(axios)
    mock.onPost('/api/users').reply(200)
    await wrapper.find('.form').trigger('submit.prevent')
    await flushPromises()
    expect(wrapper.vm.usernameError).toBe(null)
    expect(wrapper.vm.emailError).toBe(null)
    expect(wrapper.vm.networkError).toBe(null)
    expect(mockPush).toHaveBeenCalledWith({ name: 'usuarios' })
  })

  it('usernameError debe ser true si la request de axios falla y devuelve errorKey: `userexists`', async () => {
    const mock = new MockAdapter(axios)
    mock.onPost('/api/users').replyOnce(400, { errorKey: 'userexists' })
    await wrapper.find('.form').trigger('submit.prevent')
    await flushPromises()
    expect(wrapper.vm.usernameError).toBe(true)
  })

  it('emailError debe ser true si la request de axios falla y devuelve errorKey: `userexists`', async () => {
    const mock = new MockAdapter(axios)
    mock.onPost('/api/users').replyOnce(400, { errorKey: 'emailexists' })
    await wrapper.find('.form').trigger('submit.prevent')
    await flushPromises()
    expect(wrapper.vm.emailError).toBe(true)
  })

  it('emailError debe ser true si la request de axios falla y devuelve errorKey: `userexists`', async () => {
    const mock = new MockAdapter(axios)
    mock.onPost('/api/users').networkError()
    await wrapper.find('.form').trigger('submit.prevent')
    await flushPromises()
    expect(wrapper.vm.networkError).toBe('Hubo un problema de conexión. Intente nuevamente.')
  })
})
