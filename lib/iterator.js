const utils = require("./utils");

class fieldifyIteratorBuffer {
    constructor(options) {
        this.options = options;
        this.handler = options.handler;
        this.result = {}
        this.level = 0;

        // correct callbacks
        options.onAssign = options.onAssign || ((current, next) => {
            current.result[current.key] = current.input;
            next();
        });
        options.onEnd = options.onEnd || ((result) => { });
    }

    enter(schema, input, end, line) {
        line = line || "";
        const { nestedObject, nestedOptions } = utils.getNO(schema)
        const result = {}
        this.level++;

        utils.eachItem(nestedObject, (index, ptr, next, oend) => {
            if (oend === true) {
                this.level--;

                // initial level
                if(this.level == 0) {
                    this.result = result;
                    end(this, result);
                }
                // level up
                else {
                    end(this, result);
                }

                return;
            }

            const key = ptr[0];

            const current = {
                iterator: this,
                key: key,
                object: ptr[1],
                input: input?input[ptr[0]]:null,
                line: line+key,
                result: result
            }

            if(Array.isArray(current.object)) {
                // this is an input error
                if(!Array.isArray(current.input)) { 
                    // here we reset the input as we have 
                    // to follow all the schema
                    current.input = null;

                    // here is a problem. the schema must 
                    // be followed at least one time in 
                    // order to reveal assignation errors 
                    // and notabely required fields.
                     this.enter(
                        current.object[0], 
                        null, 
                        (useless, subResult) => {
                            next()
                        }, 
                        key
                    );
                }
                else {

                    // ok at this step we can follow the input 
                    // as we are sure is it an array.
                    // Array is just a bridge between 2 enter.
                    const arrayResult = []
                    utils.eachItem(current.input, (index, ptr, next2, oend) => {
                        if (oend === true) {
                            // assign to result
                            if(arrayResult.length > 0) result[key] = arrayResult;

                            // return to normal mode
                            next()

                            return;
                        }
                        
                        this.enter(
                            current.object[0], 
                            ptr, 
                            (useless, subResult) => {
                                if(Object.keys(subResult).length > 0) arrayResult.push(subResult);
                                next2();
                            }, 
                            key
                        );
                    });

                }
            }
            // here the input must be an object
            else if(current.object.$_nested === true) {
                // this is an input error
                if(typeof current.input !== "object") {
                    // here we reset the input as we have 
                    // to follow all the schema
                    current.input = null;
                }
                //console.log("NEST", current.object, current.input)

                this.enter(
                    current.object, 
                    current.input, 
                    (useless, subResult) => {
                        if(Object.keys(subResult).length > 0) result[key] = subResult;
                        next();
                    }, 
                    key
                );
            }
            // here we can get and compare values
            else {
                this.options.onAssign(current, next)
            }
        })

    }
}


function iterator(options) {
    const fib = new fieldifyIteratorBuffer(options);
  
    fib.enter(options.handler.schema, options.input, () => {
        fib.options.onEnd(fib);
    })

}


module.exports = iterator;