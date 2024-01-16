const {
    configValue,
} = require("../utils");

function extractFlags(str) {
    const reg = {
        pattern: "",
        flags: ""
    }
    const last = str.lastIndexOf("/")
    if(str.length > 2 && str[0] === "/" && last > 2) {
        reg.pattern = str.substring(1, last)
        reg.flags = str.substring(last+1)
    }
    else 
        reg.pattern = str
    return(reg)
}


/**
 * Encodes a domain name (no implementation provided).
 * @param {object} data - The data object.
 */
const ftRegexEncode = async (data) => {
    data.result = data.value;
};

/**
 * Verifies a domain name for validity.
 * @param {object} data - The data object.
 */
const ftRegexVerify = async (data) => {
    if(!data.value)
        return

    const params = data.ctrl.params;
    const allowFlags = configValue(ftRegexConfiguration, params, "allowFlags");

    if(allowFlags === true) {
        const ef = extractFlags(data.value);
        try {
            data.result = new RegExp(ef.pattern, ef.flags);
        } catch(e) {
            data.result = null;
            data.error = 'Invalid regex';
            return
        }
    }
    else {
        const ef = extractFlags(data.value);
        try {
            data.result = new RegExp(data.value);
        } catch(e) {
            data.result = null;
            data.error = 'Invalid regex';
            return
        }
    }
};

/**
 * Sanitizes a domain name (no implementation provided).
 * @param {object} data - The data object.
 */
const ftRegexSanitize = (data) => {
    // Implementation not provided
};

// Configuration object for domain-related settings
const ftRegexConfiguration = {
    allowFlags: {
        $doc: 'Allow flags in the regex',
        $required: false,
        $type: 'Boolean',
        $default: false
    }
};

// Exported module
const ftRegex = {
    encode: ftRegexEncode,
    decode: ftRegexVerify,
    verify: ftRegexVerify,
    sanitize: ftRegexSanitize,
    configuration: ftRegexConfiguration
};

module.exports = ftRegex;
