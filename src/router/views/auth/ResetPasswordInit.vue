<template>
  <Layout>
    <h2>Restablecer contraseña</h2>

    <p>
      Ingrese el <strong>e-mail</strong> con el que se registró.
      Enviaremos un correo electrónico con un código para restablecer su contraseña.
    </p>

    <BaseForm @submit.prevent="resetPasswordInit">
      <BaseFormGroup>
        <BaseInput
          id="email"
          v-model="email"
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

      <BaseButton
        :disabled="$v.$invalid"
        type="submit"
      >
        Enviar
      </BaseButton>
    </BaseForm>
  </Layout>
</template>

<script>
import Layout from '@/router/layouts/main'
import { required, email } from 'vuelidate/lib/validators'

export default {
  components: { Layout },
  data () {
    return {
      email: '',
      errors: {
        email: false
      }
    }
  },
  methods: {
    async resetPasswordInit () {
      try {
        // Ejecutar la acción 'resetPasswordInit'
        await this.$store.dispatch('auth/resetPasswordInit', this.email)
        // Redireccionar a /reset-password-finish
        this.$router.push({ name: 'resetPasswordFinish' })
      } catch (error) {
        this.errors.email = true
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
