<template>
  <!--
  Using the $listeners property, you can forward all event listeners on the component
  to a specific child element with v-on="$listeners"
  https://vuejs.org/v2/guide/components-custom-events.html#Binding-Native-Events-to-Components
  -->
  <form v-on="$listeners">
    <slot />
  </form>
</template>
