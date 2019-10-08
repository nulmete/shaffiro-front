<template>
  <div :class="$style['table-container']">
    <table :class="$style.table">
      <thead>
        <tr>
          <slot name="header" />
        </tr>
      </thead>
      <tbody>
        <slot name="body" />
      </tbody>
    </table>
  </div>
</template>

<style lang="scss" module>
  .table-container {
    overflow-x: auto;
    box-shadow: 0 3px 6px rgba($color-primary-dark, 0.16), 0 3px 6px rgba($color-primary-dark, 0.23);
  }

  .table {
    border-collapse: collapse;
    border-radius: 4px;
    font-size: 1.4rem;
    overflow: hidden;
    width: 100%;
  }
</style>
