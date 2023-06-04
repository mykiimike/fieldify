

const assert = require("assert")
const fieldify = require("..")

const stringTests = require("./types/string")
const numberTests = require("./types/number")
const momentTests = require("./types/moment")
const UrlTests = require("./types/URL")
const countryTests = require("./types/country")

const bulks = [
    // {
    //     ref: "STRING-B01",
    //     tests: stringTests
    // },
    // {
    //     ref: "NUMBER-B01",
    //     tests: numberTests
    // },
    // {
    //     ref: "MOMENT-B01",
    //     tests: momentTests
    // },
    // {
    //     ref: "URL-B01",
    //     tests: UrlTests
    // },
    {
        ref: "COUNTRY",
        tests: countryTests
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
    { ref: "NEST", type: "Nested", bulks: nestedBulks, pointer: (ret)=>{
        return(ret.result.insideNested)
    }},
    { ref: "ARR", type: "Array", bulks: arrayBulks, pointer: (ret)=>{
        return(ret.result.insideArray[0])
    }},
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
                        it(`Testing ${strategy}() against ${testRef}: ${test.description}`, async () => {
                            const schema = new fieldify.schema(context)
                            const cerror = schema.compile(test.schema)

                            if (cerror.errors.length > 0 && test.compileError !== true)
                                throw Error(cerror.errors[0].message)
                            else if (cerror.errors.length > 0 && test.compileError === true)
                                return

                            const ret = await schema[strategy](test.data)

                            // realign pointer if neeeded
                            if(bulkTest.pointer) {
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





