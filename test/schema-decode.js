const assert = require('assert');
const fieldify = require("../index");
const signderivaType = require("../lib/types/type")

const { schema, types } = fieldify;

class fakeType extends signderivaType {
    decode(input, cb) {
        cb(input+1)
        return(input+1)
    }
}

describe('Testing schema.decode()', function () {

    it('test the decode with a fake type', function (done) {
        const sc = {
            test: {
                $type: {class: fakeType}
            }
        }
        const input = {test: 1}
        const hdl = new schema("test")
        hdl.compile(sc)
        hdl.decode(input, (fieldified) => {
            if(fieldified.result.test !== 2) return(done("Decode did not increase value"))
            done()
        })
    })

});
