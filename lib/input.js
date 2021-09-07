
// const fusion = require('./fusion')
// const compile = require('./compile')
// const iterator = require('./iterator')
// const assign = require('./assign')
// const utils = require('./utils')

class fieldifyInput {
  constructor (schema, value) {
    this.schema = schema
    this._value = value || {}
    this.verifying = false
  }

  setValue (input) {
    this._value = input
  }

  getValue () {
    return (this._value)
  }

  verify (cb) {
    this.schema.verify(this._value, cb)
  }

  reset () {
    this._value = {}
  }

  set (line, data) {
    const node = this.get(line, true)
    if (node) node.input[node.fields[node.fields.length - 1]] = data
  }

  get (line, create) {
    const fields = line.split('.')
    fields.shift()

    const schema = this.schema.handler.schema
    var input = this._value
    var schemaCur, inputCur

    // align integers in field name
    for (let a = 0; a < fields.length; a++) {
      const field = fields[a]
      if (!isNaN(field)) {
        field = parseInt(field, 2)
        fields[a] = field
      }
    }

    // horizontal read
    var inArray = null
    schemaCur = schema
    for (var a = 0; a < fields.length - 1; a++) {
      var field = fields[a]

      schemaCur = schema[field]
      inputCur = input[field]

      if (Array.isArray(schemaCur)) {
        inArray = schemaCur[0]

        // check whether input is ready for array
        if (!inputCur || !Array.isArray(inputCur)) {
          // malformed input
          if (create !== true) return (null)

          // reconstruct the input
          input[field] = []
        }

        // swap schema and input
        inputCur = input[field]
        schema = schemaCur
        input = inputCur

        // dont need to go away
        continue
      }

      if (inArray) {
        if (isNaN(field)) return (null)
        field = parseInt(field)
        schemaCur = inArray
      }

      if (!schemaCur) {
        return (null)
      }

      // no input found for this entry
      // initialize it
      inputCur = input[field]

      // awaiting nested in input
      if (schemaCur.$_nested === true || (inArray && inArray.$_nested === true)) {
        if (!inputCur || typeof inputCur !== 'object' || inputCur.constructor.name !== 'Object') {
          if (create === true) input[field] = {}
          else return (null)
        }
      }

      inputCur = input[field]

      if (!inputCur && create !== true) return (null)

      // swap schema and input
      schema = schemaCur
      input = inputCur
      inArray = null
    }

    // console.log("will write at", input)

    return ({ schema, input, fields })

    // return (null)
  }

  remove (line) {
    const node = this.get(line)
    if (node) {
      const key = node.fields[node.fields.length - 1]
      if (Array.isArray(node.input)) node.input.splice(key, 1)
      else delete node.input[node.fields[node.fields.length - 1]]
    }
  }
}

module.exports = fieldifyInput
