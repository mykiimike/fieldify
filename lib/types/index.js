const ftNumber = require('./number')
const ftString = require('./string')
const ftSelect = require('./select')
const ftBoolean = require('./boolean')
const ftURL = require('./URL')
const ftMoment = require('./moment')
const ftCountry = require('./country')
const ftEmail = require('./email')
const ftDomain = require('./domain')
const ftTLD = require('./TLD')

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
    tld: ftTLD
}