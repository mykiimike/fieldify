const fieldify = require('../index')
const { schema, types } = fieldify

const validValues = [
  '#000',
  '#FFF',
  '#09C',
  '#000000',
  '#000',
  '#000000',
  '#FFFFFF',
  '#808080',
  '#8A2BE2'
]

describe('types::Color', function () {
  const sc = {
    test: {
      $type: types.Color
    }
  }
  const hdl = new schema('user')
  hdl.compile(sc)

  for (const value of validValues) {
    it(`should valid input ${value}`, async function () {
      const input = {
        test: value
      }
      const ret = await hdl.verify(input)
      if (ret.error === true) {
        throw new Error(`Catching ${ret.fields['.test']}`)
      }
    })
  }
})
