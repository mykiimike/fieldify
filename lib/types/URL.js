const signderivaType = require('./type')

// Support
// SHA1
// SHA256 < default
// SHA512

// eslint-disable-next-line no-useless-escape
const regex = /^(?:http(s)?:\/\/)?[\w.-]+(?:\.[\w\.-]+)+[\w\-\._~:/?#[\]@!\$&'\(\)\*\+,;=.]+$/g

class signderivaTypeURL extends signderivaType {
  constructor (options) {
    super(options)

    if (!this.options.maxLength) this.options.maxLength = 256
    if (!this.options.minLength) this.options.minLength = 8
  }

  verifier (input, cb) {
    if (!input) {
      if (cb) cb(false)
      return (false)
    }

    if (typeof input !== 'string') {
      if (cb) cb(false)
      return (false)
    }

    if (input.length <= 0 || input.length > this.options.maxLength) {
      if (cb) cb(false)
      return (false)
    }

    const ret = regex.test(input)
    if (cb) cb(ret)
    return (ret)
  }
}

module.exports = {
  code: 'URL',
  description: 'URL',
  class: signderivaTypeURL
}
