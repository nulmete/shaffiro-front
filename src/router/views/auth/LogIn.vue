<template>
  <MainForm>
    <template v-slot:heading>
      Inicie sesión en Shaffiro
    </template>

    <base-card
      v-if="error"
      :error="error"
    >
      <template v-slot:paragraph>
        {{ error }}
      </template>
    </base-card>

    <form
      class="form margin-bottom-medium"
      @submit.prevent="login"
    >
      <div class="form__group">
        <label
          class="form__label"
          for="username"
        >Nombre de usuario</label>
        <base-input
          id="username"
          v-model="username"
          :v="$v.username"
        />
        <span
          v-if="$v.username.$error"
          class="input-error"
        >Por favor, ingrese su nombre de usuario</span>
      </div>

      <div class="form__group">
        <label
          class="form__label"
          for="password"
        >Contraseña</label>
        <base-input
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

      <base-button
        ref="loginButton"
        :disabled="$v.$invalid"
        type="submit"
        class="w-100"
      >
        Iniciar sesión
      </base-button>
    </form>

    <template v-slot:footer>
      <base-link :to="{ name: 'resetPasswordInit' }">
        ¿Olvidó su contraseña?
      </base-link>
    </template>
  </MainForm>
</template>

<script>
import MainForm from '@/router/views/layouts/MainForm'
import { required } from 'vuelidate/lib/validators'

export default {
  components: {
    MainForm
  },
  data () {
    return {
      username: '',
      password: '',
      error: null
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
      this.error = false

      const data = {
        username: this.username,
        password: this.password,
        rememberMe: false
      }

      try {
        await this.$store.dispatch('auth/login', data)
        this.$router.push({ name: 'reglas' })
      } catch (error) {
        this.error = error.message
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
