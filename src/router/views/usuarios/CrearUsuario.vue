<template>
  <div class="auth container">
    <h2 class="heading-secondary text-center margin-bottom-medium">Crear usuario</h2>

    <form @submit.prevent="crearUsuario" class="form">
      <div class="form__group">
        <label class="form__label" for="username">Nombre de usuario</label>
        <BaseInput
          class="form__input"
          v-model="username"
          id="username"
        />
      </div>

      <div class="form__group">
        <label class="form__label" for="email">E-mail</label>
        <BaseInput
          v-model="email"
          type="email"
          id="email"
        />
      </div>

      <div class="form__group">
        <label class="form__label">Tipo de Usuario</label>
        <BaseInputSelect
          v-model="selectedAuthorities"
          :options="authoritiesOptions"
          :optionsLabels="authoritiesOptionsSpanish"
          :multiple="true"
        />
      </div>

      <BaseButton type="submit">
        Crear usuario
      </BaseButton>
    </form>
  </div>
</template>

<script>
import { required, email } from 'vuelidate/lib/validators'
import { isUsernameValid } from '@/validators/validators'
import axios from 'axios'

export default {
  data () {
    return {
      username: '',
      email: '',
      authoritiesOptions: ['ROLE_ADMIN', 'ROLE_USER'],
      selectedAuthorities: []
    }
  },
  computed: {
    authoritiesOptionsSpanish () {
      return this.authoritiesOptions.map(el => {
        switch (el) {
          case 'ROLE_ADMIN':
            return 'Administrador'
          case 'ROLE_USER':
            return 'Cliente'
          default:
            return el
        }
      })
    }
  },
  methods: {
    async crearUsuario () {
      const formData = {
        login: this.username,
        email: this.email,
        authorities: this.selectedAuthorities
      }

      try {
        await axios.post('/api/users', formData)
        this.$router.push({ name: 'usuarios' })
      } catch (error) {
        // todo
        console.log(error.response)
      }
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
    }
  }
}
</script>
