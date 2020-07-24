<template>
  <div class="backdrop" />
</template>

<script>
export default {
  name: 'Backdrop'
}
</script>

<style lang="scss" scoped>
  .backdrop {
    width: 100%;
    height: 100vh;
    background: rgba(0, 0, 0, 0.75);
    z-index: 100;
    position: fixed;
    left: 0;
    top: 0;
    transition: opacity .3s ease-out;
    opacity: 1;
  }
</style>
