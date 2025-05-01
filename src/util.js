/*
 * Utility functions.
 */

// Await for ms milliseconds.
export async function sleep(ms) {
    return await new Promise(resolve => setTimeout(resolve, ms));
}

// Try something within a handler and return error if it fails.
export function TRY(handler) {
    try {
        return [handler(), null];
    } catch (e) {
        return [null, e];
    }
}

export function equal(value1, value2) {
    if (typeof value1 === typeof value2) {
        if (Array.isArray(value1) && Array.isArray(value2)) {
            return arrayCompare(value1, value2);
        }
        if (typeof value1 === 'object') {
            return objCompare(value1, value2);
        }

        return value1 === value2;
    }

    return JSON.stringify(value1) === JSON.stringify(value2);
}

// Get the size of any value.
export function sizeOf(value) {
    const valueType = typeof value;
    if (valueType === 'object') {
        let len = 0;
        value.entries().forEach(() => ++len);
        return len;
    }
    if (valueType === 'string' || Array.isArray(value)) {
        return value.length;
    }

    return value;
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

// Deep compare two arrays.
export function arrayCompare(array1, array2) {
    return array1.filter(i => !array2.includes(i) || !equal(array1[i], array2[i])).length !== 0;
}

// Deep compare two objects.
export function objCompare(value1, value2) {
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
    for (let item of Object.keys(obj).sort(compareFn)) {
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
