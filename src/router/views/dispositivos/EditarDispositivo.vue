<template>
  <MainForm>
    <template v-slot:heading>
      Editar dispositivo
    </template>

    <form
      class="form"
      @submit.prevent="editarDispositivo"
    >
      <div class="form__group">
        <label
          class="form__label"
          for="nombre"
        >Nombre del dispositivo</label>
        <base-input
          id="nombre"
          v-model="nombre"
          :v="$v.nombre"
        />
        <span
          v-if="$v.nombre.$dirty && !$v.nombre.required"
          class="input-error"
        >Por favor, ingrese el nombre del dispositivo</span>
      </div>

      <div class="form__group">
        <base-input-checkbox
          :id="'device-state'"
          v-model="activo"
          :label="'Habilitado'"
        />
      </div>

      <base-button
        :disabled="$v.$invalid"
        type="submit"
      >
        Guardar
      </base-button>
    </form>
  </MainForm>
</template>

<script>
import MainForm from '@/router/views/layouts/MainForm'
import { required } from 'vuelidate/lib/validators'
import axios from 'axios'

export default {
  components: { MainForm },
  props: {
    identificador: {
      type: String,
      required: true
    }
  },
  beforeRouteEnter (to, from, next) {
    next(vm => {
      const { id, nombre, tipo, activo, configuracion } = vm.$store.getters['dispositivos/getDispositivoActual']

      vm.id = id.toString()
      vm.nombre = nombre
      vm.tipo = tipo
      vm.activo = activo
      vm.configuracion = configuracion
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
      tiposPosibles: ['SENSOR', 'ACTUADOR'],
      error: null
    }
  },
  methods: {
    async editarDispositivo () {
      const data = {
        id: parseInt(this.id),
        nombre: this.nombre,
        tipo: this.tipo,
        activo: this.activo,
        configuracion: this.configuracion
      }

      try {
        await axios.put('/api/dispositivos', data)
        this.$router.push({ name: 'dispositivos' })
      } catch (error) {
        // todo
        this.error = error.message
      }
    }
  },
  validations: {
    nombre: {
      required
    }
  }
}
</script>
