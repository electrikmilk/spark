/*
Randomness
 */

// Randomly mutate a number.
export class RNG {
    value = 0;
    min = 0;
    max = 0;

    constructor(init, min, max) {
        this.value = init;
        this.min = min;
        this.max = max;
    }

    // Returns a new random value.
    new() {
        return this.value = randomInt(this.min, this.max);
    }
}

// Return a random boolean.
export function maybe() {
    return randomInt(0, 1);
}

// Returns a random value from the values given.
export function randomValue(...values) {
    return values[randomInt(0, values.length - 1)];
}

// Generates a random ID with an optional prefix and length.
export function randomID(prefix = 'id-', length = 6) {
    return prefix + hash(length);
}

// Generates a random alphanumeric hash.
export function hash(length = 6) {
    let randomStr = '';
    for (let i = 0; i < length; i++) {
        const range = randomValue(
                [65, 90], // UPPERCASE
                [97, 122], // lowercase
                [48, 57], // 0-9
        );

        randomStr += String.fromCharCode(randomInt(range[0], range[1]));
    }

    return randomStr;
}

// Generate a random number.
export function randomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}
