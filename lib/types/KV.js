const signderivaType = require('./type')

const regex = /^([a-z0-9]+)$/i

class signderivaTypeKV extends signderivaType {
  verify (input, cb) {
    if (!input || typeof input !== 'object' || input.constructor.name !== 'Object') {
      return (cb(true, 'Not a KV'))
    }

    for (var key in input) {
      // const value = input[key]

      // verify the key
      const ret = regex.test(key)
      if (!ret) return (cb(true, 'Invalid key name ' + key))
    }

    cb(false)
  }

  // sanatizeOptions (input) {
  //   const output = {
  //     placeholder: typeof input.placeholder === 'string' ? input.placeholder : undefined,
  //     help: typeof input.help === 'string' ? input.help : undefined,
  //     min: typeof input.min === 'number' ? input.min : undefined,
  //     max: typeof input.max === 'number' ? input.max : undefined,
  //     strict: typeof input.strict === 'boolean' ? input.strict : undefined,
  //     unicode: typeof input.unicode === 'boolean' ? input.unicode : undefined
  //   }
  //   return (output)
  // }

  configuration () {
    return ({
      min: {
        $doc: 'Minimun of items',
        $required: false,
        $type: 'Number',
        $options: {
          acceptedTypes: 'integer'
        }
      },
      max: {
        $doc: 'Maximun of items',
        $required: false,
        $type: 'Number',
        $options: {
          acceptedTypes: 'integer'
        }
      }
    })
  }
}

module.exports = {
  code: 'KV',
  description: 'Object with single Key / Value',
  class: signderivaTypeKV
}
