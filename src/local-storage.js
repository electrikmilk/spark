/*
 * Local Storage API value handler that keeps the type of the value intact.
 */

import {empty, sizeOf, TRY} from './util.js';
import {Store} from './store.js';

const SPARK_VALUE = '_SPARK_VALUE';

export class Cache {
    key = null;
    value = null;
    setter = async () => {
        //
    };

    constructor(key, setter) {
        this.key = key;
        this.setter = setter;
    }

    async get() {
        const stored = localStorage.getItem(this.key);
        if (stored) {
            this.value = JSON.parse(stored);
            if (typeof this.value === 'object' && this.value.hasOwnProperty(SPARK_VALUE)) {
                this.value = this.value[SPARK_VALUE];
            }
            return this.value;
        }

        this.value = await this.setter();
        let value = this.value;
        if (typeof this.value !== 'object') {
            value = {SPARK_VALUE: this.value};
        }
        localStorage.setItem(this.key, JSON.stringify(value));

        return this.value;
    }

    async size() {
        return sizeOf(await this.get());
    }

    async empty() {
        return empty(await this.get());
    }

    forget() {
        localStorage.removeItem(this.key);
    }
}

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

        let value = localStorage.getItem(this.key);
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
        return localStorage.setItem(this.key, JSON.stringify({SPARK_VALUE: newValue}));
    }

    clear() {
        return this.set(this.key, null);
    }

    remove() {
        return localStorage.removeItem(this.key);
    }

    size() {
        return sizeOf(this.value());
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

    remove() {
        return this.localStorageValue.remove();
    }

    clear() {
        return this.localStorageValue.clear();
    }

    size() {
        return this.localStorageValue.size();
    }

    empty() {
        return this.localStorageValue.empty();
    }
}
