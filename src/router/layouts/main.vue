<template>
  <div :class="$style.wrap">
    <slot />
  </div>
</template>

<style lang="scss" module>
  .wrap {
    flex: 1;
    // // max-width: 120rem;
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 3.5rem 1.5rem;
  }
</style>
