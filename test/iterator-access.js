/*
 * Iterator Access
 */
const crypto = require('crypto');
const assert = require('assert');
const fieldify = require("../index");

const schema = {
    $test: "ok",
    $write: false,

    name: {
        $read: false,
        $write: true,

        first: { $read: true },
        last: { $read: true }
    },
    password: {
        $encode: (value) => {
            const h = crypto.createHash('sha256');
            h.update(''+value);
            return(h.digest('hex'))
        },
        $write: true
    },

    // direct array assignation
    notes: [{
        $write: true,
        $spec: "good"
    }],

    // indirect array assignation
    comments: [{
        $write: true,
        who: { $read: true },
        text: {}
    }]
}

const input = {
    name: {
        first: "Michael",
        last: "Vergoz"
    },
    password: "Normally not shown",
    notes: [
        'Good note #1',
        'Good note #2'
    ],
    comments: [
        {
            who: "Michael Vergoz",
            text: "That is a good comment #1"
        },
        {
            who: "Robert De Nitro",
            text: "That is a good comment #2"
        },
    ]
}

function isReadable(current, next) {
    if (current.access.$read === true) {
        current.result[current.key] = current.input;
    }
    next();
}

function isWritable(current, next) {
    if (current.access.$write === true) {
        current.result[current.key] = current.input;
    }
    next();
}

function isWritableAndSyncEncode(current, next) {
    if (current.access.$write === true) {
        // do not use access to check callbacks
        if(current.object.$encode) {
            current.result[current.key] = current.object.$encode(current.input);
        }
        else {
            current.result[current.key] = current.input;
        }
    }
    next();
}

function isWritableAndAsyncEncode(current, next) {
    if (current.access.$write === true) {
        process.nextTick(() => {
            // do not use access to check callbacks
            if(current.object.$encode) {
                current.result[current.key] = current.object.$encode(current.input);
            }
            else {
                current.result[current.key] = current.input;
            }
            next();
        })
    }
    else next();
}

var compile;

describe('Iterator Access Control Tests', function () {

    describe('Access compilation', function () {
        it('should compile schema with right access', function () {
            compile = fieldify.compile(schema)
            assert.equal(typeof compile.schema, "object");
        });

        it('$test must be present in name.first', function () {
            assert.equal(compile.schema.name.first.$_access.$test, "ok");
        });

        it('$test must be present in name.last', function () {
            assert.equal(compile.schema.name.last.$_access.$test, "ok");
        });

        it('$test must be present in password', function () {
            assert.equal(compile.schema.password.$_access.$test, "ok");
        });

        it('password must NOT be readable', function () {
            assert.notEqual(compile.schema.password.$_access.$read, true);
        });

        it('name.first must be writable', function () {
            assert.equal(compile.schema.name.first.$_access.$write, true);
        });

        // direct array
        it('notes direct array assignment must be writable', function () {
            assert.equal(compile.schema.notes[0].$_access.$write, true);
        });

        it('notes spec must be set to good', function () {
            assert.equal(compile.schema.notes[0].$_access.$spec, "good");
        });

        // indirect array
        it('comment.who indirect array assignment must be writable', function () {
            assert.equal(compile.schema.comments[0].who.$_access.$write, true);
        });

        it('comment.who indirect array assignment must be readable', function () {
            assert.equal(compile.schema.comments[0].who.$_access.$read, true);
        });
    });


    describe('Data Extraction', function () {

        it('should extract only readable fields', function (done) {
            const opts = {
                handler: compile,
                input: input,
                onAssign: isReadable,
                onEnd: (iterator) => {
                    const res = iterator.result;
                    const jsons = JSON.stringify(iterator.result);
                    if (jsons != '{"name":{"first":"Michael","last":"Vergoz"},"comments":[{"who":"Michael Vergoz"},{"who":"Robert De Nitro"}]}') {
                        done("Entry is different: " + jsons);
                    }
                    else {
                        done();
                    }
                },
            }
            fieldify.iterator(opts)
        });

        it('should extract only writable fields', function (done) {
            const opts = {
                handler: compile,
                input: input,
                onAssign: isWritable,
                onEnd: (iterator) => {
                    const jsons = JSON.stringify(iterator.result);
                     const ret = 
                        '{"name":{"first":"Michael","last":"Vergoz"},"password":'+
                        '"Normally not shown","notes":["Good note #1","Good note #2"],'+
                        '"comments":[{"who":"Michael Vergoz","text":"That is a good '+
                        'comment #1"},{"who":"Robert De Nitro","text":"That is a '+
                        'good comment #2"}]}'

                    if (jsons != ret) {
                        done("Entry is different: " + jsons);
                    }
                    else {
                        done();
                    }
        
                },
            }
            fieldify.iterator(opts)
        });

        it('should extract only writable and encode synchronously fields', function (done) {
            const opts = {
                handler: compile,
                input: input,
                onAssign: isWritableAndSyncEncode,
                onEnd: (iterator) => {
                    const jsons = JSON.stringify(iterator.result);
                    //console.log(JSON.stringify(iterator.result, null, "\t"))
                    //console.log(jsons)
                    const ret = 
                        '{"name":{"first":"Michael","last":"Vergoz"},"password":'+
                        '"92f991dd3872ef8cde47b936c2501aa03c22351b39323f16c83fbbc1e2761592",'+
                        '"notes":["Good note #1","Good note #2"],"comments":[{"who":"Michael '+
                        'Vergoz","text":"That is a good comment #1"},{"who":"Robert De Nitro",'+
                        '"text":"That is a good comment #2"}]}'

                    if (jsons != ret) {
                        done("Entry is different: " + jsons);
                    }
                    else {
                        done();
                    }
                },
            }
            fieldify.iterator(opts)
        });

        it('should extract only writable and encode asynchronously fields', function (done) {
            const opts = {
                handler: compile,
                input: input,
                onAssign: isWritableAndAsyncEncode,
                onEnd: (iterator) => {
                    const jsons = JSON.stringify(iterator.result);

                    const ret = 
                        '{"name":{"first":"Michael","last":"Vergoz"},"password":'+
                        '"92f991dd3872ef8cde47b936c2501aa03c22351b39323f16c83fbbc1e2761592",'+
                        '"notes":["Good note #1","Good note #2"],"comments":[{"who":"Michael '+
                        'Vergoz","text":"That is a good comment #1"},{"who":"Robert De Nitro",'+
                        '"text":"That is a good comment #2"}]}'

                    if (jsons != ret) {
                        done("Entry is different: " + jsons);
                    }
                    else {
                        done();
                    }
                },
            }
            fieldify.iterator(opts)
        });
    })
    
});


