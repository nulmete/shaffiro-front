<template>
  <MainForm>
    <template v-slot:heading>
      {{ pageTitle }} usuario
    </template>

    <base-card
      v-if="networkError"
      :error="networkError"
    >
      <template v-slot:paragraph>
        {{ networkError }}
      </template>
    </base-card>

    <form
      class="form"
      @submit.prevent="guardarUsuario"
    >
      <div class="form__group">
        <label
          class="form__label"
          for="email"
        >E-mail</label>
        <base-input
          id="email"
          v-model="email"
          :disabled="editMode"
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
          :disabled="editMode"
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

      <div class="form__group">
        <label class="form__label">Tipo de Usuario</label>
        <base-input-select
          id="tipo"
          v-model="selectedAuthorities"
          :options="authoritiesOptions"
          :options-labels="authoritiesOptionsSpanish"
          :multiple="true"
        />
      </div>

      <div
        v-if="editMode"
        class="form__group"
      >
        <base-input-checkbox
          :id="'user-state'"
          v-model="activated"
          :label="'Habilitado'"
        />
      </div>

      <base-button
        :disabled="$v.$invalid || !selectedAuthorities.length"
        type="submit"
      >
        {{ pageTitle === 'Crear' ? 'Crear' : 'Guardar' }}
      </base-button>
    </form>
  </MainForm>
</template>

<script>
import MainForm from '@/router/views/layouts/MainForm'
import { required, email } from 'vuelidate/lib/validators'
import { isUsernameValid } from '@/validators/validators'
import { obtenerRoles } from '@/utils/users'
import axios from 'axios'

export default {
  components: { MainForm },
  beforeRouteEnter (to, from, next) {
    if (to.name !== 'editarUsuario') return next()
    next(vm => {
      vm.editMode = true
      vm.pageTitle = 'Editar'
      const { id, login, email, activated, authorities } = vm.$store.getters['usuarios/getUser']
      vm.id = id.toString()
      vm.username = login
      vm.email = email
      vm.activated = activated
      vm.selectedAuthorities = authorities
    })
  },
  beforeRouteLeave (to, from, next) {
    this.$store.commit('usuarios/setCurrentUser', null)
    next()
  },
  data () {
    return {
      error: null,
      pageTitle: 'Crear',
      username: '',
      email: '',
      authoritiesOptions: ['ROLE_ADMIN', 'ROLE_USER'],
      selectedAuthorities: [],
      emailError: null,
      usernameError: null,
      networkError: null,
      // for edit mode
      editMode: false,
      id: '',
      activated: null
    }
  },
  computed: {
    authoritiesOptionsSpanish () {
      return this.authoritiesOptions.map(value => obtenerRoles(value))
    }
  },
  methods: {
    async guardarUsuario () {
      this.emailError = null
      this.usernameError = null
      this.networkError = null

      const data = {
        login: this.username,
        email: this.email,
        authorities: this.selectedAuthorities
      }

      const endpoint = '/api/users'
      let method = 'POST'

      if (this.editMode) {
        data.id = this.id
        data.activated = this.activated
        method = 'PUT'
      }

      try {
        await axios({
          method,
          url: endpoint,
          data
        })
        this.$router.push({ name: 'usuarios' })
      } catch (error) {
        if (error.response && error.response.status === 400) {
          const errorKey = error.response.data.errorKey
          if (errorKey === 'userexists') {
            this.usernameError = true
          } else if (errorKey === 'emailexists') {
            this.emailError = true
          }
        } else {
          this.networkError = 'Hubo un problema de conexión. Intente nuevamente.'
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
