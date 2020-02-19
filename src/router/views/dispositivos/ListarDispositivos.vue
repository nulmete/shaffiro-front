<template>
  <div class="list-wrapper container">
    <h2 class="heading-secondary margin-bottom-medium">
      ABM de dispositivos
    </h2>

    <div class="flex-container margin-bottom-medium">
      <BaseFilter v-model="search" />

      <BaseButton
        type="button"
        @click="detectar"
      >
        Detectar dispositivos
      </BaseButton>
    </div>

    <List
      :headings="headings"
      :fields="fields"
      :content="dispositivosFiltrados"
    >
      <template v-slot:body="{ row, field }">
        <template v-if="Array.isArray(row[field])">
          <div
            v-for="(value, index) in row[field]"
            :key="index"
            :class="{ 'flex-cell': field === 'reglasParseadas' }"
          >
            <template v-if="field === 'reglasParseadas'">
              <span class="margin-right-small">
                {{ value }}
              </span>
              <button
                class="btn btn--small btn--edit"
                @click="editarRegla(row.reglas[index])"
              >
                <svg class="flex-svg">
                  <use xlink:href="@/assets/sprite.svg#icon-edit-pencil" />
                </svg>
              </button>
            </template>
            <template v-else>
              {{ value }}
            </template>
          </div>
        </template>
        <template v-else>
          {{ row[field] }}
        </template>
      </template>

      <!-- Slot hardcodeado -->
      <template v-slot:actuadores="{ row, index }">
        <td
          v-if="row.tipo === 'SENSOR'"
          class="list__cell"
        >
          <BaseInputSelect
            v-model="actuadoresElegidos[index]"
            :options="actuadores"
            :options-labels="nombreActuadores"
            @change="elegirActuador"
          />
        </td>
        <td v-else>
          &nbsp;
        </td>
      </template>
      <!-- End slot hardcodeado -->

      <template v-slot:buttons="{ index }">
        <ListButtonEdit @click="editar(dispositivos[index])">
          Editar
        </ListButtonEdit>
        <ListButtonToggle
          :active="dispositivos[index].activo"
          @click="modificarEstado(dispositivos[index])"
        >
          <template v-if="dispositivos[index].activo">
            Deshabilitar
          </template>
          <template v-else>
            Habilitar
          </template>
        </ListButtonToggle>
      </template>
    </List>
  </div>
</template>

<script>
import List from '@/components/List'
import ListButtonEdit from '@/components/ListButtonEdit'
import ListButtonToggle from '@/components/ListButtonToggle'

import { searchFilter } from '@/searchFilter.js'

export default {
  components: {
    List,
    ListButtonEdit,
    ListButtonToggle
  },
  data () {
    return {
      headings: ['Sensor', 'Estado', 'Reglas', 'Actuador', 'Acciones'],
      fields: ['nombre', 'activo', 'reglasParseadas'],
      search: '',
      actuadoresElegidos: JSON.parse(localStorage.getItem('actuadoresElegidos')) || []
    }
  },
  computed: {
    dispositivos () {
      return this.$store.getters['dispositivos/getAllDispositivos']
    },
    actuadores () {
      return this.dispositivos.filter(dispositivo => dispositivo.tipo === 'ACTUADOR')
    },
    nombreActuadores () {
      return this.actuadores.map(actuador => actuador.nombre)
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
            Encender si ${this.findMagnitud(innerProp.unidad)} ${innerProp.operador} ${innerProp.valor} ${innerProp.unidad}
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
    elegirActuador (value) {
      localStorage.setItem('actuadoresElegidos', JSON.stringify(this.actuadoresElegidos))
    },
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
  .flex-cell {
    display: flex;
    align-items: center;

    &:not(:last-child) {
      margin-bottom: 1rem;
    }
  }

  .flex-svg {
    display: block;
    width: 1rem;
    height: 1rem;
    fill: #fff;
  }
</style>
