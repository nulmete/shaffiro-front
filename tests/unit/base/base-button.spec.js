import { shallowMount } from '@vue/test-utils'
import BaseButton from '@/components/base/_base-button'

describe('Componente: BaseButton', () => {
  it('Renderiza el contenido de su slot', () => {
    const slotContent = '<span>foo</span>'
    const { element } = shallowMount(BaseButton, {
      slots: {
        default: slotContent
      }
    })
    expect(element.innerHTML).toContain(slotContent)
  })

  it('Emite el evento click al ser clickeado', () => {
    const onClick = jest.fn()
    const wrapper = shallowMount(BaseButton, {
      listeners: { click: onClick }
    })
    wrapper.find('button').trigger('click')
    expect(onClick).toHaveBeenCalled()
  })
})
