<template>
  <div class="table-container">
    <table class="table">
      <thead>
        <tr>
          <th v-for="(field, index) in fields" :key="index" class="table-heading">
            {{ field | headingsFilter }}
          </th>
          <th class="table-heading">
            Acciones
          </th>
        </tr>
      </thead>
      <tbody>
        <!-- row = objeto -->
        <!-- field = propiedad del objeto -->
        <!-- prop = indice de la propiedad del objeto -->
        <tr v-for="(row, index) in content" :key="index" class="table-row">
          <td v-for="(field, prop) in fields" :key="prop" class="table-cell">
            <slot name="body" :row="row" :field="field" />
          </td>
          <td class="table-cell">
            <div class="buttons-container">
              <slot name="botones" :index="index" />
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

<style lang="scss" scoped>
  .table-container {
    overflow-x: auto;
    box-shadow:
      0 3px 6px rgba($color-primary-dark, 0.16),
      0 3px 6px rgba($color-primary-dark, 0.23);
  }

  .table {
    border-collapse: collapse;
    border-radius: $default-border-radius;
    font-size: 1.5rem;
    overflow: hidden;
    width: 100%;

    &-heading {
      background-color: $color-secondary;
      color: $color-primary-light;
      font-weight: 400;
      padding: 1rem;
      text-align: left;
    }

    &-row:hover {
      background-color: darken($color-primary-light, 5);
    }

    &-cell {
      height: 7rem;
      padding: 1rem;
    }
  }

  .buttons-container {
    display: flex;
  }

  .btn {
    display: block;
    border: none;
    border-radius: 2px;
    color: #fff;
    cursor: pointer;
    font-family: inherit;
    font-size: inherit;
    flex: 1;
    padding: 1rem .5rem;

    &--edit {
      background-color: #3949ab;
    }

    &--enable {
      background-color: $color-secondary;
    }

    &--disable {
      background-color: #c62828;
    }
  }
</style>
