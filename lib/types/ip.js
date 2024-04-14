// Import required modules
const { configValue } = require("../utils");

/* global BigInt */

function detectIpVersion(ip) {
    if (ip.indexOf(".") > 0) return (4)
    if (ip.indexOf(":") > 0) return (6)
    return (0)
}

function ipv6ToBigInt(ip) {
    const compression = ip.split("::")

    if (compression.length > 2)
        throw Error("Invalid IPv6")

    function parter(serie) {
        var parts = serie.split(":")
        parts = parts.map((a) => {
            const ret = '0'.repeat(4 - a.length) + a
            return (ret)
        })
        return (parts)
    }

    const part1 = parter(compression[0])

    // no compression
    if (compression.length === 1) {
        if (part1.length !== 8)
            throw Error("Invalid IPv6")
        return (BigInt('0x' + part1.join("")))
    }
    else {
        const middle = []
        const part2 = parter(compression[1])
        var reduce = 8 - (part1.length + part2.length)
        if (reduce < 0)
            throw Error("Invalid IPv6")
        for (var a = 0; a < reduce; a++)
            middle.push("0000")
        return (BigInt('0x' + part1.concat(middle, part2).join("")))
    }
}

function ipv4ToBigInt(ip) {
    var parts = ip.split(".")
    if (parts.length !== 4) throw Error("Invalid IPv4")
    parts = parts.map((a) => {
        const pInt = parseInt(a)
        if(pInt > 255) throw Error("Invalid IPv4")
        const hex = pInt.toString(16)
        const ret = '0'.repeat(2 - hex.length) + hex
        return (ret)
    })
    return (BigInt('0x' + parts.join("")))
}

function ipStringify(integer, compress = true) {
    var version = 4
    if (integer > 2n ** 32n) version = 6
    else if (integer > 2n ** 128n) throw Error("Invalid IP address")

    // different type of inputs
    if (typeof integer === "bigint")
        integer = integer.toString(16)
    else if (typeof integer === "string" && integer[0] == "0" && integer[1] === "x")
        integer = integer.substring(2)
    else if (typeof integer === "string" && /[0-9]+/.test(integer))
        integer = BigInt(integer).toString(16)

    // sanitize
    if (version === 4 && integer.length > 8) throw Error("Invalid IPv4")
    else if (version === 6 && integer.length > 16 * 2) throw Error("Invalid IPv6")

    // padding
    if (version === 4 && integer.length < 8) integer = '0'.repeat(8 - integer.length) + integer
    else if (version === 6 && integer.length < 32) integer = '0'.repeat(32 - integer.length) + integer

    if (version === 4) {
        var ret = []
        for (var a = 0; a < 8; a += 2) {
            const part = parseInt('0x' + integer.substring(a, a + 2))
            ret.push(part)
        }
        return (ret.join("."))
    }
    else {
        var ret = []
        for (var a = 0; a < 32; a += 4) {
            const part = integer.substring(a, a + 4)
            ret.push(part)
        }
        // if (compress === true) {
        //     var count = 0
        //     for (var a = ret.length - 1; a !== 0; a--) {
        //         const part = ret[a]
        //         if (part === "0000") {
        //             count++
        //             ret.pop()
        //         }
        //         else break
        //     }
        //     ret = ret.map((a) => trimZeroLeft(a))

        //     if (count > 0) ret.push(":")
        // }
        return (ret.join(":"))
    }
}

function ipParse(ip) {
    if (ip.indexOf(".") > 0) return ({ number: ipv4ToBigInt(ip), version: 4 })
    if (ip.indexOf(":") > 0) return ({ number: ipv6ToBigInt(ip), version: 6 })
    throw Error("Invalid IP")
}

function trimZeroLeft(str) {
    var block = false
    return ([...str]
        .filter((a) => {
            if (block === true || a !== "0") {
                block = true
                return (true)
            }
            return (false)
        })
        .join("")
    )
}


function ipNetwork(cidr, compress = false) {
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
        info.start.parse = ipParse(info.start.text);
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

    // Rebuild for start
    try {
        const lowPow = maxBits - info.mask

        const sub = lowPow === 0 ? 0n : BigInt(info.start.parse.number) % (2n ** BigInt(lowPow))

        info.start.text = ipStringify(info.start.parse.number - sub, compress);

        info.network = `${info.start.text}/${info.mask}`;
        info.start.parse = ipParse(info.start.text);

        // Correct the representation of start
        info.start.dec = info.start.parse.number.toString();
        info.start.hex = fixHex(info.start.parse.number.toString(16))

        info.bitsUsed = maxBits - info.mask; // Bits consumed
    } catch (e) {
        // console.log(e)
        return { error: `Error: ${e.message}` };
    }

    // One IP
    if (info.bitsUsed === 0) {
        info.hosts = 1n;
        info.end = { ...info.start };
    }
    // Range
    else {
        info.hosts = 2n ** BigInt(info.bitsUsed); // Number of hosts

        // Textual IP
        try {
            info.end.text = ipStringify(info.start.parse.number + info.hosts - 1n, compress);
        } catch (e) {
            return { error: "CIDR goes too far" };
        }
        try {
            info.end.parse = ipParse(info.end.text);
            if (info.end.parse.number > 2n ** BigInt(maxBits))
                throw new Error("CIDR goes too far");
        } catch (e) {
            return { error: "CIDR goes too far" };
        }

        info.end.dec = info.end.parse.number.toString()
        info.end.hex = fixHex(info.end.parse.number.toString(16))
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
    if (data.value instanceof fieldifyIP) data.result = data.value.parsed.cidr;
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
            const ip = ipNetwork(data.value);
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
