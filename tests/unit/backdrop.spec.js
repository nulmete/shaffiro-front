import { mount, createLocalVue } from '@vue/test-utils'
import Backdrop from '@/components/Backdrop'

const localVue = createLocalVue()

describe('Componente: Backdrop', () => {
  it('Se renderiza correctamente', () => {
    const wrapper = mount(Backdrop, { localVue })
    expect(wrapper.exists()).toBeTruthy()
  })
})
