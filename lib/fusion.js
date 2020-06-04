function _specialClone (dst, src) {
  for (var a in src) {
    const p = src[a]
    if (Array.isArray(p)) {
      if (!Array.isArray(dst[a])) dst[a] = [{}]
      _specialClone(dst[a][0], p[0])
    }
    else if (p && typeof p === 'object') {
      // here we only remap javascript Object
      // all other object are pointed
      if (p.constructor.name === 'Object') {
        if (!dst[a]) dst[a] = {}
        _specialClone(dst[a], p)
      }
      else {
        dst[a] = src[a]
      }
    }
    else {
      dst[a] = src[a]
    }
  }
}

/**
 * Fusionning 2 objects schema, returning new one
 * @param  {Object} dst Destination object
 * @param  {Object} src Source object
 * @return {Object}     New object
 */
function fieldifyFusion (dst, src) {
  const ret = {}

  _specialClone(ret, dst)
  _specialClone(ret, src)

  return (ret)
}

module.exports = fieldifyFusion
