/*
 * Issue #6
 */
const fieldify = require('../index')

describe('Issue #6', function () {
  it('present of the issue', function (done) {
    const schema = {
      array: [{
        $directAssignation: true
      }]
    }

    // first compilation
    const compile = fieldify.compile(schema)

    // second pass
    fieldify.compile(schema)

    if ('$_nested' in compile.schema.array[0]) return (done('Issue is present'))
    done()
  })
})
