<template>
  <div class="list-container">
    <table class="list">
      <thead class="list__head">
        <tr>
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

          <!-- Slot extra para selección de actuadores (hardcodeado) -->
          <slot
            name="actuadores"
            :row="row"
            :index="index"
          />

          <td class="list__cell list__cell--buttons">
            <div>
              <slot
                name="buttons"
                :index="index"
              />
            </div>
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
    }

    &__row:hover {
      background-color: darken($color-primary-light, 5);
    }

    &__cell {
      padding: 1rem;

      &-item {

      }

      &--buttons div {
        display: flex;

        & > * {
          flex: 1;
        }
      }
    }
  }
</style>
