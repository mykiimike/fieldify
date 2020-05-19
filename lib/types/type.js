module.exports = class signderivaType {
  constructor(options) {
    this.options = options || {}
  }

  // see if we will introduce the 
  // concept of type configurations disclosure 
  configuration() {

  }

  encode(input) {
    return (input)
  }

  decode(input) {
    return (input)
  }

  verify(input, cb) {
    if(cb) cb(true)
    return (true)
  }

 
}

