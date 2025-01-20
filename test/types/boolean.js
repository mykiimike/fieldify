
const data = [
    { "value": "true", "error": false, "result": true },
    { "value": "false", "error": false, "result": false },
    { "value": "n/a", "error": true },
    { "value": true, "error": false, "result": true },
    { "value": false, "error": false, "result": false },
    // { "value": 50, "error": true } // too much
]

const tests = []
var count = 0
for (var item of data) {
    const test = {
        ref: "T00" + count,
        description: `Testing ${item.value}`,
        schema: { test: { $type: "boolean", $required: true } },
        data: { test: item.value },
        compileError: false,
        error: item.error,
        encodeError: false,
        strictDecode: { test: item.result },
        decode: { test: item.result },
        strictVerify: { test: item.result },
        verify: { test: item.result }
    }
    if (item.options)
        test.schema.test = { ...test.schema.test, ...item.options }

    if (!item.result) {
        delete test.strictDecode
        delete test.decode
        delete test.strictVerify
        delete test.verify
    }

    tests.push(test)
    count++
}

module.exports = tests