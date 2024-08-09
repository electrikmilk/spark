/*
 * Utility functions.
 */

// Await for ms milliseconds.
export async function sleep(ms) {
    return await new Promise(resolve => setTimeout(resolve, ms));
}

export function hash(string) {
    let hash = 0;
    if (!string || string.length === 0) {
        return hash;
    }
    for (let i = 0; i < string.length; i++) {
        hash = ((hash << 5) - hash) + string.charCodeAt(i);
        hash = hash & hash;
    }

    return Math.abs(hash);
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
    const type1 = typeof value1;
    const type2 = typeof value2;
    if (type1 === 'object' || type2 === 'object') {
        return JSON.stringify(value1) === JSON.stringify(value2);
    }

    return false;
}

// Wait until the next frame.
export async function nextFrame() {
    await new Promise(resolve => setTimeout(resolve));
}
