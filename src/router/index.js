import Vue from 'vue'
import VueRouter from 'vue-router'
import store from '@/store/store'
import routes from './routes'

Vue.use(VueRouter)

const router = new VueRouter({
  routes,
  mode: 'history'
})

router.beforeEach((to, from, next) => {
  const isAuthRequired = to.matched.some(route => route.meta.requiresAuth)
  const isGuestRequired = to.matched.some(route => route.meta.requiresGuest)
  const isLoggedIn = store.getters['auth/isLoggedIn']

  if (isAuthRequired) {
    if (!isLoggedIn) {
      redirectToLogin()
    } else {
      return store.dispatch('auth/validate')
        .then(validUser => {
          validUser ? next() : redirectToLogin()
        })
    }
  } else if (isGuestRequired) {
    if (isLoggedIn) {
      next({
        name: 'reglas'
      })
    } else {
      next()
    }
  } else {
    next()
  }

  function redirectToLogin () {
    next({ name: 'login', query: { redirectFrom: to.fullPath } })
  }
})

// Por defecto, beforeResolve es un hook que se puede usar solo de manera global en el router.
// Esto quiere decir que no se puede utilizar en cada ruta por separado.
// Entonces, se crea un método beforeResolve 'alternativo' que puede ser implementado
// en cada ruta por separado (se hace en la propiedad 'meta' de cada ruta en routes.js)
router.beforeResolve(async (routeTo, routeFrom, next) => {
  try {
    // Para cada ruta matcheada...
    for (const route of routeTo.matched) {
      await new Promise((resolve, reject) => {
        // Si hay un hook 'beforeResolve' definido en 'meta', invocarlo
        // con los mismos argumentos que un hook 'beforeEnter'
        if (route.meta && route.meta.beforeResolve) {
          route.meta.beforeResolve(routeTo, routeFrom, (...args) => {
            // Si el usuario quiso hacer una redirección
            if (args.length) {
              // Completar la redirección
              next(...args)
              reject(new Error('Redirected'))
            } else {
              resolve()
            }
          })
        } else {
          // Continuar 'resolviendo' la ruta
          resolve()
        }
      })
    }
    // Si un hook 'beforeResolve' implicó una redirección, retornar
  } catch (error) {
    return
  }

  // Continuar 'resolviendo' la ruta
  next()
})

export default router
