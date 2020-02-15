<template>
  <List
    :campos="campos"
    :contenido="reglas"
  >
    <template v-slot:titulo>
      ABM de reglas
    </template>
    <template v-slot:crear>
      <BaseButton @click="crear">
        Crear regla
      </BaseButton>
    </template>
    <template v-slot:botones="{ index }">
      <!-- <ButtonEdit
        @click="editar(reglas[index])"
      />
      <ButtonDelete
        @click="eliminar(reglas[index])"
      /> -->
      <!-- <ButtonModify
        :activo="reglas[index].activo"
        @click="modificarEstado(reglas[index])"
      /> -->
    </template>
  </List>
</template>

<script>
// import ButtonEdit from '@/components/ButtonEdit'
// import ButtonDelete from '@/components/ButtonDelete'
// import ButtonModify from '@/components/ButtonModify'
import List from '@/components/List'

export default {
  components: { List },
  data () {
    return {
      campos: ['ID', 'Nombre', 'Lógica', 'Acciones']
    }
  },
  computed: {
    reglas () {
      return this.$store.getters['reglas/getAllReglas']
    }
  },
  created () {
    this.$store.dispatch('reglas/getAllReglas')
  },
  beforeRouteLeave (to, from, next) {
    this.$store.commit('reglas/setAllReglas', [])
    next()
  },
  methods: {
    crear () {
      this.$router.push({ name: 'crearRegla' })
    },
    editar (regla) {
      this.$store.commit('reglas/setReglaActual', regla)
      this.$router.push({ name: 'editarRegla', params: { identificador: regla.id.toString() } })
    },
    eliminar (regla) {
      this.$store.dispatch('reglas/darDeBaja', regla)
    }
    // async modificarEstado (dispositivo) {
    //   const dispositivoModificado = { ...dispositivo, activo: !dispositivo.activo }

    //   try {
    //     await this.$store.dispatch(`reglas/modificarEstado`, dispositivoModificado)
    //   } catch (error) {
    //     console.log(error)
    //   }
    // }
  }
}
</script>
