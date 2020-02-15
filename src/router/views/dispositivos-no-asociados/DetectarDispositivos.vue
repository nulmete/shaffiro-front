<template>
  <List
    :campos="campos"
    :contenido="dispositivosNoAsociados"
  >
    <template v-slot:titulo>
      Dispositivos detectados
    </template>
    <!-- <template v-slot:crear>
      <BaseButton @click="detectar">
        Detectar dispositivo
      </BaseButton>
    </template> -->
    <template v-slot:botones="{ index }">
      <!-- <ButtonEdit
        @click="asociar(dispositivosNoAsociados[index])"
      >
        Asociar
      </ButtonEdit> -->
      <!-- <ButtonModify
        :activo="dispositivos[index].activo"
        @click="modificarEstado(dispositivos[index])"
      /> -->
    </template>
  </List>
</template>

<script>
import List from '@/components/List'
// import ButtonEdit from '@/components/ButtonEdit'

export default {
  components: { List },
  data () {
    return {
      // campos: ['ID', 'MAC', 'UUID', 'Acciones'],
      campos: ['ID', 'MAC', 'UUID', 'Acciones']
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
    asociar (dispositivo) {
      this.$store.commit('dispositivosNoAsociados/setDispositivoNoAsociadoActual', dispositivo)
      this.$router.push({ name: 'asociarDispositivo', params: { identificador: dispositivo.id.toString() } })
    }
  }
}
</script>

<style lang="scss" module>

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
