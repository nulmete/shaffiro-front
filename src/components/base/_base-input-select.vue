<template>
  <label :class="$style.label">
    {{ label }}
    <select
      v-model="selectedOptions"
      :class="$style.select"
      :multiple="multiple"
      @change="$emit('change', selectedOptions)"
    >
      <option
        v-for="(option, index) in options"
        :key="index"
        :class="$style.option"
        :value="option"
      >
        {{ option }}
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
      type: [Array, String],
      required: true
    },
    options: {
      type: Array,
      required: true
    },
    label: {
      type: String,
      required: true
    },
    multiple: {
      type: Boolean,
      default: false
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
    @extend %font-input-label;
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
