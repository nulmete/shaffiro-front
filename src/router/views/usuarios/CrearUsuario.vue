<template>
  <MainForm>
    <template v-slot:heading>
      Crear usuario
    </template>

    <form
      class="form"
      @submit.prevent="crearUsuario"
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
        >Por favor, ingrese un e-mail</span>
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
        >Por favor, ingrese un nombre de usuario</span>
        <span
          v-else-if="$v.username.$dirty && !$v.username.valid"
          class="input-error"
        >Use entre 8 y 20 caracteres</span>
        <span
          v-else-if="usernameError"
          class="input-error"
        >El nombre de usuario ingresado ya está en uso</span>
      </div>

      <div class="form__group margin-bottom-medium">
        <label class="form__label">Tipo de Usuario</label>
        <base-input-select
          v-model="selectedAuthorities"
          :options="authoritiesOptions"
          :options-labels="authoritiesOptionsSpanish"
          :multiple="true"
        />
      </div>

      <base-button
        :disabled="$v.$invalid || !selectedAuthorities.length"
        type="submit"
      >
        Crear usuario
      </base-button>
    </form>
  </MainForm>
</template>

<script>
import MainForm from '@/router/views/layouts/MainForm'
import { required, email } from 'vuelidate/lib/validators'
import { isUsernameValid } from '@/validators/validators'
import { obtenerRoles } from '@/utils/users'

export default {
  components: { MainForm },
  data () {
    return {
      username: '',
      email: '',
      authoritiesOptions: ['ROLE_ADMIN', 'ROLE_USER'],
      selectedAuthorities: [],
      emailError: null,
      usernameError: null
    }
  },
  computed: {
    authoritiesOptionsSpanish () {
      return this.authoritiesOptions.map(value => obtenerRoles(value))
    }
  },
  methods: {
    async crearUsuario () {
      this.emailError = false
      this.usernameError = false

      const data = {
        login: this.username,
        email: this.email,
        authorities: this.selectedAuthorities
      }

      try {
        await this.$store.dispatch('auth/createUser', data)
        this.$router.push({ name: 'usuarios' })
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
