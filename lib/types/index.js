const ftNumber = require('./number')
const ftString = require('./string')
const ftURL = require('./URL')
const ftMoment = require('./moment')

module.exports = {
    string: ftString,
    number: ftNumber,
    url: ftURL,
    moment: ftMoment
}