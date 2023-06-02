const utils = require('./utils')

class fieldifyIteratorBuffer {
  constructor (options) {
    this.options = options
    this.handler = options.handler
    this.result = {}
    this.level = 0

    // correct callbacks
    options.onAssign = options.onAssign || ((current, next) => {
      // generic assignation
      current.result[current.key] = current.input
      next()
    })
    options.onEnter = options.onEnter || ((current) => { })
    options.onLeave = options.onLeave || ((current) => { })
    options.onEnd = options.onEnd || ((result) => { })
  }

  branch (schema, input, end, line) {
    line = line || '.'
    const no = utils.getNO(schema)
    const result = {}
    this.level++

    // when entering in a branch
    this.options.onEnter(schema)

    // follow each element of the current branch
    utils.eachItem(no.nestedObject, (index, ptr, next, oend) => {
      if (oend === true) {
        this.level--

        // when leaving in a branch
        this.options.onLeave(schema)

        // initial level
        if (this.level === 0) {
          this.result = result
          end(this, result)
        }
        // level up
        else {
          end(this, result)
        }

        return
      }

      const key = ptr[0]

      const current = {
        iterator: this,
        key: key,
        object: ptr[1],
        input: input ? input[ptr[0]] : null,
        line: line +'.'+ key,
        result: result
      }

      if (Array.isArray(current.object)) {
        // this is an input error
        if (!Array.isArray(current.input)) {
          // here we reset the input as we have
          // to follow all the schema
          current.input = null

          // here is a problem. the schema must
          // be followed at least one time in
          // order to reveal assignation errors
          // and notabely required fields.
          this.branch(
            current.object[0],
            null,
            (useless, subResult) => {
              next()
            },
            key
          )
        }
        else {
          // ok at this step we can follow the input
          // as we are sure is it an array.
          // Array is just a bridge between 2 branch.
          const arrayResult = []

          utils.eachItem(current.input, (index, ptr, next2, oend) => {
            if (oend === true) {
              // assign to result
              if (arrayResult.length > 0) result[key] = arrayResult

              // return to normal mode
              next()

              return
            }

            // management of array with direct and indirect assignment
            const arraySchema = current.object[0]

            if (arraySchema.$_nested === true) {
              // this is an input error
              if (typeof current.input !== 'object') {
                // here we reset the input as we have
                // to follow all the schema
                ptr = null
              }

              // console.log("ARRAY NEST", arraySchema, ptr)

              // change branche because of nested branch
              this.branch(
                arraySchema,
                ptr,
                (useless, subResult) => {
                  if (Object.keys(subResult).length > 0) arrayResult.push(subResult)
                  next2()
                },
                key
              )
            }
            // here we can get and compare values
            else {
              current.input = ptr

              // console.log("ARRAY DIRECT");

              // creation of a shortcut on the access fields
              current.access = arraySchema.$_access
              current.result = {}
             
              // execution of user assignment
              this.options.onAssign(current, () => {
                // store as array if there is result
                const values = Object.values(current.result)
                if (values.length > 0) {
                  arrayResult.push(values[0])
                }

                next2()
              })
            }
          })
        }
      }
      // here the input must be an object
      else if (current.object.$_nested === true) {
        // this is an input error
        if (typeof current.input !== 'object') {
          // here we reset the input as we have
          // to follow all the schema
          current.input = null
        }

        this.branch(
          current.object,
          current.input,
          (useless, subResult) => {
            if (Object.keys(subResult).length > 0) result[key] = subResult
            next()
          },
          key
        )
      }
      // here we can get and compare values
      else {
        // put a shortcut
        current.access = current.object.$_access

        // execution of user assignment
        this.options.onAssign(current, next)
      }
    })
  }
}

function fieldifyIterator (options) {
  const fib = new fieldifyIteratorBuffer(options)

  fib.branch(options.handler.schema, options.input, () => {
    // end user execution
    fib.options.onEnd(fib)
  })
}

module.exports = fieldifyIterator
