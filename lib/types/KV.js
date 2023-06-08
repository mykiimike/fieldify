const { configValue } = require("../utils");

/**
 * Encodes the data by setting the result as the original value.
 * @param {Object} data - The data to encode.
 */
const ftKVEncode = async (data) => {
    // Set the result as the original value
    data.result = data.value;
};

/**
 * Verifies the data by performing checks on the key-value pairs.
 * @param {Object} data - The data to verify.
 */
const ftKVVerify = async (data) => {
    // Extract control parameters from data
    const params = data.ctrl.params;

    // Retrieve configuration values
    const valueType = configValue(ftKVConfiguration, params, "valueType");
    const min = configValue(ftKVConfiguration, params, "min");
    const max = configValue(ftKVConfiguration, params, "max");

    const fieldName = data.context.getType("fieldName");

    const subType = data.context.getType(valueType);
    if (!subType) {
        // Invalid sub type
        data.error = `Invalid sub type`;
        return;
    }

    const result = {};
    var count = 0;
    const orgRealLink = data.realLink;
    for (var key in data.value) {
        const value = data.value[key];

        // Make sure the key is a string
        key = "" + key;

        data.realLink = `${orgRealLink}.${key}`;

        // Check field name
        const fieldRet = await data.context.singleVerify(key, "fieldName");
        if (fieldRet.error) {
            // Invalid field character
            data.error = `Invalid field character '${key}'`;
            return;
        }

        // Check value
        const valueRet = await data.context.singleVerify(value, valueType);
        if (valueRet.error) {
            // Invalid value for key
            data.error = `Invalid value for '${key}'`;
            return;
        }

        result[key] = value;
        count++;
    }

    // Check min and max
    if (min && min > count) {
        // Not enough keys
        data.error = `Not enough keys`;
        return;
    }
    if (max && max < count) {
        // Too many keys
        data.error = `Too many keys`;
        return;
    }

    data.result = result;
};

/**
 * Sanitizes the data by implementing the sanitization logic for a boolean value.
 * @param {Object} data - The data to sanitize.
 */
const ftKVSanitize = (data) => {
    // TODO: Implement the sanitization logic for a boolean value
};

/**
 * Configuration object for ftKV.
 * @typedef {Object} FtKVConfiguration
 * @property {string} valueType - Type of the value.
 * @property {number} [min] - Minimum selected items.
 * @property {number} [max] - Maximum selected items.
 */
const ftKVConfiguration = {
    valueType: {
        $doc: 'Type of the value',
        $type: 'String',
        $default: "String"
    },
    min: {
        $doc: 'Minimum entries',
        $type: 'Number'
    },
    max: {
        $doc: 'Maximum entries',
        $type: 'Number'
    }
};

/**
 * ftKV object.
 * @typedef {Object} FtKV
 * @property {Function} encode - Encodes the data.
 * @property {Function} decode - Decodes the data.
 * @property {Function} verify - Verifies the data.
 * @property {Function} sanitize - Sanitizes the data.
 * @property {FtKVConfiguration} configuration - Configuration object for ftKV.
 * @property {boolean} noInputCast - Specifies whether parsing should ignore casting errors.
 */
const ftKV = {
    encode: ftKVEncode,
    decode: ftKVVerify,
    verify: ftKVVerify,
    sanitize: ftKVSanitize,
    configuration: ftKVConfiguration,
    noInputCast: true
};

// Export ftKV object
module.exports = ftKV;
