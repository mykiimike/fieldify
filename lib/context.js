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
}

module.exports = fieldifyContext