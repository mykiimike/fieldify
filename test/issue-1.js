/*
 * Issue #1
 */
const fieldify = require('../index')

describe('Issue #1', function () {
  it('present of the issue', function (done) {
    const schema = {
      first: {
        $test: 1
      }
    }

    // first compilation
    const compile = fieldify.compile(schema)

    // second pass
    fieldify.compile(schema)

    if (!compile.schema.first.$_access) return (done('No access... https://github.com/mykiimike/fieldify/issues/1'))
    if (compile.schema.first.$_access.$_access) return (done('Issue is present https://github.com/mykiimike/fieldify/issues/1'))

    done()
  })
})
