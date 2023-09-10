const utils = require('./lib/utils')
const fusion = require('./lib/fusion')
const schema = require('./lib/schema')
const context = require('./lib/context')
const pack = require('./package.json')

const globalContext = new context

module.exports = {
    schema,
    context,
    //   types,
    global: globalContext,
    fusion,
    utils,
    compile: (info, context) => {
        if(!context) context = globalContext
        const sc = new schema(context)
        if(!sc.compile(info)) return(null)
        return (sc)
    },
    version: pack.version,
}
