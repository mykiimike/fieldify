const ftNumber = require('./Number')
const ftString = require('./String')
const ftSelect = require('./select')
const ftBoolean = require('./boolean')
const ftURL = require('./URL')
const ftMoment = require('./moment')
const ftCountry = require('./country')
const ftEmail = require('./email')
const ftDomain = require('./domain')
const ftTLD = require('./TLD')
const ftFieldName = require('./fieldName')
const ftKV = require('./KV')
const ftIP = require('./ip')
const ftRegex = require('./regex')

module.exports = {
    string: ftString,
    number: ftNumber,
    select: ftSelect,
    boolean: ftBoolean,
    url: ftURL,
    moment: ftMoment,
    country: ftCountry,
    email: ftEmail,
    domain: ftDomain,
    tld: ftTLD,
    fieldName: ftFieldName,
    KV: ftKV,
    IP: ftIP,
    regex: ftRegex
}