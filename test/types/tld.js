
const data = [
    {
        "domain": "example.com",
        "result": {
            source: "example.com",
            punycode: false,
            validTLD: true,
            org: 'example',
            tld: 'com',
            subDomain: ''
        },
        "error": false
    },
    {
        "domain": "subdom.nested.example.co.uk",
        "result": {
            source: "subdom.nested.example.co.uk",
            punycode: false,
            validTLD: true,
            org: 'example',
            tld: 'co.uk',
            subDomain: 'subdom.nested'
        },
        "error": false
    },

    // testing punycode
    { "domain": "xn--w4r85el8fhu5dnra.ch", "error": true, "options": { "$acceptPunycode": false } },
    { "domain": "xn--w4r85el8fhu5dnra.ch", "error": true },
    { "domain": "xn--w4r85el8fhu5dnra.ch", "error": false, "options": { "$acceptPunycode": true } },

    // test sub domains
    { "domain": "test.test.example.ch", "error": true, "options": { "$allowSubDomains": false } },
    { "domain": "test.test.example.ch", "error": false, "options": { "$allowSubDomains": true } },

    // test TLD
    { "domain": "test.test.example.ch", "error": true, "options": { "$acceptedTLDs": ["com"] } },
    { "domain": "test.test.example.ch", "error": false, "options": { "$acceptedTLDs": ["ch"] } },
    { "domain": "test.test.example.co.uk", "error": false, "options": { "$acceptedTLDs": ["co.uk"] } },
]

const tests = []
var count = 0
for (var item of data) {
    const test = {
        ref: "T00" + count,
        description: `Testing ${item.domain}`,
        schema: { test: { $type: "TLD", $required: true } },
        data: { test: item.domain },
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