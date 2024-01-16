const assert = require("assert")
const fieldify = require("..")

const stringTests = require("./types/string")
const numberTests = require("./types/number")
const momentTests = require("./types/moment")
const UrlTests = require("./types/URL")
const countryTests = require("./types/country")
const emailTests = require("./types/email")
const domainTests = require("./types/domain")
const TldTests = require("./types/TLD")
const booleanTests = require("./types/boolean")
const selectTests = require("./types/select")
const fieldNameTests = require("./types/fieldName")
const KVTests = require("./types/KV")
const IPTests = require("./types/IP")
const RegexTests = require("./types/regex")

const bulks = [
    {
        ref: "STRING",
        tests: stringTests
    },
    {
        ref: "BOOLEAN",
        tests: booleanTests
    },
    {
        ref: "NUMBER",
        tests: numberTests
    },
    {
        ref: "MOMENT",
        tests: momentTests
    },
    {
        ref: "URL",
        tests: UrlTests
    },
    {
        ref: "COUNTRY",
        tests: countryTests
    },
    {
        ref: "EMAIL",
        tests: emailTests
    },
    {
        ref: "DOMAIN",
        tests: domainTests
    },
    {
        ref: "TLD",
        tests: TldTests
    },
    {
        ref: "SELECT",
        tests: selectTests
    },
    {
        ref: "FIELDNAME",
        tests: fieldNameTests
    },
    {
        ref: "KV",
        tests: KVTests
    },
    {
        ref: "IP",
        tests: IPTests
    },
    {
        ref: "REGEX",
        tests: RegexTests
    },
]

// construct test in nested
const nestedBulks = []
for (let bulk of bulks) {
    const newBulk = {
        ref: bulk.ref,
        tests: []
    }

    for (var test of bulk.tests) {
        const newTest = { ...test }
        newTest.schema = { insideNested: newTest.schema }
        newTest.data = { insideNested: newTest.data }

        if ("encode" in newTest)
            newTest.encode = { insideNested: newTest.encode }
        if ("strictDecode" in newTest)
            newTest.strictDecode = { insideNested: newTest.strictDecode }
        if ("decode" in newTest)
            newTest.decode = { insideNested: newTest.decode }
        if ("strictVerify" in newTest)
            newTest.strictVerify = { insideNested: newTest.strictVerify }
        if ("verify" in newTest)
            newTest.verify = { insideNested: newTest.verify }

        newBulk.tests.push(newTest)
    }

    nestedBulks.push(newBulk)
}

// construct test in array
const arrayBulks = []
for (let bulk of bulks) {
    const newBulk = {
        ref: bulk.ref,
        tests: []
    }

    for (var test of bulk.tests) {
        const newTest = { ...test }
        newTest.schema = { insideArray: [newTest.schema] }
        newTest.data = { insideArray: [newTest.data] }

        if ("encode" in newTest)
            newTest.encode = { insideArray: [newTest.encode] }
        if ("strictDecode" in newTest)
            newTest.strictDecode = { insideArray: [newTest.strictDecode] }
        if ("decode" in newTest)
            newTest.decode = { insideArray: [newTest.decode] }
        if ("strictVerify" in newTest)
            newTest.strictVerify = { insideArray: [newTest.strictVerify] }
        if ("verify" in newTest)
            newTest.verify = { insideArray: [newTest.verify] }

        newBulk.tests.push(newTest)
    }

    arrayBulks.push(newBulk)
}

const bulkTests = [
    { ref: "STD", type: "Standard", bulks },
    {
        ref: "NEST", type: "Nested", bulks: nestedBulks, pointer: (ret) => {
            return (ret.result.insideNested)
        }
    },
    {
        ref: "ARR", type: "Array", bulks: arrayBulks, pointer: (ret) => {
            return (ret.result.insideArray[0])
        }
    },
]

describe('Asynchronous types testing', function () {
    const context = new fieldify.context

    for (let bulkTest of bulkTests) {
        describe(`Describing type ${bulkTest.type}`, function () {
            for (let bulk of bulkTest.bulks) {
                const bulkRef = `${bulk.ref}-${bulkTest.ref}`

                describe(`Describing type bulk tests ${bulkRef}`, function () {

                    function testingStrategy(test, strategy) {
                        const testRef = `${bulkRef}-${test.ref}`

                        var description = `Should success ${strategy}() against ${testRef}: ${test.description}`
                        if (test.error)
                            description = `Should fail ${strategy}() against ${testRef}: ${test.description}`

                        it(description, async () => {
                            const schema = new fieldify.schema(context)
                            const cerror = schema.compile(test.schema)

                            if (cerror.errors.length > 0 && test.compileError !== true)
                                throw Error(cerror.errors[0].message)
                            else if (cerror.errors.length > 0 && test.compileError === true)
                                return

                            const ret = await schema[strategy](test.data)

                            // realign pointer if neeeded
                            if (bulkTest.pointer && ret.error !== true) {
                                ret.fields = bulkTest.pointer(ret)
                            }
                            else {
                                ret.fields = ret.result
                            }

                            // prepare call
                            const errorKey = strategy + 'Error'
                            const errorCode = errorKey in test ? test[errorKey] : test.error

                            const callbackKey = strategy + 'Callback'
                            const callback = test[callbackKey]

                            if (ret.error === true && errorCode !== true)
                                throw Error(Object.values(ret.fields)[0])
                            else if (ret.error !== true && errorCode === true)
                                throw Error("Test should failed")
                            else if (ret.error === true && errorCode === true)
                                return
                            else if (callback)
                                await callback(test, ret)
                            else if (strategy in test)
                                assert.deepEqual(ret.result, test[strategy]);

                        });
                    }

                    for (let test of bulk.tests) {
                        const testRef = `${bulkRef}-${test.ref}`
                        it(`Testing reentrance against ${testRef}`, async () => {

                            const schema = new fieldify.schema(context)
                            const cerror = schema.compile(test.schema)

                            if (cerror.errors.length > 0 && test.compileError !== true)
                                throw Error(cerror.errors[0].message)
                            else if (cerror.errors.length > 0 && test.compileError === true)
                                return

                            const strictDecodeError = "strictDecodeError" in test ?
                                test.strictDecodeError :
                                test.error

                            // pass 1
                            const pass1 = await schema.strictDecode(test.data)
                            if (pass1.error === true && strictDecodeError !== true)
                                throw Error(Object.values(pass1.fields)[0])
                            else if (pass1.error !== true && strictDecodeError === true)
                                throw Error("Test should failed")
                            else if (pass1.error === true && strictDecodeError === true)
                                return

                            // pass 2
                            const pass2 = await schema.encode(pass1.result)

                            // pass 3
                            const pass3 = await schema.strictDecode(test.data)
                            if (pass3.error === true && strictDecodeError !== true)
                                throw Error(Object.values(pass3.fields)[0])
                            else if (pass3.error !== true && strictDecodeError === true)
                                throw Error("Test should failed")
                            else if (pass3.error === true && strictDecodeError === true)
                                return
                        })

                        testingStrategy(test, "encode")
                        testingStrategy(test, "strictDecode")
                        testingStrategy(test, "decode")
                        testingStrategy(test, "strictVerify")
                        testingStrategy(test, "verify")
                    }
                });
            }
        })
    }
})





