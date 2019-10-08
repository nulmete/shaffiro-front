<template>
  <Layout>
    <Form>
      <h2 class="heading heading--secondary">
        Editar Usuario
      </h2>

      <BaseForm @submit.prevent="editUser">
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
import axios from 'axios'

export default {
  components: {
    Layout,
    Form
  },
  props: {
    user: {
      type: Object,
      required: true
    }
  },
  data () {
    return {
      id: this.user.id.toString(),
      username: this.user.login,
      email: this.user.email,
      activated: this.user.activated,
      authorities: this.user.authorities,
      authoritiesOptions: ['ROLE_ADMIN', 'ROLE_USER']
    }
  },
  methods: {
    async editUser () {
      const formData = {
        id: parseInt(this.id),
        login: this.username,
        email: this.email,
        activated: this.activated,
        authorities: this.authorities
      }

      try {
        await axios.put('/api/users', formData)
        this.$router.push({ name: 'abm' })
      } catch (error) {
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
      validLength (username) {
        return username.length >= 8 && username.length <= 15
      }
    }
  }
}
</script>
