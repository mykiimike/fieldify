const signderivaType = require('./type')

const regex = /^([a-z0-9]+)$/i

class signderivaTypeKV extends signderivaType {
  verify (input, cb) {
    if (!input || typeof input !== 'object' || input.constructor.name !== 'Object') {
      return (cb(new Error('Not a KV')))
    }

    let count = 0
    for (const key in input) {
      // verify the key
      const ret = regex.test(key)
      if (!ret) return (cb(new Error('Invalid key name ' + key)))
      count++
    }

    if ('min' in this.options && count < this.options.min) {
      return (cb(new Error(`Need more elements (min: ${this.options.min})`)))
    }

    if ('max' in this.options && count > this.options.max) {
      return (cb(new Error(`Too much elements (max: ${this.options.max})`)))
    }

    cb(null)
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
