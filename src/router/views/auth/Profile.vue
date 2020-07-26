<template>
  <h2>Perfil</h2>
  <!-- <div class="profile">
    <div class="user-info">
      {{ user }}
    </div>

    <base-link :to="{ name: 'changePassword' }">
      Cambiar contraseña
    </base-link>
  </div> -->
</template>

<script>
export default {
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
