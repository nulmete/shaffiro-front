<template>
  <li
    class="condicion"
    :class="{ disabled: disabled }"
  >
    <div class="flex-wrapper">
      <h3 class="heading">
        Condición {{ padreIndex + 1 }}
      </h3>
      <button
        type="button"
        class="remover"
        @click="remover"
      >
        X
      </button>
    </div>
    <div class="form-group">
      <label class="label">Sensor</label>
      <select
        v-model="val.dispositivo"
        class="input"
      >
        <option
          disabled
          selected
          value
        >
          Seleccionar
        </option>
        <option
          v-for="(opcion, index) in nombreSensores"
          :key="index"
        >
          {{ opcion }}
        </option>
      </select>
    </div>

    <div class="form-group">
      <label class="label">Operador</label>
      <select
        v-model="val.operador"
        class="input"
      >
        <option
          disabled
          selected
          value
        >
          Seleccionar
        </option>
        <option
          v-for="(opcion, index) in operadores"
          :key="index"
        >
          {{ opcion }}
        </option>
      </select>
    </div>

    <div class="form-group">
      <label class="label">Valor</label>
      <input
        v-model="val.valor"
        class="input"
        type="text"
        label="Valor"
      >
    </div>
  </li>
</template>

<script>
export default {
  props: {
    val: {
      type: Object,
      required: true
    },
    sensores: {
      type: Array,
      required: true
    },
    padreIndex: {
      type: Number,
      required: true
    },
    disabled: {
      type: Boolean,
      required: true
    }
  },
  data () {
    return {
      operadores: ['==', '!=', '>=', '<=', '>', '<']
    }
  },
  computed: {
    nombreSensores () {
      return this.sensores.map(sensor => sensor.nombre)
    }
  },
  methods: {
    remover () {
      this.$emit('remover')
    }
  }
}
</script>

<style lang="scss" scoped>
  .flex-wrapper {
    display: flex;
  }

  .condicion {
    background: #f4f4f4;
    border-radius: 5px;
    box-shadow:
      0 3px 6px rgba($color-primary-dark, 0.16),
      0 3px 6px rgba($color-primary-dark, 0.23);
    padding: 1.2rem;

    &:not(:last-child) { margin-bottom: 1.5rem; }
  }

  .form-group {
    margin-bottom: 1rem;
    display: flex;

    .label {
      font-size: 1.35rem;
      margin-right: .75rem;
    }

    .input { flex: 1; }
  }

  .remover {
    align-self: flex-start;
    background: #dc3545;
    border: none;
    border-radius: 2px;
    color: #fafafa;
    cursor: pointer;
    display: block;
    font-family: inherit;
    font-size: 1.4rem;
    font-weight: 700;
    padding: 1rem;
    text-transform: uppercase;
    transition: all .2s;

    &:disabled {
      cursor: not-allowed;
      opacity: 0.9;
    }

    &:not(:disabled) {
      &:focus,
      &:hover,
      &:active {
        background: lighten(#dc3545, 5%);
      }
    }
  }

  .disabled {
    pointer-events: none;
    opacity: 0.65;
  }
</style>
