<template>
  <label :class="$style.label">
    {{ label }}
    <select
      v-model="selectedOptions"
      :class="$style.select"
      multiple
      @change="$emit('change', selectedOptions)"
    >
      <option
        v-for="(option, index) in options"
        :key="index"
        :class="$style.option"
        :value="option"
      >
        {{ option | authorityFilter }}
      </option>
    </select>
  </label>
</template>

<script>
export default {
  inheritAttrs: false,
  model: {
    event: 'change'
  },
  props: {
    value: {
      type: Array,
      required: true
    },
    options: {
      type: Array,
      required: true
    },
    label: {
      type: String,
      required: true
    }
  },
  data () {
    return {
      selectedOptions: this.value
    }
  }
}
</script>

<style lang="scss" module>
  .label {
    font-size: $font-size-lg;
  }

  .select {
    display: block;
    font-family: inherit;
    width: 100%;
  }

  .option {
    padding: .5rem;
  }
</style>
