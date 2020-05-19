const assert = require('assert');
const fieldify = require("../index");

const { schema, types } = fieldify;

describe('Testing schema.verify()', function () {

    it('testing a very basic schema using String type', function (done) {
        const sc = {
            email: {
                $type: types.String,
                $maxLength: 128
            }
        }
        const input = {
            firstname: "Michael",
            last: "Vergoz"
        }
        const hdl = new schema("user")
        hdl.compile(sc)
        hdl.verify(input, (fieldified) => {
            done()
        })
    });

    it('should pass without required field', function (done) {
        const sc = {
            test: {
                $type: types.String,
                $write: true,
                $required: false
            }
        }
        const input = {}
        const hdl = new schema("test")
        hdl.compile(sc)
        hdl.verify(input, (fieldified) => {
            if(fieldified.error !== false) return(done("Verification got error"))
            done()
        })
    })

    it('should not pass with required field', function (done) {
        const sc = {
            test: {
                $type: types.String,
                $write: true,
                $required: true
            }
        }
        const input = {}
        const hdl = new schema("test")
        hdl.compile(sc)
        hdl.verify(input, (fieldified) => {
            if(fieldified.error !== true) return(done("Should have fieldified.error === true"))
            done()
        })
    })

    it('should have the write access to the field', function (done) {
        const sc = {
            test: {
                $type: types.String,
                $write: true
            }
        }
        const input = {test: "Yop"}
        const hdl = new schema("test")
        hdl.compile(sc)
        hdl.verify(input, (fieldified) => {
            if(fieldified.result.test !== "Yop") return(done('Should have fieldified.result.test === "Yop"'))
            done()
        })
    })

    it('should not have the write access to the field', function (done) {
        const sc = {
            test: {
                $type: types.String
            }
        }
        const input = {test: "Yop"}
        const hdl = new schema("test")
        hdl.compile(sc)
        hdl.verify(input, (fieldified) => {
            if(fieldified.result.test === "Yop") return(done('Should have fieldified.result.test !== "Yop"'))
            done()
        })
    })





});
