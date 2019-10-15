<template>
  <Layout>
    <div class="profile">
      <div class="user-info">
        {{ user }}
      </div>

      <BaseLink :to="{ name: 'changePassword' }">
        Cambiar contraseña
      </BaseLink>
    </div>
  </Layout>
</template>

<script>
import Layout from '@/router/layouts/main'

export default {
  components: { Layout },
  props: {
    currentUser: {
      type: Object,
      required: true
    }
  },
  data () {
    return {
      user: this.currentUser.user
    }
  }
}
</script>

<style lang="scss" scoped>
  .profile {
    flex: 1;
    display: flex;
    flex-direction: column;
  }

  // test
  .user-info {
    text-align: center;
    margin-bottom: 3.5rem;
  }
  .form-wrapper__link {
    font-size: 1.5rem;
  }
</style>
