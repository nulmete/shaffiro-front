import store from '@/store/store'

export default [
  {
    path: '/',
    name: 'home',
    component: () => import('@/router/views/Home.vue')
  },
  {
    path: '/signup',
    name: 'signup',
    component: () => import('@/router/views/auth/SignUp.vue'),
    meta: {
      requiresGuest: true
    }
  },
  {
    path: '/activate',
    name: 'activate',
    component: () => import('@/router/views/auth/Activate.vue'),
    meta: {
      requiresGuest: true
    }
  },
  {
    path: '/login',
    name: 'login',
    component: () => import('@/router/views/auth/LogIn.vue'),
    meta: {
      requiresGuest: true
    }
  },
  {
    path: '/logout',
    name: 'logout',
    meta: {
      requiresAuth: true,
      beforeResolve: (routeTo, routeFrom, next) => {
        // Ejecutar la acción 'logout' en store/modules/auth
        store.dispatch('auth/logout')

        // Verificar si la ruta en la que estaba justo antes de cerrar sesión
        // requería estar logeado
        const authRequiredOnPreviousRoute = routeFrom.matched.some(
          route => route.meta.requiresAuth
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
    component: () => import('@/router/views/auth/ResetPasswordInit.vue'),
    meta: {
      requiresGuest: true
    }
  },
  {
    path: '/reset-password-finish',
    name: 'resetPasswordFinish',
    component: () => import('@/router/views/auth/ResetPasswordFinish.vue'),
    meta: {
      requiresGuest: true
    }
  },
  {
    path: '/profile',
    name: 'profile',
    component: () => import('@/router/views/auth/Profile.vue'),
    meta: {
      requiresAuth: true
    },
    props: (route) => ({ currentUser: store.state.auth.currentUser || {} })
  },
  {
    path: '/change-password',
    name: 'changePassword',
    component: () => import('@/router/views/auth/ChangePassword.vue'),
    meta: {
      requiresAuth: true
    }
  },
  {
    path: '/usuarios',
    name: 'usuarios',
    component: () => import('@/router/views/usuarios/ListarUsuarios.vue'),
    meta: {
      requiresAuth: true
    }
  },
  {
    path: '/usuarios/crear',
    name: 'crearUsuario',
    component: () => import('@/router/views/usuarios/CrearUsuario.vue'),
    meta: {
      requiresAuth: true
    }
  },
  {
    path: '/usuarios/editar/:identificador',
    name: 'editarUsuario',
    component: () => import('@/router/views/usuarios/EditarUsuario.vue'),
    meta: {
      requiresAuth: true
    },
    props: true
  },
  {
    path: '/dispositivos',
    name: 'dispositivos',
    component: () => import('@/router/views/dispositivos/ListarDispositivos.vue'),
    meta: {
      requiresAuth: true
    }
  },
  {
    path: '/dispositivos/editar/:identificador',
    name: 'editarDispositivo',
    component: () => import('@/router/views/dispositivos/EditarDispositivo.vue'),
    meta: {
      requiresAuth: true
    },
    props: true
  },
  {
    path: '/dispositivos/detectar',
    name: 'detectarDispositivos',
    component: () => import('@/router/views/dispositivos-no-asociados/DetectarDispositivos.vue'),
    meta: {
      requiresAuth: true
    }
  },
  {
    path: '/dispositivos/detectar/asociar',
    name: 'asociarDispositivo',
    component: () => import('@/router/views/dispositivos-no-asociados/AsociarDispositivo.vue'),
    meta: {
      requiresAuth: true
    }
  },
  {
    path: '/reglas',
    name: 'reglas',
    component: () => import('@/router/views/reglas/Reglas.vue'),
    meta: {
      requiresAuth: true
    }
  },
  {
    path: '/reglas/crear',
    name: 'crearRegla',
    component: () => import('@/router/views/reglas/ReglaForm.vue'),
    meta: {
      requiresAuth: true
    }
  },
  {
    path: '/reglas/editar',
    name: 'editarRegla',
    component: () => import('@/router/views/reglas/ReglaForm.vue'),
    meta: {
      requiresAuth: true
    }
  },
  {
    // Redireccionar a home cuando el path no coincide
    // con ninguno de los anteriores
    path: '*',
    redirect: { name: 'home' }
  }
]
