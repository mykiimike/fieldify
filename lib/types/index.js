const ftNumber = require('./number')
const ftString = require('./string')
const ftURL = require('./URL')
const ftMoment = require('./moment')
const ftCountry = require('./country')
const ftEmail = require('./email')

module.exports = {
    string: ftString,
    number: ftNumber,
    url: ftURL,
    moment: ftMoment,
    country: ftCountry,
    email: ftEmail
}