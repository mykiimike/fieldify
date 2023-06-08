const { configValue } = require("../utils");

/**
 * Encodes a boolean value.
 * @param {Object} data - The data object containing the value to be encoded.
 */
const ftSelectEncode = async (data) => {
    // Set the result as the original value
    data.result = data.value;
};

/**
 * Verifies and decodes a boolean value.
 * @param {Object} data - The data object containing the value to be verified and decoded.
 */
const ftSelectVerify = async (data) => {
    // Extract control parameters from data
    const params = data.ctrl.params;

    // Retrieve options from configuration
    const options = configValue(ftSelectConfiguration, params, "options");

    // Check if multiple selection is allowed
    const multiple = configValue(ftSelectConfiguration, params, "multiple");
    if (multiple === true) {
        const min = configValue(ftSelectConfiguration, params, "min");
        const max = configValue(ftSelectConfiguration, params, "max");

        if (!Array.isArray(data.value)) {
            data.error = `Invalid array`;
            return;
        }

        if (min && data.value.length < min) {
            data.error = `You need to add more selections (min: ${min})`;
            return;
        }

        if (max && data.value.length > max) {
            data.error = `You need to remove selections (max: ${max})`;
            return;
        }

        // Check values
        const orgRealLink = data.realLink;
        const result = [];
        var error = false;
        for (var a = 0; a < data.value.length; a++) {
            const select = data.value[a];

            data.realLink = `${orgRealLink}[${a}]`;

            // Make sure it's a string
            const key = '' + select;

            // Check if it's allowed
            if (!options.hasOwnProperty(key)) {
                data.error = `Unknown type ${key}`;
                return;
            }

            result.push(select);
        }
        data.result = result;
    } else {
        // Make sure it's a string
        const key = '' + data.value;

        // Check if it's allowed
        if (!options.hasOwnProperty(key)) {
            data.error = `Unknown type ${key}`;
            return;
        }

        data.result = key;
    }
};

/**
 * Sanitizes a boolean value.
 * @param {Object} data - The data object containing the value to be sanitized.
 */
const ftSelectSanitize = (data) => {
    // TODO: Implement the sanitization logic for a boolean value
};

/**
 * Configuration object for ftSelect.
 */
const ftSelectConfiguration = {
    options: {
        $doc: 'Key/value table of possible selections',
        $required: true,
        $type: 'KV'
    },
    multiple: {
        $doc: 'Allows multiple selection',
        $required: false,
        $type: 'Select',
        $default: false
    },
    min: {
        $doc: 'Minimum selected items',
        $type: 'Number'
    },
    max: {
        $doc: 'Maximum selected items',
        $type: 'Number'
    }
};

/**
 * ftSelect object.
 */
const ftSelect = {
    encode: ftSelectEncode,
    decode: ftSelectVerify,
    verify: ftSelectVerify,
    sanitize: ftSelectSanitize,
    configuration: ftSelectConfiguration,
    // Here we specify that the parsing should not pay attention to casting errors
    // The type check will be performed by the handler
    noInputCast: true
};

// Export ftSelect object
module.exports = ftSelect;
