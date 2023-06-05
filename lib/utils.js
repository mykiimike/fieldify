// Define regular expressions for leaf and leafPrivate
const leafRegex = /^\$/;
const leafPrivateRegex = /^\$_/;

// Create arrays to store allowed characters
const allowedAlphanum = [];
const allowedUsernameBasic = [];
const allowedUsernamePlus = [];

// Initialize arrays with false values
for (var i = 0; i < 256; i++) {
    allowedAlphanum[i] = false;
    allowedUsernameBasic[i] = false;
    allowedUsernamePlus[i] = false;
}

// Allow uppercase alphabets
for (var i = 65; i <= 90; i++) {
    allowedAlphanum[i] = true;
    allowedUsernameBasic[i] = true;
    allowedUsernamePlus[i] = true;
}

// Allow lowercase alphabets
for (var i = 97; i <= 122; i++) {
    allowedAlphanum[i] = true;
    allowedUsernameBasic[i] = true;
    allowedUsernamePlus[i] = true;
}

// Allow digits
for (var i = 48; i <= 57; i++) {
    allowedAlphanum[i] = true;
    allowedUsernameBasic[i] = true;
    allowedUsernamePlus[i] = true;
}

// Allow hyphen and underscore in basic usernames
allowedUsernameBasic[45] = true;
allowedUsernameBasic[95] = true;

// Allow plus, hyphen, and underscore in plus usernames
allowedUsernamePlus[43] = true;
allowedUsernamePlus[45] = true;
allowedUsernamePlus[95] = true;

/**
 * Checks if a string only contains allowed characters.
 * @param {string} str - The string to check.
 * @param {boolean[]} table - The table of allowed characters.
 * @returns {boolean} - Returns true if the string only contains allowed characters, false otherwise.
 */
function isIn(str, table) {
    for (var i = 0; i < str.length; i++) {
        var codeAscii = str.charCodeAt(i);
        if (!table[codeAscii]) {
            return false;
        }
    }
    return true;
}

/**
 * Checks if a string contains only allowed alphanumeric characters.
 * @param {string} str - The string to check.
 * @returns {boolean} - Returns true if the string only contains allowed alphanumeric characters, false otherwise.
 */
function isAlphanum(str) {
    return isIn(str, allowedAlphanum);
}

/**
 * Checks if a string contains only allowed characters for a basic email username.
 * @param {string} str - The string to check.
 * @returns {boolean} - Returns true if the string only contains allowed characters for a basic email username, false otherwise.
 */
function isEmailUsernameBasic(str) {
    return isIn(str, allowedUsernameBasic);
}

/**
 * Checks if a string contains only allowed characters for a plus email username.
 * @param {string} str - The string to check.
 * @returns {boolean} - Returns true if the string only contains allowed characters for a plus email username, false otherwise.
 */
function isEmailUsernamePlus(str) {
    return isIn(str, allowedUsernamePlus);
}

/**
 * Gets a configuration value from either params or config.
 * @param {object} config - The configuration object.
 * @param {object} params - The parameters object.
 * @param {string} name - The name of the configuration value.
 * @returns {*} - Returns the configuration value.
 */
function configValue(config, params, name) {
    const kname = '$' + name;
    return (kname in params ? params[kname] : config[name].$default);
}

/**
 * Checks a domain name for validity.
 * @param {string} domain - The domain name to check.
 * @returns {object} - Returns an object with 'error' and 'punnycode' properties.
 */
function checkDomain(domain) {
    const ret = { error: null, punnycode: false }
    // check domain name
    const domainItems = domain.split(".")
    for (var item of domainItems) {
        if (item.length === 0) {
            ret.error = 'Invalid domain';
            return (ret);
        }

        // first and last must be alphanum
        const first = isAlphanum(item[0])
        const middle = isEmailUsernameBasic(item)
        const last = isAlphanum(item[item.length - 1])
        if (first === false || last === false || middle === false) {
            ret.error = 'Invalid domain';
            return (ret);
        }

        // check punnycode
        const punnyCode = /(--)/
        if (item.match(punnyCode))
            ret.punnycode = true
    }

    return (ret)
}

/**
 * Checks an email username for validity.
 * @param {string} username - The email username to check.
 * @param {boolean} acceptPlus - Whether plus usernames are accepted.
 * @returns {object} - Returns an object with 'error' and 'punnycode' properties.
 */
function checkUsernameEmail(username, acceptPlus) {
    const ret = { error: null, punnycode: false }
    const usernameItems = username.split(".")
    for (var item of usernameItems) {
        if (item.length === 0) {
            ret.error = 'Invalid username';
            return (ret)
        }

        // first and last must be alphanum
        const first = isAlphanum(item[0])
        const middle = acceptPlus === true ? isEmailUsernamePlus(item) : isEmailUsernameBasic(item)
        const last = isAlphanum(item[item.length - 1])
        if (first === false || last === false || middle === false) {
            ret.error = 'Invalid domain';
            return (ret);
        }

    }
    return (ret)
}

/**
 * Executes a list of callbacks synchronously.
 * @param {Function[]} list - Array of callbacks.
 * @param {Function} finish - Triggered when the list is completed.
 */
function sync(list, finish) {
    function next(index) {
        var exec = list[index];
        if (!exec) {
            if (finish) finish();
            return;
        }
        exec(() => {
            index++;
            process.nextTick(next, index);
        });
    }
    process.nextTick(next, 0);
}

// Exported variables and functions
module.exports = {
    leaf: leafRegex,
    leafPrivate: leafPrivateRegex,
    isAlphanum,
    isEmailUsernameBasic,
    isEmailUsernamePlus,
    configValue,
    checkDomain,
    checkUsernameEmail,
    sync
};
