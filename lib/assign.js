const utils = require('./utils')

/**
  * Generator deep iterator is a complex function to assign a
  * new struture of a current schema
  * @param  {Object} schema Source schema to follow
  * @param  {fieldifyAssignator~callback} leaf Executed on each leaf
  * @param  {Mixed} user User pointer
  * @param  {lkey} lkey Internal use
  */
function fieldifyAssignator(schema, leaf, user, lkey, first) {
  const { nestedObject } = utils.getNO(schema)

  var ret = {}

  if (first === false) {
    const lret = leaf(user, ret, schema, lkey)
    if (lret === false) return (ret)
  }

  // follow the rest of keys
  for (var a = 0; a < nestedObject.length; a++) {
    const key = nestedObject[a][0]
    const value = schema[key]

    const save = lkey
    lkey = lkey ? lkey + '.' + key : key
    if (Array.isArray(value)) {
      ret[key] = [fieldifyAssignator(value[0], leaf, user, lkey, false)]

      // prune branch
      if (Object.keys(ret[key][0]).length === 0) delete ret[key]
    }
    else {
      ret[key] = fieldifyAssignator(value, leaf, user, lkey, false)

      // prune the branch
      if (Object.keys(ret[key]).length === 0) delete ret[key]
    }

    // restore state
    lkey = save
  }

  if (first !== false) {
    for (const key in ret) {
      const ptr = ret[key]

      if (typeof ptr === 'object' && Object.keys(ptr) === 0) {
        delete ret[key]
      }
    }
  }
  return (ret)
}

/**
 * This callback is displayed as part of the Requester class.
 * @callback fieldifyAssignator~callback
 * @param {number} responseCode
 * @param {string} responseMessage
 */

module.exports = fieldifyAssignator
