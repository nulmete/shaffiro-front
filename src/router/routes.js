import store from '@/store/store'

// Se importan los componentes de esta forma para hacer lazy-loading
// Es decir, los componentes van a ser cargados solo cuando se los necesite
const Home = () => import('@/router/views/Home.vue')
const SignUp = () => import('@/router/views/auth/SignUp.vue')
const Activate = () => import('@/router/views/auth/Activate.vue')
const LogIn = () => import('@/router/views/auth/LogIn.vue')
const ResetPasswordInit = () => import('@/router/views/auth/ResetPasswordInit.vue')
const ResetPasswordFinish = () => import('@/router/views/auth/ResetPasswordFinish.vue')
const Dashboard = () => import('@/router/views/Dashboard.vue')
const UserProfile = () => import('@/router/views/usuarios/UserProfile.vue')
const ChangePassword = () => import('@/router/views/auth/ChangePassword.vue')
const ListarUsuarios = () => import('@/router/views/usuarios/ListarUsuarios.vue')
const CrearUsuario = () => import('@/router/views/usuarios/CrearUsuario.vue')
const EditarUsuario = () => import('@/router/views/usuarios/EditarUsuario.vue')
const ListarDispositivos = () => import('@/router/views/dispositivos/ListarDispositivos.vue')
const EditarDispositivo = () => import('@/router/views/dispositivos/EditarDispositivo.vue')
const DetectarDispositivos = () => import('@/router/views/dispositivos-no-asociados/DetectarDispositivos.vue')
const AsociarDispositivo = () => import('@/router/views/dispositivos-no-asociados/AsociarDispositivo.vue')

export default [
  {
    path: '/',
    name: 'home',
    component: Home
  },
  {
    path: '/signup',
    name: 'signup',
    component: SignUp
  },
  {
    path: '/signup/activate',
    name: 'activate',
    component: Activate
  },
  {
    path: '/login',
    name: 'login',
    component: LogIn
  },
  {
    path: '/logout',
    name: 'logout',
    meta: {
      authRequired: true,
      beforeResolve: (routeTo, routeFrom, next) => {
        // Ejecutar la acción 'logOut' en store/modules/auth
        store.dispatch('auth/logOut')

        // Verificar si la ruta en la que estaba justo antes de cerrar sesión
        // requería autenticación (estar logeado)
        const authRequiredOnPreviousRoute = routeFrom.matched.some(
          route => route.meta.authRequired
        )

        // Redireccionar a 'home' si la ruta anterior requería autenticación
        // Quedarse en la ruta anterior si no requería autenticación
        next(authRequiredOnPreviousRoute ? { name: 'home' } : { ...routeFrom })
      }
    }
  },
  {
    path: '/reset-password-init/',
    name: 'resetPasswordInit',
    component: ResetPasswordInit
  },
  {
    path: '/reset-password-finish',
    name: 'resetPasswordFinish',
    component: ResetPasswordFinish
  },
  {
    path: '/dashboard',
    name: 'dashboard',
    component: Dashboard,
    meta: { authRequired: true }
  },
  {
    path: '/profile',
    name: 'profile',
    component: UserProfile,
    meta: { authRequired: true },
    props: (route) => ({ currentUser: store.state.auth.currentUser || {} })
  },
  {
    path: '/change-password',
    name: 'changePassword',
    component: ChangePassword,
    meta: { authRequired: true }
  },
  {
    path: '/usuarios',
    name: 'usuarios',
    component: ListarUsuarios,
    meta: { authRequired: true }
  },
  {
    path: '/usuarios/crear',
    name: 'crearUsuario',
    component: CrearUsuario,
    meta: { authRequired: true }
  },
  {
    path: '/usuarios/editar/:login',
    name: 'editarUsuario',
    component: EditarUsuario,
    meta: { authRequired: true },
    props: true,
    beforeEnter: (to, from, next) => {
      store.dispatch('users/getUser', to.params.login)
      next()
    }
  },
  {
    path: '/dispositivos',
    name: 'dispositivos',
    component: ListarDispositivos,
    meta: { authRequired: true }
  },
  {
    path: '/dispositivos/editar/:dispositivoId',
    name: 'editarDispositivo',
    component: EditarDispositivo,
    meta: { authRequired: true },
    props: true,
    beforeEnter: (to, from, next) => {
      store.dispatch('dispositivos/getDispositivo', to.params.dispositivoId)
      next()
    }
  },
  {
    path: '/dispositivos/detectar',
    name: 'detectarDispositivos',
    component: DetectarDispositivos,
    meta: { authRequired: true },
    beforeEnter: (to, from, next) => {
      store.dispatch('dispositivosNoAsociados/getAllDispositivosNoAsociados')
      next()
    }
  },
  {
    path: '/dispositivos/detectar/asociar/:dispositivoId',
    name: 'asociarDispositivo',
    component: AsociarDispositivo,
    meta: { authRequired: true },
    props: true,
    beforeEnter: (to, from, next) => {
      store.dispatch('dispositivosNoAsociados/getDispositivo', to.params.dispositivoId)
      next()
    }
  },
  {
    // Redireccionar a home cuando el path no coincide
    // con ninguno de los anteriores
    path: '*',
    redirect: { name: 'home' }
  }
]
