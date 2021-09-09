const fieldify = require('../index')
const lib = require('./lib')

const { schema, types } = fieldify

describe('types::Hash', function () {
  // TODO: test sha1 & sha512

  describe('positive default behavior', async function () {
    const validValues = [
      '45ed7410fd66c73d32bc8be0e95410b315c952ffbc2eef8f1f81cc4935822a69'
    ]
    const sc = {
      test: {
        $type: types.Hash
      }
    }
    const hdl = new schema('user')
    hdl.compile(sc)

    await lib.positive(hdl, validValues)
  })

  describe('negative default behavior', async function () {
    const validValues = [
      'ab34daa81d15f2ca7d2e2fa13eb90a86f5034d76',
      'ab34daa81d15f2ca7d2e2fa13eb90a86f5034d760',
    ]
    const sc = {
      test: {
        $type: types.Hash
      }
    }
    const hdl = new schema('user')
    hdl.compile(sc)

    await lib.negative(hdl, validValues)
  })
})

