import { mount } from '@vue/test-utils'
import BaseLink from '@/components/base/_base-link.vue'

const mountBaseLink = (options = {}) => {
  return mount(BaseLink, {
    stubs: {
      RouterLink: {
        functional: true,
        render (h, { slots, data }) {
          return <a data-router-link='true'>{slots().default}</a>
        }
      }
    },
    slots: {
      default: 'hello'
    },
    ...options
  })
}

describe('Componente: BaseLink', () => {
  it('Renderiza <a> cuando se le pasa como prop `href`', () => {
    const externalUrl = 'https://google.com/'
    const { element } = mountBaseLink({
      propsData: {
        href: externalUrl
      }
    })
    expect(element.tagName).toEqual('A')
    expect(element.href).toEqual(externalUrl)
    expect(element.textContent).toEqual('hello')
  })

  it('Renderiza <router-link> cuando se le pasa como prop `name`', () => {
    const routeName = 'home'
    const { element, vm } = mountBaseLink({
      propsData: {
        name: routeName
      }
    })
    expect(element.dataset.routerLink).toEqual('true')
    expect(element.textContent).toEqual('hello')
    expect(vm.routerLinkTo).toEqual({ name: routeName, params: {} })
  })

  it('Renderiza <router-link> cuando se le pasa como props `name` y `params`', () => {
    const routeName = 'home'
    const routeParams = { foo: 'bar' }
    const { element, vm } = mountBaseLink({
      propsData: {
        name: routeName,
        params: routeParams
      }
    })
    expect(element.dataset.routerLink).toEqual('true')
    expect(element.textContent).toEqual('hello')
    expect(vm.routerLinkTo).toEqual({
      name: routeName,
      params: routeParams
    })
  })

  it('Renderiza <router-link> cuando se le pasa como prop `to`', () => {
    const routeName = 'home'
    const { element, vm } = mountBaseLink({
      propsData: {
        to: {
          name: routeName
        }
      }
    })
    expect(element.dataset.routerLink).toEqual('true')
    expect(element.textContent).toEqual('hello')
    expect(vm.routerLinkTo).toEqual({ name: routeName, params: {} })
  })

  it('Renderiza <router-link> cuando se le pasa como prop `to` con `params`', () => {
    const routeName = 'home'
    const routeParams = { foo: 'bar' }
    const { element, vm } = mountBaseLink({
      propsData: {
        to: {
          name: routeName,
          params: routeParams
        }
      }
    })
    expect(element.dataset.routerLink).toEqual('true')
    expect(element.textContent).toEqual('hello')
    expect(vm.routerLinkTo).toEqual({ name: routeName, params: routeParams })
  })
})
