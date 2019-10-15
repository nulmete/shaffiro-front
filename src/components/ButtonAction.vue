<template>
  <button
    :class="$style.button"
    @click="doAction"
  >
    <span>{{ action }}</span>
  </button>
</template>

<script>
export default {
  props: {
    obj: {
      type: Object,
      required: true
    },
    param: {
      type: String,
      required: true
    },
    action: {
      type: String,
      required: true
    },
    path: {
      type: String,
      required: true
    }
  },
  methods: {
    doAction () {
      console.log(this.$route)
      console.log(this.path)
      console.log(this.action)
      console.log(this.obj[this.param])
      this.$router.push({ path: `${this.path}/${this.action}/${this.obj[this.param]}` })
    }
  }
}
</script>

<style lang="scss" module>
  .button {
    background-color: #4e87b9;
    border: none;
    border-radius: $size-border-radius;
    color: $color-primary-light;
    cursor: pointer;
    font-family: inherit;
    font-size: 90%;
    height: 100%;
    padding: .25rem .5rem;
    flex: 1 1 0;
  }
</style>
