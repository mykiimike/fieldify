const fieldify = require('../index')

const { schema, types } = fieldify

describe('Testing schema.encode()', function () {
  it('email encoder should return lower cases string', function (done) {
    const email = 'JxE@OxcnQ.cOkd'
    const sc = {
      email: {
        $type: types.Email
      }
    }
    const input = { email }
    const hdl = new schema('test')
    hdl.compile(sc)
    hdl.encode(input, (fieldified) => {
      if (email.toLowerCase() !== fieldified.result.email) return (done('Is not lower case'))
      done()
    })
  })
})
