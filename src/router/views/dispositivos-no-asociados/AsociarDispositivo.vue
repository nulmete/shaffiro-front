<template>
  <Layout>
    <Form>
      <h2 :class="$style.heading">
        Asociar dispositivo
      </h2>

      <BaseForm @submit.prevent="asociarDispositivo">
        <!-- Nombre -->
        <BaseFormGroup>
          <BaseInput
            v-model="nombre"
            label="Nombre del dispositivo"
          />
        </BaseFormGroup>

        <!-- Tipo de dispositivo -->
        <BaseFormGroup>
          <BaseInputSelect
            v-model="tipo"
            label="Tipo de dispositivo"
            :options="tiposPosibles"
          />
        </BaseFormGroup>

        <!-- Estado -->
        <BaseFormGroup>
          <BaseInputCheckbox
            v-model="activo"
            label="Habilitado"
          />
        </BaseFormGroup>

        <!-- Regla -->
        <!-- <BaseFormGroup>
          <BaseInput
            v-model="regla"
            label="Reglas"
          />
        </BaseFormGroup> -->

        <!-- Regla ID -->
        <!-- <BaseFormGroup>
          <BaseInputSelect
            v-model="regla"
            label="Regla"
            :options="reglasLogica"
          />
        </BaseFormGroup>

        {{ regla }}

        {{ reglacompleta }} -->

        <!-- Configuracion -->
        <BaseFormGroup>
          <BaseInput
            v-model="configuracion"
            label="Configuración"
          />
        </BaseFormGroup>

        <BaseFormGroup>
          <BaseInputSelect
            v-model="magnitud"
            label="Magnitud a medir"
            :options="magnitudesPosibles"
          />
        </BaseFormGroup>

        <!-- Submit -->
        <BaseButton type="submit">
          Asociar
        </BaseButton>
      </BaseForm>

      {{ mac }}
    </Form>
  </Layout>
</template>

<script>
import Layout from '@/router/layouts/main'
import Form from '@/router/layouts/form'
import axios from 'axios'

export default {
  components: {
    Layout,
    Form
  },
  props: {
    identificador: {
      type: String,
      required: true
    }
  },
  beforeRouteEnter (to, from, next) {
    next(vm => {
      const { id, mac, uuid } = vm.$store.getters['dispositivosNoAsociados/getDispositivoNoAsociado']

      vm.id = id
      vm.mac = mac
      vm.uuid = uuid
      vm.configuracion = ''
    })
  },
  beforeRouteLeave (to, from, next) {
    this.$store.commit('dispositivosNoAsociados/setDispositivoNoAsociadoActual', {})
    next()
  },
  data () {
    return {
      id: '',
      nombre: '',
      tipo: '',
      tiposPosibles: ['SENSOR', 'ACTUADOR'],
      activo: false,
      configuracion: '',
      regla: '',
      magnitud: '',
      magnitudesPosibles: ['Intensidad de corriente', 'Temperatura', 'Movimiento'],

      // prueba
      uuid: '',
      mac: ''
    }
  },
  computed: {
    reglas () {
      return this.$store.getters['reglas/getAllReglas']
    },
    reglasLogica () {
      return this.reglas.map(regla => regla.logica)
    },
    reglacompleta () {
      return this.reglas.find(r => r.logica === this.regla)
    }
  },
  created () {
    this.$store.dispatch('reglas/getAllReglas')
  },
  methods: {
    async asociarDispositivo () {
      const pair = [{
        id: '2',
        pin: '2',
        mode: 'OUTPUT',
        type: 'proximidad'
      }]

      const formData = {
        nombre: this.nombre,
        tipo: this.tipo,
        activo: this.activo,
        configuracion: this.configuracion,
        // regla: this.reglacompleta.id
        reglaId: null
      }
      try {
        await axios.post(`/api/pair/${this.mac}`, pair)
        await axios.post('/api/dispositivos', formData)
        await axios.delete(`api/dispositivo-no-asociados/${this.id}`)
        this.$router.push({ name: 'dispositivos' })
      } catch (error) {
        // todo
        console.log(error.response)
      }
    }
  }
}
</script>
