<template>
  <input
    v-model="computedValue"
    :type="type"
    :class="['form__input', { 'error': hasError }]"
  >
</template>

<script>
export default {
  props: {
    value: {
      type: String,
      required: true,
      default: ''
    },
    type: {
      type: String,
      default: 'text',
      validator (value) {
        return [
          'email',
          'number',
          'password',
          'search',
          'tel',
          'text',
          'url'
        ].includes(value)
      }
    },
    v: {
      type: Object,
      required: false,
      default: null
    }
  },
  computed: {
    computedValue: {
      get () {
        return this.value
      },
      set (newValue) {
        if (this.v) this.v.$touch()
        this.$emit('input', newValue)
      }
    },
    hasError () {
      if (!this.v) return
      return !!this.v.$error
    }
  }
}
</script>

<style lang="scss" scoped>
  .error {
    border: 1px solid $color-error-dark !important;
  }
</style>
