<template>
  <div :class="$style.success">
    <h3>
      <slot name="title" />
    </h3>
    <p>
      <slot name="paragraph" />
    </p>
  </div>
</template>

<style lang="scss" module>
  .success {
    background-color: rgba($color-secondary, .15);
    border-radius: $size-border-radius;
    font-size: $size-font-lg;
    margin-bottom: 2.5rem;
    padding: 2rem;
    text-align: center;

    h3 { margin-bottom: .5rem; }
  }
</style>
