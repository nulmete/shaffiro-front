<template>
  <div class="auth container">
    <h2 class="auth__heading">
      <slot name="heading" />
    </h2>
    <slot />
    <p class="auth__footer">
      <slot name="footer" />
    </p>
  </div>
</template>

<style lang="scss" scoped>
  .auth {
    padding: 3rem 0;
    width: 40vw;

    &__heading {
      font-size: 3rem;
      font-weight: 700;
      text-align: center;
      margin-bottom: 3rem;
    }

    &__footer {
    margin-top: 1rem;
    text-align: center;
    font-size: 1.4rem;

      a {
        color: $color-secondary;
        font-weight: 700;
      }
    }
  }
</style>
