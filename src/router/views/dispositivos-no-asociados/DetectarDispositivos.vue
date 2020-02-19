<template>
  <div class="list-wrapper container">
    <h2 class="heading-secondary margin-bottom-medium">
      Dispositivos no asociados
    </h2>

    <List
      :headings="headings"
      :fields="fields"
      :content="dispositivosNoAsociados"
    >
      <template v-slot:body="{ row, field }">
        <template v-if="Array.isArray(row[field])">
          <div
            v-for="(value, index) in row[field]"
            :key="index"
          >
            {{ value }}
          </div>
        </template>
        <template v-else>
          {{ row[field] }}
        </template>
      </template>
      <template v-slot:buttons="{ index }">
        <ListButtonEdit @click="asociar(dispositivosNoAsociados[index])">
          Asociar
        </ListButtonEdit>
      </template>
    </List>
  </div>
</template>

<script>
import List from '@/components/List'
import ListButtonEdit from '@/components/ListButtonEdit'

export default {
  components: {
    List,
    ListButtonEdit
  },
  data () {
    return {
      headings: ['MAC', 'UUID', 'Acciones'],
      fields: ['mac', 'uuid']
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
