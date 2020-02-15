<template>
  <div class="item">
    <template v-if="Array.isArray(row[field])">
      <div v-for="(value, index) in row[field]" :key="index">
        {{ value }}
      </div>
    </template>
    <template v-else>
      {{ row[field] }}
    </template>
  </div>
</template>

<script>
export default {
  props: {
    row: {
      type: Object,
      required: true
    },
    field: {
      type: String,
      required: true
    }
  }
}
</script>
