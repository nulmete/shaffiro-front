import { shallowMount } from '@vue/test-utils'
import Listado from '@/router/views/layouts/Listado'

describe('Componente: Listado', () => {
  const headings = ['heading1', 'heading2']
  const fields = ['field1', 'field2']
  const content = [{ field1: 'aaa', field2: 'bbb' }, { field1: 'ccc', field2: 'ddd' }]

  it('Renderiza el contenido del slot heading', () => {
    const headingSlot = 'Heading'
    const buttonSlot = '<button>Click me</button>'
    const wrapper = shallowMount(Listado, {
      data () {
        return {
          myProp: 'xyz'
        }
      },
      slots: {
        heading: headingSlot,
        buttons: buttonSlot
      },
      scopedSlots: {
        content: function (props) {
          return this.$createElement('img', props.myProp)
        }
      },
      propsData: {
        headings,
        fields,
        content
      }
    })
    expect(wrapper.element.innerHTML).toContain(headingSlot)
    expect(wrapper.element.innerHTML).toContain(buttonSlot)
    expect(wrapper.find('img').exists()).toBe(true)
  })
})
