<template>
  <input
    v-model="computedValue"
    :type="type"
    :name="id"
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
    id: {
      type: String,
      required: true
    },
    v: {
      type: Object,
      required: false,
      default: null
    },
    serverError: {
      type: Boolean,
      required: false,
      default: false
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
      if (!this.v && !this.serverError) return
      return !!this.v.$error || !!this.serverError
    }
  }
}
</script>

<style lang="scss" scoped>
  .error {
    border: 1px solid $color-error-dark !important;
  }
</style>
