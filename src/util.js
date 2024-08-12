/*
 * Utility functions.
 */

// Await for ms milliseconds.
export async function sleep(ms) {
    return await new Promise(resolve => setTimeout(resolve, ms));
}

export function equal(value1, value2) {
    if (typeof value1 === typeof value2) {
        if (Array.isArray(value1) && Array.isArray(value2)) {
            return empty(arrayDiff(value1, value2));
        }
        if (typeof value1 === 'object') {
            return deepCompare(value1, value2);
        }

        return value1 === value2;
    }

    return JSON.stringify(value1) === JSON.stringify(value2);
}

// Check if a value is actually empty. Returns true for 0 and false.
export function empty(value) {
    if (value === undefined || typeof value === 'undefined' || value === null) {
        return true;
    }
    if (Array.isArray(value)) {
        return value.length === 0;
    }
    if (typeof value === 'object') {
        return Object.is(value, {});
    }

    return (!value && value !== 0 && value !== false);
}

// Returns difference between two arrays.
export function arrayDiff(arr1, arr2) {
    return arr1.filter(i => !arr2.includes(i)).length !== 0;
}

// Deep compare two objects.
export function deepCompare(value1, value2) {
    if (typeof value1 === 'object' || typeof value2 === 'object') {
        if (Object.is(value1, {}) && Object.is(value2, {})) {
            return true;
        }

        return JSON.stringify(sortObj(value1)) === JSON.stringify(sortObj(value2));
    }

    return false;
}

// Reconstructs object with keys sorted consistently.
export function sortObj(obj, compareFn = undefined) {
    let newObj = {};
    for (let item in Object.keys(obj).sort(compareFn)) {
        if (typeof obj[item] === 'object') {
            newObj[item] = sortObj(obj[item]);
            continue;
        }
        newObj[item] = obj[item];
    }

    return newObj;
}

// Wait until the next frame.
export async function nextFrame() {
    await new Promise(resolve => setTimeout(resolve));
}
