const signderivaType = require('./type')

class signderivaTypeName extends signderivaType {
  schematizer () {
    return ({
      first: {
        $type: 'String',
        $options: {
          strict: true,
          min: 2,
          max: 128,
          unicode: true
        }
      },
      last: {
        $type: 'String',
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
