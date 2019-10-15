<template>
  <List
    :data="dispositivosNoAsociados"
    :fields="fields"
    :actions="actions"
  >
    <template v-slot:header>
      Dispositivos no asociados
    </template>
  </List>
</template>

<script>
import List from '@/components/List'

export default {
  components: { List },
  data () {
    return {
      fields: ['id', 'mac', 'uuid'],
      actions: [
        {
          name: 'asociar',
          param: 'id'
        }
      ]
    }
  },
  computed: {
    dispositivosNoAsociados () {
      return this.$store.getters['dispositivosNoAsociados/getAllDispositivosNoAsociados']
    }
  },
  created () {
    this.$store.dispatch('dispositivosNoAsociados/getAllDispositivosNoAsociados')
  },
  methods: {
    asociar () {
      this.$router.push({ name: 'asociarDispositivo' })
    }
  }
}
</script>

<style lang="scss" module>
  .heading {
    @include heading(left);
  }

  .wrap {
    display: flex;
    width: 100%;
    margin-bottom: 2rem;

    > input {
      flex-basis: 75%;
    }
  }

  @media screen and (max-width: 43.75em) {
    // 700px
    .wrap input {
      flex-basis: 65%;
    }
  }
</style>
