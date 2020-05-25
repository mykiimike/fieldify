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

const extract = fieldify.assign(schema, (user, dst, object, source) => {
  dst.flags = object.$read === true ? 'r' : ''
  dst.flags += object.$write === true ? 'w' : ''

  // do not follow the rest only if write is false
  if (object.$write !== true && object.$read !== true) return (false)
})

console.log(JSON.stringify(extract, null, '\t'))