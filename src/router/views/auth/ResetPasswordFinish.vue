<template>
  <MainForm>
    <template v-slot:heading>
      Restablecer contraseña
    </template>

    <base-card v-if="resetted">
      <template v-slot:title>
        Contraseña restablecida con éxito
      </template>
      <template v-slot:paragraph>
        Ahora puede iniciar sesión en Shaffiro
      </template>
    </base-card>

    <base-card
      v-if="serverError"
      :error="serverError"
    >
      <template v-slot:paragraph>
        {{ serverError }}
      </template>
    </base-card>

    <template v-slot:paragraph>
      <span v-if="!resetted">
        Ingrese el <strong>código</strong> recibido en su e-mail y una nueva <strong>contraseña</strong>.
      </span>
    </template>

    <form
      v-if="!resetted"
      class="form"
      @submit.prevent="resetPasswordFinish"
    >
      <div class="form__group">
        <label
          class="form__label"
          for="code"
        >Código</label>
        <base-input
          id="code"
          v-model="code"
          :v="$v.code"
        />
        <span
          v-if="$v.code.$dirty && !$v.code.required"
          class="input-error"
        >Por favor, ingrese el código recibido en su e-mail</span>
        <span
          v-else-if="userError"
          class="input-error"
        >{{ userError }}</span>
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
        >Por favor, ingrese una nueva contraseña</span>
        <span
          v-else-if="$v.password.$dirty && !$v.password.valid"
          class="input-error"
        >Use entre 8 y 20 caracteres, y al menos una mayúsucula y un número</span>
      </div>

      <base-button
        :disabled="$v.$invalid"
        type="submit"
      >
        Restablecer contraseña
      </base-button>
    </form>

    <base-button
      v-if="resetted"
      ref="loginBtn"
      type="button"
      @click="redirectToLogin"
    >
      Iniciar sesión
    </base-button>
  </MainForm>
</template>

<script>
import MainForm from '@/router/views/layouts/MainForm'
import { required } from 'vuelidate/lib/validators'
import { isPasswordStrong } from '@/validators/validators'
import axios from 'axios'

export default {
  components: { MainForm },
  beforeRouteLeave (to, from, next) {
    localStorage.removeItem('resetted')
    next()
  },
  data () {
    return {
      code: '',
      password: '',
      userError: null,
      serverError: null,
      resetted: localStorage.getItem('resetted') || false
    }
  },
  methods: {
    async resetPasswordFinish () {
      const data = {
        key: this.code,
        newPassword: this.password
      }

      try {
        await axios.post('/api/account/reset-password/finish', data)
        this.resetted = true
        localStorage.setItem('resetted', this.resetted)
      } catch (error) {
        if (error.response.data && error.response.data.title && error.response.data.title === 'No user was found for this reset key') {
          this.userError = 'El código ingresado no corresponde a ningún usuario activo.'
        } else {
          this.serverError = 'Hubo un problema de conexión. Intente nuevamente.'
        }
      }
    },
    redirectToLogin () {
      this.$router.push({ name: 'login' })
    }
  },
  validations: {
    code: {
      required
    },
    password: {
      required,
      valid: function () {
        return isPasswordStrong(this.password)
      }
    }
  }
}
</script>
