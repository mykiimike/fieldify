const fieldify = require('../index')
const assert = require('assert')

const { roles, schema } = fieldify

const theSchema = {
  nested: {
    $type: 'String',
    $write: false,
    $read: false,
    $roles: {
      admin: {
        $write: true
      },
      user: {
        $read: true
      }
    },

    other: {
      $type: 'String'
    }
  }
}

describe('role based schema', function () {
  it('should not accept non object schema', function (done) {
    try {
      // eslint-disable-next-line no-new
      new roles('test', 'error')
      done('Should throw')
    } catch (e) {
      done()
    }
  })

  it('accept direct object schema binding', function (done) {
    // eslint-disable-next-line no-new
    new roles('test', theSchema)
    done()
  })

  it('accept indirect object schema binding', function (done) {
    const hdl = new schema('test')
    hdl.compile(theSchema)

    // eslint-disable-next-line no-new
    new roles('test', hdl)
    done()
  })

  it('should sets of default schema', function (done) {
    const hdl = new roles('test', theSchema)
    assert.strictEqual(hdl.default.tree.nested.$write, false)
    assert.strictEqual(hdl.default.tree.nested.$read, false)
    done()
  })

  it('should sets of ADMIN schema', function (done) {
    const hdl = new roles('test', theSchema)
    assert.strictEqual(hdl.admin.tree.nested.$write, true)
    assert.strictEqual(hdl.admin.tree.nested.$read, false)
    done()
  })

  it('should sets of USER schema', function (done) {
    const hdl = new roles('test', theSchema)
    assert.strictEqual(hdl.user.tree.nested.$write, false)
    assert.strictEqual(hdl.user.tree.nested.$read, true)
    done()
  })
})
