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
    if (cb) cb(false)
    return (false)
  }

  // TODO: Add verify by default
  filter (input, cb) {
    if (cb) cb(true)
    return (true)
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
