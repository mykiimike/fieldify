module.exports = [
    {
        ref: "T0001",
        description: "Basic usage",
        schema: { test: { $type: "fieldName", $required: true } },
        data: { test: "helloWorld" },
        compileError: false,
        error: false,
        encode: { test: "helloWorld" },
        strictDecode: { test: "helloWorld" },
        decode: { test: "helloWorld" },
        strictVerify: { test: "helloWorld" },
        verify: { test: "helloWorld" }
    },
    {
        ref: "T0002",
        description: "Basic usage touching min",
        schema: { test: { $type: "fieldName", $required: true } },
        data: { test: "h" },
        compileError: false,
        error: true,
        encodeError: false
    },
    {
        ref: "T0003",
        description: "Basic usage touching max",
        schema: { test: { $type: "fieldName", $required: true } },
        data: { test: "h".repeat(33) },
        compileError: false,
        error: true,
        encodeError: false
    },
    {
        ref: "T0004",
        description: "Basic usage touching regex detection",
        schema: { test: { $type: "fieldName", $required: true } },
        data: { test: "Hello World" },
        compileError: false,
        error: true,
        encodeError: false
    },
]