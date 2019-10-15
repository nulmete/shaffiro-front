<template>
  <Layout>
    <Form>
      <h2 :class="$style.heading">
        Asociar dispositivo
      </h2>

      <BaseForm @submit.prevent="asociarDispositivo">
        <!-- Nombre -->
        <BaseFormGroup>
          <BaseInput
            v-model="nombre"
            label="Nombre del dispositivo"
          />
        </BaseFormGroup>

        <!-- Tipo de dispositivo -->
        <BaseFormGroup>
          <BaseInputSelect
            v-model="tipo"
            label="Tipo de dispositivo"
            :options="tiposPosibles"
          />
        </BaseFormGroup>

        <!-- Estado -->
        <BaseFormGroup>
          <BaseInputCheckbox
            v-model="activo"
            label="Habilitado"
          />
        </BaseFormGroup>

        <!-- Regla -->
        <BaseFormGroup>
          <BaseInput
            v-model="regla"
            label="Reglas"
          />
        </BaseFormGroup>

        <!-- Configuracion -->
        <BaseFormGroup>
          <BaseInput
            v-model="configuracion"
            label="Configuración"
          />
        </BaseFormGroup>

        <!-- Submit -->
        <BaseButton type="submit">
          Asociar
        </BaseButton>
      </BaseForm>
    </Form>
  </Layout>
</template>

<script>
import Layout from '@/router/layouts/main'
import Form from '@/router/layouts/form'
import axios from 'axios'

export default {
  components: {
    Layout,
    Form
  },
  props: {
    dispositivoId: {
      type: String,
      required: true
    }
  },
  beforeRouteEnter (to, from, next) {
    next(vm => {
      const { id, mac, uuid } = vm.$store.getters['dispositivosNoAsociados/getDispositivoNoAsociado']

      vm.id = id
      vm.configuracion = `${mac}+${uuid}`
    })
  },
  beforeRouteLeave (to, from, next) {
    this.$store.commit('dispositivosNoAsociados/setDispositivoNoAsociadoActual', {})
    next()
  },
  data () {
    return {
      id: '',
      nombre: '',
      tipo: '',
      activo: false,
      configuracion: '',
      regla: '',
      tiposPosibles: ['SENSOR', 'ACTUADOR'],

      // todo
      errors: {}
    }
  },
  methods: {
    async asociarDispositivo () {
      const formData = {
        nombre: this.nombre,
        tipo: this.tipo,
        activo: this.activo,
        configuracion: this.configuracion,
        regla: this.regla
      }

      try {
        await axios.post('/api/dispositivos', formData)
        await axios.delete(`api/dispositivo-no-asociados/${this.id}`)
        this.$router.push({ name: 'dispositivos' })
      } catch (error) {
        // todo
        console.log(error.response)
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
