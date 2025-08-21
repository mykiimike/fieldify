module.exports = [
    {
        ref: "T0001",
        description: "Basic usage",
        schema: { test: { $type: "number", $required: true } },
        data: { test: "1" },
        compileError: false,
        error: false,
        encode: { test: 1 },
        strictDecode: { test: 1 },
        decode: { test: 1 },
        strictVerify: { test: 1 },
        verify: { test: 1 }
    },
    {
        ref: "T0002",
        description: "Using $min",
        schema: { test: { $type: "number", $min: 1, $required: true } },
        data: { test: 0 },
        compileError: false,
        error: true,
        encodeError: false
    },
    {
        ref: "T0003",
        description: "Using $max",
        schema: { test: { $type: "number", $max: 1, $required: true } },
        data: { test: 2 },
        compileError: false,
        error: true,
        encodeError: false
    },

    // both mode
    {
        ref: "T0003",
        description: "Using integer with both mode",
        schema: { test: { $type: "number", $acceptedTypes: "both", $required: true } },
        data: { test: 2 },
        compileError: false,
        error: false,
        encode: { test: 2 },
        strictDecode: { test: 2 },
        decode: { test: 2 },
        strictVerify: { test: 2 },
        verify: { test: 2 }
    },

    {
        ref: "T0004",
        description: "Using float with both mode",
        schema: { test: { $type: "number", $acceptedTypes: "both", $required: true } },
        data: { test: 2.2 },
        compileError: false,
        error: false,
        encode: { test: 2.2 },
        strictDecode: { test: 2.2 },
        decode: { test: 2.2 },
        strictVerify: { test: 2.2 },
        verify: { test: 2.2 }
    },
    // {
    //     ref: "T0005",
    //     description: "Trigger error when NaN with both mode",
    //     schema: { test: { $type: "number", $acceptedTypes: "both", $required: true } },
    //     data: { test: "NaN" },
    //     compileError: false,
    //     error: true,
    //     encodeError: false
    // },

    // integer mode
    {
        ref: "T0006",
        description: "Using integer with integer mode",
        schema: { test: { $type: "number", $acceptedTypes: "integer", $required: true } },
        data: { test: 2 },
        compileError: false,
        error: false,
        encode: { test: 2 },
        strictDecode: { test: 2 },
        decode: { test: 2 },
        strictVerify: { test: 2 },
        verify: { test: 2 }
    },

    {
        ref: "T0007",
        description: "Using float with integer mode",
        schema: { test: { $type: "number", $acceptedTypes: "integer", $required: true } },
        data: { test: 2.2 },
        compileError: false,
        error: false,
        encode: { test: 2.2 },
        strictDecode: { test: 2 },
        decode: { test: 2 },
        strictVerify: { test: 2 },
        verify: { test: 2 }
    },
    // {
    //     ref: "T0008",
    //     description: "Trigger error when NaN with integer mode",
    //     schema: { test: { $type: "number", $acceptedTypes: "integer", $required: true } },
    //     data: { test: "NaN" },
    //     compileError: false,
    //     error: true,
    //     encodeError: false
    // },

    // float mode
    {
        ref: "T0006",
        description: "Using integer with float mode",
        schema: { test: { $type: "number", $acceptedTypes: "float", $required: true } },
        data: { test: 2 },
        compileError: false,
        error: false,
        encode: { test: 2 },
        strictDecode: { test: 2 },
        decode: { test: 2 },
        strictVerify: { test: 2 },
        verify: { test: 2 }
    },

    {
        ref: "T0007",
        description: "Using float with float mode",
        schema: { test: { $type: "number", $acceptedTypes: "float", $required: true } },
        data: { test: 2.2 },
        compileError: false,
        error: false,
        encode: { test: 2.2 },
        strictDecode: { test: 2.2 },
        decode: { test: 2.2 },
        strictVerify: { test: 2.2 },
        verify: { test: 2.2 }
    },
    // {
    //     ref: "T0008",
    //     description: "Trigger error when NaN with float mode",
    //     schema: { test: { $type: "number", $acceptedTypes: "float", $required: true } },
    //     data: { test: "NaN" },
    //     compileError: false,
    //     error: true,
    //     encodeError: false
    // },

    // bigint mode
    {
        ref: "T0009",
        description: "Using integer with bigint mode",
        schema: { test: { $type: "number", $acceptedTypes: "bigint", $required: true } },
        data: { test: "2135443545314314134035403841381408048" },
        compileError: false,
        error: false,
        encode: { test: 2135443545314314134035403841381408048n },
        strictDecode: { test: 2135443545314314134035403841381408048n },
        decode: { test: 2135443545314314134035403841381408048n },
        strictVerify: { test: 2135443545314314134035403841381408048n },
        verify: { test: 2135443545314314134035403841381408048n }
    },

    {
        ref: "T0010",
        description: "Using float with bigint mode",
        schema: { test: { $type: "number", $acceptedTypes: "bigint", $required: true } },
        data: { test: 2.2 },
        compileError: false,
        error: true,
        encodeError: false
    },
    {
        ref: "T0011",
        description: "Trigger error when NaN with bigint mode",
        schema: { test: { $type: "number", $acceptedTypes: "bigint", $required: true } },
        data: { test: "NaN" },
        compileError: false,
        error: true,
        encodeError: false
    },

]