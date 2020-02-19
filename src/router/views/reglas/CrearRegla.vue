<template>
  <div class="auth container">
    <h2 class="heading-secondary text-center margin-bottom-medium">
      Crear regla
    </h2>

    <form
      class="form"
      @submit.prevent="crearRegla"
    >
      <div class="form__group">
        <label
          class="form__label"
          for="nombre"
        >Nombre</label>
        <BaseInput
          id="nombre"
          v-model="nombre"
          class="form__input"
        />
      </div>

      <div class="form__group">
        <label class="form__label">Dispositivo asociado</label>
        <BaseInputSelect
          v-model="dispositivoAsociado"
          :options="sensores"
          :options-labels="sensoresLabels"
        />
      </div>

      <div class="form__group">
        <label class="form__label">Unidad</label>
        <BaseInputSelect
          v-model="unidad"
          :options="unidadesPosibles"
        />
      </div>

      <div class="form__group">
        <label class="form__label">Operador</label>
        <BaseInputSelect
          v-model="operador"
          :options="operadoresPosibles"
        />
      </div>

      <div class="form__group">
        <label
          class="form__label"
          for="valor"
        >Valor</label>
        <BaseInput
          id="valor"
          v-model="valor"
          type="number"
          class="form__input"
        />
      </div>

      <BaseButton type="submit">
        Crear regla
      </BaseButton>
    </form>
  </div>
</template>

<script>
import axios from 'axios'
import store from '@/store/store'

export default {
  beforeRouteEnter (to, from, next) {
    store.dispatch('dispositivos/getAllDispositivos').then(res => next())
  },
  beforeRouteLeave (to, from, next) {
    this.$store.commit('dispositivos/setAllDispositivos', [])
    next()
  },
  data () {
    return {
      nombre: '',
      dispositivoAsociado: '',
      unidad: '',
      unidadesPosibles: ['CELSIUS', 'LUMENES', 'AMPERE'],
      operador: '',
      operadoresPosibles: ['>', '<', '>=', '<='],
      valor: ''
    }
  },
  computed: {
    sensores () {
      const dispositivos = this.$store.getters['dispositivos/getAllDispositivos']
      return dispositivos.filter(dispositivo => dispositivo.tipo === 'SENSOR')
    },
    sensoresLabels () {
      return this.sensores.map(sensor => `Nombre: ${sensor.nombre}`)
    }
  },
  methods: {
    async crearRegla () {
      const formData = {
        dispositivoId: this.dispositivoAsociado.id,
        nombre: this.nombre,
        operador: this.operador,
        unidad: this.unidad,
        valor: this.valor
      }

      try {
        await axios.post('/api/reglas', formData)
        this.$router.push({ name: 'reglas' })
      } catch (error) {
        // todo
        console.log(error.response)
      }
    }
  }
}
</script>
