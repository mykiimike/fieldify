const signderivaType = require('./type')

const strictRegex = /`|~|!|@|#|\$|%|\^|&|\*|\(|\)|\+|=|\[|\{|\]|\}|\||\\|'|<|,|\.|>|\?|\/|"|;|:/gm

const noUnicodeRegex = /^[a-z0-9\-_\s]+$/i

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

    if (this.options.unicode === false && !noUnicodeRegex.test(input)) {
      return (cb(true, 'Unicode is forbidden'))
    }

    cb(false)
  }

  sanatizeOptions (input) {
    const output = {
      placeholder: typeof input.placeholder === 'string' ? input.placeholder : undefined,
      help: typeof input.help === 'string' ? input.help : undefined,
      min: typeof input.min === 'number' ? input.min : undefined,
      max: typeof input.max === 'number' ? input.max : undefined,
      strict: typeof input.strict === 'boolean' ? input.strict : undefined,
      unicode: typeof input.unicode === 'boolean' ? input.unicode : undefined
    }
    return (output)
  }
}

module.exports = {
  code: 'String',
  description: 'String of characters',
  class: signderivaTypeString
}
