<template>
  <button
    :class="['btn', active ? 'btn--disable' : 'btn--enable']"
    v-on="$listeners"
  >
    {{ text }}
  </button>
</template>

<script>
export default {
  props: {
    active: {
      type: Boolean,
      required: true
    }
  },
  computed: {
    text () {
      return this.active ? 'Deshabilitar' : 'Habilitar'
    }
  }
}
</script>
