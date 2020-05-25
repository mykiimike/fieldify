const fieldify = require('../index')

const { schema, types } = fieldify

const cmp = {
  $type: types.String
}
const sc = {
  nested1: {
    nested2: cmp
  }
}
const hdl = new schema('user')
hdl.compile(sc)

describe('Testing schema lineup features', function () {
  it('should get the last node', function (done) {
    const ret = hdl.getLineup('.nested1.nested2')
    if (!ret) return (done('getLineup() returns null'))
    if (ret.$type.class !== cmp.$type.class) return (done('Comparing failed'))
    done()
  })

  it('should get the before last node', function (done) {
    const ret = hdl.getLineup('.nested1.nested2', true)
    if (!ret) return (done('getLineup() returns null'))
    if (ret.last.$type.class !== cmp.$type.class) return (done('Comparing last failed'))
    if (!('nested2' in ret.beforeLast)) return (done('Can not find the presence of nested2'))
    done()
  })

  it('should get immedite null from getLineup() ', function (done) {
    const ret = hdl.getLineup('.nested1.nested3')
    if (ret) return (done('getLineup() returns is not null null'))
    done()
  })

  it('should get indirect null from getLineup() using .last', function (done) {
    const ret = hdl.getLineup('.nested1.nested3', true)

    if (!ret) return (done('getLineup() returns null'))
    if (ret.last !== null) return (done('getLineup() ret.last returns is not null'))
    if (ret.beforeLast === null) return (done('getLineup() ret.beforeLast should have at least the root'))
    done()
  })

  it('should add the field nested3 in nested1 using setLineup()', function (done) {
    const n = {
      $type: types.String
    }

    var ret

    ret = hdl.setLineup('.nested1.nested3', n)
    if (ret !== true) return (done('Fail to setLineup()'))

    ret = hdl.getLineup('.nested1.nested3')
    if (!ret) return (done('getLineup() after setLineup() returns null'))
    if (ret.$type.class !== n.$type.class) return (done('Comparing failed'))

    done()
  })

  it('should change the field nested2 in nested1 using setLineup()', function (done) {
    const n = {
      $type: types.Email
    }

    var ret

    ret = hdl.setLineup('.nested1.nested2', n)
    if (ret !== true) return (done('Fail to setLineup()'))

    ret = hdl.getLineup('.nested1.nested2')
    if (!ret) return (done('getLineup() after setLineup() returns null'))
    if (ret.$type.class !== n.$type.class) return (done('Comparing failed'))

    done()
  })

  it('should rename the field nested3 in nested4', function (done) {
    var ret

    ret = hdl.renameLineup('.nested1.nested3', '.nested1.nested4')
    if (ret !== true) return (done('Fail to renameLineup()'))

    ret = hdl.getLineup('.nested1.nested4')

    if (!ret) return (done('getLineup() after setLineup() returns null'))
    if (ret.$type.class !== types.String.class) return (done('Comparing failed'))

    done()
  })

  it('should remove the field nested4 in nested1', function (done) {
    var ret

    ret = hdl.removeLineup('.nested1.nested4')
    if (ret !== true) return (done('Fail to removeLineup()'))

    ret = hdl.getLineup('.nested1.nested4')
    if (ret) return (done('getLineup() after setLineup(), nested4 is still present'))

    done()
  })
})
