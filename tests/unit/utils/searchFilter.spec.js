import { searchFilter } from '@/utils/searchFilter'

test('El filtro de búsqueda funciona', () => {
  const search = 'shaffiro'
  const array = [
    {
      name: 'shaffiro',
      lastname: 'torasso'
    },
    {
      name: 'saffiro',
      lastname: 'charizard'
    }
  ]

  expect(searchFilter(search, array)).toEqual([{ name: 'shaffiro', lastname: 'torasso' }])
})
