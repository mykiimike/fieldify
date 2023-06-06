const {
    configValue,
    checkDomain,
    checkUsernameDomain
} = require("../utils");

/**
 * Encodes a domain name (no implementation provided).
 * @param {object} data - The data object.
 */
const ftDomainEncode = async (data) => {
    data.result = data.value;
};

/**
 * Verifies a domain name for validity.
 * @param {object} data - The data object.
 */
const ftDomainVerify = async (data) => {
    const params = data.ctrl.params;
    if (typeof data.value !== 'string') {
        data.error = 'Invalid input: Domain must be a string';
        return;
    }
    const acceptPunycode = configValue(ftDomainConfiguration, params, "acceptPunycode");
    if (data.value.length > 256) {
        data.error = 'Invalid input: Domain is too long';
        return;
    }
    const dRet = checkDomain(data.value);
    if (dRet.error) {
        data.error = 'Invalid input: ' + dRet.error;
        return;
    }
    if (dRet.punycode === true && acceptPunycode !== true) {
        data.error = 'Invalid input: Punycode is forbidden in the domain';
        return;
    }
    data.result = data.value;
};

/**
 * Sanitizes a domain name (no implementation provided).
 * @param {object} data - The data object.
 */
const ftDomainSanitize = (data) => {
    // Implementation not provided
};

// Configuration object for domain-related settings
const ftDomainConfiguration = {
    acceptPunycode: {
        $doc: 'Accept punycode in the domain name',
        $help: 'Accept punycode in the domain name',
        $required: false,
        $type: 'Boolean',
        $default: false
    }
};

// Exported module
const ftDomain = {
    encode: ftDomainEncode,
    decode: ftDomainVerify,
    verify: ftDomainVerify,
    sanitize: ftDomainSanitize,
    configuration: ftDomainConfiguration
};

module.exports = ftDomain;
