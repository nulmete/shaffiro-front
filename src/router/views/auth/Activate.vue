<template>
  <div class="auth">
    <h2 class="heading-secondary text-center margin-bottom-medium">Activar usuario</h2>

    <!-- Mostrar si no se activó el usuario -->
    <template v-if="!activated">
      <BaseCard>
        <template v-slot:title>
          Usuario registrado con éxito
        </template>
        <template v-slot:paragraph>
          Ingrese el código enviado a <strong>{{ email }}</strong> para activar su usuario.
        </template>
      </BaseCard>

      <form @submit.prevent="activate" class="form">
        <div class="form__group">
          <label class="form__label" for="code">Código</label>
          <BaseInput
            v-model="code"
            label="Código"
            type="number"
            id="code"
            :serverError="codeError"
            :v="$v.code"
          />
          <span v-if="$v.code.$dirty && !$v.code.required" class="input-error">Por favor, ingrese el código recibido en su e-mail</span>
          <span v-else-if="codeError" class="input-error">El código ingresado no es correcto</span>
        </div>

        <BaseButton :disabled="$v.$invalid" type="submit">
          Activar
        </BaseButton>
      </form>
    </template>

    <!-- Mostrar si se activó el usuario -->
    <template v-else>
      <BaseCard>
        <template v-slot:title>
          Usuario activado con éxito
        </template>
        <template v-slot:paragraph>
          Ahora puede iniciar sesión en Shaffiro
        </template>
      </BaseCard>

      <BaseButton type="button" @click="redirectToLogin">
        Iniciar sesión
      </BaseButton>
    </template>
  </div>
</template>

<script>
import axios from 'axios'
import { required } from 'vuelidate/lib/validators'

export default {
  // Antes de pasar a otra URL
  beforeRouteLeave (to, from, next) {
    if (!this.activated) {
      // Si el usuario no activó su cuenta
      const answer = window.confirm('Todavía no activó su cuenta. ¿Está seguro que quiere salir?')

      if (answer) {
        // Si el usuario clickea "Sí" en la ventana de confirmación, sale de la página
        localStorage.removeItem('activated')
        this.$store.commit('auth/setActivationEmail', null)
        localStorage.removeItem('auth.activationEmail')
        next()
      } else {
        // Si el usuario clickea "No" en la ventana de confirmación, permanecer en la página
        next(false)
      }
    } else {
      // El usuario activó su cuenta y sale de la página
      localStorage.removeItem('activated')
      this.$store.commit('auth/setActivationEmail', null)
      localStorage.removeItem('auth.activationEmail')
      next()
    }
  },
  data () {
    return {
      code: '',
      codeError: false,
      activated: localStorage.getItem('activated') || false
    }
  },
  computed: {
    email () {
      return this.$store.getters['auth/getActivationEmail']
    }
  },
  methods: {
    async activate () {
      try {
        await axios.get(`/api/activate?key=${this.code}`)
        this.activated = true
        localStorage.setItem('activated', this.activated)
      } catch (error) {
        this.codeError = true
      }
    },
    redirectToLogin () {
      this.$router.push({ name: 'login' })
    }
  },
  validations: {
    code: {
      required
    }
  }
}
</script>
