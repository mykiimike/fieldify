const signderivaType = require("./type")

// Support
// SHA1
// SHA256 < default
// SHA512

const _sha1 = /\b[0-9a-f]{5,40}\b/
const _sha256 = /\b[A-Fa-f0-9]{64}\b/
const _sha512 = /\b[A-Fa-f0-9]{128}\b/

class signderivaTypeHash extends signderivaType {

  constructor(options) {
    super(options)

    switch (this.options.mode) {
      case "sha1":
        this.verify = this.sha1Verifier.bind(this)
        break;

      default:
      case "sha256":
        this.verify = this.sha256Verifier.bind(this)
        break;

      case "sha512":
        this.verify = this.sha512Verifier.bind(this)
        break;
    }
  }

  sha1Verifier(input, cb) {
    if (!input) {
      if (cb) cb(false)
      return (false)
    }

    const ret = _sha1.test(input)
    if (cb) cb(ret)
    return (ret)
  }

  sha256Verifier(input, cb) {
    if (!input) {
      if (cb) cb(false)
      return (false)
    }
    const ret = _sha256.test(input)
    if (cb) cb(ret)
    return (ret)
  }

  sha512Verifier(input, cb) {
    if (!input) {
      if (cb) cb(false)
      return (false)
    }
    const ret = _sha512.test(input)
    if (cb) cb(ret)
    return (ret)
  }
}

module.exports = {
  "code": "Hash",
  "description": "Computer Hash",
  "class": signderivaTypeHash
}