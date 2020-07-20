<template>
  <MainForm>
    <template v-slot:heading>
      Inicie sesión en Shaffiro
    </template>

    <BaseCard
      v-if="credentialsError"
      :error="credentialsError"
    >
      <template v-slot:paragraph>
        Nombre de usuario o contraseña incorrectos.
      </template>
    </BaseCard>

    <BaseCard
      v-if="activationError"
      :error="activationError"
    >
      <template v-slot:paragraph>
        El usuario ingresado no se encuentra habilitado.<br>
        Haga click
        <BaseLink
          :to="{ name: 'activate' }"
          class="activate"
        >
          aquí
        </BaseLink>
        para activar su usuario.
      </template>
    </BaseCard>

    <form
      class="form margin-bottom-medium"
      @submit.prevent="login"
    >
      <div class="form__group">
        <label
          class="form__label"
          for="username"
        >Nombre de usuario</label>
        <BaseInput
          id="username"
          v-model="username"
          :v="$v.username"
        />
        <span
          v-if="$v.username.$error"
          class="input-error"
        >Por favor, ingrese su nombre de usuario</span>
      </div>

      <div class="form__group margin-bottom-medium">
        <label
          class="form__label"
          for="password"
        >Contraseña</label>
        <BaseInput
          id="password"
          v-model="password"
          type="password"
          :v="$v.password"
        />
        <span
          v-if="$v.password.$error"
          class="input-error"
        >Por favor, ingrese su contraseña</span>
      </div>

      <BaseButton
        :disabled="$v.$invalid"
        type="submit"
        class="w-100"
      >
        Iniciar sesión
      </BaseButton>
    </form>

    <template v-slot:footer>
      <BaseLink :to="{ name: 'resetPasswordInit' }">
        ¿Olvidó su contraseña?
      </BaseLink>
    </template>
  </MainForm>
</template>

<script>
import MainForm from '@/router/views/layouts/MainForm'
import { required } from 'vuelidate/lib/validators'

export default {
  components: { MainForm },
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
