/*
 * Read Write - Assignator
 */
const fieldify = require('../index')

const schema = {
  entry: {
    $read: false,
    $write: true,

    subEntry1: {
      $read: true,
      $write: true
    },

    subEntry2: {
      $read: true,

      subEntry22: {
        $read: true,
        $write: true
      }
    }
  }
}

describe('Read Write Assignator', function () {
  it('should skip sub entries because write is false', function (done) {
    const extract = fieldify.assign(schema, (user, dst, object, source) => {
      dst.flags = object.$read === true ? 'r' : ''
      dst.flags += object.$write === true ? 'w' : ''

      // do not follow the rest only if write is false
      if (object.$write === false) return (false)
    })

    const jsons = JSON.stringify(extract)
    if (jsons !== '{"entry":{"flags":"w","subEntry1":{"flags":"rw"},"subEntry2":{"flags":"r","subEntry22":{"flags":"rw"}}}}') {
      done('Entry is different: ' + jsons)
    }
    else {
      done()
    }
  })

  it('should skip sub entries because write & read is not true', function (done) {
    const extract = fieldify.assign(schema, (user, dst, object, source) => {
      dst.flags = object.$read === true ? 'r' : ''
      dst.flags += object.$write === true ? 'w' : ''

      // do not follow the rest only if write is false
      if (object.$write !== true && object.$read !== true) return (false)
    })

    const jsons = JSON.stringify(extract)
    if (jsons !== '{"entry":{"flags":"w","subEntry1":{"flags":"rw"},"subEntry2":{"flags":"r","subEntry22":{"flags":"rw"}}}}') {
      done('Entry is different: ' + jsons)
    }
    else {
      done()
    }
  })
})
