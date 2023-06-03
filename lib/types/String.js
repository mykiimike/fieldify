const { configValue } = require("../utils")

/**
 * Regular expression to match forbidden special characters.
 */
const strictRegex = /`|~|!|@|#|\$|%|\^|&|\*|\(|\)|\+|=|\[|\{|\]|\}|\||\\|'|<|,|\.|>|\?|\/|"|;|:/gm;

/**
 * Regular expression to match Unicode characters.
 */
const noUnicodeRegex = /[\x7E-\xFF]+/gm;

/**
 * Encode method.
 * @param {Object} data - The data object containing the value and control parameters.
 */
const ftStringEncode = async (data) => {
    // Set the result as the original value
    data.result = data.value;
}

/**
 * Verifies the validity of a string based on the provided parameters.
 * @param {Object} data - The data object containing the value and control parameters.
 */
const ftStringVerify = async (data) => {
    // Extract control parameters from data
    const params = data.ctrl.params;

    // Check if the value is not a string
    if (typeof data.value !== 'string') {
        data.error = 'Not a string';
        return;
    }

    // Retrieve configuration parameters
    const min = configValue(ftStringConfiguration, params, "min")
    const max = configValue(ftStringConfiguration, params, "max")
    const strict = configValue(ftStringConfiguration, params, "strict")
    const unicode = configValue(ftStringConfiguration, params, "unicode")

    // Check if the string length is less than the minimum
    if (data.value.length < min) {
        data.error = `String is too short (min: ${min})`;
        return;
    }

    // Check if the string length exceeds the maximum
    if (data.value.length > max) {
        data.error = `String is too long (max: ${max})`;
        return;
    }

    // Check if strict mode is enabled and the string contains forbidden special characters
    if (strict === true && data.value.match(strictRegex)) {
        data.error = 'Forbidden special chars';
        return;
    }

    // Check if Unicode is disabled and the string contains Unicode characters
    if (unicode === false && noUnicodeRegex.test(data.value)) {
        data.error = 'Unicode is forbidden';
        return;
    }

    // Set the result as the validated string
    data.result = data.value;
};

const ftStringSanitize = async (data) => {

};

const ftStringConfiguration = {
    placeholder: {
        $doc: 'Field placeholder',
        $required: false,
        $type: 'String'
    },
    help: {
        $doc: 'Help / Bottom message',
        $required: false,
        $type: 'String'
    },
    min: {
        $doc: 'Minimum length',
        $required: false,
        $type: 'Number',
        $default: 1
    },
    max: {
        $doc: 'Maximum length',
        $required: false,
        $type: 'Number',
        $default: 256,
    },
    strict: {
        $doc: 'Strict Mode',
        $help: 'Special characters are forbidden',
        $required: false,
        $type: 'Checkbox',
        $default: false
    },
    unicode: {
        $doc: 'Accept Unicode',
        $help: 'Accept characters from different languages',
        $required: false,
        $type: 'Checkbox',
        $default: true
    }
}
/**
 * ftString object.
 */
const ftString = {
    encode: ftStringEncode,
    decode: ftStringVerify,
    verify: ftStringVerify,
    sanatize: ftStringSanitize,
    configuration: ftStringConfiguration
};

// Export ftString object
module.exports = ftString;
