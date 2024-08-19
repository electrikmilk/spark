/*
 * Local Storage API value handler that keeps the type of the value intact.
 */

import {empty, TRY} from './util.js';
import {Store} from './store.js';

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

        let value = JSON.parse(localStorage.getItem(this.key));
        let [json, err] = TRY(() => {
            JSON.parse(value);
        });
        if (err === null) {
            value = json;

            if (value && value.hasOwnProperty('SPARK_VALUE')) {
                return value.SPARK_VALUE;
            }
        }

        return value;
    }

    set(newValue) {
        return localStorage.setItem(this.key, JSON.stringify({'SPARK_VALUE': newValue}));
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

export class LocalStorageStore extends Store {
    localStorageValue;

    constructor(key, defaultValue = null) {
        const localStorageValue = new LocalStorageValue(key, defaultValue);
        super(localStorageValue.get());
        this.localStorageValue = localStorageValue;
    }

    set(newValue) {
        this.localStorageValue.set(newValue);
        super.set(newValue);
    }

    async update(handler) {
        await super.update(handler);
        this.localStorageValue.set(this.value);
    }

    get() {
        return this.value = this.localStorageValue.get();
    }
}
