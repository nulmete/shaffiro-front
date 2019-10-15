<template>
  <Layout>
    <Form>
      <h2 :class="$style.heading">
        Crear Usuario
      </h2>

      <BaseForm @submit.prevent="crearUsuario">
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
          <BaseInputSelect
            v-model="selectedAuthorities"
            label="Tipo de Usuario"
            :options="authorities"
            :multiple="true"
          />
        </BaseFormGroup>

        <!-- Submit -->
        <BaseButton type="submit">
          Crear usuario
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
  data () {
    return {
      username: '',
      email: '',
      authorities: ['ROLE_ADMIN', 'ROLE_USER'],
      selectedAuthorities: [],

      // todo
      errors: {}
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

<style lang="scss" module>
  .heading {
    @include heading(left);
  }
</style>
