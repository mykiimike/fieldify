const ftNumber = require('./number')
const ftString = require('./string')
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
    boolean: ftBoolean,
    url: ftURL,
    moment: ftMoment,
    country: ftCountry,
    email: ftEmail,
    domain: ftDomain,
    tld: ftTLD
}