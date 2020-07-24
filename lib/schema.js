
const fusion = require('./fusion')
const compile = require('./compile')
const iterator = require('./iterator')
const assign = require('./assign')
const utils = require('./utils')
const set = require('./set')
const types = require('./types')

// const fieldifyTypes = require('@fieldify/types/esm')
const currentSet = 'F2020V1'

class fieldifySchema {
  constructor (name, options) {
    if (!options) options = {}

    // the set must be previously loaded
    if (options.set) this.set = set.get(currentSet)
    else this.set = set.load(currentSet, types)

    this.tree = options.tree || {}
    this.policy = options.policy || {
      required: false,
      read: true,
      write: true
    }

    // this.policy.required = this.policy.required === true
    // this.policy.read = this.policy.read === true
    // this.policy.write = this.policy.write === true
  }

  resolver (type) {
    return (this.set[type])
  }

  fusion (schema) {
    this.tree = fusion(this.tree, schema)
  }

  /**
   * Compile the targetted schema
   * @param {Object} schema The schema
   */
  compile (schema) {
    if (schema) this.tree = schema

    const localAssigner = (user, dst, object, source) => {
      dst.$_key = ('.' + source).split('.').pop()

      for (var a in object) dst[a] = object[a]

      var typeClass = null

      // the type is a string, use the resolver to retrieve
      // the good object control
      if (typeof object.$type === 'string') {
        dst.$type = this.resolver(object.$type)
        if (!dst.$type) {
          console.error('Can not resolv type ' + object.$type)
          return (true)
        }
        typeClass = dst.$type.class
      }
      else if (object.$type) {
        typeClass = object.$type.class
      }

      // create the type with the desired options

      dst.$_type = typeClass ? new typeClass(object.$options) : undefined
      dst.$_wire = '.' + source

      // apply default policy
      // use with caution
      if (user) {
        dst.$_hidden = true
        dst.$_wire = user + dst.$_wire
      }

      // here we apply policy with driven line
      for (var key in this.policy) {
        const rkey = '$' + key
        const value = this.policy[key]

        if (!(rkey in dst)) dst[rkey] = value
      }

      // sanatize options
      if (!user && dst.$_type && object.$options) {
        const correctedOptions = dst.$_type.sanatizeOptions(object.$options || {})
        dst.$options = correctedOptions
      }

      return (true)
    }

    // here we store the "original" non type schematized use
    // to work with lineup and to drive the flow of displaying
    const nonTypeSchematized = assign(this.tree, localAssigner)

    // extract the schematized types
    // this will be use in background for verification
    // and filtering
    const typeSchematized = assign(nonTypeSchematized, (user, dst, object, source) => {
      if (object.$_type && object.$_type.schematizer) {
        const patch = object.$_type.schematizer(object)
        if (patch !== null) {
          for (var a in object) dst[a] = object[a]

          // extract sub fields
          const extract = assign(patch, localAssigner, object.$_wire)
          for (var a in extract) dst[a] = extract[a]

          dst.$_schematized = true
        }
        else for (var a in object) dst[a] = object[a]
      }
      else for (var a in object) dst[a] = object[a]

      return (true)
    })

    // we will finally based the search on the assigned extraction
    this.handler = compile(nonTypeSchematized, this.resolver.bind(this))
    this.handlerSchematized = compile(typeSchematized, this.resolver.bind(this))
  }

  /**
   * Export the current working schema
   */
  export (pv) {
    const localAssigner = (user, dst, object, source) => {
      if (object.$_hidden === true) return (true)

      for (var a in object) {
        if (utils.leafPrivate.test(a) && pv === true) {
          dst[a] = object[a]
        }
        else if (utils.leaf.test(a) && utils.leafPrivate.test(a) === false && pv !== true) {
          dst[a] = object[a]
        }
      }

      if (typeof dst.$type !== 'string' && dst.$type) dst.$type = dst.$type.code

      return (true)
    }

    //  prune and return
    return (assign(this.handler.schema, localAssigner))
  }

  /**
   * Verify User Input following Schema Definition
   * @param {*} input User input
   * @param {*} onEnd Function is async, fired when verification is done
   */
  verify (input, onEnd) {
    const ret = {
      error: false
    }

    const opts = {
      handler: this.handlerSchematized,
      input: input,

      onAssign: (current, next) => {
        // get different pointer we need
        const { access, input } = current

        // check if access schema has right to write
        if (access.$write !== true) {
          // do not response to avoid field discovery
          // just ignore the field
          // if user set required without then it
          // will have logic conflict
          return (next())
        }

        // check if the field is required
        if (access.$required === true && input === undefined) {
          ret.error = true
          if (!ret.fields) ret.fields = {}
          ret.fields[current.line] = 'Required Field'
          return (next())
        }
        // in opposite, if the field is not required
        // then we should not run the verifier
        if (access.$required !== true && input === undefined) {
          // just a pass through
          return (next())
        }

        // run the type dependant verifier
        if (access.$_type) {
          access.$_type.verify(input, (error, message) => {
            // there is error during verification
            if (error === true) {
              ret.error = true
              if (!ret.fields) ret.fields = {}
              ret.fields[current.line] = message
              return (next())
            }

            // just assign value
            current.result[current.key] = input
            next()
          })
        }
        else {
          ret.error = true
          if (!ret.fields) ret.fields = {}
          ret.fields[current.line] = 'Need field interpretor'
          return (next())
        }
      },

      onEnd: (iterator) => {
        ret.result = iterator.result
        onEnd(ret)
      }
    }
    iterator(opts)
  }

