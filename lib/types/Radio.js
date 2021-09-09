const fieldifyType = require('./type')

class fieldifyTypeRadio extends fieldifyType {
  // TODO: verifier

  // sanatizeOptions (input) {
  //   const output = {
  //     placeholder: typeof input.placeholder === 'string' ? input.placeholder : undefined,
  //     help: typeof input.help === 'string' ? input.help : undefined,
  //     default: typeof input.default === 'string' ? input.default : undefined,
  //     items: typeof input.items === 'object' ? input.items : undefined
  //   }
  //   return (output)
  // }

  configuration () {
    return ({
      default: {
        $doc: 'Default selection (key)',
        $required: false,
        $type: 'String'
      },
      items: {
        $doc: 'Items in selector',
        $required: true,
        $type: 'KV'
      },
      horizontal: {
        $doc: 'Horizontal',
        $required: false,
        $type: 'Checkbox'
      }
    })
  }
}

module.exports = {
  code: 'Radio',
  description: 'Radio Selector',
  class: fieldifyTypeRadio
}
