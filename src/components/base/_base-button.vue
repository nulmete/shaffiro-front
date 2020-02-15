<template>
  <button class="button" v-on="$listeners">
    <slot />
  </button>
</template>

<style lang="scss" scoped>
  .button {
    background: none;
    border: 1px solid $color-secondary;
    border-radius: 4px;
    color: $color-secondary;
    cursor: pointer;
    display: block;
    font-family: inherit;
    font-size: 1.6rem;
    font-weight: 700;
    padding: 1.25rem 1.5rem;
    text-transform: uppercase;
    transition: all .2s;

    &:focus,
    &:hover,
    &:active {
        background-color: $color-secondary;
        color: $color-primary-light;
    }

    &:disabled {
      cursor: not-allowed;
      opacity: 0.9;
    }
  }
</style>
