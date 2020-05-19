const utils = require("./utils");
const fusion = require("./fusion");

class fieldifyHandler {
    constructor(schema) {
        this.orgSchema = Object.assign({}, schema)
        this.schema = Object.assign({}, schema);

        this._access = {}
        this._accessStack = []

    }

    branch(schema, line) {
        line = line||"";
        const { nestedObject, nestedOptions } = utils.getNO(schema)

        // construct options of the current branch
        const tmpAccess = {}
        for (var a in nestedOptions) {
            const ptr = nestedOptions[a];
            tmpAccess[ptr[0]] = ptr[1];
        }
        this._access = fusion(this._access, tmpAccess)

        if (nestedObject.length > 0) schema.$_nested = true;

        for (var key in nestedObject) {
            const ptrS = nestedObject[key];
            const no = utils.getNO(ptrS[1]);
            const subLine = line.length > 0?line+"."+ptrS[0]:ptrS[0];
            var drive = ptrS[1];

            // current key is an array
            if (Array.isArray(ptrS[1])) {
                drive = ptrS[1][0];
                drive.$_array = true;
            }
            // the current key is nested
            else if (no.nestedObject.length > 0) {
                drive.$_nested = true;
            }

            // push on the stack current accesses
            this._accessStack.push(this._access)
            
            // remove useless private info
            delete this._access.$_nested;
            delete this._access.$_array;

            // enter in the branch
            this.branch(drive, subLine)

            // set the current access
            drive.$_access = this._access;

            // restore the state of access
            this._access = this._accessStack.pop()
        }
    }
}

function fieldifyCompiler(schema) {
    const fib = new fieldifyHandler(schema);

    // process nested object
    fib.branch(fib.schema)

//    console.log(JSON.stringify(fib.schema, null, "\t"))

    return (fib);
}

module.exports = fieldifyCompiler;
