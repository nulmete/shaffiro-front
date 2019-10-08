<template>
  <label :class="$style['label--error']">
    <slot />
  </label>
</template>

<style lang="scss" module>
  .label--error {
    color: $color-error-dark;
    font-size: 1.35rem;
  }
</style>
