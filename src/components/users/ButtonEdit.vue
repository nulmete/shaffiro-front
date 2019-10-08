<template>
  <button
    :class="$style.button"
    @click="editUser"
  >
    <span>Editar</span>
  </button>
</template>

<script>
export default {
  props: {
    user: {
      type: Object,
      required: true
    }
  },
  methods: {
    editUser () {
      this.$store.commit('users/setUserBeingEdited', this.user)
      this.$router.push({ name: 'edit', params: { user: this.user.login } })
    }
  }
}
</script>

<style lang="scss" module>
  .button {
    background-color: #4e87b9;
    border: none;
    border-radius: 2px;
    color: $color-primary-light;
    cursor: pointer;
    font-family: inherit;
    font-size: 90%;
    height: 100%;
    padding: .25rem .5rem;
  }
</style>
