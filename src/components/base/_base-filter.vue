<template>
  <input
    :value="value"
    :class="$style.input"
    type="text"
    placeholder="Buscar..."
    @input="$emit('input', $event.target.value)"
  >
</template>

<script>
export default {
  props: {
    value: {
      type: String,
      required: true
    }
  }
}
</script>

<style lang="scss" module>
  .input {
    border: 1px solid $color-primary-medium;
    display: block;
    font-family: inherit;
    font-size: $size-font-md;
    padding: 1rem;
    margin-right: auto;
  }
</style>
