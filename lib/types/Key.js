const signderivaType = require('./type')

class signderivaTypeKey extends signderivaType {
  // TODO: this must be connected
}

module.exports = {
  code: 'Key',
  description: "Signderiva' Key (DSA+DH) 2020",
  class: signderivaTypeKey
}
