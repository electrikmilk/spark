/*
 * Local Storage API value handler that keeps the type of the value intact.
 */

import {empty} from './util.js';

export class LocalStorageValue {
    key;
    defaultValue = null;

    constructor(key, defaultValue = null) {
        this.key = key;
        this.defaultValue = defaultValue;
    }

    get() {
        if (this.empty()) {
            return this.defaultValue ?? null;
        }

        return this.value();
    }

    value() {
        if (!localStorage.getItem(this.key)) {
            return null;
        }

        const value = localStorage.getItem(this.key);
        const json = isJSONString(value);
        if (json !== false) {
            return json.value;
        }

        return value;
    }

    set(newValue) {
        return localStorage.setItem(this.key, JSON.stringify({value: newValue}));
    }

    clear() {
        return this.set(this.key, null);
    }

    remove() {
        return localStorage.removeItem(this.key);
    }

    size() {
        const value = this.value();
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

    empty() {
        return empty(this.value());
    }
}