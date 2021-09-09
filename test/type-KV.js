const fieldify = require('../index')
const lib = require('./lib')

const { schema, types } = fieldify

describe('types::KV', function () {
  // TODO: test min & max

  describe('positive default behavior', async function () {
    const validValues = [
      { k: 1 }
    ]
    const sc = {
      test: {
        $type: types.KV
      }
    }
    const hdl = new schema('user')
    hdl.compile(sc)

    await lib.positive(hdl, validValues)
  })

  describe('negative default behavior', async function () {
    const validValues = [
      'ab34daa81d15f2ca7d2e2fa13eb90a86f5034d76',
      [{ k: 1 }]
    ]
    const sc = {
      test: {
        $type: types.KV
      }
    }
    const hdl = new schema('user')
    hdl.compile(sc)

    await lib.negative(hdl, validValues)
  })
})

