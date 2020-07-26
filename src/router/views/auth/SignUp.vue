<template>
  <MainForm>
    <template v-slot:heading>
      Regístrese en Shaffiro
    </template>

    <form
      class="form margin-bottom-medium"
      @submit.prevent="signup"
    >
      <div class="form__group">
        <label
          class="form__label"
          for="email"
        >E-mail</label>
        <base-input
          id="email"
          v-model="email"
          type="email"
          :v="$v.email"
        />
        <span
          v-if="$v.email.$dirty && !$v.email.required"
          class="input-error"
        >Por favor, ingrese su e-mail</span>
        <span
          v-else-if="$v.email.$dirty && !$v.email.email"
          class="input-error"
        >Ingrese un e-mail válido <em>(ejemplo: shaffiro@gmail.com)</em></span>
        <span
          v-else-if="emailError"
          class="input-error"
        >El e-mail ingresado ya está en uso</span>
      </div>

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
          v-if="$v.username.$dirty && !$v.username.required"
          class="input-error"
        >Por favor, ingrese su nombre de usuario</span>
        <span
          v-else-if="$v.username.$dirty && !$v.username.valid"
          class="input-error"
        >Use entre 8 y 20 caracteres</span>
        <span
          v-else-if="usernameError"
          class="input-error"
        >El nombre de usuario ingresado ya está en uso</span>
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
          v-if="$v.password.$dirty && !$v.password.required"
          class="input-error"
        >Por favor, ingrese su contraseña</span>
        <span
          v-else-if="$v.password.$dirty && !$v.password.valid"
          class="input-error"
        >Use entre 8 y 20 caracteres, y al menos una mayúscula y un número</span>
      </div>

      <div class="form__group margin-bottom-medium">
        <label
          class="form__label"
          for="confirm-password"
        >Confirmar contraseña</label>
        <base-input
          id="confirm-password"
          v-model="confirmPassword"
          type="password"
          :v="$v.confirmPassword"
        />
        <span
          v-if="$v.confirmPassword.$dirty && !$v.confirmPassword.required"
          class="input-error"
        >Por favor, confirme su contraseña</span>
        <span
          v-else-if="$v.confirmPassword.$dirty && !$v.confirmPassword.sameAs"
          class="input-error"
        >Las contraseñas no coinciden</span>
      </div>

      <base-button
        :disabled="$v.$invalid"
        type="submit"
        class="w-100"
      >
        Registrarse
      </base-button>
    </form>

    <template v-slot:footer>
      ¿Ya tiene una cuenta?
      <base-link :to="{ name: 'login' }">
        Inicie sesión
      </base-link>
    </template>
  </MainForm>
</template>

<script>
import MainForm from '@/router/views/layouts/MainForm'
import { required, email, sameAs } from 'vuelidate/lib/validators'
import { isUsernameValid, isPasswordStrong } from '@/validators/validators'

export default {
  components: {
    MainForm
  },
  data () {
    return {
      email: '',
      username: '',
      password: '',
      confirmPassword: '',
      emailError: null,
      usernameError: null
    }
  },
  validations: {
    email: {
      required,
      email
    },
    username: {
      required,
      valid: function () {
        return isUsernameValid(this.username)
      }
    },
    password: {
      required,
      valid: function () {
        return isPasswordStrong(this.password)
      }
    },
    confirmPassword: {
      required,
      sameAs: sameAs(function () {
        return this.password
      })
    }
  },
  methods: {
    async signup () {
      this.emailError = false
      this.usernameError = false

      const data = {
        email: this.email,
        login: this.username,
        password: this.password,
        langKey: 'es'
      }

      try {
        await this.$store.dispatch('auth/signup', data)
        this.$router.push({ name: 'activate' })
      } catch (error) {
        switch (error.message) {
          case 'userexists':
            this.usernameError = true
            break
          case 'emailexists':
            this.emailError = true
            break
          default:
            break
        }
      }
    }
  }
}
</script>
