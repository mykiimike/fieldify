const signderivaType = require("./type")

const regex = /^((0x){0,1}|#{0,1})([0-9A-F]{8}|[0-9A-F]{6})$/ig

class signderivaTypeColor extends signderivaType {

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
  "code": "Color",
  "description": "HTML Color",
  "class": signderivaTypeColor
}