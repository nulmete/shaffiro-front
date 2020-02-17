<template>
  <div class="list-wrapper container">
    <h2 class="heading-secondary margin-bottom-medium">Dispositivos no asociados</h2>

    <List :fields="fields" :content="dispositivosNoAsociados">
      <template v-slot:body="{ row, field }">
        <ListItem :row="row" :field="field" />
      </template>
      <template v-slot:botones="{ index }">
        <ListButtonEdit @click="asociar(dispositivosNoAsociados[index])">Asociar</ListButtonEdit>
      </template>
    </List>
  </div>
</template>

<script>
import List from '@/components/List'
import ListItem from '@/components/ListItem'
import ListButtonEdit from '@/components/ListButtonEdit'

export default {
  components: {
    List,
    ListItem,
    ListButtonEdit
  },
  data () {
    return {
      fields: ['id', 'mac', 'uuid']
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
