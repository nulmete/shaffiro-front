<template>
  <div :class="$style.wrap">
    <slot />
  </div>
</template>

<style lang="scss" module>
  .wrap {
    min-height: 100vh;
    max-width: 120rem;
    margin: 0 auto;
    padding: 3rem 1.5rem;
  }
</style>
