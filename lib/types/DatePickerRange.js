const signderivaType = require('./type')

class signderivaTypeDatePickerRange extends signderivaType {
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
