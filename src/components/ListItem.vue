<template>
  <div class="item">
    <template v-if="Array.isArray(row[field])">
      <!-- <div v-if="isObject(row[field])">
        {{ row[field] }}
      </div> -->
      <span v-for="(value, index) in row[field]" :key="index">
        <template v-if="isObject(value)">
          {{ parseRegla(value) }}<br>
        </template>
        <template v-else>
          {{ value }}
        </template>
      </span>
    </template>
    <template v-else>
      {{ row[field] }}
    </template>
  </div>
</template>

<script>
export default {
  props: {
    row: {
      type: Object,
      required: true
    },
    field: {
      type: String,
      required: true
    }
  },
  methods: {
    isObject (value) {
      const type = typeof value
      return type === 'function' || type === 'object' && !!value
    },
    parseRegla (value) {
      const keys = Object.keys(value)
      const values = Object.values(value)

      // buscar index de la propiedad 'unidad'
      const indexUnidad = keys.indexOf('unidad')
      const indexOperador = keys.indexOf('operador')
      const indexValor = keys.indexOf('valor')

      let magnitud

      switch (values[indexUnidad]) {
        case 'CELSIUS':
          magnitud = 'Temperatura'
          break
        case 'AMPERES':
          magnitud = 'Intensidad de corriente'
          break
        case 'LUMENES':
          magnitud = 'Intensidad lumínica'
          break
      }

      // magnitud operador valor unidad
      return `${magnitud} ${values[indexOperador]} ${values[indexValor]} ${values[indexUnidad]}`
    }
  }
}
</script>
