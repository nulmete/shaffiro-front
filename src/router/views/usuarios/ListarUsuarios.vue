<template>
  <List
    :data="usuarios"
    :fields="fields"
    :actions="actions"
    @child-clicked="crear"
  >
    <template v-slot:header>
      ABM de usuarios
    </template>

    <template v-slot:button>
      Crear usuario
    </template>
  </List>
</template>

<script>
import List from '@/components/List'

export default {
  components: { List },
  data () {
    return {
      fields: ['id', 'login', 'email', 'activated', 'authorities'],
      actions: [
        {
          name: 'editar',
          param: 'login'
        }
      ]
    }
  },
  computed: {
    usuarios () {
      return this.$store.getters['users/getAllUsers'](this.fields)
    }
  },
  created () {
    this.$store.dispatch('users/getAllUsers')
  },
  methods: {
    crear () {
      this.$router.push({ name: 'crearUsuario' })
    }
  }
}
</script>
