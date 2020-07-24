<template>
  <Listado
    :headings="headings"
    :fields="fields"
    :content="dispositivosNoAsociados"
    @selected="selectedItem = $event"
  >
    <template v-slot:heading>
      Dispositivos No Asociados
    </template>

    <template v-slot:buttons>
      <base-button
        :disabled="selectedItem === null"
        @click="asociar(dispositivosNoAsociados[selectedItem])"
      >
        Asociar
      </base-button>
    </template>

    <template v-slot:content="{ row, field }">
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
  </Listado>
</template>

<script>
import Listado from '@/router/views/layouts/Listado'

export default {
  components: {
    Listado
  },
  data () {
    return {
      headings: ['MAC', 'UUID'],
      fields: ['mac', 'uuid'],
      selectedItem: null
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
