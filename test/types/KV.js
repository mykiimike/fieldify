const long = {}
long["a".repeat(33)] = "long"

module.exports = [
    {
        ref: "T0001",
        description: "Basic selection usage",
        schema: { test: { $type: "KV", $required: true } },
        data: { test: { aa: "a", bb: "b" } },
        compileError: false,
        error: false,
        encode: { test: { aa: "a", bb: "b" } },
        strictDecode: { test: { aa: "a", bb: "b" } },
        decode: { test: { aa: "a", bb: "b" } },
        strictVerify: { test: { aa: "a", bb: "b" } },
        verify: { test: { aa: "a", bb: "b" } }
    },
    {
        ref: "T0002",
        description: "Invalid field name 1",
        schema: { test: { $type: "KV", $required: true } },
        data: { test: { a: "a" } },
        compileError: false,
        error: true,
        encodeError: false
    },
    {
        ref: "T0003",
        description: "Invalid field name 2",
        schema: { test: { $type: "KV", $required: true } },
        data: { test: long },
        compileError: false,
        error: true,
        encodeError: false
    },
    {
        ref: "T0004",
        description: "Invalid field name 3",
        schema: { test: { $type: "KV", $required: true } },
        data: { test: { "a!s": "a" } },
        compileError: false,
        error: true,
        encodeError: false
    },

    {
        ref: "T0005",
        description: "Not enought",
        schema: { test: { $type: "KV", $required: true, $min: 2 } },
        data: { test: { aaa: "a" } },
        compileError: false,
        error: true,
        encodeError: false
    },

    {
        ref: "T0006",
        description: "Too much",
        schema: { test: { $type: "KV", $required: true, $max: 1 } },
        data: { test: { aaa: "a", bbb: "b" } },
        compileError: false,
        error: true,
        encodeError: false
    },

    {
        ref: "T0007",
        description: "Test with numbers",
        schema: { test: { $type: "KV", $required: true, $valueType: "Number" } },
        data: { test: { aaa: 1, bbb: 1 } },
        compileError: false,
        error: false,
        encode: { test: { aaa: 1, bbb: 1 } },
        strictDecode: { test: { aaa: 1, bbb: 1 } },
        decode: { test: { aaa: 1, bbb: 1 } },
        strictVerify: { test: { aaa: 1, bbb: 1 } },
        verify: { test: { aaa: 1, bbb: 1 } }
    },

    {
        ref: "T0008",
        description: "Test with domains",
        schema: { test: { $type: "KV", $required: true, $valueType: "Domain" } },
        data: { test: { aaa: "example.com", bbb: "example.ch" } },
        compileError: false,
        error: false,
        encode: { test: { aaa: "example.com", bbb: "example.ch" } },
        strictDecode: { test: { aaa: "example.com", bbb: "example.ch" } },
        decode: { test: { aaa: "example.com", bbb: "example.ch" } },
        strictVerify: { test: { aaa: "example.com", bbb: "example.ch" } },
        verify: { test: { aaa: "example.com", bbb: "example.ch" } }
    },
]