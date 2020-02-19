<template>
  <h2>
    Cambiar contraseña
  </h2>

  <!-- <template v-if="!submitted">
    <p>
      Ingrese su <strong>contraseña actual</strong> y una <strong>nueva contraseña</strong>.
    </p>

    <BaseForm @submit.prevent="changePassword">
      <BaseFormGroup>
        <BaseInput
          v-model="currentPassword"
          label="Contraseña actual"
          type="password"
          :v="$v.currentPassword"
        />
        <BaseLabelError>
          <template v-if="$v.currentPassword.$dirty && !$v.currentPassword.required">
            Por favor, ingrese su contraseña actual
          </template>
          <template v-else-if="errors.currentPassword">
            La contraseña ingresada no corresponde a su usuario
          </template>
        </BaseLabelError>
      </BaseFormGroup>

      <BaseFormGroup>
        <BaseInput
          v-model="newPassword"
          label="Contraseña nueva"
          type="password"
          :v="$v.newPassword"
        />
        <BaseLabelError>
          <template v-if="$v.newPassword.$dirty && !$v.newPassword.required">
            Por favor, ingrese una contraseña nueva
          </template>
          <template v-else-if="$v.newPassword.$dirty && !$v.newPassword.valid">
            Use entre 8 y 20 caracteres, y al menos una mayúsucula y un número
          </template>
        </BaseLabelError>
      </BaseFormGroup>

      <BaseButton
        :disabled="$v.$invalid"
        type="submit"
      >
        Cambiar contraseña
      </BaseButton>
    </BaseForm>
  </template>

  <template v-else>
    <div
      v-if="submitted"
      class="card-success"
    >
      <h3><strong>Contraseña cambiada con éxito</strong></h3>
    </div>
  </template> -->
</template>

<script>
import { required } from 'vuelidate/lib/validators'
import { isPasswordStrong } from '@/validators/validators'

export default {
  data () {
    return {
      currentPassword: '',
      newPassword: '',
      errors: {
        currentPassword: false
      },
      submitted: false
    }
  },
  methods: {
    async changePassword () {
      const formData = {
        currentPassword: this.currentPassword,
        newPassword: this.newPassword
      }

      try {
        await this.$store.dispatch('auth/changePassword', formData)
        this.submitted = true
        this.errors.currentPassword = false
      } catch (error) {
        this.errors.currentPassword = true
      }
    }
  },
  validations: {
    currentPassword: {
      required
    },
    newPassword: {
      required,
      valid: function () {
        return isPasswordStrong(this.password)
      }
    }
  }
}
</script>
