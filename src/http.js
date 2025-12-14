/*
 * HTTP request abstractions.
 */

import {Store} from './store.js';

// Store for JSON data from a single API endpoint. Use fetch() method to refresh data for subscribers.
export class FetchStore extends Store {
    url;
    options = {};
    busy = new Store(false);

    /**
     @param url URL to query.
     @param options RequestInit object
     @param initialValue Initial value for store.
     */
    constructor(url = null, options = {}, initialValue = {}) {
        super(initialValue);
        if (url) {
            this.url = url;
        }
        if (options) {
            this.options = options;
        }
        this.fetch();
    }

    async fetch() {
        this.busy.set(true);
        await fetch(this.url, this.options).then(res => res.json()).then(data => this.set(this.onFetch(data)))
                                           .catch(this.onError)
                                           .finally(() => this.busy.set(false));
    }

    onFetch(data) {
        return data;
    }

    onError(err) {
        //
    }
}
