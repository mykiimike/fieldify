
const data = [
    { "domain": "example.com", "error": false },
    { "domain": "a.b-b.ccc.com", "error": false },
    { "domain": "-.bb.ccc.com", "error": true },
    { "domain": "domain", "error": false },
    { "domain": "", "error": true },
    { "domain": ".com", "error": true },
    { "domain": "domain.", "error": true },
    { "domain": "example..com", "error": true },
    { "domain": "-domain.com", "error": true },
    { "domain": "123.com", "error": false },
    { "domain": "[123.45.67.89]", "error": true },
    { "domain": "example.co.uk", "error": false },
    { "domain": "example.com.", "error": true },
    { "domain": "domain+.com", "error": true },
    { "domain": "xn--w4r85el8fhu5dnra.ch", "error": false, "options": { "$acceptPunycode": true } },
    { "domain": "xn--w4r85el8fhu5dnra.ch", "error": true },
    { "domain": "xn--w4r85el8fhu5dnra.ch", "error": true, "options": { "$acceptPunycode": false } },
    { "domain": "xn--bcher-kva.xn--bouch-fsa.example.com", "error": false, "options": { "$acceptPunycode": true } }
]

const tests = []
var count = 0
for (var item of data) {
    const test = {
        ref: "T00" + count,
        description: `Testing ${item.domain}`,
        schema: { test: { $type: "domain", $required: true } },
        data: { test: item.domain },
        compileError: false,
        error: item.error,
        encodeError: false,
        strictDecode: { test: item.domain },
        decode: { test: item.domain },
        strictVerify: { test: item.domain },
        verify: { test: item.domain }
    }
    if (item.options)
        test.schema.test = { ...test.schema.test, ...item.options }
    tests.push(test)
    count++
}

module.exports = tests