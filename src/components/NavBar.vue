<template>
  <header class="header">
    <div class="container">
      <div class="header__logo-box">
        <img
          class="header__logo"
          src="../assets/logo.png"
          alt="logo"
        >
      </div>
      <nav class="nav">
        <ul class="nav__list">
          <template v-if="isAdmin">
            <li>
              <BaseLink
                :to="{ name: 'dispositivos' }"
                class="nav__link"
              >
                Dispositivos
              </BaseLink>
            </li>
            <li>
              <BaseLink
                :to="{ name: 'reglas' }"
                class="nav__link"
              >
                Reglas
              </BaseLink>
            </li>
            <li>
              <BaseLink
                :to="{ name: 'usuarios' }"
                class="nav__link"
              >
                Usuarios
              </BaseLink>
            </li>
          </template>
          <template v-if="isLoggedIn">
            <li>
              <BaseLink
                :to="{ name: 'profile' }"
                class="nav__link"
              >
                Perfil
              </BaseLink>
            </li>
            <li>
              <BaseLink
                :to="{ name: 'logout' }"
                class="nav__link"
              >
                Cerrar sesión
              </BaseLink>
            </li>
          </template>
          <template v-if="!isLoggedIn">
            <li>
              <BaseLink
                :to="{ name: 'signup' }"
                class="nav__link"
              >
                Registrarse
              </BaseLink>
            </li>
            <li>
              <BaseLink
                :to="{ name: 'login' }"
                class="nav__link"
              >
                Iniciar sesión
              </BaseLink>
            </li>
          </template>
        </ul>
      </nav>
    </div>
  </header>
</template>

<script>

export default {
  computed: {
    isLoggedIn () {
      return this.$store.getters['auth/isLoggedIn']
    },
    isAdmin () {
      return this.$store.getters['auth/isAdmin']
    }
  }
}
</script>

<style lang="scss" scoped>
.header {
  background-color: $color-primary-dark;
  border-bottom: 1px solid #eee;
  padding: 1.2rem 0;

  .container {
    display: flex;
    align-items: center;
  }

  &__logo-box {
    margin-right: auto;
  }

  &__logo {
    display: block;
    height: 4rem;
    width: 4rem;
  }
}

.nav {
  font-size: 1.6rem;

  &__list {
    display: flex;
    flex: 1;
  }

  &__link {
    &:link,
    &:visited {
      display: block;
      color: $color-primary-light;
      padding: 1rem 2rem;
    }

    &:hover,
    &:active {
      color: $color-secondary-light;
    }
  }

  .router-link-active,
  .router-link-exact-active {
    color: $color-secondary-light;
  }
}
</style>
