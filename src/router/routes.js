import store from '@/store/store'

// Se importan los componentes de esta forma para hacer lazy-loading
// Es decir, los componentes van a ser cargados solo cuando se los necesite
const Home = () => import('@/router/views/Home.vue')
const SignUp = () => import('@/router/views/auth/SignUp.vue')
const Activate = () => import('@/router/views/auth/Activate.vue')
const SignIn = () => import('@/router/views/auth/SignIn.vue')
const ResetPasswordInit = () => import('@/router/views/auth/ResetPasswordInit.vue')
const ResetPasswordFinish = () => import('@/router/views/auth/ResetPasswordFinish.vue')
const Dashboard = () => import('@/router/views/Dashboard.vue')
const Profile = () => import('@/router/views/users/Profile.vue')
const ChangePassword = () => import('@/router/views/auth/ChangePassword.vue')
const Abm = () => import('@/router/views/users/Abm.vue')
const CreateUser = () => import('@/router/views/users/CreateUser.vue')
const EditUser = () => import('@/router/views/users/EditUser.vue')

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
    path: '/signin',
    name: 'signin',
    component: SignIn
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

        console.log(authRequiredOnPreviousRoute)

        // Redireccionar a 'home' si la ruta anterior requería autenticación
        // Quedarse en la ruta anterior si no requería autenticación
        console.log(routeFrom)
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
    component: Profile,
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
    path: '/abm',
    name: 'abm',
    component: Abm,
    meta: { authRequired: true }
  },
  {
    path: '/abm/create',
    name: 'create',
    component: CreateUser,
    meta: { authRequired: true }
  },
  {
    path: '/abm/edit/:user',
    name: 'edit',
    component: EditUser,
    meta: { authRequired: true },
    props: (route) => ({ user: store.state.users.userBeingEdited })
  },
  {
    // Redireccionar a home cuando el path no coincide
    // con ninguno de los anteriores
    path: '*',
    redirect: { name: 'home' }
  }
]
