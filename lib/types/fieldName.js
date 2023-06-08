const regex = /^([a-z0-9-]+)$/i;

/**
 * Encodes the field name in the provided data.
 * @param {object} data - The data object containing the field name.
 * @param {string} data.value - The original field name.
 * @param {string} [data.result] - The result after encoding the field name (output parameter).
 */
const ftFieldNameEncode = async (data) => {
    // Set the result as the original value
    data.result = data.value;
};

/**
 * Decodes and verifies the field name in the provided data.
 * @param {object} data - The data object containing the field name.
 * @param {string} data.value - The field name to decode and verify.
 * @param {string} [data.result] - The decoded and verified field name (output parameter).
 * @param {string} [data.error] - Error message in case of validation failure (output parameter).
 */
const ftFieldNameVerify = async (data) => {
    if (typeof data.value !== 'string') {
        data.error = 'Not a string';
        return;
    }

    if (data.value.length < 2) {
        data.error = 'fieldName is too short';
        return;
    }

    if (data.value.length > 32) {
        data.error = 'fieldName is too long';
        return;
    }

    if (!data.value.match(regex)) {
        data.error = 'Forbidden special chars';
        return;
    }

    // Set the result as the validated string
    data.result = data.value;
};

/**
 * Sanitizes the field name in the provided data.
 * @param {object} data - The data object containing the field name.
 * @param {string} data.value - The field name to sanitize.
 */
const ftFieldNameSanitize = (data) => {
    // Implement field name sanitization logic here
};

const ftFieldNameConfiguration = {
    // Define configuration options for ftFieldName
};

/**
 * ftFieldName module provides functions to encode, decode, verify, and sanitize field names.
 * @module ftFieldName
 */
const ftFieldName = {
    encode: ftFieldNameEncode,
    decode: ftFieldNameVerify,
    verify: ftFieldNameVerify,
    sanitize: ftFieldNameSanitize,
    configuration: ftFieldNameConfiguration
};

module.exports = ftFieldName;
