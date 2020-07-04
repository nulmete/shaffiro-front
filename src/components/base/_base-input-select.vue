<template>
  <select
    v-model="inputValue"
    :class="['form__select-input', { 'form__select-input--single': !multiple }]"
    :multiple="multiple"
  >
    <option
      v-if="!multiple"
      disabled
      selected
      value
      class="form__select-option"
    >
      Seleccionar
      <template v-if="extraLabel">
        {{ extraLabel }}
      </template>
    </option>
    <option
      v-for="(option, index) in options"
      :key="index"
      class="form__select-option"
      :value="option"
    >
      {{ labelValue[index] }}
    </option>
  </select>
</template>

<script>
export default {
  model: {
    event: 'change'
  },
  props: {
    value: {
      type: [Object, Array, String, Number],
      default: () => []
    },
    options: {
      type: Array,
      required: true
    },
    multiple: {
      type: Boolean,
      default: false
    },
    optionsLabels: {
      type: Array,
      required: false,
      default: null
    },
    extraLabel: {
      type: String,
      required: false,
      default: ''
    }
  },
  data () {
    return {
      labelValue: this.optionsLabels || this.options
    }
  },
  computed: {
    inputValue: {
      get () {
        return this.value
      },
      set (newValue) {
        this.$emit('change', newValue)
      }
    }
  }
}
</script>
