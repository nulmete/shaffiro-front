<template>
  <Auth>
    <template v-slot:heading>
      Editar regla
    </template>

    <form
      class="form"
      @submit.prevent="editarRegla"
    >
      <div class="form__group">
        <label
          class="form__label"
          for="nombre"
        >Nombre de la Regla</label>
        <BaseInput
          id="nombre"
          v-model="nombre"
          :v="$v.nombre"
          class="form__input"
        />
        <span
          v-if="$v.nombre.$dirty && !$v.nombre.required"
          class="input-error"
        >Por favor, ingrese el nombre de la condicion</span>
      </div>

      <div class="form__group">
        <label class="form__label">Sensor asociado</label>
        <BaseInputSelect
          v-model="sensorAsociado"
          :options="sensores"
          :options-labels="sensoresLabels"
        />
      </div>

      <div class="form__group">
        <label class="form__label">Actuador asociado</label>
        <BaseInputSelect
          v-model="actuadorAsociado"
          :options="actuadores"
          :options-labels="actuadoresLabels"
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
          :v="$v.valor"
          class="form__input"
        />
        <span
          v-if="$v.valor.$dirty && !$v.valor.required"
          class="input-error"
        >Por favor, ingrese el valor de la condicion</span>
      </div>

      <BaseButton
        :disabled="$v.$invalid || !dispositivoAsociado || !unidad || !operador"
        type="submit"
      >
        Guardar
      </BaseButton>
    </form>
  </Auth>
</template>

<script>
import Auth from '@/router/views/layouts/Auth'
import { required } from 'vuelidate/lib/validators'
import axios from 'axios'
import store from '@/store/store'

export default {
  components: { Auth },
  props: {
    identificador: {
      type: String,
      required: true
    }
  },
  beforeRouteEnter (to, from, next) {
    store.dispatch('dispositivos/getAllDispositivos')
      .then(res => {
        return next(vm => {
          const { id, nombre, unidad, operador, valor, dispositivoId } = vm.$store.getters['reglas/getRegla']

          vm.id = id.toString()
          vm.nombre = nombre
          vm.unidad = unidad
          vm.operador = operador
          vm.valor = valor

          const dispositivoAsociadoActual = res.data.find(dispositivo => dispositivo.id === dispositivoId)
          vm.dispositivoAsociado = dispositivoAsociadoActual
        })
      })
  },
  beforeRouteLeave (to, from, next) {
    this.$store.commit('reglas/setReglaActual', {})
    next()
  },
  data () {
    return {
      id: '',
      nombre: '',
      unidad: '',
      unidadesPosibles: ['CELSIUS', 'LUMENES', 'AMPER'],
      operador: '',
      operadoresPosibles: ['>', '<', '>=', '<='],
      valor: '',
      sensorAsociado: '',
      actuadorAsociado: ''
    }
  },
  computed: {
    sensores () {
      const dispositivos = this.$store.getters['dispositivos/getAllDispositivos']
      return dispositivos.filter(dispositivo => dispositivo.tipo === 'SENSOR')
    },
    sensoresLabels () {
      return this.sensores.map(sensor => `Nombre: ${sensor.nombre}`)
    },
    actuadores () {
      const dispositivos = this.$store.getters['dispositivos/getAllDispositivos']
      return dispositivos.filter(dispositivo => dispositivo.tipo === 'ACTUADOR')
    },
    actuadoresLabels () {
      return this.actuadores.map(sensor => `Nombre: ${sensor.nombre}`)
    }
  },
  methods: {
    async editarRegla () {
      const formData = {
        id: parseInt(this.id),
        nombre: this.nombre,
        unidad: this.unidad,
        operador: this.operador,
        valor: this.valor,
        dispositivoId: this.sensorAsociado.id
      }

      try {
        await axios.put('/api/reglas', formData)
        this.$router.push({ name: 'reglas' })
      } catch (error) {
        // todo
        console.log(error.response)
      }
    }
  },
  validations: {
    nombre: {
      required
    },
    valor: {
      required
    }
  }
}
</script>
