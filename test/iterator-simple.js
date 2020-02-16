/*
 * Iterator Basics
 */
const assert = require('assert');
const fieldify = require("../index");

describe('Iterator Basics', function () {

    it('should get a valid return from a simple schema', function (done) {
        const schema = {
            first: {},
            last: {}
        }

        const input = {
            first: "Michael",
            last: "Vergoz"
        }

        const hdl = fieldify.compile(schema)

        const opts = {
            handler: hdl,
            input: input,

            onAssign: ((current, next) => {
                current.result[current.key] = "OK " + current.input;
                next();
            }),
            onEnd: (iterator) => {
                // compare output
                const jsons = JSON.stringify(iterator.result);
                if (jsons != '{"first":"OK Michael","last":"OK Vergoz"}') {
                    done("Entry is different: " + jsons);
                }
                else {
                    done();
                }
            },
        }
        fieldify.iterator(opts)
    });


    it('should get a valid return from a nested schema', function (done) {
        const schema = {
            name: {
                first: {},
                last: {}
            }
        }

        const input = {
            name: {
                first: "Michael",
                last: "Vergoz"
            }
        }

        const hdl = fieldify.compile(schema)

        const opts = {
            handler: hdl,
            input: input,

            onAssign: ((current, next) => {
                current.result[current.key] = "OK " + current.input;
                next();
            }),
            
            onEnd: (iterator) => {
                // compare output
                const jsons = JSON.stringify(iterator.result);
                if (jsons != '{"name":{"first":"OK Michael","last":"OK Vergoz"}}') {
                    done("Entry is different: " + jsons);
                }
                else {
                    done();
                }
            },
        }
        fieldify.iterator(opts)
    });

    it('should get a valid return from a array schema', function (done) {
        const schema = {
            users: [{
                first: {},
                last: {}
            }]
        }

        const input = {
            users: [
                {
                    first: "AA1",
                    last: "AB1"
                },
                {
                    first: "BA2",
                    last: "BB2"
                },
            ]
        }

        const hdl = fieldify.compile(schema)

        const opts = {
            handler: hdl,
            input: input,

            onAssign: ((current, next) => {
                current.result[current.key] = "OK " + current.input;
                next();
            }),
            onEnd: (iterator) => {
                // compare output
                const jsons = JSON.stringify(iterator.result);
                if (jsons != '{"users":[{"first":"OK AA1","last":"OK AB1"},{"first":"OK BA2","last":"OK BB2"}]}') {
                    done("Entry is different: " + jsons);
                }
                else {
                    done();
                }
            },
        }
        fieldify.iterator(opts)
    });

    it('should follow all fields of the schema with no input', function (done) {
        var counter = 0;

        const schema = {
            simple: {},
            nested: {
                subNest1: {
                    subSubNest: {}
                },
                subNest: {},
            },
            users: [{
                first: {},
                last: {}
            }]
        }

        const input = { }

        const hdl = fieldify.compile(schema)

        const opts = {
            handler: hdl,
            input: input,

            onAssign: ((current, next) => {
                counter++;                
                next();
            }),
            onEnd: (iterator) => {
                if(counter != 5) {
                    done("Invalid Field Counter")
                }
                else {
                    done()
                }
            },
        }
        fieldify.iterator(opts)
    });



    /*
    it('should get a invalid return from a simple schema because of non nested input', function (done) {
        const schema = {
            first: {error: {}},
            last: {}
        }

        const input = {
           
            first: "Michael",
            last: "Vergoz"
            
        }

        const hdl = fieldify.compile(schema)


        const opts = {
            handler: hdl,
            input: input,
            assign: () => {},
            options: () => {},
            end: (err) => {

                done(err);
            },
        }
        fieldify.iterator(opts)
        
    });
*/

});


