const fieldifySchema = require('./schema')
const assign = require('./assign')
const utils = require('./utils')

class fieldifyRoles {
  constructor(name, schema, options) {
    this._name = name
    if (!options) options = {}

    if (typeof schema !== 'object') {
      throw new Error('Schema argument is not an object')
    }

    // check types
    switch (schema.constructor.name) {
      case 'Object':
        break

      case 'fieldifySchema':
        schema = schema.tree
        break

      default:
        throw new Error(`Can not accept schema type of ${schema.constructor.name}`)
    }

    // this.default = this.extract(schema)
    this._roles = this._list(schema)

    // extract, compile and place the default schema
    const sc = this._extract(schema)
    this.default = new fieldifySchema(`${name}/default`, options)
    this.default.compile(sc)

    // prepare each schema with correct role
    for (var role in this._roles) {
      // rebuild the role schema
      const sc = this._extract(schema, role)

      // compile the role based schema
      const sch = new fieldifySchema(`${name}/${role}`, options)
      sch.compile(sc)

      // assign compiled schema to current object
      this._roles[role] = sc
      this[role] = sch
    }
  }

  // this private method will list all available roles in the schema
  _list(schema) {
    const ret = {}
    assign(schema, (user, dst, object, source) => {
      // check if roles are available for the field and rewrite them
      if (typeof object.$roles === 'object') {
        for (var role in object.$roles) {
          if (!ret[role]) ret[role] = {}
        }
      }
      return (true)
    })
    return (ret)
  }

  _extract(schema, role) {
    const schematized = assign(schema, (user, dst, object, source) => {
      // first we copy all subobject fields
      for (var a in object) {
        if (utils.leaf.test(a)) {
          dst[a] = object[a]
        }
      }

      // check if roles are available for the fields and rewrite fields
      if (role && typeof object.$roles === 'object' && typeof object.$roles[role] === 'object') {
        const ptr = object.$roles[role]
        for (var a in ptr) {
          if (utils.leaf.test(a)) {
            dst[a] = ptr[a]
          }
        }
      }

      // extracting will make roles disappear
      delete dst.$roles

      return (true)
    })

    return (schematized)
  }
}

module.exports = fieldifyRoles
