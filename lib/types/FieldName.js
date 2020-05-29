const fieldifyType = require('./type')

const regex = /^([a-z0-9]+)$/i


class fieldifyTypeFieldName extends fieldifyType {
  verify (input, cb) {
    if (!input) {
      return (cb(true))
    }

    if (typeof input !== 'string') {
      return (cb(true, 'Not a string'))
    }

    const ret = regex.test(input)
    if (!ret) return (cb(true, 'Forbidden special chars'))

    return (cb(false))
  }
}

module.exports = {
  code: 'FieldName',
  description: 'Restricted Field Name',
  class: fieldifyTypeFieldName
}
