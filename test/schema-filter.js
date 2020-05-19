const assert = require('assert');
const fieldify = require("../index");

const { schema, types } = fieldify;

describe('Testing schema.filter()', function () {

    it('filter on a single entry where read is TRUE', function (done) {
        const sc = {
            secret: {
                $type: types.String,
                $read: true
            }
        }
        const input = {
            secret: "This is a super secret"
        }
        const hdl = new schema("user")
        hdl.compile(sc)
        hdl.filter(input, (fieldified) => {
            if(fieldified.result.secret !== input.secret) return(done("Should have: fieldified.result.secret !== input.secret"))
            done()
        })
    });

    it('filter on a single entry where read is FALSE', function (done) {
        const sc = {
            secret: {
                $type: types.String,
                $read: false
            }
        }
        const input = {
            secret: "This is a super secret"
        }
        const hdl = new schema("user")
        hdl.compile(sc)
        hdl.filter(input, (fieldified) => {
            if(fieldified.result.secret === input.secret) return(done("Should have: fieldified.result.secret !== input.secret"))
            done()
        })
    });


    it('filter on a multiple entries where read is TRUE', function (done) {
        const sc = {
            secret: {
                $type: types.String,
                $read: true
            }
        }
        const input = [
            {
                secret: "This is a super secret"
            },
            {
                secret: "This is a super secret"
            }
        ]
        

        const hdl = new schema("user")
        hdl.compile(sc)
        hdl.filter(input, (fieldified) => {
            if(fieldified.result[0].secret !== input[0].secret) return(done("Should have: fieldified.result.secret !== input.secret"))
            done()
        })
    });


    it('filter on a multiple entry where read is FALSE', function (done) {
        const sc = {
            secret: {
                $type: types.String,
                $read: false
            }
        }
        const input = [
            {
                secret: "This is a super secret"
            },
            {
                secret: "This is a super secret"
            }
        ]
        const hdl = new schema("user")
        hdl.compile(sc)
        hdl.filter(input, (fieldified) => {
            if(fieldified.result[0].secret === input[0].secret) return(done("Should have: fieldified.result.secret !== input.secret"))
            done()
        })
    });

});
