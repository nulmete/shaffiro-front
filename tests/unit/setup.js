import '@/components/base/globals'
import { config } from '@vue/test-utils'

config.showDeprecationWarnings = false

// eslint-disable-next-line
global.console.warn = jest.fn()
