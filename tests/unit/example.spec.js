import { mount, createLocalVue } from '@vue/test-utils'
import SignUp from '@/router/views/auth/SignUp.vue'
import Vuelidate from 'vuelidate'

const localVue = createLocalVue()
localVue.use(Vuelidate)

const wrapper = mount(SignUp, {
  localVue,
  stubs: ['BaseInput', 'BaseButton', 'BaseLink']
})

describe('SignUp.vue', () => {
  it('Se renderiza correctamente', () => {
    expect(wrapper.find('div > h2').text()).toContain('Regístrese en Shaffiro')
  })
})
