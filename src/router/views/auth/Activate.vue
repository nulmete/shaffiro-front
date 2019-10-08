<template>
  <Layout>
    <Form>
      <h2>Active su usuario</h2>

      <template v-if="!activated">
        <BaseSuccessCard>
          <template v-slot:title>
            Usuario registrado con éxito
          </template>
          <template v-slot:paragraph>
            Se ha enviado un código a {{ currentUser.email }} que debe ingresar aquí para activar su usuario
          </template>
        </BaseSuccessCard>

        <BaseForm @submit.prevent="activate">
          <BaseFormGroup>
            <BaseInput
              v-model="code"
              label="Código"
              type="number"
              :v="$v.code"
            />
            <BaseLabelError>
              <template v-if="$v.code.$dirty && !$v.code.required">
                Por favor, ingrese el código recibido en su e-mail
              </template>
              <template v-else-if="errors.code">
                El código ingresado no es correcto
              </template>
            </BaseLabelError>
          </BaseFormGroup>

          <BaseButton
            :disabled="$v.$invalid"
            type="submit"
          >
            Activar
          </BaseButton>
        </BaseForm>
      </template>

      <template v-else>
        <BaseSuccessCard>
          <template v-slot:title>
            Usuario activado con éxito
          </template>
          <template v-slot:paragraph>
            Ahora puede iniciar sesión en Shaffiro
          </template>
        </BaseSuccessCard>

        <!--
          Se usa BaseButton en vez de BaseLink por cuestiones de estilo
          Para poder hacer la redirección, se define el método redirectToLogin
          Es necesario agregar v-on="$listeners" en BaseButton para que herede
          el event listener de este componente padre
          -->
        <BaseButton
          type="button"
          @click="redirectToLogin"
        >
          Iniciar sesión
        </BaseButton>
      </template>
    </Form>
  </Layout>
</template>

<script>
import Layout from '@/router/layouts/main'
import Form from '@/router/layouts/form'
import { required } from 'vuelidate/lib/validators'
import { mapState } from 'vuex'

export default {
  components: {
    Layout,
    Form
  },
  // Antes de pasar a otra url
  beforeRouteLeave (to, from, next) {
    if (!this.activated) {
      // Si el usuario no activó su cuenta
      const answer = window.confirm(
        'Todavía no activó su cuenta. ¿Está seguro que quiere salir?'
      )

      if (answer) {
        // Si el usuario clickea "Sí" en la ventana de confirmación
        this.$store.commit('auth/setCurrentUser', null)
        next()
      } else {
        // Si el usuario clickea "No" en la ventana de confirmación
        next(false)
      }
    } else {
      // El usuario activó su cuenta
      this.$store.commit('auth/setCurrentUser', null)
      localStorage.removeItem('activated')
      next()
    }
  },
  data () {
    return {
      code: '',
      errors: {
        code: false
      },
      activated: localStorage.getItem('activated') || false
    }
  },
  computed: {
    ...mapState('auth', ['currentUser'])
  },
  methods: {
    async activate () {
      try {
        // Ejecutar la acción 'activate'
        await this.$store.dispatch('auth/activate', this.code)
        this.activated = true
        localStorage.setItem('activated', this.activated)
      } catch (error) {
        this.errors.code = true
      }
    },
    redirectToLogin () {
      this.$router.push({ name: 'signin' })
    }
  },
  validations: {
    code: {
      required
    }
  }
}
</script>
