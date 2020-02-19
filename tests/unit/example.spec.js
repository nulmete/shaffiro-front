import { expect } from 'chai'
import { mount, createLocalVue } from '@vue/test-utils'
import SignUp from '@/router/views/auth/SignUp.vue'
import Vuelidate from 'vuelidate'

const localVue = createLocalVue()
localVue.use(Vuelidate)

const wrapper = mount(SignUp, {
  localVue
})

describe('SignUp.vue', () => {
  it('renders correctly', () => {
    expect(wrapper.find('div > h2').text()).equal('Regístrese en Shaffiro')
  })
})
