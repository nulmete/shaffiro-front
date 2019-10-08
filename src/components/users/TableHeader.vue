<script>
export default {
  functional: true,
  render (createElement, { props, $style = {} }) {
    return createElement(
      'th',
      {
        class: $style['title']
      },
      props.title
    )
  }
}
</script>

<style lang="scss" module>
  .title {
    background-color: $color-secondary;
    color: $color-primary-light;
    font-weight: 400;
    padding: 1.25rem;
    text-align: left;
  }
</style>
