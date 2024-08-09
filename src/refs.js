/*
 * Global references.
 */

let refs = {};

// Define a global reference. Primarily meant for sharing objects, as they are copied by reference.
export function define(key, value) {
    if (refs[key]) {
        return false;
    }

    return refs[key] = value;
}

// Get the value of a global reference.
export function ref(key) {
    return refs[key] ?? null;
}
