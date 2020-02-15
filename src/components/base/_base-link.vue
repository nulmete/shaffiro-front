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
    :to="routerLinkTo"
    v-bind="$attrs"
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
      required: false,
      default: ''
    },
    to: {
      type: Object,
      required: false,
      default: null
    }
  },
  computed: {
    routerLinkTo ({ name, params }) {
      return {
        name,
        params,
        ...(this.to || {})
      }
    }
  }
}
</script>
