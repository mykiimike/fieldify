
// The code defines a JavaScript module that exports a class called "fieldifySchema".
// The class is responsible for compiling and processing a schema object.

// Define a regular expression to match keys starting with "$".
const currentSet = 'F2022V1'
const leafRegex = /^\$/

// A function that extracts controllers from a schema object.
function extractControllers(schema) {
    const ret = {
        params: {},
        fields: [],
        array: {},
        isNested: false
    }
    for (var key in schema) {
        const value = schema[key]
        if (leafRegex.test(key)) {
            ret.params[key] = value
        }
        else if (Array.isArray(value)) {
            ret.array[key] = value
            ret.isNested = true
        }
        else {
            ret.fields.push(key)
            ret.isNested = true
        }
    }
    return (ret)
}

// A recursive function that iterates over a schema object and executes a callback function on each field.
function schemaIterator(data, onField, line = [], merge) {
    const ctrl = { ...extractControllers(data), ...merge }

    onField([...line], ctrl)

    for (var field of ctrl.fields) {
        line.push(field)
        schemaIterator(data[field], onField, line, { isArray: false })
    }

    for (var field in ctrl.array) {
        const value = ctrl.array[field]
        line.push(field)
        schemaIterator(value[0], onField, line, { isArray: true })
    }

    line.pop()
}

// The main class "fieldifySchema".
class fieldifySchema {
    constructor(context) {
        this.context = context
        this.routing = {}
    }

    // Compiles a schema object and returns the compiled result.
    compile(schema) {
        const ret = {
            errors: [],
            warnings: []
        }

        // TODO: process field expension

        // Iterate over the schema using the schemaIterator function.
        schemaIterator(schema, (line, ctrl) => {
            const key = line.join(".")
            this.routing[key] = ctrl

            // Resolve field type only on data field
            if (ctrl.isNested === false) {
                const name = ctrl.params.$type
                if (!name) {
                    ret.errors.push({ field: key, message: `Define a type for this field'` })
                    return
                }

                const type = this.context.getType(name)
                if (!type) {
                    ret.errors.push({ field: key, message: `Can not find type '${ctrl.params.$type}'` })
                    return
                }
                ctrl.type = type

                // TODO: sanitize type options
            }
        })

        return (ret)
    }

    // Returns the routing information for a given key.
    route(key) {
        return (this.routing[key])
    }

    // Converts data to a string representation based on the schema.
    async encode(data) {
        return (this.input(data, {
            rejectUnknown: false,
            rejectCast: false,
            rejectRequired: false,
            onAnalysis: async (data) => data.ctrl.type.encode(data)
        }))
    }

    // Decodes a string representation and returns the decoded data based on the schema.
    async strictDecode(data) {
        return (this.input(data, {
            onAnalysis: async (data) => data.ctrl.type.decode(data)
        }))
    }

    // Decodes a string representation and returns the decoded data based on the schema.
    async decode(data) {
        return (this.input(data, {
            rejectUnknown: false,
            rejectCast: false,
            rejectRequired: false,
            onAnalysis: async (data) => data.ctrl.type.decode(data)
        }))
    }

    // Performs strict verification on the data based on the schema.
    async strictVerify(data) {
        return (this.input(data, {
            onAnalysis: async (data) => data.ctrl.type.verify(data)
        }))
    }

    // Performs verification on the data based on the schema.
    async verify(data) {
        return (this.input(data, {
            rejectUnknown: false,
            onAnalysis: async (data) => data.ctrl.type.verify(data)
        }))
    }

    // Extracts data from the input without performing validation or casting.
    async filter(data) {
        return (this.input(data, {
            rejectUnknown: false,
            rejectCast: false,
            rejectRequired: false
        }))
    }

