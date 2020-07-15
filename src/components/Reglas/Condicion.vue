<template>
  <div>
    {{ sensorAsociado }}
    <div class="flex-wrapper margin-bottom-small">
      <span>Si</span>

      <div class="form__group">
        <!-- <BaseInput
          id="magnitud"
          v-model="magnitud"
          placeholder="Magnitud"
          disabled
          class="form__input"
        /> -->
        <BaseInputSelect
          v-model="magnitud"
          :extra-label="'magnitud'"
          :options="magnitudesPosibles"
        />
      </div>

      <span>es</span>

      <div class="form__group">
        <BaseInputSelect
          v-model="operador"
          :extra-label="'operador'"
          :options="operadoresPosibles"
          :options-labels="operadoresPosiblesTexto"
        />
      </div>

      <div class="form__group">
        <BaseInput
          id="valor"
          v-model="valor"
          type="number"
          class="form__input"
          placeholder="Ingresar valor"
        />
      </div>

      <div class="form__group">
        <BaseInput
          id="unidad"
          v-model="unidad"
          placeholder="Unidad"
          disabled
          class="form__input"
        />
      </div>
    </div>

    <button
      class="btn btn--condicion"
      @click.prevent="agregarCondicion"
    >
      Agregar
    </button>
  </div>
</template>

<script>
import { transformarOperador, obtenerMagnitud } from '@/utils/reglas'
import { required } from 'vuelidate/lib/validators'

export default {
  props: {
    sensorAsociado: {
      type: Object,
      required: false,
      default: function () {
        return {}
      }
    }
  },
  data () {
    return {
      operador: '',
      magnitud: '',
      valor: null,
      operadoresPosibles: ['>', '<', '>=', '<='],
      sensor: this.sensorAsociado
    }
  },
  computed: {
    // unidad () {
    //   return this.sensorAsociado.configuracion || ''
    // },
    operadoresPosiblesTexto () {
      return this.operadoresPosibles.map(operador => transformarOperador(operador))
    },
    magnitudesPosibles () {
      if (this.sensorAsociado) {
        const magnitudSensor = obtenerMagnitud(this.sensorAsociado.configuracion)
        return [magnitudSensor, 'el Horario']
      } else {
        return []
      }
    },
    unidad () {
      if (!this.sensorAsociado) {
        return ''
      }

      if (this.magnitud === obtenerMagnitud(this.sensorAsociado.configuracion)) {
        return this.sensorAsociado.configuracion
      } else if (this.magnitud === 'el Horario') {
        return 'horas'
      } else {
        return ''
      }
    }
  },
  methods: {
    agregarCondicion () {
      this.$emit('agregarCondicion', {
        op: this.operador,
        vs: parseInt(this.valor),
        unit: this.unidad
      })

      this.operador = ''
      this.valor = ''
    }
  },
  validations: {
    valor: {
      required
    }
  }
}
</script>
