const { configValue } = require("../utils")

// Decodes the data using moment library
const ftMomentDecode = async (data) => {
    const params = data.ctrl.params;

    // Extracts configuration values for each component of the date
    const year = configValue(ftMomentConfig, params, "year")
    const month = configValue(ftMomentConfig, params, "month")
    const date = configValue(ftMomentConfig, params, "date")
    const hours = configValue(ftMomentConfig, params, "hours")
    const minutes = configValue(ftMomentConfig, params, "minutes")
    const seconds = configValue(ftMomentConfig, params, "seconds")
    const milliseconds = configValue(ftMomentConfig, params, "milliseconds")

    try {
        const date = new Date(data.value);
        // Checks if the date is valid
        if (isNaN(date.getTime())) {
            data.error = "Invalid date";
            return;
        }
        data.result = date

        // Modifies the date based on the configuration values
        if (milliseconds !== true) date.setMilliseconds(0)
        if (seconds !== true) date.setSeconds(0)
        if (minutes !== true) date.setMinutes(0)
        if (hours !== true) date.setHours(12)
        if (date !== true) date.setDate(1)
        if (month !== true) date.setMonth(0)
        if (year !== true) date.setYear(0)
    } catch (e) {
        data.error = e.message;
        return;
    }
};

// Verifies if the given data value is a valid date
const ftMomentVerify = async (data) => {
    try {
        const date = new Date(data.value);
        if (isNaN(date.getTime())) {
            data.error = "Invalid date";
            return;
        }
        data.result = data.value
    } catch (e) {
        data.error = e.message;
        return;
    }
};

// Stringifies the date value by converting it to a timestamp
const ftMomentEncode = async (data) => {
    if (data.value instanceof Date)
        data.result = data.value.getTime();
    else
        data.result = data.value
};

// Sanitizes the moment data (To be implemented)
const ftMomentSanitize = async (controler) => {
    // TODO: Implement Moment sanitization logic
};

// Schematizes the moment data (To be implemented)
const ftMomentSchematizer = async (controler) => {
    // TODO: Implement Moment schematization logic
};

// Configuration object for ftMoment module
const ftMomentConfig = {
    year: { $type: "Boolean", $default: true },
    month: { $type: "Boolean", $default: true },
    date: { $type: "Boolean", $default: true },
    hours: { $type: "Boolean", $default: true },
    minutes: { $type: "Boolean", $default: true },
    seconds: { $type: "Boolean", $default: true },
    milliseconds: { $type: "Boolean", $default: false },
};

/**
 * ftMoment module.
 */
const ftMoment = {
    encode: ftMomentEncode,
    decode: ftMomentDecode,
    verify: ftMomentVerify,
    sanitize: ftMomentSanitize,
    schematizer: ftMomentSchematizer,
    configuration: ftMomentConfig,
};

module.exports = ftMoment;
