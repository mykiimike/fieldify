
// const fusion = require('./fusion')
// const compile = require('./compile')
// const iterator = require('./iterator')
// const assign = require('./assign')
// const utils = require('./utils')

class fieldifyInput {
  constructor (schema, value) {
    this.schema = schema
    this._value = value
    this.verifying = false
  }

  setValue (input) {
    this._value = input
  }

  getValue () {
    return (this._value)
  }

  verify (cb) {

  }

  reset () {

  }

  set (line, data) {
    const node = this.getCreate(line)
    if (node) node.input[node.fields[node.fields.length - 1]] = data
  }

  getCreate (line, leaf) {
    const fields = line.split('.')
    fields.shift()

    var schema = this.schema.handler.schema
    var input = this._value
    var schemaCur, inputCur

    for (var a = 0; a < fields.length - 1; a++) {
      var field = fields[a]

      if (!isNaN(field)) field = parseInt(field)

      if (Array.isArray(schema)) schemaCur = schema[0]
      else schemaCur = schema[field]

      if (!schemaCur) return (null)

      // no input found for this entry
      // initialize it
      inputCur = input[field]
      if (!inputCur) {
        if (schemaCur.$_nested === true && schemaCur.$_array !== true) {
          inputCur = input[field] = {}
        }
        else if (schemaCur.$_nested === true && schemaCur.$_array === true) {
          inputCur = input[field] = {}
        }
      }

      // swap schema and input
      schema = schemaCur
      input = inputCur
    }

    return ({ schema, input, fields })
  }

  get (line) {
    console.log('get', line)
  }

  remove (line) {

  }
}

module.exports = fieldifyInput
