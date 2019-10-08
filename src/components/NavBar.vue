<template>
  <nav :class="$style.nav">
    <ul>
      <NavBarRoutes :routes="persistentNavRoutes" />
      <NavBarRoutes
        v-if="loggedIn"
        :routes="loggedInNavRoutes"
      />
      <NavBarRoutes
        v-if="isAdmin"
        :routes="adminNavRoutes"
      />
      <NavBarRoutes
        v-if="!loggedIn"
        :routes="loggedOutNavRoutes"
      />
    </ul>
  </nav>
</template>

<script>
import { mapState } from 'vuex'
import NavBarRoutes from './NavBarRoutes'

export default {
  components: {
    NavBarRoutes
  },
  data () {
    return {
      // Rutas comunes para todo tipo de usuario
      persistentNavRoutes: [
        {
          name: 'home',
          title: 'Home'
        }
      ],
      // Rutas visibles para usuarios logeados
      loggedInNavRoutes: [
        {
          name: 'profile',
          title: () => 'Logeado como ' + this.user
        },
        {
          name: 'logout',
          title: 'Cerrar sesión'
        }
      ],
      // Rutas visibles para usuarios no logeados
      loggedOutNavRoutes: [
        {
          name: 'signup',
          title: 'Registrarse'
        },
        {
          name: 'signin',
          title: 'Iniciar sesión'
        }
      ],
      adminNavRoutes: [
        {
          name: 'abm',
          title: 'ABM'
        }
      ]
    }
  },
  computed: {
    loggedIn () {
      return this.$store.getters['auth/loggedIn']
    },
    isAdmin () {
      return this.$store.getters['auth/isAdmin']
    },
    ...mapState('auth', {
      user: state => state.currentUser.user
    })
  }
}
</script>

<style lang="scss" module>
.nav {
  align-items: center;
  background-color: $color-primary-dark;
  display: flex;
  font-size: 1.5rem;

  > ul {
    display: flex;
    flex: 1;
    list-style: none;

    > li {
      padding: 1rem 1.5rem;

      &:first-child {
        margin-right: auto;
      }
    }
  }
}
</style>
