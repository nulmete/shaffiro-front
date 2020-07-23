<template>
  <div
    class="card margin-bottom-large"
    :class="[error ? 'error' : 'success']"
  >
    <h3 class="card__heading">
      <slot name="title">
        <template v-if="error">
          Error
        </template>
        <template v-else>
          Éxito
        </template>
      </slot>
    </h3>
    <p>
      <slot name="paragraph" />
    </p>
  </div>
</template>

<script>
export default {
  props: {
    error: {
      type: String,
      required: false,
      default: null
    }
  }
}
</script>

<style lang="scss" scoped>
.card {
  border-radius: $default-border-radius;
  font-size: 1.5rem;
  padding: 2rem 4rem;
  position: relative;
  overflow: hidden;
  box-shadow:
    0 3px 6px rgba($color-primary-dark, 0.16),
    0 3px 6px rgba($color-primary-dark, 0.23);

  &::before {
    content: '';
    position: absolute;
    left: 0;
    top: 0;
    height: 100%;
    width: 4px;
  }

  &__heading {
    margin-bottom: 1rem;
    font-weight: 700;
  }
}

.success {
  background-color: rgba($color-secondary-light, .1);

  &::before {
    background-color: $color-secondary;
  }
}

.error {
  background-color: rgba($color-error-light, .75);

  &::before {
    background-color: $color-error-dark;
  }
}
</style>
