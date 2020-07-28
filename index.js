const utils = require('./lib/utils')
const fusion = require('./lib/fusion')
const assign = require('./lib/assign')
const iterator = require('./lib/iterator')
const compile = require('./lib/compile')
const schema = require('./lib/schema')
const input = require('./lib/input')
const types = require('./lib/types')
const fieldifyType = require('./lib/types/type')
const pack = require('./package.json')

module.exports = {
  schema,
  input,
  types,
  fusion,
  assign,
  iterator,
  compile,
  utils,
  version: pack.version,

  // this is a shortcut to retrieve the root object for types
  fieldifyType
}
