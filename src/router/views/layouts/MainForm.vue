<template>
  <div class="main-form container">
    <h2 class="heading-secondary text-center main-form__heading">
      <slot name="heading" />
    </h2>
    <p class="main-form__subheading">
      <slot name="paragraph" />
    </p>
    <slot />
    <p class="main-form__footer">
      <slot name="footer" />
    </p>
  </div>
</template>

<style lang="scss" scoped>
  .main-form {
    padding: 3rem 0;
    width: 40vw;

    &__heading {
      margin-bottom: 3.5rem;
    }

    &__subheading {
      font-size: 1.6rem;
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
