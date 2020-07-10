<template>
  <div>
    <div class="flex-wrapper margin-bottom-small">
      <span>Si</span>

      <div class="form__group">
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
      type: [Object, String],
      required: true
    }
  },
  data () {
    return {
      operador: '',
      valor: null,
      operadoresPosibles: ['>', '<', '>=', '<=']
    }
  },
  computed: {
    unidad () {
      return this.sensorAsociado.configuracion || ''
    },
    magnitud () {
      return obtenerMagnitud(this.unidad)
    },
    operadoresPosiblesTexto () {
      return this.operadoresPosibles.map(operador => transformarOperador(operador))
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
