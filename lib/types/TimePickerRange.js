const signderivaType = require('./type')

class signderivaTypeTimePickerRange extends signderivaType {
  schematizer () {
    return ({
      from: {
        $type: 'TimePicker'
      },
      to: {
        $type: 'TimePicker'
      }
    })
  }
}

module.exports = {
  code: 'TimePickerRange',
  description: 'Time PickerRange',
  class: signderivaTypeTimePickerRange
}
