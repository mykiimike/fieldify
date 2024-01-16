
const data = [
    { "regex": "([a-z])", "error": false, "options": { "$allowFlags": false } },
    { "regex": "([a-z)", "error": true, "options": { "$allowFlags": false } },
    { "regex": "/([a-z)/i", "error": true, "options": { "$allowFlags": false } },

    { "regex": "/([a-z])/", "error": false, "options": { "$allowFlags": true } },
    { "regex": "/([a-z)/", "error": true, "options": { "$allowFlags": true } },

    { "regex": "/([a-z])/i", "error": false, "options": { "$allowFlags": true } },
    { "regex": "/([a-z)/i", "error": true, "options": { "$allowFlags": true } },
]

const tests = []
var count = 0
for (var item of data) {
    const test = {
        ref: "T00" + count,
        description: `Testing ${item.regex}`,
        schema: { test: { $type: "Regex" } },
        data: { test: item.regex },
        compileError: false,
        error: item.error,
        encodeError: false,
        strictDecode: { test: item.result },
        decode: { test: item.result },
        strictVerify: { test: item.result },
        verify: { test: item.result }
    }

    if (!item.result) {
        delete test.strictDecode
        delete test.decode
        delete test.strictVerify
        delete test.verify
    }
    if (item.options)
        test.schema.test = { ...test.schema.test, ...item.options }
    tests.push(test)
    count++
}

module.exports = tests