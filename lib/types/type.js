module.exports = class fieldifyType {
  constructor(options) {
    this.options = options || {}
  }

  // see if we will introduce the 
  // concept of type configurations disclosure 
  configuration() {

  }

  encode(input, cb) {
    if(cb) cb(input)
    return (input)
  }

  decode(input, cb) {
    if(cb) cb(input)
    return (input)
  }

  verify(input, cb) {
    if(cb) cb(true)
    return (true)
  }

  filter(input, cb) {
    if(cb) cb(true)
    return (true)
  }
}

