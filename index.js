const utils = require('./lib/utils')
const fusion = require('./lib/fusion')
const schema = require('./lib/schema')
const context = require('./lib/context')
const pack = require('./package.json')

module.exports = {
  schema,
  context,
//   types,
  fusion,
  utils,
  version: pack.version,
}
