<template>
  <div :class="$style.form">
    <slot />
  </div>
</template>

<style lang="scss" module>
  .form {
    margin: 0 auto;
    width: 60%;

    @media screen and (max-width: 43.75em) {
      // 700px
      width: 85%;
    }
  }
</style>
