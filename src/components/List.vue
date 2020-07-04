<template>
  <div class="list-container">
    <table class="list">
      <thead class="list__head">
        <tr>
          <!-- Primer columna para radio button -->
          <th class="list__heading list__heading--radio">
            &nbsp;
          </th>
          <th
            v-for="(heading, index) in headings"
            :key="index"
            class="list__heading"
          >
            {{ heading }}
          </th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="(row, index) in content"
          :key="index"
          class="list__row"
        >
          <td class="list__cell list__cell--buttons">
            <slot
              name="buttons"
              :index="index"
            />
          </td>
          <td
            v-for="(field, prop) in fields"
            :key="prop"
            class="list__cell"
          >
            <slot
              name="body"
              :row="row"
              :field="field"
            />
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
export default {
  props: {
    headings: {
      type: Array,
      required: true
    },
    fields: {
      type: Array,
      required: true
    },
    content: {
      type: Array,
      required: true
    }
  }
}
</script>

<style lang="scss">
  .list-container {
    overflow-x: auto;
    box-shadow:
      0 3px 6px rgba($color-primary-dark, 0.16),
      0 3px 6px rgba($color-primary-dark, 0.23);
  }

  .list {
    border-collapse: collapse;
    border-radius: $default-border-radius;
    font-size: 1.5rem;
    overflow: hidden;
    width: 100%;

    &__head {
      background-color: $color-secondary;
      color: $color-primary-light;
    }

    &__heading {
      font-weight: 400;
      padding: 1rem;
      text-align: left;
      text-transform: capitalize;

      &--radio {
        width: 1rem;
        padding: 1rem 0;
      }
    }

    &__row:hover {
      background-color: darken($color-primary-light, 5);
    }

    &__cell {
      padding: 1rem;

      &--buttons {
        padding: 1rem 2rem;
      }
    }
  }
</style>
