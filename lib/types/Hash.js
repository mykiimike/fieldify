const signderivaType = require('./type')

// Support
// SHA1
// SHA256 < default
// SHA512

//  TODO:  -a, --algorithm   1 (default), 224, 256, 384, 512, 512224, 512256

const _sha1 = /\b[0-9a-f]{5,40}\b/
const _sha256 = /\b[A-Fa-f0-9]{64}\b/
const _sha512 = /\b[A-Fa-f0-9]{128}\b/

class signderivaTypeHash extends signderivaType {
  constructor(options) {
    super(options)
    switch (this.options.mode) {
      case 'SHA1':
        this.verify = this.sha1Verifier.bind(this)
        break

      case 'SHA512':
        this.verify = this.sha512Verifier.bind(this)
        break

      // eslint-disable-next-line default-case-last
      default:
      case 'SHA256':
        this.verify = this.sha256Verifier.bind(this)
        break
    }
  }

  sha1Verifier(input, cb) {
    if (!input) return (cb(new Error('Not a string')))
    const ret = _sha1.test(input)
    if (ret !== true) return (cb(new Error('Not a SHA1 Hash')))
    return (cb(null))
  }

  sha256Verifier(input, cb) {
    if (!input) return (cb(new Error('Not a string')))
    const ret = _sha256.test(input)
    if (ret !== true) return (cb(new Error('Not a SHA256 Hash')))
    return (cb(null))
  }

  sha512Verifier(input, cb) {
    if (!input) return (cb(new Error('Not a string')))
    const ret = _sha512.test(input)
    if (ret !== true) return (cb(new Error('Not a SHA512 Hash')))
    return (cb(null))
  }

  configuration() {
    return ({
      mode: {
        $doc: 'Awaited hash type',
        $required: false,
        $type: 'Select',
        $options: {
          default: 'SHA256',
          items: {
            sha1: 'SHA1',
            sha256: 'SHA256',
            sha512: 'SHA512'
          }
        }
      }
    })
  }
}

module.exports = {
  code: 'Hash',
  description: 'Computer Hash',
  class: signderivaTypeHash
}
