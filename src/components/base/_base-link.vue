<template>
  <a
    v-if="href"
    :href="href"
    v-bind="$attrs"
  >
    <slot />
  </a>
  <router-link
    v-else
    :to="routerLinkTo"
    v-bind="$attrs"
  >
    <slot />
  </router-link>
</template>

<script>
export default {
  name: 'BaseLink',
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
    },
    name: {
      type: String,
      default: ''
    },
    params: {
      type: Object,
      default: () => ({})
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
