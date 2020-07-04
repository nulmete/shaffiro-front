<template>
  <Listado
    :headings="headings"
    :fields="fields"
    :content="dispositivosNoAsociados"
  >
    <template v-slot:heading>
      Dispositivos No Asociados
    </template>

    <template v-slot:buttons>
      <BaseButton
        :disabled="selectedItem === null"
        type="button"
        @click="asociar(dispositivosNoAsociados[selectedItem])"
      >
        Asociar
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
  <!-- <div class="list-wrapper container">
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
  </div> -->
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
