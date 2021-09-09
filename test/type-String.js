const fieldify = require('../index')
const lib = require('./lib')
const { schema, types } = fieldify

// TODO: placeholder
// TODO: help
// TODO: min
// TODO: max

describe('types::String', function () {
  describe('default behavior', async function () {
    const validValues = [
      'This is a single test',
      '€éöüèäà',
      'This \' should work',
      'This " as well',
      '+"*%&/()=?`',
      'Düsseldorf, Köln, Москва, 北京市, إسرائيل !@#$'
    ]
    const sc = {
      test: {
        $type: types.String
      }
    }
    const hdl = new schema('user')
    hdl.compile(sc)

    await lib.positive(hdl, validValues)
  })

  describe('positive strict mode', async function () {
    const validValues = [
      'This is a single test'
    ]
    const sc = {
      test: {
        $type: types.String,
        $options: {
          strict: true
        }
      }
    }
    const hdl = new schema('user')
    hdl.compile(sc)

    await positive(hdl, validValues)
  })

  describe('negative strict mode', async function () {
    const invalidValues = [
      'This \' should work',
      'This " as well',
      '+"*%&/()=?`'
    ]

    const sc = {
      test: {
        $type: types.String,
        $options: {
          strict: true
        }
      }
    }
    const hdl = new schema('user')
    hdl.compile(sc)

    await lib.negative(hdl, invalidValues)
  })


  describe('positive no unicode mode', async function () {
    const validValues = [
      'This is a single test',
      'This \' should work',
      'This " as well',
      '+"*%&/()=?'
    ]
    const sc = {
      test: {
        $type: types.String,
        $options: {
          unicode: false
        }
      }
    }
    const hdl = new schema('user')
    hdl.compile(sc)

    await lib.positive(hdl, validValues)
  })

  describe('negative no unicode mode', async function () {
    const invalidValues = [
      'Düsseldorf, Köln, Москва, 北京市, إسرائيل !@#$',
      '€éöüèäà'
    ]

    const sc = {
      test: {
        $type: types.String,
        $options: {
          unicode: false
        }
      }
    }
    const hdl = new schema('user')
    hdl.compile(sc)

    await lib.negative(hdl, invalidValues)
})

})

