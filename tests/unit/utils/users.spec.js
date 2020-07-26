import { obtenerRoles } from '@/utils/users'

test('`ROLE_USER` se transforma en `Cliente`', () => {
  expect(obtenerRoles('ROLE_USER')).toEqual('Cliente')
})

test('`ROLE_ADMIN` se transforma en `Administrador`', () => {
  expect(obtenerRoles('ROLE_ADMIN')).toEqual('Administrador')
})

test('`ROLE_UNKNOWN` no se transforma en `Cliente` ni `Administrador`', () => {
  expect(obtenerRoles('ROLE_UNKNOWN')).toEqual('ROLE_UNKNOWN')
})
