<template>
  <div class="form__checkbox-group">
    <input
      :id="id"
      class="form__checkbox-input"
      type="checkbox"
      v-bind="$attrs"
      :checked="value"
      @change="$emit('input', $event.target.checked)"
    >
    <label
      class="form__checkbox-label"
      :for="id"
    >
      <span class="form__checkbox-button" />
      {{ label }}
    </label>
  </div>
</template>

<script>
export default {
  inheritAttrs: false,
  props: {
    value: {
      type: Boolean,
      required: true
    },
    label: {
      type: String,
      required: true
    },
    id: {
      type: String,
      required: true
    }
  }
}
</script>
