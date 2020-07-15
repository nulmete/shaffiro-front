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

      <div
        v-if="tipo === 'SENSOR'"
        class="form__group"
      >
        <label class="form__label">Magnitud a medir</label>
        <BaseInputSelect
          id="unidad"
          v-model="unidad"
          disabled
          :options="unidadesPosibles"
          :options-labels="magnitudesPosibles"
        />
      </div>

      <div
        v-else-if="tipo === 'ACTUADOR'"
        class="form__group"
      >
        <label class="form__label">Artefacto a controlar</label>
        <BaseInputSelect
          id="artefacto"
          v-model="artefacto"
          :options="artefactosPosibles"
          :options-labels="artefactosPosibles"
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
  </MainForm>
</template>

<script>
import MainForm from '@/router/views/layouts/MainForm'
import { obtenerMagnitud } from '@/utils/reglas'
import { required } from 'vuelidate/lib/validators'
import mainApi from '@/utils/mainApi'

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
      unidad: 'LUMENES',
      tiposPosibles: ['SENSOR', 'ACTUADOR'],
      // unidadesPosibles: ['LUMENES', 'CELSIUS', 'AMPERES'],
      unidadesPosibles: ['LUMENES'],
      activo: false,
      artefacto: '',
      // artefactosPosibles: ['Lámpara', 'Aire', 'PC'],
      artefactosPosibles: ['Lámpara LED', 'Lámpara fluorescente', 'Lámpara halógena', 'Lámpara bajo consumo'],
      configuracion: ''
    }
  },
  computed: {
    magnitudesPosibles () {
      return this.unidadesPosibles.map(unidad => obtenerMagnitud(unidad))
    }
  },
  methods: {
    async asociarDispositivo () {
      const configuracion = this.tipo === 'SENSOR' ? this.unidad : this.artefacto

      const formData = {
        nombre: this.nombre,
        tipo: this.tipo,
        activo: this.activo,
        // A MEJORAR: mando en el campo configuración la magnitud a medir
        // si el dispositivo es tipo SENSOR.
        // Si es tipo ACTUADOR, mando el artefacto a controlar
        configuracion
      }

      try {
        // crear dispositivo
        await mainApi.post('/api/dispositivos', formData)
        // eliminar dispositivo de la tabla de dispositivos no asociados
        await mainApi.delete(`api/dispositivo-no-asociados/${this.id}`)
        this.$router.push({ name: 'dispositivos' })
      } catch (error) {
        // todo
        console.log(error)
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
