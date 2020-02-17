<template>
  <div class="list-wrapper container">
    <h2 class="heading-secondary margin-bottom-medium">ABM de dispositivos</h2>

    <div class="flex-container margin-bottom-medium">
      <BaseFilter v-model="search" />

      <BaseButton type="button" @click="detectar">
        Detectar dispositivos
      </BaseButton>
    </div>

    <List :fields="fields" :content="dispositivosFiltrados">
      <template v-slot:body="{ row, field }">
        <ListItem :row="row" :field="field" />
      </template>
      <template v-slot:botones="{ index }">
        <ListButtonEdit @click="editar(dispositivos[index])">Editar</ListButtonEdit>
        <ListButtonToggle @click="modificarEstado(dispositivos[index])" :active="dispositivos[index].activo">
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
import ListItem from '@/components/ListItem'
import ListButtonEdit from '@/components/ListButtonEdit'
import ListButtonToggle from '@/components/ListButtonToggle'

export default {
  components: {
    List,
    ListItem,
    ListButtonEdit,
    ListButtonToggle
  },
  data () {
    return {
      fields: ['nombre', 'tipo', 'activo', 'reglas'],
      search: ''
    }
  },
  computed: {
    dispositivos () {
      return this.$store.getters['dispositivos/getAllDispositivos']
    },
    dispositivosTraducidos () {
      const props = this.dispositivos.map(dispositivo => {
        const filtered = Object.keys(dispositivo)
          .filter(key => ['activo'].includes(key))
          .reduce((obj, key) => {
            return {
              ...obj,
              [key]: dispositivo[key]
            }
          }, {})

        return filtered
      })

      const activo = props.map(prop => prop.activo ? 'Habilitado' : 'Deshabilitado')

      const dispositivos = this.dispositivos.map((el, index) => {
        return { ...el, activo: activo[index] }
      })

      return dispositivos
    },
    dispositivosFiltrados () {
      const lowerCaseSearch = this.search.toLowerCase().trim()

      return this.dispositivosTraducidos.filter(element => {
        return Object.values(element).some(value => {
          return String(value).toLowerCase().includes(lowerCaseSearch)
        })
      })
    }
  },
  created () {
    this.$store.dispatch('dispositivos/getAllDispositivos')
  },
  beforeRouteLeave (to, from, next) {
    this.$store.commit('dispositivos/setAllDispositivos', [])
    next()
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
    }
  }
}
</script>
