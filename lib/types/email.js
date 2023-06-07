const {
    configValue,
    checkUsernameEmail
} = require("../utils");

const { checkDomain } = require("tlds2")

/**
 * Encodes an email address.
 * @param {object} data - The data object.
 */
const ftEmailEncode = async (data) => {
    // Set the result as the original value
    data.result = data.value;
};

/**
 * Verifies the validity of an email address.
 * @param {object} data - The data object.
 */
const ftEmailVerify = async (data) => {
    // Extract control parameters from data
    const params = data.ctrl.params;

    // Check if the value is not a string
    if (typeof data.value !== 'string') {
        data.error = 'Email address must be a string';
        return;
    }

    // Retrieve configuration parameters
    const acceptPlus = configValue(ftEmailConfiguration, params, "acceptPlus");
    const acceptPunycode = configValue(ftEmailConfiguration, params, "acceptPunycode");

    if (data.value.length > 320) {
        data.error = 'Email address is too long';
        return;
    }

    // Check if the string contains an "@" character
    const t = data.value.split("@");
    if (t.length !== 2) {
        data.error = 'Invalid email address';
        return;
    }

    const username = t[0];
    const domain = t[1];

    // Check the username
    const uRet = checkUsernameEmail(username, acceptPlus);
    if (uRet.error) {
        data.error = uRet.error;
        return;
    }

    // Check the domain
    const dRet = checkDomain(domain);
    if (dRet.error) {
        data.error = dRet.error;
        return;
    }

    if (dRet.punycode === true && acceptPunycode !== true) {
        data.error = 'Punycode is forbidden in the domain';
        return;
    }

    data.result = data.value;
};

/**
 * Sanitizes an email address.
 * @param {object} data - The data object.
 */
const ftEmailSanitize = (data) => {
    // TODO: Implement email address sanitization logic
};

/**
 * Configuration object for ftEmail module.
 * @typedef {object} FtEmailConfiguration
 * @property {boolean} acceptPlus - Accept plus sign in the username part of the email.
 * @property {boolean} acceptPunycode - Accept punycode in the domain name.
 */

/**
 * ftEmail module.
 * @typedef {object} FtEmailModule
 * @property {Function} encode - Encodes an email address.
 * @property {Function} decode - Decodes an email address (alias for verify).
 * @property {Function} verify - Verifies the validity of an email address.
 * @property {Function} sanitize - Sanitizes an email address.
 * @property {FtEmailConfiguration} configuration - Configuration object for the module.
 */

/**
 * Configuration object for ftEmail module.
 * @type {FtEmailConfiguration}
 */
const ftEmailConfiguration = {
    acceptPlus: {
        $doc: 'Accept plus sign in the username part of the email',
        $help: 'Accept plus sign in the username part of the email',
        $required: false,
        $type: 'Boolean',
        $default: true
    },
    acceptPunycode: {
        $doc: 'Accept punycode in the domain name',
        $help: 'Accept punycode in the domain name',
        $required: false,
        $type: 'Boolean',
        $default: false
    }
};

/**
 * ftEmail module.
 * @type {FtEmailModule}
 */
const ftEmail = {
    encode: ftEmailEncode,
    decode: ftEmailVerify,
    verify: ftEmailVerify,
    sanitize: ftEmailSanitize,
    configuration: ftEmailConfiguration
};

// Export ftEmail module
module.exports = ftEmail;
