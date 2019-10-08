<template>
  <button
    :class="$style.button"
    v-on="$listeners"
  >
    <slot />
  </button>
</template>

<style lang="scss" module>
  .button {
    background: none;
    border: 2px solid $color-secondary;
    border-radius: 2px;
    color: $color-secondary;
    cursor: pointer;
    display: block;
    font-family: inherit;
    font-size: $font-size-md;
    font-weight: 700;
    padding: 1.25rem 1.5rem;
    text-transform: uppercase;
    transition: all $duration-animation-base;

    &:disabled {
      cursor: not-allowed;
      opacity: 0.9;
    }

    &:not(:disabled) {
      &:focus,
      &:hover,
      &:active {
          background-color: $color-secondary;
          color: $color-primary-light;
      }
    }
  }
</style>
