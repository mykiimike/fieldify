const types = require("./types")

/**
 * Represents a context for managing field types.
 */
class FieldifyContext {
    constructor() {
        this.types = {}

        // Register built-in types
        for (var key in types)
            this.registerType(key, types[key])
    }

    /**
     * Registers a new field type.
     * 
     * @param {string} name - The name of the type.
     * @param {object} obj - The type object.
     */
    registerType(name, obj) {
        const tname = name.toLowerCase()
        this.types[tname] = obj
    }

    /**
     * Retrieves a field type by name.
     * 
     * @param {string} name - The name of the type.
     * @returns {object|undefined} The type object if found, otherwise undefined.
     */
    getType(name) {
        const tname = name.toLowerCase()
        return this.types[tname]
    }

    /**
     * Verifies a single field value against a given type.
     * 
     * @param {*} value - The value to be verified.
     * @param {string} type - The name of the type.
     * @param {object} [params] - Additional parameters for verification.
     * @param {Array} [virt] - Virtual field path.
     * @param {Array} [real] - Real field path.
     * @returns {Promise<object>} A Promise that resolves to an object with the verification result.
     */
    async singleVerify(value, type, params, virt, real) {
        if (!params) params = {}
        if (!virt) virt = []
        if (!real) real = []

        const ret = {
            error: null
        }

        type = this.getType(type)
        if (!type) {
            ret.error = "Invalid type"
            return ret
        }

        const ctrl = {
            params,
            fields: [],
            isNested: false,
            isArray: false,
            type
        }

        const data = {
            error: null,
            context: this,
            virt: [...virt],
            real: [...real],
            value,
            ctrl
        }

        data.error = null
        data.virtLink = data.virt.join(".")
        data.realLink = data.real.join(".")

        await ctrl.type.verify(data)

        if (data.error)
            ret.error = data.error
        else
            ret.result = data.result

        return ret
    }
}

module.exports = FieldifyContext
