const fieldifyType = require('./type')

const regex = /^([a-z0-9-]+)$/i

class fieldifyTypeFieldName extends fieldifyType {
  verify(input, cb) {
    if (!input) {
      return (cb(null))
    }

    if (typeof input !== 'string') {
      return (cb(new Error('Not a string')))
    }

    const ret = regex.test(input)
    if (!ret) return (cb(new Error('Forbidden special chars')))

    return (cb(null))
  }
}

module.exports = {
  code: 'FieldName',
  description: 'Restricted Field Name',
  class: fieldifyTypeFieldName
}
