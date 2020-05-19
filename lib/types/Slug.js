const signderivaType = require("./type")

const regex = /^[a-z0-9]+(?:-[a-z0-9]+)*$/g

class signderivaTypeSlug extends signderivaType {

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
  "code": "Slug",
  "description": "Slug name",
  "class": signderivaTypeSlug
}