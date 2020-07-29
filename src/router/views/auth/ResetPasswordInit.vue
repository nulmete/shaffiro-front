<template>
  <MainForm>
    <template v-slot:heading>
      Restablecer contraseña
    </template>

    <template v-slot:paragraph>
      Ingrese el <strong>e-mail</strong> con el que se registró.
      Enviaremos un correo electrónico con un código para restablecer su contraseña.
    </template>

    <base-card
      v-if="serverError"
      :error="serverError"
    >
      <template v-slot:paragraph>
        {{ serverError }}
      </template>
    </base-card>

    <form
      class="form"
      @submit.prevent="resetPasswordInit"
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
        >{{ emailError }} </span>
      </div>

      <base-button
        :disabled="$v.$invalid"
        type="submit"
      >
        Enviar
      </base-button>
    </form>
  </MainForm>
</template>

<script>
import MainForm from '@/router/views/layouts/MainForm'
import { required, email } from 'vuelidate/lib/validators'
import axios from 'axios'

export default {
  components: { MainForm },
  data () {
    return {
      email: '',
      emailError: null,
      serverError: null
    }
  },
  methods: {
    async resetPasswordInit () {
      this.emailError = null
      this.serverError = null

      try {
        await axios.post('/api/account/reset-password/init', this.email, {
          headers: {
            'Content-Type': 'text/plain'
          }
        })
        this.$router.push({ name: 'resetPasswordFinish' })
      } catch (error) {
        if (error.response.status === 400) {
          this.emailError = 'La dirección de email no corresponde a ningún usuario activo.'
        } else {
          this.serverError = 'Hubo un problema de conexión. Intente nuevamente.'
        }
      }
    }
  },
  validations: {
    email: {
      required,
      email
    }
  }
}
</script>
