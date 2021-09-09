module.exports = class fieldifyType {
  constructor (options) {
    this.options = options || {}
  }

  encode (input, cb) {
    if (cb) cb(input)
    return (input)
  }

  decode (input, cb) {
    if (cb) cb(input)
    return (input)
  }

  verify (input, cb) {
    if (cb) cb(null)
    return (null)
  }

  // TODO: Add verify by default
  filter (input, cb) {
    return (this.verify(input, cb))
  }

  schematizer () {
    return (null)
  }

  configuration () {
    return (null)
  }

  // will be auto generate from configuration
  sanatizeOptions (input) {
    return (input)
  }
}
