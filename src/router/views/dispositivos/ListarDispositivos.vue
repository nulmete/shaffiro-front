<template>
  <Listado
    :headings="headings"
    :fields="fields"
    :content="dispositivosFiltrados"
    :search-prop="search"
    @searched="search = $event"
  >
    <template v-slot:heading>
      Dispositivos
    </template>

    <template v-slot:buttons>
      <BaseButton
        type="button"
        @click="detectar"
      >
        Detectar dispositivos
      </BaseButton>

      <BaseButton
        :disabled="selectedItem === null"
        type="button"
        @click="editar(dispositivos[selectedItem])"
      >
        Editar
      </BaseButton>
    </template>

    <template v-slot:radio-button="{ index }">
      <div class="radio">
        <input
          :id="index"
          v-model="selectedItem"
          name="radio"
          :value="index"
          type="radio"
          class="radio__input"
        >
        <label
          class="radio__label"
          :for="index"
        >
          <span class="radio__btn" />
        </label>
      </div>
    </template>

    <template v-slot:content="{ row, field, index }">
      <template v-if="Array.isArray(row[field])">
        <div
          v-for="(value, index) in row[field]"
          :key="index"
        >
          {{ value }}
          <!-- <template v-if="field === 'reglasParseadas'">
            <span class="margin-right-small">
              {{ value }}
            </span> -->
          <!-- <button
              class="btn btn--small btn--edit"
              @click="editarRegla(row.reglas[index])"
            >
              <svg class="flex-svg">
                <use xlink:href="@/assets/sprite.svg#icon-edit-pencil" />
              </svg>
            </button> -->
          <!-- </template>
          <template v-else>
            {{ value }}
          </template> -->
        </div>
      </template>
      <template v-else-if="field === 'activo'">
        <span
          :class="[row[field] === 'Deshabilitado' ? 'disabled' : 'enabled']"
          @click="modificarEstado(dispositivos[index])"
        >
          {{ row[field] }}
        </span>
      </template>
      <template v-else>
        {{ row[field] }}
      </template>
    </template>
  </Listado>
</template>

<script>
import Listado from '@/router/views/layouts/Listado'
import { searchFilter } from '@/searchFilter.js'

export default {
  components: {
    Listado
  },
  data () {
    return {
      headings: ['Nombre', 'Tipo', 'Estado', 'Reglas'],
      fields: ['nombre', 'tipo', 'activo', 'reglasParseadas'],
      search: '',
      selectedItem: null
    }
  },
  computed: {
    dispositivos () {
      return this.$store.getters['dispositivos/getAllDispositivos']
    },
    dispositivosToSpanish () {
      const props = this.dispositivos.map(dispositivo => {
        const filtered = Object.keys(dispositivo)
          .filter(key => ['activo', 'reglas'].includes(key))
          .reduce((obj, key) => {
            return {
              ...obj,
              [key]: dispositivo[key]
            }
          }, {})

        return filtered
      })

      const activo = props.map(prop => prop.activo ? 'Habilitado' : 'Deshabilitado')

      const regla = props.map(prop => {
        return prop.reglas.map(innerProp => {
          return `
            Si ${this.findMagnitud(innerProp.unidad)} ${innerProp.operador} ${innerProp.valor} ${innerProp.unidad}
            -> Encender Actuador_1
          `
        })
      })

      const dispositivos = this.dispositivos.map((el, index) => {
        return { ...el, activo: activo[index], reglasParseadas: regla[index] }
      })

      return dispositivos
    },
    dispositivosFiltrados () {
      return searchFilter(this.search, this.dispositivosToSpanish)
    }
  },
  created () {
    this.$store.dispatch('dispositivos/getAllDispositivos')
  },
  methods: {
    detectar () {
      this.$router.push({ name: 'detectarDispositivos' })
    },
    editar (dispositivo) {
      this.$store.commit('dispositivos/setDispositivoActual', dispositivo)
      this.$router.push({ name: 'editarDispositivo', params: { identificador: dispositivo.id.toString() } })
    },
    async modificarEstado (dispositivo) {
      const dispositivoModificado = { ...dispositivo, activo: !dispositivo.activo }

      try {
        await this.$store.dispatch(`dispositivos/modificarEstado`, dispositivoModificado)
      } catch (error) {
        console.log(error)
      }
    },
    findMagnitud (unidad) {
      switch (unidad) {
        case 'CELSIUS':
          return 'Temperatura'
        case 'AMPERES':
          return 'Intensidad de corriente'
        case 'LUMENES':
          return 'Flujo luminoso'
      }
    },
    editarRegla (regla) {
      this.$store.commit('reglas/setReglaActual', { ...regla, dispositivoId: regla.dispositivo.id })
      this.$router.push({ name: 'editarRegla', params: { identificador: regla.id.toString() } })
    }
  }
}
</script>

<style lang="scss" scoped>
//   .flex-cell {
//     display: flex;
//     align-items: center;

//     &:not(:last-child) {
//       margin-bottom: 1rem;
//     }
//   }

//   .flex-svg {
//     display: block;
//     width: 1rem;
//     height: 1rem;
//     fill: #fff;
//   }
</style>
