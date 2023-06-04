const testTime = 'Sat Jun 03 2023 23:16:42 GMT+0200 (Central European Summer Time)'
const testTimeDate = new Date(testTime)

module.exports = [
    {
        ref: "T0001",
        description: "Basic usage",
        schema: { test: { $type: "moment", $required: true } },
        data: { test: testTime },
        compileError: false,
        error: false,
        encode: { test: testTime },
        // strictDecode: { test: testTimeDate },
        // decode: { test: "Hello world" },
        strictVerify: { test: testTime },
        verify: { test: testTime }
    },
    
]