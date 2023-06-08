const { configValue } = require("../utils")

/**
 * Encodes a boolean value.
 * @param {Object} data - The data object containing the value to be encoded.
 */
const ftBooleanEncode = async (data) => {
    // Set the result as the original value
    data.result = data.value;
}

/**
 * Verifies and decodes a boolean value.
 * @param {Object} data - The data object containing the value to be verified and decoded.
 */
const ftBooleanVerify = async (data) => {
    // Extract control parameters from data
    const params = data.ctrl.params;

    // Check if the value is not a string
    if (typeof data.value === 'string') {
        switch (data.value.toLowerCase()) {
            case "true":
                data.result = true
                break
            case "false":
                data.result = false
                break;
            default:
                data.error = 'Invalid boolean';
                return;
        }
    }
    else if (data.value === true || data.value === false) {
        data.result = data.value;
    }
    else {
        data.error = 'Invalid boolean';
    }
};

/**
 * Sanitizes a boolean value.
 * @param {Object} data - The data object containing the value to be sanitized.
 */
const ftBooleanSanitize = (data) => {
    // TODO: Implement the sanitization logic for a boolean value
};

/**
 * Configuration object for ftBoolean.
 */
const ftBooleanConfiguration = {
    // TODO: Add configuration options for ftBoolean
};

/**
 * ftBoolean object.
 */
const ftBoolean = {
    encode: ftBooleanEncode,
    decode: ftBooleanVerify,
    verify: ftBooleanVerify,
    sanitize: ftBooleanSanitize,
    configuration: ftBooleanConfiguration
};

// Export ftBoolean object
module.exports = ftBoolean;
