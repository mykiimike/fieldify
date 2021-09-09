const fieldify = require('../index')
const lib = require('./lib')

const { schema, types } = fieldify

describe('types::Email', function () {
  // TODO: test lower case encoding

  describe('positive behavior', async function () {
    const validValues = [
      'test@test.com',
      'test@test.cdasvfdv',
      'test+sub@test.com'
    ]
    const sc = {
      test: {
        $type: types.Email
      }
    }
    const hdl = new schema('user')
    hdl.compile(sc)

    await lib.positive(hdl, validValues)
  })

  describe('negative behavior', async function () {
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
        $type: types.Email
      }
    }
    const hdl = new schema('user')
    hdl.compile(sc)

    await lib.negative(hdl, validValues)
  })
})

