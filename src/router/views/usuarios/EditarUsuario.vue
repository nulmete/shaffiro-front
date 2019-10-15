<template>
  <Layout>
    <Form>
      <h2 :class="$style.heading">
        Editar usuario
      </h2>

      <BaseForm @submit.prevent="editarUsuario">
        <BaseFormGroup>
          <BaseInput
            v-model="id"
            label="Id"
            type="text"
            :v="$v.id"
          />
        </BaseFormGroup>

        <!-- Nombre de usuario -->
        <BaseFormGroup>
          <BaseInput
            v-model="username"
            label="Nombre de Usuario"
            :v="$v.username"
          />
        </BaseFormGroup>

        <!-- E-mail -->
        <BaseFormGroup>
          <BaseInput
            v-model="email"
            label="E-mail"
            type="email"
            :v="$v.email"
          />
        </BaseFormGroup>

        <BaseFormGroup>
          <BaseInputCheckbox
            v-model="activated"
            label="Habilitado"
          />
        </BaseFormGroup>

        <BaseFormGroup>
          <BaseInputSelect
            v-model="authorities"
            label="Tipo de Usuario"
            :options="authoritiesOptions"
            :multiple="true"
          />
        </BaseFormGroup>

        <!-- Submit -->
        <BaseButton type="submit">
          Guardar
        </BaseButton>
      </BaseForm>
    </Form>
  </Layout>
</template>

<script>
import Layout from '@/router/layouts/main'
import Form from '@/router/layouts/form'
import { required, email } from 'vuelidate/lib/validators'
import { isUsernameValid } from '@/validators/validators'
import axios from 'axios'

export default {
  components: {
    Layout,
    Form
  },
  props: {
    login: {
      type: String,
      required: true
    }
  },
  beforeRouteEnter (to, from, next) {
    next(vm => {
      const { id, login, email, activated, authorities } = vm.$store.getters['users/getUser']

      vm.id = id.toString()
      vm.username = login
      vm.email = email
      vm.activated = activated
      vm.authorities = authorities
    })
  },
  beforeRouteLeave (to, from, next) {
    this.$store.commit('users/setCurrentUser', {})
    next()
  },
  data () {
    return {
      id: '',
      username: '',
      email: '',
      authorities: [],
      activated: false,
      authoritiesOptions: ['ROLE_ADMIN', 'ROLE_USER'],

      // todo
      errors: {}
    }
  },
  methods: {
    async editarUsuario () {
      const formData = {
        id: parseInt(this.id),
        login: this.username,
        email: this.email,
        activated: this.activated,
        authorities: this.authorities
      }

      try {
        await axios.put('/api/users', formData)
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

<style lang="scss" module>
  .heading {
    @include heading(left);
  }
</style>
