import { isUsernameValid, isPasswordStrong } from '@/validators/validators'

test('`test` es un nombre de usuario incorrecto', () => {
  expect(isUsernameValid('test')).toBe(false)
})

test('`shaffiro` es un nombre de usuario correcto', () => {
  expect(isUsernameValid('shaffiro')).toBe(true)
})

test('`nombreincorrecto` es un nombre de usuario incorrecto', () => {
  expect(isUsernameValid('nombreincorrecto')).toBe(false)
})

test('`test` es una contraseña incorrecta', () => {
  expect(isPasswordStrong('test')).toBe(false)
})

test('`Shaffiro123` es una contraseña correcta', () => {
  expect(isPasswordStrong('Shaffiro123')).toBe(true)
})

test('`Contraseñamuylarga123` es una contraseña incorrecta', () => {
  expect(isPasswordStrong('Contraseñamuylarga123')).toBe(false)
})
