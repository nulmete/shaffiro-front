<template>
  <Layout>
    <Form>
      <h2 :class="$style.heading">
        Inicie sesión en Shaffiro
      </h2>

      <div
        v-if="errors.credentials"
        :class="$style.error"
      >
        Nombre de usuario o contraseña incorrectos
      </div>

      <div
        v-if="errors.activation"
        :class="$style.error"
      >
        El usuario ingresado no está activado.<br>
        Para ingresar, primero debe
        <BaseLink
          :to="{ name: 'activate' }"
          :class="$style.activate"
        >
          activarse
        </BaseLink>
      </div>

      <BaseForm @submit.prevent="logIn">
        <!-- Nombre de usuario -->
        <BaseFormGroup>
          <BaseInput
            v-model="username"
            name="username"
            label="Nombre de Usuario"
            :v="$v.username"
          />
          <BaseLabelError
            v-if="$v.username.$error"
            :v="$v.username"
          >
            Por favor, ingrese su nombre de usuario
          </BaseLabelError>
        </BaseFormGroup>

        <!-- Contraseña -->
        <BaseFormGroup>
          <BaseInput
            v-model="password"
            name="password"
            label="Contraseña"
            type="password"
            :v="$v.password"
          />
          <BaseLabelError
            v-if="$v.password.$error"
            :v="$v.password"
          >
            Por favor, ingrese su contraseña
          </BaseLabelError>
        </BaseFormGroup>

        <!-- Submit -->
        <BaseButton
          class="align-center"
          :disabled="$v.$invalid"
          type="submit"
        >
          Iniciar sesión
        </BaseButton>
      </BaseForm>

      <p class="form-footer">
        <BaseLink :to="{ name: 'resetPasswordInit' }">
          ¿Olvidó su contraseña?
        </BaseLink>
      </p>
    </Form>
  </Layout>
</template>

<script>
import Layout from '@/router/layouts/main'
import Form from '@/router/layouts/form'
import { required } from 'vuelidate/lib/validators'

export default {
  components: {
    Layout,
    Form
  },
  data () {
    return {
      username: '',
      password: '',
      errors: {
        activation: false,
        credentials: false
      }
    }
  },
  validations: {
    username: {
      required
    },
    password: {
      required
    }
  },
  methods: {
    async logIn () {
      // Resetear errores
      this.errors.activation = false
      this.errors.credentials = false

      // Objeto esperado por el endpoint /api/authenticate
      const formData = {
        username: this.username,
        password: this.password,
        rememberMe: false
      }

      try {
        // Ejecutar la acción 'logIn'
        await this.$store.dispatch('auth/logIn', formData)

        // Redireccionar a la ruta solicitada originalmente, o a /dashboard por defecto
        this.$router.push(this.$route.query.redirectFrom || { name: 'dashboard' })
      } catch (error) {
        const responseError = error.response.data.detail

        switch (responseError) {
          // Si el usuario no está activado
          case `User ${this.username} was not activated`:
            this.errors.activation = true
            break
          // Si el usuario o la contraseña son incorrectos
          case 'Bad credentials':
            this.errors.credentials = true
            break
          default:
            break
        }
      }
    }
  }
}
</script>

<style lang="scss" module>
  .heading {
    @include heading(center);
  }

  .error {
    background-color: $color-error-dark;
    color: $color-primary-light;
    margin-bottom: 1.5rem;
    padding: 1.25rem;
    text-align: center;

    .activate {
      color: $color-primary-light;
      font-weight: 700;
      text-transform: uppercase;
    }
  }
</style>
