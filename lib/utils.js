const leafRegex = /^\$/

const internal = {
  $required: true,
  $maxArray: 100
}

module.exports = {
  leaf: leafRegex,

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
      const fc = key.substr(0, 1)
      if (fc === '$') nestedOptions.push([key, ptr])
      else nestedObject.push([key, ptr])
    }

    return ({ nestedObject, nestedOptions })
  }
}
