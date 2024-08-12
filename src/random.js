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

    new() {
        return this.value = randomInt(this.min, this.max);
    }

    maybeNeg() {
        if (maybe()) {
            this.value = -this.new();
        }
    }
}

// Return a random boolean.
export function maybe() {
    return randomInt(0, 1);
}

// Returns a random value from the values given.
export function randomValue(...values) {
    return values[randomInt(0, values.length)];
}

// Generate a random number.
export function randomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);

    return Math.floor(Math.random() * (max - min + 1)) + min;
}
