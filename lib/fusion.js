const merge = require("deepmerge");

const overwriteMerge = (destinationArray, sourceArray, options) => {
	if (typeof destinationArray[0] == "string" || typeof sourceArray[0] == "string") {
		return (merge(destinationArray, sourceArray))
	}
	if (!destinationArray[0]) destinationArray[0] = {}
	if (!sourceArray[0]) sourceArray[0] = {};
	return ([merge(destinationArray[0], sourceArray[0])])
}

/**
 * Fusionning 2 objects schema, returning new one
 * @param  {Object} dst Destination object
 * @param  {Object} src Source object
 * @return {Object}     New object
 */
function fieldifyFusion(dst, src) {
    return (merge(
        dst,
        src,
        { arrayMerge: overwriteMerge }
    ));
}

module.exports = fieldifyFusion