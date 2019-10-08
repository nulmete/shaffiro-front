<template>
  <label :class="$style.label">
    {{ label }}
    <input
      v-model="computedValue"
      v-bind="$attrs"
      :type="type"
      :class="[hasError ? $style['input-error'] : '' , $style.input]"
    >
  </label>
</template>

<script>
export default {
  inheritAttrs: false,
  props: {
    value: {
      type: String,
      required: true
    },
    label: {
      type: String,
      required: true
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
      required: true
    }
  },
  computed: {
    computedValue: {
      get () {
        return this.value
      },
      set (newValue) {
        this.v.$touch()
        this.$emit('input', newValue)
      }
    },
    hasError () {
      return !!this.v.$error
    }
  }
}
</script>

<style lang="scss" module>
.label {
  font-size: $font-size-lg;
}

.input {
  border: 1px solid #ccc;
  border-radius: 2px;
  display: block;
  font-family: inherit;
  font-size: $font-size-md;
  padding: 1rem 1.25rem;
  width: 100%;

  &-error {
    border: 1px solid $color-error-dark;
  }
}
</style>
