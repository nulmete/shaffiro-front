import { mount } from '@vue/test-utils'
import BaseInput from '@/components/base/_base-input'

describe('Componente: BaseInput', () => {
  it('Funciona con v-model', () => {
    const wrapper = mount(BaseInput, { propsData: { value: 'aaa' } })
    const inputWrapper = wrapper.find('input')
    const inputEl = inputWrapper.element

    // El valor inicial del input es correcto
    expect(inputEl.value).toEqual('aaa')

    // Emite un evento 'input' al cambiar su valor
    inputEl.value = 'bbb'
    inputWrapper.trigger('input')
    expect(wrapper.emitted().input).toEqual([['bbb']])

    // El valor del input se actualiza correctametne cuando cambian sus props
    wrapper.setValue('ccc')
    expect(inputEl.value).toEqual('ccc')
  })

  it('Permite type="password"', () => {
    const consoleError = jest
      .spyOn(console, 'error')
      .mockImplementation(() => {})
    mount(BaseInput, {
      propsData: { value: 'aaa', type: 'password' }
    })
    expect(consoleError).not.toBeCalled()
    consoleError.mockRestore()
  })

  it('No permite type=checkbox"', () => {
    const consoleError = jest
      .spyOn(console, 'error')
      .mockImplementation(() => {})
    mount(BaseInput, {
      propsData: { value: 'aaa', type: 'checkbox' }
    })
    expect(consoleError.mock.calls[0][0]).toContain('custom validator check failed for prop "type"')
    consoleError.mockRestore()
  })
})
