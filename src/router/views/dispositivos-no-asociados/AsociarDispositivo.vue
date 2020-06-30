<template>
  <div class="auth container">
    <h2 class="heading-secondary text-center margin-bottom-medium">
      Asociar dispositivo
    </h2>

    <form
      class="form"
      @submit.prevent="asociarDispositivo"
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
        <label class="form__label">Tipo de dispositivo</label>
        <BaseInputSelect
          id="tipo"
          v-model="tipo"
          :options="tiposPosibles"
        />
      </div>

      <div class="form__group">
        <BaseInputCheckbox
          :id="'device-state'"
          v-model="activo"
          :label="'Habilitado'"
        />
      </div>

      <BaseButton
        :disabled="$v.$invalid || !tipo"
        type="submit"
      >
        Asociar
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
      const { id, mac, uuid } = vm.$store.getters['dispositivosNoAsociados/getDispositivoNoAsociado']

      vm.id = id
      vm.mac = mac
      vm.uuid = uuid
      vm.configuracion = ''
    })
  },
  beforeRouteLeave (to, from, next) {
    this.$store.commit('dispositivosNoAsociados/setDispositivoNoAsociadoActual', {})
    next()
  },
  data () {
    return {
      id: '',
      mac: '',
      uuid: '',
      nombre: '',
      tipo: '',
      tiposPosibles: ['SENSOR', 'ACTUADOR'],
      activo: false,
      configuracion: ''
    }
  },
  methods: {
    async asociarDispositivo () {
      // const pair = [{
      //   id: '2',
      //   pin: '2',
      //   mode: 'OUTPUT',
      //   type: 'proximidad'
      // }]

      const formData = {
        nombre: this.nombre,
        tipo: this.tipo,
        activo: this.activo,
        configuracion: this.configuracion
      }

      try {
        // hacer pair
        // await axios.post(`/api/pair/${this.mac}`, pair)

        // crear dispositivo
        await axios.post('/api/dispositivos', formData)
        // eliminar dispositivo de la tabla de dispositivos no asociados
        await axios.delete(`api/dispositivo-no-asociados/${this.id}`)
        await this.$nextTick.then(this.$router.push({ name: 'dispositivos' }))
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
