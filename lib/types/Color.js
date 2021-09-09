const signderivaType = require('./type')


const regex = /^#([a-fA-F0-9]{6}|[a-fA-F0-9]{3})$/

class signderivaTypeColor extends signderivaType {
  verify(input, cb) {
    if (!input) {
      if (cb) cb(new Error('No input'))
      return
    }

    if (typeof input !== 'string') {
      if (cb) cb(new Error('Input is not a string'))
      return
    }

    // verify
    const ret = regex.test(input)
    const validation = ret !== true ? new Error('Invalid input color') : null
    if (cb) cb(validation)
  }
}

module.exports = {
  code: 'Color',
  description: 'HTML Color',
  class: signderivaTypeColor
}
