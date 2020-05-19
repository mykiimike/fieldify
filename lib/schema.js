
const fusion = require("./fusion");
const compile = require("./compile");
const iterator = require("./iterator");
const assign = require("./assign");
const utils = require("./iterator");

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
      if (!object.$type) {
        console.log("No valid type assigned for " + source)
        return (false);
      }

      // get all options be removing $type and 
      // all $ key before each other values
      // there is special case for $write and $read as-well
      const options = {}
      for (var key in object) {
        const ptr = object[key]

        if (
          key !== "$type" && 
          key !== "$read" && 
          key !== "$write" &&
          key !== "$required") {
          const nKey = key.substr(1)
          options[nKey] = ptr;
        }
      }

      // create the type with the desired options
      dst.$_type = new object.$type.class(options)
      dst.$_read = ("$read" in object) ? object.$read : false;
      dst.$_write = ("$write" in object) ? object.$write : false;
      dst.$_required = ("$required" in object) ? object.$required : false;
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
        if(access.$_write !== true) {
          // do not response to avoid field discovery
          // just ignore the field
          // if user set required without then it 
          // will have logic conflict
          return(next());
        }

        // check if the field is required 
        if(access.$_required === true && input === undefined) {
          ret.error = true;
          if (!ret.fields) ret.fields = {}
          ret.fields[current.line] = "Required Field";
          return(next());
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

  encode(input) {


  }
  
  filter(inputs) {

  }



  decode(input) {

  }
}


module.exports = fieldifySchema