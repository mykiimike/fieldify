const signderivaType = require('./type')

const strictRegex = /`|~|!|@|#|\$|%|\^|&|\*|\(|\)|\+|=|\[|\{|\]|\}|\||\\|'|<|,|\.|>|\?|\/|"|;|:/gm

const noUnicodeRegex = /^[a-z0-9\-_\s]+$/i

const exported = {
  code: 'String',
  description: 'String of characters'
}

class signderivaTypeString extends signderivaType {
  verify (input, cb) {
    if (typeof input !== 'string') {
      return (cb(true, 'Not a string'))
    }

    if ('min' in this.options && input.length < this.options.min) {
      return (cb(true, `String is too short (min: ${this.options.min})`))
    }

    if ('max' in this.options && input.length > this.options.max) {
      return (cb(true, `String is too long (max: ${this.options.max})`))
    }

    if (this.options.strict === true && input.match(strictRegex)) {
      return (cb(true, 'Forbidden special chars'))
    }

    if (this.options.unicode !== true && !noUnicodeRegex.test(input)) {
      return (cb(true, 'Unicode is forbidden'))
    }

    cb(false)
  }

  configuration () {
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

exported.class = signderivaTypeString
module.exports = exported
