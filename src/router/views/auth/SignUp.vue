<template>
  <div class="auth container">
    <h2 class="heading-secondary text-center margin-bottom-medium">Regístrese en Shaffiro</h2>

    <form @submit.prevent="signup" class="form">
      <div class="form__group">
        <label class="form__label" for="email">E-mail</label>
        <BaseInput
          v-model="email"
          type="email"
          id="email"
          :serverError="emailError"
          :v="$v.email"
        />
        <span v-if="$v.email.$dirty && !$v.email.required" class="input-error">Por favor, ingrese su e-mail</span>
        <span v-else-if="$v.email.$dirty && !$v.email.email" class="input-error">Ingrese un e-mail válido <i>(ejemplo: shaffiro@gmail.com)</i></span>
        <span v-else-if="emailError" class="input-error">El e-mail ingresado ya está en uso</span>
      </div>

      <div class="form__group">
        <label class="form__label" for="username">Nombre de usuario</label>
        <BaseInput
          v-model="username"
          id="username"
          :serverError="usernameError"
          :v="$v.username"
        />
        <span v-if="$v.username.$dirty && !$v.username.required" class="input-error">Por favor, ingrese su nombre de usuario</span>
        <span v-else-if="$v.username.$dirty && !$v.username.valid" class="input-error">Use entre 8 y 15 caracteres</span>
        <span v-else-if="usernameError" class="input-error">El nombre de usuario ingresado ya está en uso</span>
      </div>

      <div class="form__group">
        <label class="form__label" for="password">Contraseña</label>
        <BaseInput
          v-model="password"
          type="password"
          id="password"
          :v="$v.password"
        />
        <span v-if="$v.password.$dirty && !$v.password.required" class="input-error">Por favor, ingrese su contraseña</span>
        <span v-else-if="$v.password.$dirty && !$v.password.valid" class="input-error">Use entre 8 y 20 caracteres, y al menos una mayúsucula y un número</span>
      </div>

      <div class="form__group">
        <label class="form__label" for="confirm-password">Confirmar contraseña</label>
        <BaseInput
          v-model="confirmPassword"
          type="password"
          id="confirm-password"
          :v="$v.confirmPassword"
        />
        <span v-if="$v.confirmPassword.$dirty && !$v.confirmPassword.required" class="input-error">Por favor, confirme su contraseña</span>
        <span v-else-if="$v.confirmPassword.$dirty && !$v.confirmPassword.sameAs" class="input-error">Las contraseñas no coinciden</span>
      </div>

      <BaseButton :disabled="$v.$invalid" type="submit">
        Registrarse
      </BaseButton>
    </form>

    <p class="auth__footer">
      ¿Ya tiene una cuenta?
      <BaseLink :to="{ name: 'login' }">Inicie sesión</BaseLink>
    </p>
  </div>
</template>

<script>
import { required, email, sameAs } from 'vuelidate/lib/validators'
import { isUsernameValid, isPasswordStrong } from '@/validators/validators'
import axios from 'axios'

export default {
  data () {
    return {
      email: '',
      username: '',
      password: '',
      confirmPassword: '',
      emailError: false,
      usernameError: false
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
        await axios.post('/api/register', data)
        this.$store.commit('auth/setActivationEmail', data.email)
        this.$router.push({ name: 'activate' })
      } catch (error) {
        const responseError = error.response.data.errorKey

        switch (responseError) {
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
