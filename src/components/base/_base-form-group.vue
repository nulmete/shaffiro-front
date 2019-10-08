<template>
  <div :class="$style.group">
    <slot />
  </div>
</template>

<style lang="scss" module>
.group {
  &:not(:last-of-type) {
    margin-bottom: 2rem;
  }

  &:last-of-type {
    margin-bottom: 3.5rem;
  }
}
</style>
