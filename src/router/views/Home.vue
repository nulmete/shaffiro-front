<template>
  <Layout>
    <h1>Home</h1>
  </Layout>
</template>

<script>
import Layout from '@/router/layouts/main'
export default {
  components: { Layout },
  data () {
    return {
      // modo: process.env.VUE_APP_MODO
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
