import escapeStringRegexp from "escape-string-regexp";

export function filtersToString(filters) {
    const filtersString = filters.filter(filter => {
        return filter[2].length > 0;
    }).map(filter => {
        return filter.join(" ");
    }).join(" && ");

    return filtersString
}

export function filtersFromString(filtersString) {
    return filtersString.split("&&").map(filter => {
        return filter.trim().split(" ");
    });
}

const filterToURLDictionary = [
    // order matters!
    ["&&", " AND "],
    ["||", " OR "],
    ["==", " eq "],
    ["!=", " neq "],
    [">=", " gte "],
    ["<=", " lte "],
    ["^", " XOR "],
    [">", " gt "],
    ["<", " lt "],
];

export function filtersStringToURLCompatible(filtersString) {
    for (const [key, val] of filterToURLDictionary) {
        filtersString = filtersString.replace(new RegExp(escapeStringRegexp(key), "g"), val);
    }

    return filtersString.replace(/ +/g, " ");
}

export function filtersStringFromURLCompatible(filtersString) {
    for (const [key, val] of filterToURLDictionary) {
        filtersString = filtersString.replace(new RegExp(escapeStringRegexp(val), "g"), ` ${key} `);
    }

    return filtersString.replace(/ +/g, " ");
}