  /**
   * Filter Database Output following Schema Definition
   * @param {*} output
   * @param {*} onEnd
   */
  filter (output, onEnd) {
    if (Array.isArray(output)) {
      const ret = {
        error: false,
        result: []
      }
      utils.eachItem(output, (index, ptr, next, oend) => {
        if (oend === true) return (onEnd(ret))

        // apply filter on each entry
        this._filterLine(ptr, ({ result }) => {
          ret.result.push(result)
          next()
        })
      })
    }
    else {
      this._filterLine(output, onEnd)
    }
  }

  /**
   * Encode the input data following fieldify schema
   * @param {*} input
   * @param {*} onEnd When operation is done
   */
  encode (input, onEnd) {
    this.flow('encode', input, onEnd)
  }

  /**
   * Decode the input data following fieldify schema
   * @param {*} input
   * @param {*} onEnd When operation is done
   */
  decode (input, onEnd) {
    this.flow('decode', input, onEnd)
  }

  /**
   * Execute type callback following the flow of the schema
   * @param {String} direction The executed callback inside the type
   * @param {*} input Input data
   * @param {*} onEnd Called when finish to read
   */
  flow (direction, input, onEnd) {
    const ret = {
      error: false
    }

    const opts = {
      handler: this.handlerSchematized,
      input: input,

      onAssign: (current, next) => {
        // get different pointer we need
        const { access, result, input } = current

        // run the type dependant verifier
        access.$_type[direction](input, (output) => {
          // just assign value
          result[current.key] = output
          next()
        })
      },

      onEnd: (iterator) => {
        ret.result = iterator.result
        onEnd(ret)
      }
    }
    iterator(opts)
  }

  /**
   * Get lineup allow to read the schema following a string
   * @param {String} lineup String, field separate by points
   * @param {Boolean} beforeLast Return the before last instead of the last one
   * @returns {Object}
   *
   * The string must start with a point:
   * getLineup(".") = get the root schema
   * getLineup(".fieldA.fieldB")
   */
  getLineup (lineup, beforeLast) {
    const fields = lineup.split('.')
    fields.shift()

    var bLast = this.handler.schema
    var root = this.handler.schema
    for (var a = 0; a < fields.length; a++) {
      const field = fields[a]
      var ptr = root[field]
      bLast = root

      if (Array.isArray(ptr)) ptr = ptr[0]

      if (!ptr) return (beforeLast === true ? { beforeLast: bLast, last: null, fields } : null)
      root = ptr
    }

    return (beforeLast === true ? { beforeLast: bLast, last: root, fields } : root)
  }

  /**
   * Set an object in the schema following the lineup string
   * @param {String} lineup
   * @param {Object} obj
   *
   * The string must start with a point:
   * setLineup(".fieldA.fieldB", {$type: Types.String})
   */
  setLineup (lineup, obj) {
    const root = this.getLineup(lineup, true)
    const injection = root.beforeLast
    const key = root.fields[root.fields.length - 1]

    if (!injection) return (false)

    // inject the field as it into the schema
    injection[key] = obj

    // during the injection and to avoid recompilation
    // we will dynamically resolv the type
    if (obj.$type && typeof obj.$type === 'string') {
      obj.$type = this.resolver(obj.$type)
    }

    return (true)
  }

  /**
   * Rename a line up
   * @param {String} oldLineup
   * @param {String} newLineup
   */
  renameLineup (oldLineup, newLineup) {
    // get old lineup info
    const root = this.getLineup(oldLineup, true)
    const injection = root.beforeLast
    const key = root.fields[root.fields.length - 1]
    const saved = injection[key]

    if (!injection || !saved) return (false)

    // prepare new lineup
    const fields = newLineup.split('.')
    fields.shift()
    const newKey = fields[fields.length - 1]

    if (!newKey) return (false)

    // restore on the new place
    injection[newKey] = saved

    return (true)
  }

  /**
   * Remove object (and everything else) following the lineup String
   * @param {String} lineup
   */
  removeLineup (lineup) {
    const root = this.getLineup(lineup, true)
    const injection = root.beforeLast
    const key = root.fields[root.fields.length - 1]

    if (!injection) return (false)

    // inject the field as it into the schema
    delete injection[key]

    return (true)
  }

  _filterLine (input, onEnd) {
    const ret = {
      error: false
    }

    const opts = {
      handler: this.handlerSchematized,
      input: input,

      onAssign: (current, next) => {
        // get different pointer we need
        const { access, result, input } = current

        // check if access schema has right to write
        if (access.$read !== true) {
          // do not response to avoid field discovery
          // just ignore the field
          // if user set required without then it
          // will have logic conflict
          return (next())
        }

        // run the type dependant verifier
        access.$_type.filter(input, (valid, message) => {
          if (valid !== true) {
            return (next())
          }

          // just assign value
          result[current.key] = input
          next()
        })
      },

      onEnd: (iterator) => {
        ret.result = iterator.result
        onEnd(ret)
      }
    }
    iterator(opts)
  }
}

module.exports = fieldifySchema
