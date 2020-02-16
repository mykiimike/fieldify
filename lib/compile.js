const utils = require("./utils");
const iterator = require("./iterator");

class fieldifyHandler {
    constructor(schema) {
        this.orgSchema = Object.assign({}, schema)
        this.schema = Object.assign({}, schema);
    }

    branch(schema) {
        const { nestedObject, nestedOptions } = utils.getNO(schema)

        if(nestedObject.length > 0) schema.$_nested = true;

        for (var key in nestedObject) {
            const ptrS = nestedObject[key];
            const no = utils.getNO(ptrS[1]);
            var drive = ptrS[1];

            // current key is an array
            if(Array.isArray(ptrS[1])) {
                drive = ptrS[1][0];
                drive.$_array = true;
            }
            // the current key is nested
            else if(no.nestedObject.length > 0) {
                drive.$_nested = true;
            }

            // follow the rest
            this.branch(drive)
        }
    }
}

function fieldifyCompiler(schema) {
    const fib = new fieldifyHandler(schema);

    // process nested object
    fib.branch(fib.schema)

    //console.log(JSON.stringify(fib.schema, null, "\t"))

    return(fib);
}

module.exports = fieldifyCompiler;
