const signderivaType = require('./type')

class signderivaTypeDatePickerRange extends signderivaType {
  // TODO: test
  schematizer () {
    return ({
      from: {
        $type: 'DatePicker'
      },
      to: {
        $type: 'DatePicker'
      }
    })
  }
}

module.exports = {
  code: 'DatePickerRange',
  description: 'Date Picker Range',
  class: signderivaTypeDatePickerRange
}
