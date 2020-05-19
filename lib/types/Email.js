const signderivaType = require("./type")

const regex = /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/

class signderivaTypeEmailAddress extends signderivaType {
  verify(input, cb) {
    if(!input) {
      if(cb) cb(false)
      return(false)
    }

    const ret = regex.test(input)
    if (cb) cb(ret)
    return (ret)
  }

  encode(input, cb) {
    input = input.toLowerCase();
    if (cb) cb(input)
    return (input)
  }
}

module.exports = {
  "code": "EmailAddress",
  "description": "E-mail address",
  "class": signderivaTypeEmailAddress
}