<template>
  <div class="auth container">
    <h2 class="heading-secondary text-center margin-bottom-medium">
      Editar dispositivo
    </h2>

    <form
      class="form"
      @submit.prevent="editarDispositivo"
    >
      <div class="form__group">
        <label
          class="form__label"
          for="nombre"
        >Nombre del dispositivo</label>
        <BaseInput
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
        <BaseInputCheckbox
          :id="'device-state'"
          v-model="activo"
          :label="'Habilitado'"
        />
      </div>

      <!-- <div class="form__group">
        <label class="form__label">Tipo de dispositivo</label>
        <BaseInputSelect
          v-model="tipo"
          :options="tiposPosibles"
        />
      </div> -->

      <BaseButton
        :disabled="$v.$invalid"
        type="submit"
      >
        Guardar
      </BaseButton>
    </form>
  </div>
</template>

<script>
import { required } from 'vuelidate/lib/validators'
import axios from 'axios'

export default {
  props: {
    identificador: {
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
      tiposPosibles: ['SENSOR', 'ACTUADOR']
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
  },
  validations: {
    nombre: {
      required
    }
  }
}
</script>
