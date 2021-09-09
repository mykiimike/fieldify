const signderivaType = require('./type')

class signderivaTypeTimePickerRange extends signderivaType {
  // TODO: verifier
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
