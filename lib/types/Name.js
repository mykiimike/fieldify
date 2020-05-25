const signderivaType = require('./type')
const signderivaTypeString = require('./String')

class signderivaTypeName extends signderivaType {
  schematizer () {
    return ({
      first: {
        $type: signderivaTypeString,
        $options: {
          strict: true,
          min: 2,
          max: 128,
          unicode: false
        }
      },
      last: {
        $type: signderivaTypeString,
        $options: {
          strict: true,
          min: 2,
          max: 128,
          unicode: true
        }
      }
    })
  }
}

module.exports = {
  code: 'Name',
  description: 'Name (first and last name)',
  class: signderivaTypeName
}
