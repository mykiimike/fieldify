/*
 * Fusion Assignation
 */
const fieldify = require('../index')

describe('Fusion Assignation', function () {
  it('should do a fusion between 2 objects with array', function (done) {
    const part1 = {
      entry: {
        arrayEntry: [{
          $read: true,

          insideArray: {
            $read: true
          }
        }]
      }
    }

    const part2 = {
      entry: {
        arrayEntry: [{
          insideArray: {
            $read: true,
            $done: true
          }
        }]
      }
    }

    const merge = fieldify.fusion(part1, part2)

    const jsonMerge = JSON.stringify(merge)
    if (jsonMerge !== '{"entry":{"arrayEntry":[{"$read":true,"insideArray":{"$read":true,"$done":true}}]}}') {
      return (done('Invalid fingerprint'))
    }

    done()
  })
})
