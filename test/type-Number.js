const fieldify = require('../index')
const lib = require('./lib')

const { schema, types } = fieldify

describe('types::Number', function () {
  // TODO: test min & max

  describe('positive default behavior', async function () {
    const validValues = [
      125,
      '125',
      125.2,
      '125.2'
    ]
    const sc = {
      test: {
        $type: types.Number
      }
    }
    const hdl = new schema('user')
    hdl.compile(sc)

    await lib.positive(hdl, validValues)
  })

  describe('negative only integer', async function () {
    const validValues = [
      125.2,
      '125.2',
      '1a',
      'q'
    ]
    const sc = {
      test: {
        $type: types.Number,
        $options: {
          acceptedTypes: 'integer'
        }
      }
    }
    const hdl = new schema('user')
    hdl.compile(sc)

    await lib.negative(hdl, validValues)
  })

  describe('negative only float', async function () {
    const validValues = [
      125,
      '125',
      '1a',
      'q'
    ]
    const sc = {
      test: {
        $type: types.Number,
        $options: {
          acceptedTypes: 'float'
        }
      }
    }
    const hdl = new schema('user')
    hdl.compile(sc)

    await lib.negative(hdl, validValues)
  })

  describe('negative default behavior', async function () {
    const validValues = [
      '1q',
      'a'
    ]
    const sc = {
      test: {
        $type: types.Number
      }
    }
    const hdl = new schema('user')
    hdl.compile(sc)

    await lib.negative(hdl, validValues)
  })


  describe('negative min option', async function () {
    const validValues = [
      125,
      '125'
    ]
    const sc = {
      test: {
        $type: types.Number,
        $options: {
          min: 130
        }
      }
    }
    const hdl = new schema('user')
    hdl.compile(sc)

    await lib.negative(hdl, validValues)
  })

  describe('negative max option', async function () {
    const validValues = [
      125,
      '125'
    ]
    const sc = {
      test: {
        $type: types.Number,
        $options: {
          max: 120
        }
      }
    }
    const hdl = new schema('user')
    hdl.compile(sc)

    await lib.negative(hdl, validValues)
  })
})
