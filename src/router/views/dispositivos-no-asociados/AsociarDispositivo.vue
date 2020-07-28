<template>
  <MainForm>
    <template v-slot:heading>
      Asociar dispositivo
    </template>

    <form
      class="form"
      @submit.prevent="asociarDispositivo"
    >
      <div class="form__group">
        <label
          class="form__label"
          for="nombre"
        >Nombre del dispositivo</label>
        <base-input
          id="nombre"
          v-model="nombre"
          placeholder="Dispositivo_Living"
          :v="$v.nombre"
        />
        <span
          v-if="$v.nombre.$dirty && !$v.nombre.required"
          class="input-error"
        >Por favor, ingrese el nombre del dispositivo</span>
      </div>

      <div class="form__group">
        <label class="form__label">Tipo de dispositivo</label>
        <base-input-select
          id="tipo"
          v-model="tipo"
          :options="tiposPosibles"
          @change="mostrarOpciones"
        />
      </div>

      <div
        v-if="tipo"
        class="form__group"
      >
        <label class="form__label">
          {{ tipo === 'SENSOR' ? 'Magnitud a medir' : 'Artefacto a controlar' }}
        </label>
        <base-input-select
          id="configuracion"
          v-model="configuracion"
          :options="configuracionesPosibles"
          :options-labels="configuracionesPosiblesLabels"
        />
      </div>

      <div class="form__group">
        <base-input-checkbox
          :id="'device-state'"
          v-model="activo"
          :label="'Habilitado'"
        />
      </div>

      <base-button
        :disabled="$v.$invalid || !tipo"
        type="submit"
      >
        Asociar
      </base-button>
    </form>
  </MainForm>
</template>

<script>
import MainForm from '@/router/views/layouts/MainForm'
import { obtenerMagnitud } from '@/utils/reglas'
import { required } from 'vuelidate/lib/validators'
import axios from 'axios'

export default {
  components: { MainForm },
  beforeRouteEnter (to, from, next) {
    next(vm => {
      const { id, mac, uuid } = vm.$store.getters['dispositivosNoAsociados/getDispositivoNoAsociadoActual']

      vm.id = id
      vm.mac = mac
      vm.uuid = uuid
      vm.configuracion = ''
    })
  },
  beforeRouteLeave (to, from, next) {
    this.$store.commit('dispositivosNoAsociados/setDispositivoNoAsociadoActual', null)
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
      unidadesPosibles: ['LUMENES'],
      artefactosPosibles: ['Lámpara LED', 'Lámpara fluorescente', 'Lámpara halógena', 'Lámpara bajo consumo'],
      configuracion: '',
      configuracionesPosibles: [],
      configuracionesPosiblesLabels: [],
      activo: false,
      error: null
    }
  },
  methods: {
    mostrarOpciones (tipoDispositivo) {
      this.configuracionesPosibles.splice(0, this.configuracionesPosibles.length)
      this.configuracionesPosiblesLabels.splice(0, this.configuracionesPosiblesLabels.length)
      if (tipoDispositivo === 'SENSOR') {
        const unidad = 'LUMENES'
        const magnitud = obtenerMagnitud(unidad)
        this.configuracionesPosibles.push('LUMENES')
        this.configuracionesPosiblesLabels.push(magnitud)
      } else if (tipoDispositivo === 'ACTUADOR') {
        this.configuracionesPosibles.push('Lámpara LED', 'Lámpara fluorescente', 'Lámpara halógena', 'Lámpara bajo consumo')
        this.configuracionesPosiblesLabels.push('Lámpara LED', 'Lámpara fluorescente', 'Lámpara halógena', 'Lámpara bajo consumo')
      }
    },
    async asociarDispositivo () {
      const data = {
        nombre: this.nombre,
        tipo: this.tipo,
        // Si el dispositivo es tipo SENSOR, la configuración será la MAGNITUD a medir
        // Si es tipo ACTUADOR, será el ARTEFACTO A CONTROLAR
        configuracion: this.configuracion
      }

      try {
        await axios.post(`api/dispositivo-no-asociado/pair/${this.id}`, data)
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
