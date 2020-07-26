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
        <base-input
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
        <base-input
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

      <base-button
        :disabled="$v.$invalid"
        type="submit"
      >
        Cambiar contraseña
      </base-button>
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
import axios from 'axios'

export default {
  data () {
    return {
      currentPassword: '',
      newPassword: '',
      error: false,
      submitted: false
    }
  },
  methods: {
    async changePassword () {
      const data = {
        currentPassword: this.currentPassword,
        newPassword: this.newPassword
      }

      try {
        await axios.post('/api/account/change-password', data)
        this.submitted = true
      } catch (error) {
        this.error = true
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
