<template>
  <div class="listado container">
    <!-- Heading -->
    <h2 class="listado__heading margin-bottom-medium">
      Listado de <slot name="heading" />
    </h2>

    <!-- Filtro de búsqueda -->
    <input
      v-if="searchProp"
      :value="searchProp"
      class="listado__filter margin-bottom-medium"
      type="text"
      placeholder="Buscar..."
      @input="$emit('searched', $event.target.value)"
    >

    <!-- Botones -->
    <div class="listado__buttons margin-bottom-small">
      <slot name="buttons" />
    </div>

    <!-- Listado de cosas -->
    <div class="listado__table-container">
      <table class="table">
        <thead class="table__head">
          <tr>
            <!-- Primer columna para radio button -->
            <th class="table__heading table__heading--radio">
              &nbsp;
            </th>
            <th
              v-for="(heading, index) in headings"
              :key="index"
              class="table__heading"
            >
              {{ heading }}
            </th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="(row, index) in content"
            :key="index"
            class="table__row"
          >
            <!-- Primera celda para radio button -->
            <td class="table__cell table__cell--radio">
              <slot
                name="radio-button"
                :index="index"
              />
            </td>
            <td
              v-for="(field, prop) in fields"
              :key="prop"
              class="table__cell"
            >
              <slot
                name="content"
                :index="index"
                :row="row"
                :field="field"
              />
            </td>
          </tr>
        </tbody>
      </table>
    </div>
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
    },
    searchProp: {
      type: String,
      required: false,
      default: ''
    }
  },
  data () {
    return {
      search: ''
    }
  }
}
</script>

<style lang="scss" scoped>
  .listado {
    padding: 3rem 0;

    &__heading {
      font-size: 3rem;
      font-weight: 700;
    }

    &__filter {
      background-color: $color-primary-light;
      border: 1px solid $color-primary-medium;
      border-radius: $default-border-radius;
      color: darken($color-primary-medium, 25%);
      display: block;
      font-family: inherit;
      font-size: 1.5rem;
      padding: 1rem;
      width: 100%;
      transition: all .2s;

      &:focus {
        background-color: #fff;
        color: $color-primary-dark;
        outline: none;

        &::placeholder {
          color: transparent;
        }
      }
    }

    &__buttons {
      display: flex;

      & > *:not(:last-child) {
        margin-right: 1rem;
      }
    }

    &__table-container {
      overflow-x: auto;
      box-shadow:
        0 3px 6px rgba($color-primary-dark, 0.16),
        0 3px 6px rgba($color-primary-dark, 0.23);
    }
  }

  .table {
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

      &--radio {
        padding: 1rem 2rem;
      }
    }
  }
</style>
