<template>
  <div class="auth container">
    <h2 class="heading-secondary text-center margin-bottom-medium">Editar usuario</h2>

    <form @submit.prevent="editarUsuario" class="form">
      <div class="form__group">
        <label class="form__label" for="id">ID</label>
        <BaseInput
          v-model="id"
          type="text"
          id="id"
        />
      </div>

      <div class="form__group">
        <label class="form__label" for="username">Nombre de usuario</label>
        <BaseInput
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
        <BaseInputCheckbox
          v-model="activated"
          :label="'Habilitado'"
          :id="'user-state'"
        />
      </div>

      <div class="form__group">
        <label class="form__label">Tipo de Usuario</label>
        <BaseInputSelect
          v-model="authorities"
          :options="authoritiesOptions"
          :optionsLabels="authoritiesOptionsSpanish"
          :multiple="true"
        />
      </div>

      <BaseButton type="submit">
        Guardar
      </BaseButton>
    </form>
  </div>
</template>

<script>
import { required, email } from 'vuelidate/lib/validators'
import { isUsernameValid } from '@/validators/validators'
import axios from 'axios'

export default {
  props: {
    identificador: {
      type: String,
      required: true
    }
  },
  beforeRouteEnter (to, from, next) {
    next(vm => {
      const { id, login, email, activated, authorities } = vm.$store.getters['usuarios/getUser']
      vm.id = id.toString()
      vm.username = login
      vm.email = email
      vm.activated = activated
      vm.authorities = authorities
    })
  },
  beforeRouteLeave (to, from, next) {
    this.$store.commit('usuarios/setCurrentUser', {})
    next()
  },
  data () {
    return {
      id: '',
      username: '',
      email: '',
      authorities: [],
      activated: false,
      authoritiesOptions: ['ROLE_ADMIN', 'ROLE_USER']
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
    async editarUsuario () {
      const formulario = {
        id: parseInt(this.id),
        login: this.username,
        email: this.email,
        activated: this.activated,
        authorities: this.authorities
      }

      try {
        await axios.put('/api/users', formulario)
        this.$router.push({ name: 'usuarios' })
      } catch (error) {
        // todo
        console.log(error.response)
      }
    }
  },
  validations: {
    id: {
      required
    },
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
