<template>
  <div class="login-error">
    <h3 class="login-error__heading">
      Su sesión ha expirado
    </h3>
    <p class="login-error__paragraph">
      Por favor, inicie sesión nuevamente
    </p>
    <BaseButton @click="closeModal">
      Iniciar sesión
    </BaseButton>
  </div>
</template>

<script>
export default {
  methods: {
    closeModal () {
      this.$store.commit('auth/setSessionExpired', false)
    }
  }
}
</script>

<style lang="scss" scoped>
  .login-error {
    position: absolute;
    z-index: 200;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    height: 30vh;
    width: 35vw;
    background-color: $color-primary-light;
    border: 1px solid $color-error-dark;
    border-radius: 4px;
    padding: 2rem;
    font-size: 1.5rem;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-around;

    &__heading,
    &__paragraph {
      text-align: center;
    }

    // 900px
    @media only screen and (max-width: 56.25em) {
      width: 50vw;
    }

    // 600px
    @media only screen and (max-width: 37.5em) {
      width: 75vw;
    }

    // 600px
    @media only screen and (max-width: 25em) {
      width: 90vw;
    }
  }
</style>
