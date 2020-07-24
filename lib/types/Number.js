const signderivaType = require('./type')

// const noUnicodeRegex = /^[0-9]+$/i

const exported = {
  code: 'Number',
  description: 'Various Numbers'
}

function isInt (n) {
  return n % 1 === 0
}

class signderivaTypeNumber extends signderivaType {
  verify (input, cb) {
    if (isNaN(input)) return (cb(true, 'Not a number'))

    if (typeof input === 'string') input = parseInt(input)

    const integer = isInt(input)

    // if (this.options.unicode === false && !noUnicodeRegex.test(input)) {
    //   return (cb(true, 'Unicode is forbidden'))
    // }

    cb(false)
  }

  // sanatizeOptions (input) {
  //   const output = {
  //     // placeholder: typeof input.placeholder === 'string' ? input.placeholder : undefined,
  //     // help: typeof input.help === 'string' ? input.help : undefined,
  //     // min: typeof input.min === 'number' ? input.min : undefined,
  //     // max: typeof input.max === 'number' ? input.max : undefined,
  //     // strict: typeof input.strict === 'boolean' ? input.strict : undefined,
  //     // unicode: typeof input.unicode === 'boolean' ? input.unicode : undefined
  //   }
  //   return (output)
  // }

  configuration () {
    return ({
      acceptedTypes: {
        $doc: 'What kind of number to accept',
        $required: true,
        $type: 'Select',
        $options: {
          default: 'both',
          items: {
            both: 'Both Integer & Float',
            integer: 'Only Integer',
            float: 'Only Float'
          }
        }
      }
    })
  }
}

exported.class = signderivaTypeNumber
module.exports = exported
