<template>
  <Layout>
    <Form>
      <h2 :class="$style.heading">
        Editar dispositivo
      </h2>

      <BaseForm @submit.prevent="editarDispositivo">
        <!-- ID -->
        <BaseFormGroup>
          <BaseInput
            v-model="id"
            label="Id"
            type="text"
          />
        </BaseFormGroup>

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
          Guardar
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
      const { id, nombre, tipo, activo, configuracion, regla } = vm.$store.getters['dispositivos/getDispositivo']

      vm.id = id.toString()
      vm.nombre = nombre
      vm.tipo = tipo
      vm.activo = activo
      vm.configuracion = configuracion
      vm.regla = regla
    })
  },
  beforeRouteLeave (to, from, next) {
    this.$store.commit('dispositivos/setDispositivoActual', {})
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
    async editarDispositivo () {
      const formData = {
        id: parseInt(this.id),
        nombre: this.nombre,
        tipo: this.tipo,
        activo: this.activo,
        configuracion: this.configuracion,
        regla: this.regla
      }

      try {
        await axios.put('/api/dispositivos', formData)
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
