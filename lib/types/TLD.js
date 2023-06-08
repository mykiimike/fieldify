const {
    configValue,
} = require("../utils");

const { check, meta } = require("tlds2")

// Class definition for fieldifyTLD
class fieldifyTLD { }

// Encode function for TLD (Top-Level Domain) data
const ftTLDEncode = async (data) => {
    // If the data value is an instance of fieldifyTLD, use its source property as the result
    if (data.value instanceof fieldifyTLD)
        data.result = data.value.source;
    else
        data.result = data.value;
};

const ftTLDVerify = async (data) => {
    const params = data.ctrl.params;

    // If the data value is an instance of fieldifyTLD, set it as the result and return
    if (data.value instanceof fieldifyTLD) {
        data.result = data.value;
        return;
    }

    // Check the validity of the TLD using the 'tlds2' module
    const dRet = check(data.value);
    if (dRet.error) {
        // If the TLD is invalid, set an error message and return
        data.error = 'Invalid input: ' + dRet.info;
        return;
    }

    // Retrieve the accepted TLDs from the configuration
    const acceptedTLDs = configValue(ftTLDConfiguration, params, "acceptedTLDs");
    if (Array.isArray(acceptedTLDs)) {
        // Check if the TLD is in the list of accepted TLDs
        var found = false;
        for (var allowed of acceptedTLDs) {
            if (allowed === dRet.tld)
                found = true;
        }
        if (found === false) {
            // If the TLD is not allowed, set an error message and return null
            data.error = `TLD ${dRet.tld} is not allowed`;
            return null;
        }
    }

    // Retrieve the configuration values for punycode, subdomains, and create a new fieldifyTLD instance
    const acceptPunycode = configValue(ftTLDConfiguration, params, "acceptPunycode");
    if (dRet.punycode === true && acceptPunycode !== true) {
        data.error = 'Invalid input: Punycode is forbidden in the domain';
        return;
    }

    const allowSubDomains = configValue(ftTLDConfiguration, params, "allowSubDomains");
    if (dRet.subDomain.length > 0 && allowSubDomains !== true) {
        data.error = 'Invalid input: Sub domains are forbidden';
        return;
    }

    const ret = new fieldifyTLD;
    ret.source = data.value;
    ret.punycode = dRet.punycode;
    ret.validTLD = dRet.validTLD;
    ret.org = dRet.org;
    ret.tld = dRet.tld;
    ret.subDomain = dRet.subDomain;

    data.result = ret;
};


const ftTLDSanitize = (data) => {
    // Implementation not provided
};

// Configuration object for domain-related settings
const ftTLDConfiguration = {
    acceptPunycode: {
        $doc: 'Accept punycode in the domain name',
        $type: 'Boolean',
        $default: false
    },
    allowSubDomains: {
        $doc: 'Allow subdomains',
        $type: 'Boolean',
        $default: true
    },
    acceptedTLDs: {
        $doc: 'List of accepted TLDs for the field',
        $type: 'Select',
        $multiple: true,
        $default: 'both',
        $options: meta
    }
};

// Exported module
const ftTLD = {
    encode: ftTLDEncode,
    decode: ftTLDVerify,
    verify: ftTLDVerify,
    sanitize: ftTLDSanitize,
    configuration: ftTLDConfiguration
};

module.exports = ftTLD;
