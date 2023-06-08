const types = require("./types")

class fieldifyContext {
    constructor() {
        this.types = {}
        // this.registerType("String", fsString)
        // this.registerType("Boolean", fsBoolean)
        // this.registerType("Checkbox", fsBoolean)

        for (var key in types)
            this.registerType(key, types[key])
    }

    registerType(name, obj) {
        const tname = name.toLowerCase()
        this.types[tname] = obj
    }

    getType(name) {
        const tname = name.toLowerCase()
        return (this.types[tname])
    }

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
            return
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

        return (ret)
    }
}

module.exports = fieldifyContext