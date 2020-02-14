const utils = require("./utils");

/**
 * Fieldify Iterator
 *
 * This iterating method allow to compare a schema and an input
 * data. It implements the pipeline to allow errors generation
 * mainly schema typing error.
 * @param  {keyonPipeline} pipe   Related pipeline
 * @param  {Object} ret    Return reference
 * @param  {Object} schema Schema object
 * @param  {[type]} input  Unsafe input data
 * @param  {[type]} leaf   Leaf executor
 * @param  {[type]} lkey   Linear key (internal)
 * @param  {Function} end   End callback (internal) or pipe.$fifo()
 */
function fieldifyIterator(pipe, ret, schema, input, leaf, lkey, end) {

    utils.eachObject(schema, (key, value, next, oend) => {
        if (oend === true) {
            if (end) end();
            else pipe.$fifo()
            return;
        }

        if (!leafRegex.test(key)) {
            const user = input[key];
            const save = lkey;

            // construct linear key
            lkey = lkey ? lkey + "." + key : key;

            // schema awaiting array
            if (Array.isArray(value)) {
                value = value[0];

                // is array required ?
                if (pipe.initial === true && !user && value.$required === true) {
                    pipe.$error(400, lkey + " is a required array");
                    pipe.$end();
                    return;
                }

                // check if there is an input
                if (!user) {
                    lkey = save;
                    next();
                    return;
                }

                // check if input is an array
                if (user && !Array.isArray(user)) {
                    pipe.$error(400, "Invalid Type Array in " + lkey);
                    pipe.$end();
                    return;
                }

                const maxIndex = value.$maxArray || internal.$maxArray;

                // determine si le schema fait un access direct ou
                // passe par des champs
                if (utils.isThereObjectParams(value)) {
                    //console.log("pour "+lkey+" array à acces direct");
                    ret[key] = []

                    // follow user items
                    utils.eachItem(user, (index, ivalue, nextItem, end) => {
                        if (end === true) {
                            // prune
                            if (ret[key].length == 0) delete ret[key];

                            // restore lkey
                            lkey = save;

                            // next item
                            next();

                            return;
                        }

                        // evaluate maximum array index
                        if (index >= maxIndex) {
                            pipe.$error(400, "Maximum array limit reach for " + lkey);
                            pipe.$end();
                            return;
                        }

                        // assign result
                        var iret = {} // fake return
                        leaf(iret, key, value, ivalue, () => {
                            const p = iret[key];
                            if (p !== undefined) ret[key].push(p);
                            nextItem();
                        });
                    })

                }
                else {
                    //console.log("pour "+lkey+" array à acces indirect");
                    ret[key] = []

                    // follow user items
                    utils.eachItem(user, (index, ivalue, nextItem, end) => {
                        if (end === true) {
                            // prune
                            if (ret[key].length == 0) delete ret[key];

                            // restore lkey
                            lkey = save;

                            // next item
                            next();

                            return;
                        }

                        // evaluate maximum array index
                        if (index >= maxIndex) {
                            pipe.$error(400, "Maximum array limit reach for " + lkey);
                            pipe.$end();
                            return;
                        }

                        // assign result
                        var iret = {} // fake return
                        fieldifyIterator(pipe, iret, value, ivalue, leaf, lkey, () => {
                            if (Object.keys(iret).length > 0) ret[key].push(iret);
                            nextItem();
                        })
                    })
                }
            }
            // not an array
            else {
                // is array required ?
                if (pipe.initial === true && !user && value.$required === true) {
                    pipe.$error(400, lkey + " is a required value");
                    pipe.$end();
                    return;
                }

                // check if there is an input
                if (!user) {
                    lkey = save;
                    next();
                    return;
                }

                // determine si le schema fait un access direct ou
                // passe par des champs
                if (utils.isThereObjectParams(value)) {
                    //console.log("pour "+lkey+" champs à acces direct", value);
                    leaf(ret, key, value, user, () => {
                        // restore lkey
                        lkey = save;

                        // next item
                        next();
                    });
                }
                else {
                    //console.log("for "+lkey+" field indirect access");

                    ret[key] = {}
                    fieldifyIterator(pipe, ret[key], schema[key], input[key], leaf, lkey, () => {
                        // prune
                        if (Object.keys(ret[key]).length == 0) delete ret[key];

                        // restore lkey
                        lkey = save;

                        // next item
                        next();
                    })
                }
            }

            return;
        }

        next();
    })
}

module.exports = fieldifyIterator;