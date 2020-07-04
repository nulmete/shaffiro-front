<template>
  <div>
    <div class="flex-wrapper margin-bottom-small">
      <span>Si</span>

      <div class="form__group">
        <!-- <BaseInputSelect
          v-model="unidad"
          :extra-label="'unidad'"
          :options="unidadesPosibles"
          :options-labels="magnitudesPosibles"
        /> -->
        <BaseInput
          id="magnitud"
          v-model="magnitud"
          placeholder="Magnitud"
          disabled
          class="form__input"
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
        <!-- <span
          v-if="$v.valor.$dirty && !$v.valor.required"
          class="input-error"
        >Por favor, ingrese el valor de la condición</span> -->
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

      <!-- <span>{{ unidad }}</span> -->
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
import { transformarOperador, transformarUnidad } from './condicion'
import { required } from 'vuelidate/lib/validators'

export default {
  props: {
    sensorAsociado: {
      type: [Object, String],
      required: true
    }
  },
  data () {
    return {
      operador: '',
      valor: '',
      operadoresPosibles: ['>', '<', '>=', '<=']
      // unidadesPosibles: ['CELSIUS', 'LUMENES', 'AMPERES']
    }
  },
  computed: {
    unidad () {
      return this.sensorAsociado.configuracion || ''
    },
    magnitud () {
      return transformarUnidad(this.unidad)
    },
    operadoresPosiblesTexto () {
      return this.operadoresPosibles.map(operador => transformarOperador(operador))
    }
    // magnitudesPosibles () {
    //   return this.unidadesPosibles.map(unidad => transformarUnidad(unidad))
    // }
  },
  methods: {
    agregarCondicion () {
      this.$emit('agregarCondicion', {
        unidad: this.unidad,
        operador: this.operador,
        valor: this.valor
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