    // Processes the input data based on the schema and the provided options.
    async input(data, options) {
        const ret = {
            error: false,
            fields: {},
            result: {}
        }

        // Set default options and merge with the provided options.
        options = {
            onAnalysis: async (a) => { a.result = a.value },
            rejectUnknown: true,
            rejectCast: true,
            rejectRequired: true,
            ...options
        }

        // Asynchronously runs the analysis on the data.
        const runAnalysis = async (data) => {
            data.error = null
            data.virtLink = data.virt.join(".")
            data.realLink = data.real.join(".")

            await options.onAnalysis(data)

            if (data.error) {
                ret.error = true
                ret.fields[data.realLink] = data.error
            }
        }

        // Recursive iterator function to process the input data.
        const iterator = async (data, result, virt = [], real = []) => {
            // Check for required fields
            const ctrl = this.routing[virt.join(".")]

            // Search in fields
            for (var field of ctrl.fields) {
                const virtFieldKey = [...virt, field].join(".")
                const realFieldKey = [...real, field].join(".")
                const fieldAvailable = data.hasOwnProperty(field)
                const fieldCtrl = this.routing[virtFieldKey]
                if (fieldCtrl?.params?.$required === true && !fieldAvailable && options.rejectRequired === true) {
                    ret.error = true
                    ret.fields[realFieldKey] = `Field '${realFieldKey}' is required`
                }
            }

            // Search in array
            for (var field in ctrl.array) {
                const value = ctrl.array[field]
                const virtFieldKey = [...virt, field].join(".")
                const realFieldKey = [...real, field].join(".")
                const fieldAvailable = data.hasOwnProperty(field)
                const fieldCtrl = this.routing[virtFieldKey]
                if (fieldCtrl?.params?.$required === true && !fieldAvailable && options.rejectRequired === true) {
                    ret.error = true
                    ret.fields[realFieldKey] = `Field '${realFieldKey}' is required`
                }
            }

            // Follow input data
            for (var key in data) {
                const value = data[key]

                if (Array.isArray(value)) {
                    virt.push(key)
                    real.push(key)

                    const virtKey = virt.join(".")
                    const realKey = real.join(".")

                    // Check if the controller exists
                    const ctrl = this.routing[virtKey]
                    if (!ctrl) {
                        if (options.rejectUnknown === true) {
                            ret.error = true
                            ret.fields[realKey] = `Unknown array '${virtKey}'`
                        }
                        virt.pop()
                        real.pop()
                        continue
                    }

                    // Check if the schema requires an array
                    if (ctrl.isArray !== true) {
                        if (ctrl.type.noInputCast === true) {
                            const analysis = {
                                virt,
                                real,
                                value,
                                ctrl,
                                options
                            }
                            await runAnalysis(analysis)
                            result[key] = analysis.result
                            virt.pop()
                            real.pop()
                            continue
                        }

                        if (options.rejectCast === true) {

                            ret.error = true
                            ret.fields[realKey] = `Can not cast array into '${virtKey}' field`
                        }
                        virt.pop()
                        real.pop()
                        continue

                    }

                    // Check the size of the array based on the provided configuration parameters.

                    // Check if the minimum length parameter exists in the control parameters
                    if ("$min" in ctrl.params) {
                        // Check if the length of the array is less than the minimum
                        if (value.length < ctrl.params.$min) {
                            ret.error = true;
                            ret.fields[realKey] = `The array is too short and must be at least ${ctrl.params.$min} element(s) long`;
                            virt.pop();
                            real.pop();
                            continue;
                        }
                    }

                    // Check if the maximum length parameter exists in the control parameters
                    if ("$max" in ctrl.params) {
                        // Check if the length of the array exceeds the maximum
                        if (value.length > ctrl.params.$max) {
                            ret.error = true;
                            ret.fields[realKey] = `The array is too long and must be no more than ${ctrl.params.$max} element(s) long`;
                            virt.pop();
                            real.pop();
                            continue;
                        }
                    }

                    // Iterate over the array
                    if (ctrl.isNested === true) {
                        const rvalue = result[key] = []
                        for (var index = 0; index < value.length; index++) {
                            real.push(`${key}[${index}]`)

                            if (value[index] instanceof Object) {
                                const rindex = rvalue.push({})
                                await iterator(value[index], rvalue[rindex - 1], [...virt], [...real])
                            }

                            /// op
                            real.pop()
                        }
                    }
                    else {
                        const rvalue = result[key] = []
                        for (var index = 0; index < value.length; index++) {
                            real.push(`${key}[${index}]`)

                            const analysis = {
                                virt,
                                real,
                                value: value[index],
                                ctrl,
                                options
                            }
                            await runAnalysis(analysis)
                            rvalue.push(analysis.result)

                            /// op
                            real.pop()
                        }
                    }

                    virt.pop()
                    real.pop()
                }
                else {
                    virt.push(key)
                    real.push(key)

                    const virtKey = virt.join(".")
                    const realKey = real.join(".")

                    // Check if the controller exists
                    const ctrl = this.routing[virtKey]
                    if (!ctrl) {
                        if (options.rejectUnknown === true) {
                            ret.error = true
                            ret.fields[realKey] = `Unknown field '${virtKey}'`
                        }
                        virt.pop()
                        real.pop()
                        continue
                    }

                    // Check if the schema requires an array
                    if (ctrl.isArray === true) {
                        if (options.rejectCast === true) {
                            ret.error = true
                            ret.fields[realKey] = `Can not cast non-array into '${virtKey}' field`
                        }
                        virt.pop()
                        real.pop()
                        continue
                    }

                    // Check if the schema requires an object
                    if (ctrl.isNested === true && !(value instanceof Object)) {
                        if (options.rejectCast === true) {
                            ret.error = true
                            ret.fields[realKey] = `Can not cast non-object into '${virtKey}' field`
                        }
                        virt.pop()
                        real.pop()
                        continue
                    }

                    if (ctrl.isNested === true && value instanceof Object) {
                        result[key] = {}
                        await iterator(value, result[key], [...virt], [...real])
                    }
                    else {
                        const analysis = {
                            virt,
                            real,
                            value,
                            ctrl,
                            options
                        }
                        await runAnalysis(analysis)
                        result[key] = analysis.result
                    }

                    virt.pop()
                    real.pop()
                }
            }
        }

        await iterator(data, ret.result)
        if (ret.error === true) ret.result = {}

        return (ret)
    }

}

module.exports = fieldifySchema
