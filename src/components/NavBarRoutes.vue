<script>
export default {
  functional: true,
  render (h, { props, $style = {} }) {
    // Obtener título de la ruta
    function getRouteTitle (route) {
      return typeof route.title === 'function' ? route.title() : route.title
    }

    // Array de: <li><a>Título de la ruta</a></li>
    return props.routes.map(route =>
      <BaseLink
        tag="li"
        key={ route.name }
        to={ route }
        exact-active-class={ $style.active }
      >
        <a class={ $style['nav-link'] }>
          { getRouteTitle(route) }
        </a>
      </BaseLink>
    )
  }
}
</script>

<style lang="scss" module>
  .nav-link {
    &:link,
    &:visited {
      color: $color-primary-light;
    }

    &:hover,
    &:active {
      color: $color-secondary-light;
    }
  }

  .active > .nav-link {
    color: $color-secondary-light;
  }
</style>
