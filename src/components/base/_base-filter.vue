<template>
  <input
    :value="value"
    class="input-filter"
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

<style lang="scss" scoped>
  .input-filter {
    background-color: $color-primary-light;
    border: 1px solid $color-primary-medium;
    border-radius: $default-border-radius;
    color: darken($color-primary-medium, 25%);
    display: block;
    font-family: inherit;
    font-size: 1.5rem;
    padding: 1rem;
    width: 100%;
    transition: all .2s;

    &:focus {
      background-color: #fff;
      color: $color-primary-dark;
      outline: none;

      &::placeholder {
        color: transparent;
      }
    }
  }
</style>
