const signderivaType = require('./type')

class signderivaTypeKV extends signderivaType {
  verify (input, cb) {
    // if (typeof input !== 'string') {
    //   return (cb(true, 'Not a string'))
    // }

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

  // configuration () {
  //   return ({
  //     placeholder: {
  //       $doc: 'Field placeholder',
  //       $required: false,
  //       $type: 'KV'
  //     },
  //     help: {
  //       $doc: 'Help / Bottom message',
  //       $required: false,
  //       $type: 'KV'
  //     }
  //   })
  // }
}

module.exports = {
  code: 'KV',
  description: 'Object with single Key / Value',
  class: signderivaTypeKV
}
