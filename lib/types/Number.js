/**
 * Checks if a number is an integer.
 * @param {number} n - The number to check.
 * @returns {boolean} - True if the number is an integer, false otherwise.
 */
function isInt(n) {
    return n % 1 === 0;
}

/**
 * Checks if a number is a float.
 * @param {number} n - The number to check.
 * @returns {boolean} - True if the number is a float, false otherwise.
 */
function isFloat(n) {
    return n % 1 !== 0;
}

/**
 * Verifies and processes a number based on specified configuration parameters.
 * @param {object} data - The data object containing the number value and configuration.
 */
const ftNumberVerify = async (data) => {
    const params = data.ctrl.params;
    const acceptedTypes = params.$acceptedTypes || 'both';

    try {
        switch (acceptedTypes) {
            case "both":
                data.result = Number(data.value);
                break;
            case "integer":
                data.result = parseInt(data.value);
                break;
            case "float":
                data.result = parseFloat(data.value);
                break;
            case "bigint":
                data.result = BigInt(data.value);
                break;
            default:
                return;
        }
    } catch (e) {
        data.error = e.message;
        return;
    }

    if ("$min" in params) {
        const value = typeof data.result === 'bigint' ? BigInt(parseInt(params.$min)) : parseInt(params.$min);
        if (value > data.result) {
            data.error = `Number must be upper or equal to ${value}`;
        }
    }

    if ("$max" in params) {
        const value = typeof data.result === 'bigint' ? BigInt(parseInt(params.$max)) : parseInt(params.$max);
        if (value < data.result) {
            data.error = `Number must be lower or equal to ${value}`;
        }
    }
};

/**
 * Stringifies a number based on specified configuration parameters.
 * @param {object} data - The data object containing the number value and configuration.
 */
const ftNumberEncode = async (data) => {
    const params = data.ctrl.params;
    const acceptedTypes = params.$acceptedTypes || 'both';

    if (acceptedTypes === "bigint") {
        data.result = data.value.toString();
    } else {
        data.result = Number(data.value);
    }
};

/**
 * Sanitizes a number (empty function, no implementation).
 * @param {object} data - The data object containing the number value and configuration.
 */
const ftNumberSanitize = async (data) => {

};

/**
 * Configuration object for ftNumber.
 */
const ftNumberConfig = {
    acceptedTypes: {
        $doc: 'What kind of number to accept',
        $required: true,
        $type: 'Select',
        $default: 'both',
        $options: {
            both: 'Both Integer & Float',
            integer: 'Only Integer',
            float: 'Only Float',
            bigint: 'Big Integer (no float)'
        }
    },
    min: {
        $doc: 'Specify minimum value',
        $required: false,
        $type: 'Number'
    },
    max: {
        $doc: 'Specify maximum value',
        $required: false,
        $type: 'Number'
    }
};

/**
 * ftNumber module.
 */
const ftNumber = {
    encode: ftNumberEncode,
    decode: ftNumberVerify,
    verify: ftNumberVerify,
    sanitize: ftNumberSanitize,
    configuration: ftNumberConfig
};

module.exports = ftNumber;
