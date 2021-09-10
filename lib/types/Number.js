const signderivaType = require('./type')

const onlyNumber = /^[0-9]+$/
const onlyFloat = /^[0-9]+\.[0-9]$/

function isInt(n) {
  return n % 1 === 0
}

function isFloat(n) {
  return n % 1 !== 0
}

class signderivaTypeNumber extends signderivaType {
  verify(input, cb) {
    if (isNaN(input)) return (cb(new Error('Not a number')))
    var conv = input

    switch (this.options.acceptedTypes) {
      // integer only
      case 'integer':
        if (typeof input === 'string') {
          if (!onlyNumber.test(input)) return (cb(new Error('Is not an integer')))
          conv = parseInt(input)
        }
        if (!isInt(conv)) return (cb(new Error('Is not an integer')))
        break

      // float only
      case 'float':
        if (typeof input === 'string') {
          if (!onlyFloat.test(input)) return (cb(new Error('Is not an float')))
          conv = parseFloat(input)
        }
        if (!isFloat(conv)) return (cb(new Error('Is not an float')))
        break

      // both
      default:
        if (typeof input === 'string') conv = parseInt(input)
        if (!isInt(conv)) {
          if (typeof input === 'string') conv = parseFloat(input)
          if (!isFloat(conv)) return (cb(new Error('Is not an integer nor float')))
        }
        break
    }

    if ('min' in this.options && conv < this.options.min) {
      return (cb(new Error(`Number is too low (min: ${this.options.min})`)))
    }

    if ('max' in this.options && conv > this.options.max) {
      return (cb(new Error(`Number is too high (max: ${this.options.max})`)))
    }

    cb(null)
  }

  sanatizeOptions(input) {
    const output = {
      // acceptedTypes: typeof input.acceptedTypes === 'string' ? input.acceptedTypes : 'both',
    }
    return (output)
  }

  configuration() {
    return ({
      // TODO: test min & max
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
      },
      min: {
        $doc: 'Specify minimun value',
        $required: false,
        $type: 'Number'
      },
      max: {
        $doc: 'Specify maximun value',
        $required: false,
        $type: 'Number'
      }
    })
  }
}

module.exports = {
  code: 'Number',
  description: 'Various Numbers',
  class: signderivaTypeNumber
}
