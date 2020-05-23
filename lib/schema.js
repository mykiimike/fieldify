
const fusion = require("./fusion");
const compile = require("./compile");
const iterator = require("./iterator");
const assign = require("./assign");
const utils = require("./utils");

class fieldifySchema {

  constructor(name, options) {
    if (!options) options = {}

    this.tree = options.tree || {}
  }

  fusion(schema) {
    this.tree = fusion(this.tree, schema)
  }

  /**
   * Compile the targetted schema
   * @param {Object} schema 
   */
  compile(schema) {
    if (schema) this.fusion(schema)

    // assign different controllers to each fields
    const extract = assign(this.tree, (user, dst, object, source) => {
      for(var a in object) dst[a] = object[a]

      // create the type with the desired options
      dst.$_type = object.$type ? new object.$type.class(object.$options) : undefined;
      dst.$_wire = "." + source;

      return (true)
    });

    // we will finally based the search on the assigned extraction
    this.handler = compile(extract)
  }

  /**
   * Verify User Input following Schema Definition
   * @param {*} input 
   * @param {*} onEnd 
   */
  verify(input, onEnd) {
    const ret = {
      error: false
    }

    const opts = {
      handler: this.handler,
      input: input,

      onAssign: ((current, next) => {
        // get different pointer we need
        const { access, result, input } = current;

        // check if access schema has right to write
        if (access.$write !== true) {
          // do not response to avoid field discovery
          // just ignore the field
          // if user set required without then it 
          // will have logic conflict
          return (next());
        }

        // check if the field is required 
        if (access.$required === true && input === undefined) {
          ret.error = true;
          if (!ret.fields) ret.fields = {}
          ret.fields[current.line] = "Required Field";
          return (next());
        }

        // run the type dependant verifier
        access.$_type.verify(input, (valid, message) => {
          if (valid !== true) {
            ret.error = true;
            if (!ret.fields) ret.fields = {}
            ret.fields[current.line] = message;
            return (next())
          }

          // just assign value
          current.result[current.key] = input;
          next();
        })
      }),

      onEnd: (iterator) => {
        ret.result = iterator.result;
        onEnd(ret)
      },
    }
    iterator(opts)
  }

  /**
   * Filter Database Output following Schema Definition
   * @param {*} output 
   * @param {*} onEnd 
   */
  filter(output, onEnd) {

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
  encode(input, onEnd) {
    this.flow("encode", input, onEnd)
  }

  /**
   * Decode the input data following fieldify schema
   * @param {*} input 
   * @param {*} onEnd When operation is done
   */
  decode(input, onEnd) {
    this.flow("decode", input, onEnd)
  }

  /**
   * Execute type callback following the flow of the schema
   * @param {String} direction The executed callback inside the type
   * @param {*} input Input data
   * @param {*} onEnd Called when finish to read
   */
  flow(direction, input, onEnd) {
    const ret = {
      error: false
    }

    const opts = {
      handler: this.handler,
      input: input,

      onAssign: ((current, next) => {
        // get different pointer we need
        const { access, result, input } = current;

        // run the type dependant verifier
        access.$_type[direction](input, (output) => {
          // just assign value
          result[current.key] = output;
          next();
        })
      }),

      onEnd: (iterator) => {
        ret.result = iterator.result;
        onEnd(ret)
      },
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
  getLineup(lineup, beforeLast) {
    const fields = lineup.split(".")
    fields.shift()

    var bLast = this.tree;
    var root = this.tree;
    for (var a = 0; a < fields.length; a++) {
      const field = fields[a]
      const ptr = root[field]
      bLast = root;

      if (!ptr) return (beforeLast === true ? { beforeLast: bLast, last: null, fields } : null)

      root = ptr;
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
  setLineup(lineup, obj) {
    const root = this.getLineup(lineup, true)
    const injection = root.beforeLast;
    const key = root.fields[root.fields.length - 1]

    if (!injection) return (false)

    // inject the field as it into the schema
    injection[key] = obj

    return (true)
  }

  /**
   * Rename a line up
   * @param {String} oldLineup 
   * @param {String} newLineup 
   */
  renameLineup(oldLineup, newLineup) {

    // get old lineup info
    const root = this.getLineup(oldLineup, true)
    const injection = root.beforeLast;
    const key = root.fields[root.fields.length - 1]
    const saved = injection[key]

    if (!injection || !saved) return (false)

    // prepare new lineup
    const fields = newLineup.split(".")
    fields.shift()
    const newKey = fields[fields.length - 1]

    if (!newKey) return (false)

    // restore on the new place
    injection[newKey] = saved;

    return (true)
  }

  /**
   * Remove object (and everything else) following the lineup String
   * @param {String} lineup 
   */
  removeLineup(lineup) {
    const root = this.getLineup(lineup, true)
    const injection = root.beforeLast;
    const key = root.fields[root.fields.length - 1]

    if (!injection) return (false)

    // inject the field as it into the schema
    delete injection[key];

    return (true)
  }

  _filterLine(input, onEnd) {
    const ret = {
      error: false
    }

    const opts = {
      handler: this.handler,
      input: input,

      onAssign: ((current, next) => {
        // get different pointer we need
        const { access, result, input } = current;

        // check if access schema has right to write
        if (access.$read !== true) {
          // do not response to avoid field discovery
          // just ignore the field
          // if user set required without then it 
          // will have logic conflict
          return (next());
        }

        // run the type dependant verifier
        access.$_type.filter(input, (valid, message) => {
          if (valid !== true) {
            return (next())
          }

          // just assign value
          result[current.key] = input;
          next();
        })
      }),

      onEnd: (iterator) => {
        ret.result = iterator.result;
        onEnd(ret)
      },
    }
    iterator(opts)
  }
}


module.exports = fieldifySchema