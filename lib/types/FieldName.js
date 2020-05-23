const signderivaType = require("./type")

const regex = /^([a-z0-9]+)$/i

class signderivaTypeFieldName extends signderivaType {

  verifier(input, cb) {
    if (!input) {
      if (cb) cb(false)
      return (false)
    }

    if (typeof input !== "string") {
      if (cb) cb(false)
      return (false)
    }

    const ret = regex.test(input)
    if (cb) cb(ret)
    return (ret)
  }
}

module.exports = {
  "code": "FieldName",
  "description": "Restricted Field Name",
  "class": signderivaTypeFieldName
}