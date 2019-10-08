<template>
  <a
    v-if="href"
    :href="href"
    v-bind="$attrs"
  >
    <slot />
  </a>
  <RouterLink
    v-else
    :to="to"
    v-bind="$attrs"
    :class="$style.link"
  >
    <slot />
  </RouterLink>
</template>

<script>
export default {
  inheritAttrs: false,
  props: {
    href: {
      type: String,
      default: ''
    },
    to: {
      type: Object,
      default: null
    }
  }
}
</script>

<style lang="scss" module>
  .link {
    &:link,
    &:visited {
        color: $color-secondary;
    }

    &:hover,
    &:active {
        color: darken($color-secondary, 6);
    }
  }
</style>
