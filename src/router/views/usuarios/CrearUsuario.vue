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
          for="username"
        >Nombre de usuario</label>
        <BaseInput
          id="username"
          v-model="username"
          class="form__input"
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
        <label class="form__label">Tipo de Usuario</label>
        <BaseInputSelect
          v-model="selectedAuthorities"
          :options="authoritiesOptions"
          :options-labels="authoritiesOptionsSpanish"
          :multiple="true"
        />
      </div>

      <BaseButton type="submit">
        Crear usuario
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
      return this.authoritiesOptions.map(value => obtenerRoles(value))
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
        await mainApi.post('/api/users', formData)
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
