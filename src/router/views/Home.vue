<template>
  <div class="home">
    <h1>Home</h1>

    <h2>Modo: {{ modo }}</h2>
  </div>
</template>

<script>
export default {
  data () {
    return {
      modo: process.env.VUE_APP_MODO
    }
  }
}
</script>

<style lang="scss" scoped>
  .home {
    flex: 1;
    display: flex;
    flex-direction: column;
  }
</style>
