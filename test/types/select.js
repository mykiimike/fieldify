module.exports = [
    {
        ref: "T0001",
        description: "Basic selection usage",
        schema: { test: { $type: "select", $required: true, $options: { a: 1, b: 2 } } },
        data: { test: "a" },
        compileError: false,
        error: false,
        encode: { test: "a" },
        strictDecode: { test: "a" },
        decode: { test: "a" },
        strictVerify: { test: "a" },
        verify: { test: "a" }
    },
    {
        ref: "T0002",
        description: "Invalid selection",
        schema: { test: { $type: "select", $required: true, $options: { a: 1, b: 2 } } },
        data: { test: "2" },
        compileError: false,
        error: true,
        encodeError: false
    },
    {
        ref: "T0003",
        description: "Basic multiple selection usage",
        schema: { test: { $type: "select", $required: true, $options: { a: 1, b: 2, c: 3 }, $multiple: true } },
        data: { test: ["a", "c"] },
        compileError: false,
        error: false,
        encode: { test: ["a", "c"] },
        strictDecode: { test: ["a", "c"] },
        decode: { test: ["a", "c"] },
        strictVerify: { test: ["a", "c"] },
        verify: { test: ["a", "c"] }
    },
    {
        ref: "T0004",
        description: "Basic invalid multiple selection usage",
        schema: { test: { $type: "select", $required: true, $options: { a: 1, b: 2, c: 3 }, $multiple: true } },
        data: { test: ["a", "z"] },
        compileError: false,
        error: true,
        encodeError: false
    },
    {
        ref: "T0005",
        description: "Minimun invalid multiple selection usage",
        schema: { test: { $type: "select", $required: true, $min: 10, $options: { a: 1, b: 2, c: 3 }, $multiple: true } },
        data: { test: ["a", "c"] },
        compileError: false,
        error: true,
        encodeError: false
    },
    {
        ref: "T0006",
        description: "Maximun invalid multiple selection usage",
        schema: { test: { $type: "select", $required: true, $max: 1, $options: { a: 1, b: 2, c: 3 }, $multiple: true } },
        data: { test: ["a", "c"] },
        compileError: false,
        error: true,
        encodeError: false
    },
]