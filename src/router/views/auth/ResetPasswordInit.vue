<template>
  <h2>Restablecer contraseña</h2>

  <!-- <p>
      Ingrese el <strong>e-mail</strong> con el que se registró.
      Enviaremos un correo electrónico con un código para restablecer su contraseña.
    </p>

    <BaseForm @submit.prevent="resetPasswordInit">
      <BaseFormGroup>
        <base-input
          v-model="email"
          name="email"
          label="E-mail"
          :v="$v.email"
        />
        <BaseLabelError>
          <template v-if="$v.email.$dirty && !$v.email.required">
            Por favor, ingrese su e-mail
          </template>
          <template v-else-if="$v.email.$dirty && !$v.email.email">
            Ingrese un e-mail válido <i>(ejemplo: shaffiro@gmail.com)</i>
          </template>
          <template v-else-if="errors.email">
            La dirección de e´mail no corresponde a ningún usuario activo
          </template>
        </BaseLabelError>
      </BaseFormGroup>

      <base-button
        :disabled="$v.$invalid"
        type="submit"
      >
        Enviar
      </base-button>
    </BaseForm> -->
</template>

<script>
import { required, email } from 'vuelidate/lib/validators'
import axios from 'axios'

export default {
  data () {
    return {
      email: '',
      error: false
    }
  },
  methods: {
    async resetPasswordInit () {
      try {
        await axios.post('/api/account/reset-password/init', this.email, {
          headers: {
            'Content-Type': 'text/plain'
          }
        })
        this.$router.push({ name: 'resetPasswordFinish' })
      } catch (error) {
        this.error = true
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
