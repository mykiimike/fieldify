const fieldifyType = require('./type')

class fieldifyTypeCheckbox extends fieldifyType {
  configuration () {
    return ({
      placeholder: {
        $doc: 'Field placeholder',
        $required: false,
        $type: 'String'
      }
    })
  }
}

module.exports = {
  code: 'Checkbox',
  description: 'Checkbox Options',
  class: fieldifyTypeCheckbox
}
