<template>
  <List
    :data="dispositivos"
    :fields="fields"
    :actions="actions"
    @child-clicked="detectar"
  >
    <template v-slot:header>
      ABM de dispositivos
    </template>

    <template v-slot:button>
      Detectar dispositivos
    </template>
  </List>
</template>

<script>
import List from '@/components/List'

export default {
  components: { List },
  data () {
    return {
      fields: ['id', 'nombre', 'tipo', 'activo', 'configuracion', 'regla'],
      actions: [
        {
          name: 'editar',
          param: 'id'
        },
        {
          name: 'habilitar/deshabilitar',
          param: 'id'
        },
        {
          name: 'dar de baja',
          param: 'id'
        }
      ]
    }
  },
  computed: {
    dispositivos () {
      return this.$store.getters['dispositivos/getAllDispositivos']
    }
  },
  created () {
    this.$store.dispatch('dispositivos/getAllDispositivos')
  },
  methods: {
    detectar () {
      this.$router.push({ name: 'detectarDispositivos' })
    }
  }
}
</script>
