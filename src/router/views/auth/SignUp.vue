<template>
  <Layout>
    <Form>
      <h2 class="heading heading--primary">
        Regístrese en Shaffiro
      </h2>

      <BaseForm @submit.prevent="signUp">
        <BaseFormGroup>
          <BaseInput
            v-model="email"
            type="email"
            label="E-mail"
            :v="$v.email"
          />
          <BaseLabelError>
            <template v-if="$v.email.$dirty && !$v.email.required">
              Por favor, ingrese su e-mail
            </template>
            <template v-else-if="$v.email.$dirty && !$v.email.email">
              Ingrese un e-mail válido <i>(ejemplo: shaffiro@gmail.com)</i>
            </template>
            <template v-else-if="errors.email">
              El e-mail ingresado ya está en uso
            </template>
          </BaseLabelError>
        </BaseFormGroup>

        <BaseFormGroup>
          <BaseInput
            v-model="username"
            label="Nombre de usuario"
            :v="$v.username"
          />
          <BaseLabelError>
            <template v-if="$v.username.$dirty && !$v.username.required">
              Por favor, ingrese su nombre de usuario
            </template>
            <template v-else-if="$v.username.$dirty && !$v.username.valid">
              Use entre 8 y 15 caracteres
            </template>
            <template v-else-if="errors.username">
              El nombre de usuario ingresado ya está en uso
            </template>
          </BaseLabelError>
        </BaseFormGroup>

        <BaseFormGroup>
          <BaseInput
            v-model="password"
            type="password"
            label="Contraseña"
            :v="$v.password"
          />
          <BaseLabelError>
            <template v-if="$v.password.$dirty && !$v.password.required">
              Por favor, ingrese su contraseña
            </template>
            <template v-else-if="$v.password.$dirty && !$v.password.valid">
              Use entre 8 y 20 caracteres, y al menos una mayúsucula y un número
            </template>
          </BaseLabelError>
        </BaseFormGroup>

        <BaseFormGroup>
          <BaseInput
            v-model="confirmPassword"
            type="password"
            label="Confirmar Contraseña"
            :v="$v.confirmPassword"
          />
          <BaseLabelError>
            <template v-if="$v.confirmPassword.$dirty && !$v.confirmPassword.required">
              Por favor, confirme su contraseña
            </template>
            <template v-else-if="$v.confirmPassword.$dirty && !$v.confirmPassword.sameAs">
              Las contraseñas no coinciden
            </template>
          </BaseLabelError>
        </BaseFormGroup>

        <BaseButton
          class="align-center"
          :disabled="$v.$invalid"
          type="submit"
        >
          Registrarse
        </BaseButton>
      </BaseForm>

      <p class="form-footer">
        ¿Ya tiene una cuenta?
        <BaseLink :to="{ name: 'signin' }">
          Inicie sesión
        </BaseLink>
      </p>
    </Form>
  </Layout>
</template>

<script>
import Layout from '@/router/layouts/main'
import Form from '@/router/layouts/form'
import { required, email, sameAs } from 'vuelidate/lib/validators'
import { isUsernameValid, isPasswordStrong } from '@/validators/validators'

export default {
  components: {
    Layout,
    Form
  },
  data () {
    return {
      email: '',
      username: '',
      password: '',
      confirmPassword: '',
      errors: {
        email: false,
        username: false
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
    },
    password: {
      required,
      valid: function () {
        return isPasswordStrong(this.password)
      }
    },
    confirmPassword: {
      required,
      sameAs: sameAs(function () {
        return this.password
      })
    }
  },
  methods: {
    async signUp () {
      // Resetear errores
      this.errors.email = false
      this.errors.username = false

      // Objeto esperado por el endpoint /api/register
      const formData = {
        email: this.email,
        login: this.username,
        password: this.password,
        langKey: 'es'
      }

      try {
        // Ejecutar la acción 'signup'
        await this.$store.dispatch('auth/signUp', formData)
        // Redireccionar a /signup/activate
        this.$router.push({ name: 'activate' })
      } catch (error) {
        const responseError = error.response.data.errorKey

        switch (responseError) {
          // Si el usuario ingresado ya existe
          case 'userexists':
            this.errors.username = true
            break
          // Si el e-mail ingresado ya existe
          case 'emailexists':
            this.errors.email = true
            break
          default:
            break
        }
      }
    }
  }
}
</script>
