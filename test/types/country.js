async function waitObject(test, ret) {
    if (!("test" in ret.fields))
        throw Error("Can not find field test")

    if (!("source" in ret.fields.test))
        throw Error("Can not find source field")

    if (!("country" in ret.fields.test))
        throw Error("Can not find country field")

    if (ret.fields.test.country.alpha3 !== "CHE")
        throw Error("Can not find country")
}

module.exports = [
    {
        ref: "T0001",
        description: "Basic usage alpha-2",
        schema: { test: { $type: "country", $required: true } },
        data: { test: "CH" },
        compileError: false,
        error: false,
        encode: { test: "CH" },
        strictDecodeCallback: waitObject,
        decodeCallback: waitObject,
        strictVerify: { test: "CH" },
        verify: { test: "CH" }
    },
    {
        ref: "T0002",
        description: "Basic usage alpha-3",
        schema: { test: { $type: "country", $required: true } },
        data: { test: "CHE" },
        compileError: false,
        error: false,
        encode: { test: "CHE" },
        strictDecodeCallback: waitObject,
        decodeCallback: waitObject,
        strictVerify: { test: "CHE" },
        verify: { test: "CHE" }
    },
    {
        ref: "T0003",
        description: "Basic usage phone",
        schema: { test: { $type: "country", $required: true } },
        data: { test: "+41" },
        compileError: false,
        error: false,
        encode: { test: "+41" },
        strictDecodeCallback: waitObject,
        decodeCallback: waitObject,
        strictVerify: { test: "+41" },
        verify: { test: "+41" }
    },
    {
        ref: "T0004",
        description: "Invalid country code",
        schema: { test: { $type: "country", $required: true } },
        data: { test: "invalid" },
        compileError: false,
        error: true,
        encodeError: false
    },
    {
        ref: "T0005",
        description: "Try with not allowed country",
        schema: { test: { $type: "country", $allowedCountries: ["CHE"], $required: true } },
        data: { test: "FRA" },
        compileError: false,
        error: true,
        encodeError: false
    },
]