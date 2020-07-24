<template>
  <header class="header">
    <div class="container">
      <div class="header__logo-box">
        <img
          class="header__logo"
          src="../assets/shaffiro.svg"
          alt="logo"
        >
      </div>

      <input
        id="nav"
        type="checkbox"
        class="nav-checkbox"
      >
      <label
        for="nav"
        class="nav-button"
      >
        <span class="nav-line" />
      </label>

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
  name: 'NavBar',
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

    .container {
      display: flex;
      align-items: center;
      position: relative;
      padding: 1.5rem;
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

  .nav-checkbox {
    display: none;
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

  @media only screen and (max-width: 50em) {
    .nav {
      position: absolute;
      z-index: 600;
      top: 100%;
      right: 0;
      background-color: lighten($color-primary-dark, 5);
      transform: scale(1, 0);
      transform-origin: top;
      transition: transform .3s ease-in-out;

      &__list {
        flex-direction: column;
      }
    }

    .nav-button {
      cursor: pointer;
      width: 3rem;
      z-index: 999;
      position: absolute;
      top: 0;
      right: 1rem;
      height: 100%;
      display: flex;
      flex-direction: column;
      justify-content: center;
    }

    .nav-line {
      position: relative;
    }

    .nav-line,
    .nav-line::before,
    .nav-line::after {
      display: block;
      background-color: $color-primary-light;
      height: 2px;
      transition: all .3s;
    }

    .nav-line::before,
    .nav-line::after {
      content: "";
      position: absolute;
      width: 100%;
    }

    .nav-line::before {
      top: -.7rem;
    }

    .nav-line::after {
      top: .7rem;
    }

    .nav-checkbox:checked + .nav-button > .nav-line {
      background-color: transparent;
    }

    .nav-checkbox:checked + .nav-button > .nav-line::before {
      top: 0;
      transform: rotate(45deg);
      }

    .nav-checkbox:checked + .nav-button > .nav-line::after {
      top: 0;
      transform: rotate(-45deg);
    }

    .nav-checkbox:checked ~ .nav {
      transform: scale(1, 1);
    }

    .nav-checkbox:checked ~ .nav .nav__link {
      opacity: 1;
      transition: opacity .25s ease-in-out .25s;
    }
  }
</style>
