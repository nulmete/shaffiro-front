<template>
  <MainForm>
    <template v-slot:heading>
      Editar usuario
    </template>

    <form
      class="form"
      @submit.prevent="editarUsuario"
    >
      <div class="form__group">
        <label
          class="form__label"
          for="username"
        >Nombre de usuario</label>
        <BaseInput
          id="username"
          v-model="username"
        />
      </div>

      <div class="form__group">
        <label
          class="form__label"
          for="email"
        >E-mail</label>
        <BaseInput
          id="email"
          v-model="email"
          type="email"
        />
      </div>

      <div class="form__group">
        <BaseInputCheckbox
          :id="'user-state'"
          v-model="activated"
          :label="'Habilitado'"
        />
      </div>

      <div class="form__group">
        <label class="form__label">Tipo de Usuario</label>
        <BaseInputSelect
          v-model="authorities"
          :options="authoritiesOptions"
          :options-labels="authoritiesOptionsSpanish"
          :multiple="true"
        />
      </div>

      <BaseButton type="submit">
        Guardar
      </BaseButton>
    </form>
  </MainForm>
</template>

<script>
import MainForm from '@/router/views/layouts/MainForm'
import { required, email } from 'vuelidate/lib/validators'
import { isUsernameValid } from '@/validators/validators'
import { obtenerRoles } from '@/utils/users'
import mainApi from '@/utils/mainApi'

export default {
  components: { MainForm },
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
      return this.authoritiesOptions.map(value => obtenerRoles(value))
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
        await mainApi.put('/api/users', formulario)
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
