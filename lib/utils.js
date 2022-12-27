const leafRegex = /^\$/
const leafPrivateRegex = /^\$_/

const internal = {
  $required: true,
  $maxArray: 100
}

module.exports = {
  leaf: leafRegex,
  leafPrivate: leafPrivateRegex,

  /**
   * Determine if there is a defined field in the current object stage
   * @param  {Object}  schema Current stage
   * @return {Boolean}      true there is reference, false it's free
   */
  isThereSubObject: (schema) => {
    for (var key in schema) {
      if (internal.hasOwnProperty(key)) continue
      if (!leafRegex.test(key)) {
        return (true)
      }
    }
    return (false)
  },

  /**
   * Determine if there an object parameter
   * @param  {Object}  schema Current stage
   * @return {Boolean}      true there is reference, false it's free
   */
  isThereObjectParams: (schema) => {
    for (var key in schema) {
      if (internal.hasOwnProperty(key)) continue
      if (leafRegex.test(key)) {
        return (true)
      }
    }
    return (false)
  },

  /**
   * Async object follower
   * @param  {[type]} objs       Object to follow
   * @param  {Function} executor Per item execution
   */
  eachObject: (objs, executor) => {
    var aObjects = []

    // transpose objets to array
    for (var a in objs) { aObjects.push([a, objs[a]]) }

    function next () {
      var o = aObjects.shift()
      if (o === undefined) {
        executor(null, null, next, true)
        return
      }
      executor(o[0], o[1], () => {
        process.nextTick(next)
      }, false)
    }

    process.nextTick(next)
  },

  /**
   * Async array follower
   * @param  {[type]} list     List of object
   * @param  {[type]} executor Per item execution
   */
  eachItem: (list, executor) => {
    var index = 0
    if (!Array.isArray(list)) { return (executor(null, null, null, true)) }
    function next () {
      var o = list[index]
      if (o === undefined) {
        executor(null, null, null, true)
        return
      }
      executor(index, o, () => {
        index++
        process.nextTick(next)
      }, false)
    }
    process.nextTick(next)
  },

  /**
   * Read async a list of callback
   * @param  {Array}    list   Array of callback
   * @param  {Function} finish Triggered when list is completed
   */
  sync: (list, finish) => {
    function next (index) {
      var exec = list[index]
      if (!exec) {
        if (finish) finish()
        return
      }
      exec(() => {
        index++
        process.nextTick(next, index)
      })
    }
    process.nextTick(next, 0)
  },

  getNO: (schema) => {
    const nestedObject = []
    const nestedOptions = []

    for (var key in schema) {
      const ptr = schema[key]
      const fc = key.substring(0, 1)
      if (fc === '$') nestedOptions.push([key, ptr])
      else nestedObject.push([key, ptr])
    }

    return ({ nestedObject, nestedOptions })
  },

  orderedRead: (schema, cb, wire) => {
    wire = wire || ''

    const dup = { ...schema }

    // remap keys
    for (var key in dup) {
      if (leafRegex.test(key)) {
        delete dup[key]
        continue
      }
    }

    // ordering the line
    const ordered = Object.values(dup).sort((a, b) => {
      if (Array.isArray(a)) a = a[0]
      if (Array.isArray(b)) b = b[0]

      return (a.$position - b.$position)
    })

    // this pass is use to reduce displacement on positions
    for (var index = 0; index < ordered.length; index++) {
      var ptr = ordered[index]
      if (Array.isArray(ptr)) ptr = ptr[0]
      ptr.$position = index
    }

    // follow and update the line
    for (var index = 0; index < ordered.length; index++) {
      const item = ordered[index]
      cb(index, item)
    }
  }
}
