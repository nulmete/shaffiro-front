<template>
  <label :class="$style.label">
    <input
      type="checkbox"
      v-bind="$attrs"
      :checked="value"
      @change="$emit('input', $event.target.checked)"
    >
    <span>{{ label }}</span>
  </label>
</template>

<script>
export default {
  inheritAttrs: false,
  props: {
    value: {
      type: Boolean,
      required: true
    },
    label: {
      type: String,
      required: true
    }
  }
}
</script>

<style lang="scss" module>
  .label {
    font-size: $font-size-lg;
    display: flex;
    align-items: center;

    span {
      margin-left: .35rem;
    }
  }
</style>
