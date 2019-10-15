<template>
  <label :class="$style['label-error']">
    <slot />
  </label>
</template>

<style lang="scss" module>
  .label-error {
    @extend %font-input-label;
    color: $color-error-dark;
  }
</style>
