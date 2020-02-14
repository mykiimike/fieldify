const utils = require("./utils");

/**
  * Generator deep iterator is a complex function to assign a
  * new struture of a current schema
  * @param  {Object} schema Source schema to follow
  * @param  {fieldifyAssign~callback} leaf Executed on each leaf
  * @param  {Mixed} user User pointer
  * @param  {lkey} lkey Internal use
  */
function fieldifyAssign(schema, leaf, user, lkey) {
    var ret = {};

    // if there is object parameters send leaf immediatly
    if (utils.isThereObjectParams(schema)) {
        const lret = leaf(user, ret, schema, lkey);
        if (lret === false) return (ret);
    }

    // follow the rest of keys
    for (var key in schema) {
        var value = schema[key];
        if (!utils.leaf.test(key)) {
            const save = lkey;
            lkey = lkey ? lkey + "." + key : key;
            if (Array.isArray(value)) {
                ret[key] = [fieldifyAssign(value[0], leaf, user, lkey)];

                // prune branch
                if (Object.keys(ret[key][0]) == 0) delete ret[key];
            }
            else {
                ret[key] = fieldifyAssign(value, leaf, user, lkey);

                // prune the branch
                if (Object.keys(ret[key]) == 0) delete ret[key];
            }

            // restore state
            lkey = save;
        }
    }

    return (ret);
}

/**
 * This callback is displayed as part of the Requester class.
 * @callback fieldifyAssign~callback
 * @param {number} responseCode
 * @param {string} responseMessage
 */

module.exports = fieldifyAssign