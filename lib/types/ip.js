// Import required modules
const { configValue } = require("../utils");
const ipBigInt = require("ip-bigint");
const bigInt = require("big-integer");

/**
 * Parses the CIDR string and calculates information about the IP range.
 * @param {string} cidr - The CIDR string.
 * @returns {Object} - Information about the IP range.
 */
function ipparse(cidr) {
    cidr = cidr.split("/");

    if (cidr.length > 2) return { error: "Invalid CIDR" };

    const info = {
        ip: cidr[0],
        cidr: cidr.join("/"),
        start: {
            text: cidr[0],
        },
        end: {},
        trigger: {},
    };

    try {
        info.start.parse = ipBigInt.parse(info.start.text);
    } catch (e) {
        return { error: "Invalid CIDR" };
    }

    info.version = info.start.parse.version; // IP version

    // Prepare the mask
    info.mask = parseInt(
        cidr.length > 1 ? cidr[1] : info.start.parse.version === 4 ? 32 : 128
    );
    if (
        (info.start.parse.version === 4 && info.mask > 32) ||
        (info.start.parse.version === 6 && info.mask > 128)
    )
        return { error: "Mask is too high" };
    if (info.mask < 0) return { error: "Mask is too low" };

    var maxBits = info.start.parse.version === 4 ? 32 : 128;

    // Rebuild for start
    const sub = bigInt(info.start.parse.number).mod(
        Math.pow(2, maxBits - info.mask)
    );

    info.start.text = ipBigInt.stringify({
        number: bigInt(info.start.parse.number).subtract(sub).value,
        version: info.start.parse.version,
    });
    info.network = `${info.start.text}/${info.mask}`;
    info.start.parse = ipBigInt.parse(info.start.text);

    // Correct the representation of start
    info.start.dec = info.start.parse.number.toString();
    info.start.hex = info.start.parse.number.toString(16);

    /**
     * Fixes the hexadecimal representation of the IP by padding zeros if needed.
     * @param {string} hex - The hexadecimal string.
     * @returns {string} - The fixed hexadecimal string.
     */
    function fixHex(hex) {
        if (hex.length % 2) hex = `0${hex}`;
        if (hex.length != maxBits) hex = `${"0".repeat((maxBits / 8 - hex.length / 2) * 2)}${hex}`;
        return hex;
    }

    info.start.hex = fixHex(info.start.hex); // Fix start hex
    info.bitsUsed = maxBits - info.mask; // Bits consumed

    // One IP
    if (info.bitsUsed === 0) {
        info.hosts = 1;
        info.end = { ...info.start };
    }
    // Range
    else {
        info.hosts = bigInt(2).pow(info.bitsUsed).value; // Number of hosts

        // Textual IP
        try {
            info.end.text = ipBigInt.stringify({
                number: info.start.parse.number + info.hosts - 1n,
                version: info.start.parse.version,
            });
        } catch (e) {
            return { error: "CIDR goes too far" };
        }
        try {
            info.end.parse = ipBigInt.parse(info.end.text);
            if (info.end.parse.number > bigInt(2).pow(maxBits).value)
                throw new Error("CIDR goes too far");
        } catch (e) {
            return { error: "CIDR goes too far" };
        }

        info.end.dec = info.end.parse.number.toString();
        info.end.hex = fixHex(info.end.parse.number.toString(16));
    }

    const shift = 4;

    for (var a = 0; a < info.start.hex.length / shift; a++) {
        info.trigger[`s_dword${a + 1}`] = parseInt(
            info.start.hex.substring(a * shift, (a + 1) * shift),
            16
        );
        info.trigger[`e_dword${a + 1}`] = parseInt(
            info.end.hex.substring(a * shift, (a + 1) * shift),
            16
        );
    }

    // Pad IPv4
    if (info.version === 4) {
        for (var a = 0; a < 6; a++) {
            info.trigger[`s_dword${a + 3}`] = 0;
            info.trigger[`e_dword${a + 3}`] = 0;
        }
    }

    // Compute unit
    info.units = info.bitsUsed === 0 ? 1 : info.bitsUsed;
    if (info.version === 4) info.units *= 4;

    // Clean up
    delete info.start.parse;
    delete info.end.parse;
    info.hosts = info.hosts.toString();

    return info;
}

/**
 * Represents the fieldifyIP class.
 */
class fieldifyIP { }

/**
 * Encodes the fieldifyIP value.
 * @param {Object} data - The data object.
 */
const ftIPEncode = async (data) => {
    if (data.value instanceof fieldifyIP) data.result = data.value.cidr;
    else data.result = data.value;
};

/**
 * Extracts and validates the fieldifyIP value.
 * @param {Object} data - The data object.
 * @returns {fieldifyIP|null} - The extracted fieldifyIP object or null if invalid.
 */
const ftIPExtractor = async (data) => {
    const params = data.ctrl.params;
    let ret = null;

    if (typeof data.value === "string") {
        try {
            const ip = ipparse(data.value);
            if (ip.error) {
                data.error = `Invalid IP: ${ip.error}`;
                return null;
            }

            const acceptedVersions = configValue(
                ftIPConfiguration,
                params,
                "acceptedVersions"
            );
            switch (acceptedVersions) {
                case "ipv4":
                    if (ip.version !== 4) {
                        data.error = `Invalid IP version, accepting IPv4 only`;
                        return null;
                    }
                    break;

                case "ipv6":
                    if (ip.version !== 6) {
                        data.error = `Invalid IP version, accepting IPv6 only`;
                        return null;
                    }
                    break;
                default:
                    break;
            }

            // Assign
            ret = new fieldifyIP();
            ret.source = data.value;
            ret.parsed = ip;
        } catch (e) {
            data.error = "Can not decode IP field";
            return null;
        }
    } else if (data.value instanceof fieldifyIP) {
        ret = data.value;
    } else {
        data.error = "Can not decode IP field";
        return null;
    }

    return ret;
};

/**
 * Decodes the fieldifyIP value.
 * @param {Object} data - The data object.
 */
const ftIPDecode = async (data) => {
    data.result = await ftIPExtractor(data);
};

/**
 * Verifies the fieldifyIP value.
 * @param {Object} data - The data object.
 */
const ftIPVerify = async (data) => {
    await ftIPExtractor(data);
    data.result = data.value;
};

/**
 * Sanitizes the fieldifyIP value.
 * @param {Object} data - The data object.
 */
const ftIPSanitize = (data) => {
    // Implement your logic to sanitize the fieldifyIP value
};

/**
 * Configuration options for ftIP.
 */
const ftIPConfiguration = {
    acceptedVersions: {
        $doc: "What version of IP to accept",
        $required: true,
        $type: "Select",
        $default: "both",
        $options: {
            both: "Both IPv4 & IPv6",
            ipv4: "IPv4 only",
            ipv6: "IPv6 only",
        },
    },
};

/**
 * The ftIP object.
 */
const ftIP = {
    encode: ftIPEncode,
    decode: ftIPDecode,
    verify: ftIPVerify,
    sanitize: ftIPSanitize,
    configuration: ftIPConfiguration,
};

// Export ftIP object
module.exports = ftIP;
