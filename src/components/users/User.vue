<template>
  <tr :class="[$style.row, user.activated ? '' : $style.disabled]">
    <td
      v-for="(value, key, index) in user"
      :key="index"
      :class="$style.cell"
    >
      <div :class="$style['cell__content']">
        <template v-if="Array.isArray(value)">
          <div
            v-for="(nestedValue, nestedIndex) in value"
            :key="nestedIndex"
          >
            {{ nestedValue | authorityFilter(key) }}
          </div>
        </template>
        <template v-else>
          {{ value | activatedFilter(key) }}
        </template>
      </div>
    </td>
    <td :class="$style.cell">
      <div :class="$style['cell__content']">
        <ButtonEdit :user="user" />
      </div>
    </td>
  </tr>
</template>

<script>
import ButtonEdit from './ButtonEdit'

export default {
  components: { ButtonEdit },
  props: {
    user: {
      type: Object,
      required: true
    }
  }
}
</script>

<style lang="scss" module>
  .row:hover {
    background-color: darken($color-primary-light, 5);
  }

  .cell {
    height: 7rem;
    padding: 1.25rem;

    &__content {
      height: 100%;
    }
  }

  .disabled {
    background-color: $color-primary-medium;
    color: lighten($color-primary-dark, 30);
  }
</style>
