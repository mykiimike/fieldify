const signderivaType = require('./type')

const strictRegex = /`|~|!|@|#|\$|%|\^|&|\*|\(|\)|\+|=|\[|\{|\]|\}|\||\\|'|<|,|\.|>|\?|\/|"|;|:/gm
const noUnicodeRegex = /[\x7E-\xFF]+/gm

class signderivaTypeString extends signderivaType {
  verify(input, cb) {
    if (typeof input !== 'string') {
      return (cb(new Error('Not a string')))
    }

    if ('min' in this.options && input.length < this.options.min) {
      return (cb(new Error(`String is too short (min: ${this.options.min})`)))
    }

    if ('max' in this.options && input.length > this.options.max) {
      return (cb(new Error(`String is too long (max: ${this.options.max})`)))
    }

    if (this.options.strict === true && input.match(strictRegex)) {
      return (cb(new Error('Forbidden special chars')))
    }

    if (this.options.unicode === false && noUnicodeRegex.test(input)) {
      return (cb(new Error('Unicode is forbidden')))
    }

    cb(null, input)
  }

  configuration() {
    return ({
      placeholder: {
        $doc: 'Field placeholder',
        $required: false,
        $type: 'String'
      },
      help: {
        $doc: 'Help / Bottom message',
        $required: false,
        $type: 'String'
      },
      min: {
        $doc: 'Minimun length',
        $required: false,
        $type: 'Number',
        $options: {
          default: 1
        }
      },
      max: {
        $doc: 'Maximun length',
        $required: false,
        $type: 'Number',
        $options: {
          default: 256
        }
      },
      strict: {
        $doc: 'Strict Mode',
        $help: 'Specials Chars Are Forbidden',
        $required: false,
        $type: 'Checkbox',
        $options: {
          default: false
        }
      },
      unicode: {
        $doc: 'Accept Unicode',
        $help: 'Accept Char From Different Languages',
        $required: false,
        $type: 'Checkbox',
        $options: {
          default: true
        }
      }
    })
  }
}

module.exports = {
  code: 'String',
  description: 'String of characters',
  class: signderivaTypeString
}
