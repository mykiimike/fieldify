const testTime = 'Sat Jun 03 2023 23:16:42 GMT+0200 (Central European Summer Time)'
const testTimeDate = new Date(testTime)

async function waitObject(test, ret) {
    if (!("test" in ret.fields))
        throw Error("Can not find field test")
    else if (!(ret.fields.test instanceof URL))
        throw Error("Can not find valid URL")
}


module.exports = [
    {
        ref: "T0001",
        description: "Basic usage",
        schema: { test: { $type: "url", $required: true } },
        data: { test: "http://example.com/?query=ok" },
        compileError: false,
        error: false,
        encode: { test: "http://example.com/?query=ok" },
        strictDecodeCallback: waitObject,
        decodeCallback: waitObject,
        strictVerify: { test: "http://example.com/?query=ok" },
        verify: { test: "http://example.com/?query=ok" },
    },

]