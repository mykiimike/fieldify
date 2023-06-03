function _specialClone(dst, src) {
    for (let a in src) {
        const p = src[a];
        if (Array.isArray(p)) {
            // If the property is an array
            if (!Array.isArray(dst[a])) dst[a] = [{}]; // If the destination property is not an array, initialize it as an array with an empty object
            _specialClone(dst[a][0], p[0]); // Recursively clone the first element of the array
        } else if (p && typeof p === 'object') {
            // If the property is an object
            // here we only remap javascript Object
            // all other objects are pointed
            if (p.constructor.name === 'Object') {
                // If the property is a plain JavaScript object
                if (!dst[a]) dst[a] = {}; // If the destination property doesn't exist, initialize it as an empty object
                _specialClone(dst[a], p); // Recursively clone the object
            } else {
                dst[a] = src[a]; // Assign the property value to the destination object as it is (not cloning)
            }
        } else {
            dst[a] = src[a]; // Assign the property value to the destination object as it is (not cloning)
        }
    }
}

/**
 * Merges two object schemas and returns a new object.
 * @param  {Object} dst - Destination object.
 * @param  {Object} src - Source object.
 * @return {Object} - New object.
 */
function fieldifyFusion(dst, src) {
    const ret = {};

    _specialClone(ret, dst); // Clone the properties from the destination object to the new object
    _specialClone(ret, src); // Clone the properties from the source object to the new object

    return ret;
}

module.exports = fieldifyFusion;
