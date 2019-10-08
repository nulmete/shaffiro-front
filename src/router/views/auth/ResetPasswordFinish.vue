<template>
  <Layout>
    <h2>Restablecer contraseña</h2>

    <template v-if="!resetted">
      <p>
        Ingrese el <strong>código</strong> recibido en su e-mail y una nueva <strong>contraseña</strong>.
      </p>

      <BaseForm @submit.prevent="resetPasswordFinish">
        <BaseFormGroup>
          <BaseInput
            id="code"
            v-model="code"
            label="Código"
            :v="$v.code"
          />
          <BaseLabelError>
            <template v-if="$v.code.$dirty && !$v.code.$required">
              Por favor, ingrese el código recibido en su e-mail
            </template>
            <template v-else-if="errors.code">
              El código ingresado no corresponde a ningún usuario activo
            </template>
          </BaseLabelError>
        </BaseFormGroup>

        <BaseFormGroup>
          <BaseInput
            id="password"
            v-model="password"
            label="Contraseña"
            :v="$v.password"
          />
          <BaseLabelError>
            <template v-if="$v.password.$dirty && !$v.password.$required">
              Por favor, ingrese una nueva contraseña
            </template>
            <template v-if="$v.password.$dirty && !$v.password.valid">
              Use entre 8 y 20 caracteres, y al menos una mayúsucula y un número
            </template>
          </BaseLabelError>
        </BaseFormGroup>

        <BaseButton
          :disabled="$v.$invalid"
          type="submit"
        >
          Restablecer contraseña
        </BaseButton>
      </BaseForm>
    </template>

    <template v-else>
      <BaseSuccessCard>
        <template v-slot:title>
          Contraseña restablecida con éxito
        </template>
        <template v-slot:paragraph>
          Ahora puede iniciar sesión en Shaffiro
        </template>
      </BaseSuccessCard>

      <!--
      Se usa BaseButton en vez de BaseLink por cuestiones de estilo
      Para poder hacer la redirección, se define el método redirectToLogin
      Es necesario agregar v-on="$listeners" en BaseButton para que herede
      el event listener de este componente padre
      -->
      <BaseButton
        type="button"
        @click="redirectToLogin"
      >
        Iniciar sesión
      </BaseButton>
    </template>
  </Layout>
</template>

<script>
import Layout from '@/router/layouts/main'
import { required } from 'vuelidate/lib/validators'
import { isPasswordStrong } from '@/validators/validators'

export default {
  components: { Layout },
  beforeRouteLeave (to, from, next) {
    localStorage.removeItem('resetted')
    next()
  },
  data () {
    return {
      code: '',
      password: '',
      errors: {
        code: false
      },
      resetted: localStorage.getItem('resetted') || false
    }
  },
  methods: {
    async resetPasswordFinish () {
      const formData = {
        key: this.fields.code,
        newPassword: this.fields.password
      }

      try {
        // Ejecutar la acción 'resetPasswordFinish'
        await this.$store.dispatch('auth/resetPasswordFinish', formData)
        this.resetted = true
        localStorage.setItem('resetted', this.resetted)
      } catch (error) {
        this.errors.code = true
      }
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
