const { configValue } = require("../utils")
const countries = require('country-data-list').countries

const countriesList = [];
const countriesOptions = {};
const countriesDetection = {};

for (var country of countries.all) {
    if (country.status === "deleted")
        continue;

    countriesList.push(country)
    countriesOptions[country.alpha3] = country.name

    countriesDetection[country.countryCallingCodes] = country
    countriesDetection[country.alpha2] = country
    countriesDetection[country.alpha3] = country
}

class fieldifyCountry { }

const ftCountryEncode = async (data) => {
    if (data.value instanceof fieldifyCountry)
        data.result = data.value.source;
    else
        data.result = data.value
}

const ftCountryExtractor = async (data) => {
    var ret = null

    const params = data.ctrl.params;
    const allowedCountries = configValue(ftCountryConfiguration, params, "allowedCountries")
    if (typeof data.value === "string") {
        const countryPointer = countriesDetection[data.value]
        if (!countryPointer) {
            data.error = `Can not find country ${data.value}`
            return
        }

        ret = new fieldifyCountry
        ret.source = data.value
        ret.country = countryPointer
    }
    else if (data.value instanceof fieldifyCountry) {
        ret = data.value;
    }
    else {
        data.error = "Can not decode country field"
        return(null)
    }

    // check allowed countries
    if(Array.isArray(allowedCountries)) {
        var found = false
        for(var allowed of allowedCountries) {
            if(allowed === ret.country.alpha3) 
            found = true
        }
        if(found === false) {
            data.error = "The selected country is not allowed"
            return(null)
        }
    }

    return(ret)
}

const ftCountryDecode = async (data) => {
    data.result = ftCountryExtractor(data)
};

const ftCountryVerify = async (data) => {
    ftCountryExtractor(data)
    data.result = data.value
};

const ftCountrySanitize = (data) => {

};

const ftCountryConfiguration = {
    allowedCountries: {
        $doc: 'Accepted countries',
        $required: true,
        $type: 'Select',
        $multiple: true,
        $options: countriesOptions
    },
}

/**
 * ftCountry object.
 */
const ftCountry = {
    encode: ftCountryEncode,
    decode: ftCountryDecode,
    verify: ftCountryVerify,
    sanatize: ftCountrySanitize,
    configuration: ftCountryConfiguration,
    countriesList,
    countriesOptions,
    countriesDetection
};

// Export ftCountry object
module.exports = ftCountry;
