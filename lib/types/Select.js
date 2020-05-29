const fieldifyType = require('./type')

class fieldifyTypeSelector extends fieldifyType {
  sanatizeOptions (input) {
    const output = {
      placeholder: typeof input.placeholder === 'string' ? input.placeholder : undefined,
      help: typeof input.help === 'string' ? input.help : undefined,
      default: typeof input.default === 'string' ? input.default : undefined,
      items: typeof input.items === 'object' ? input.items : undefined
    }
    return (output)
  }
}

module.exports = {
  code: 'Select',
  description: 'Selector',
  class: fieldifyTypeSelector
}
