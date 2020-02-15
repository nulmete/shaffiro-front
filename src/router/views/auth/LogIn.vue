<template>
  <div class="auth container">
    <h2 class="heading-secondary text-center margin-bottom-medium">Inicie sesión en Shaffiro</h2>

    <BaseCard v-if="credentialsError" :error="credentialsError">
      <template v-slot:paragraph>
        Nombre de usuario o contraseña incorrectos.
      </template>
    </BaseCard>

    <BaseCard v-if="activationError" :error="activationError">
      <template v-slot:paragraph>
        El usuario ingresado no se encuentra habilitado.<br>
        Haga click
        <BaseLink :to="{ name: 'activate' }" class="activate">
          aquí
        </BaseLink>
        para activar su cuenta.
      </template>
    </BaseCard>

    <form @submit.prevent="login" class="form">
      <div class="form__group">
        <label class="form__label" for="username">Nombre de usuario</label>
        <BaseInput
          v-model="username"
          id="username"
          :v="$v.username"
        />
        <span v-if="$v.username.$error" class="input-error">Por favor, ingrese su nombre de usuario</span>
      </div>

      <div class="form__group">
        <label class="form__label" for="password">Contraseña</label>
        <BaseInput
          v-model="password"
          type="password"
          id="password"
          :v="$v.password"
        />
        <span v-if="$v.password.$error" class="input-error">Por favor, ingrese su contraseña</span>
      </div>

      <BaseButton :disabled="$v.$invalid" type="submit">
        Iniciar sesión
      </BaseButton>
    </form>

    <p class="auth__footer">
      <BaseLink :to="{ name: 'resetPasswordInit' }">
        ¿Olvidó su contraseña?
      </BaseLink>
    </p>
  </div>
</template>

<script>
import { required } from 'vuelidate/lib/validators'

export default {
  data () {
    return {
      username: '',
      password: '',
      credentialsError: false,
      activationError: false
    }
  },
  validations: {
    username: {
      required
    },
    password: {
      required
    }
  },
  methods: {
    async login () {
      this.credentialsError = false
      this.activationError = false

      const data = {
        username: this.username,
        password: this.password,
        rememberMe: false
      }

      try {
        await this.$store.dispatch('auth/login', data)

        // Redireccionar a la ruta en la que estaba antes de hacer el login
        // o a Home por defecto.
        this.$router.push(this.$route.query.redirectFrom || { name: 'home' })
      } catch (error) {
        const responseError = error.response.data.detail

        switch (responseError) {
          case `User ${this.username} was not activated`:
            this.activationError = true
            break
          case 'Bad credentials':
            this.credentialsError = true
            break
          default:
            break
        }
      }
    }
  }
}
</script>

<style lang="scss" scoped>
  .activate {
    color: $color-primary-dark;
    font-weight: 700;
    text-transform: uppercase;
  }
</style>
