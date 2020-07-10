<template>
  <MainForm>
    <template v-slot:heading>
      Activar usuario
    </template>

    <BaseCard>
      <template v-slot:title>
        Usuario dado de alta con éxito
      </template>
      <template v-slot:paragraph>
        Se ha enviado un correo electrónico a <strong>{{ email }}</strong> para activar su usuario.
        Por favor, verifique su casilla para continuar con el proceso de activación.
      </template>
    </BaseCard>
  </MainForm>
</template>

<script>
import MainForm from '@/router/views/layouts/MainForm'

export default {
  components: { MainForm },
  computed: {
    email () {
      return this.$store.getters['auth/getActivationEmail']
    }
  }
}
</script>
