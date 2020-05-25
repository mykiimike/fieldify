const fieldify = require('../index')

const { schema, types } = fieldify

const fieldifyType = require('../lib/types/type')

class _CounterType extends fieldifyType {
  constructor (options) {
    super(options)
    this.counters = {
      encode: 0,
      decode: 0,
      verify: 0,
      filter: 0
    }
  }

  encode (input, cb) {
    this.counters.encode++
    return (super.encode(input, cb))
  }

  decode (input, cb) {
    this.counters.decode++
    return (super.decode(input, cb))
  }

  verify (input, cb) {
    this.counters.verify++
    return (super.verify(input, cb))
  }

  filter (input, cb) {
    this.counters.filter++
    return (super.filter(input, cb))
  }
}

const CounterType = {
  code: 'Counter',
  description: 'Only for test purpose',
  class: _CounterType
}

const policy = {
  read: false,
  write: false
}

describe('Testing schema.verify()', function () {
  it('testing a very basic schema using String type', function (done) {
    const sc = {
      email: {
        $type: types.String,
        $maxLength: 128
      }
    }
    const input = {
      firstname: 'Michael',
      last: 'Vergoz'
    }
    const hdl = new schema('user', { policy })
    hdl.compile(sc)
    hdl.verify(input, (fieldified) => {
      done()
    })
  })

  it('should pass without required field', function (done) {
    const sc = {
      test: {
        $type: types.String,
        $write: true,
        $required: false
      }
    }
    const input = {}
    const hdl = new schema('test', { policy })
    hdl.compile(sc)
    hdl.verify(input, (fieldified) => {
      if (fieldified.error !== false) return (done('Verification got error'))
      done()
    })
  })

  it('should not pass with required field', function (done) {
    const sc = {
      test: {
        $type: types.String,
        $write: true,
        $required: true
      }
    }
    const input = {}
    const hdl = new schema('test', { policy })
    hdl.compile(sc)
    hdl.verify(input, (fieldified) => {
      if (fieldified.error !== true) return (done('Should have fieldified.error === true'))
      done()
    })
  })

  it('should have the write access to the field', function (done) {
    const sc = {
      test: {
        $type: types.String,
        $write: true
      }
    }
    const input = { test: 'Yop' }
    const hdl = new schema('test', { policy })
    hdl.compile(sc)
    hdl.verify(input, (fieldified) => {
      if (fieldified.result.test !== 'Yop') return (done('Should have fieldified.result.test === "Yop"'))
      done()
    })
  })

  it('should not have the write access to the field', function (done) {
    const sc = {
      test: {
        $type: types.String
      }
    }
    const input = { test: 'Yop' }
    const hdl = new schema('test', { policy })
    hdl.compile(sc)
    hdl.verify(input, (fieldified) => {
      if (fieldified.result.test === 'Yop') return (done('Should have fieldified.result.test !== "Yop"'))
      done()
    })
  })

  it('verification should work on direct access array', function (done) {
    const sc = {
      test: [{
        $type: CounterType,
        $write: true,
        $doc: 'This is a test'
      }]
    }
    const input = { test: ['b0', 'How', 'are', 'you'] }
    const hdl = new schema('test', { policy })
    hdl.compile(sc)
    hdl.verify(input, (fieldified) => {
      const type = hdl.handler.schema.test[0].$_type
      if (type.counters.verify !== 4) return (done('Verifier did not ran on each field'))
      done()
    })
  })
})
