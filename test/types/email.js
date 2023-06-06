
const data = [
    { "email": "te-st@example.com", "error": false },
    { "email": "te.st@example.com", "error": false },
    { "email": "te_st@example.com", "error": false },
    { "email": "te_st@a.b-b.ccc.com", "error": false },
    { "email": "te_st@-.bb.ccc.com", "error": true },
    { "email": "test@example.com", "error": false },
    { "email": "user@domain", "error": false },
    { "email": "invalid.email@", "error": true },
    { "email": "user@.com", "error": true },
    { "email": "-user@example.com", "error": true },
    { "email": "user-@example.com", "error": true },
    { "email": "user@domain.", "error": true },
    { "email": "@example.com", "error": true },
    { "email": "user@example..com", "error": true },
    { "email": "user@-domain.com", "error": true },
    { "email": "user@domain-.com", "error": true },
    { "email": "user@123.com", "error": false },
    { "email": "user@[123.45.67.89]", "error": true },
    { "email": "user@example.co.uk", "error": false },
    { "email": "user@example.com.", "error": true },
    { "email": "user+test@example.com", "error": false },
    { "email": "user+123@example.com", "error": false },
    { "email": "+test@example.com", "error": true },
    { "email": "user+@example.com", "error": true },
    { "email": "user+test+123@example.com", "error": false },
    { "email": "user+test123@domain.com", "error": false },
    { "email": "user+test@domain+.com", "error": true },
    { "email": "user+@123.com", "error": true },
    { "email": "user+test@example.co.uk", "error": false },
    { "email": "user@xn--w4r85el8fhu5dnra.ch", "error": false, "options": { $acceptPunycode: true } },
    { "email": "user@xn--w4r85el8fhu5dnra.ch", "error": true },
    { "email": "user@xn--w4r85el8fhu5dnra.ch", "error": true, "options": { $acceptPunycode: false } },
    { "email": "user@xn--bcher-kva.xn--bouch-fsa.example.com", "error": false, "options": { $acceptPunycode: true } }
]

const tests = []
var count = 0
for (var item of data) {
    const test = {
        ref: "T00" + count,
        description: `Testing ${item.email}`,
        schema: { test: { $type: "email", $required: true } },
        data: { test: item.email },
        compileError: false,
        error: item.error,
        encodeError: false,
        strictDecode: { test: item.email },
        decode: { test: item.email },
        strictVerify: { test: item.email },
        verify: { test: item.email }
    }
    if (item.options)
        test.schema.test = { ...test.schema.test, ...item.options }
    tests.push(test)
    count++
}

module.exports = tests