/*
 * HTTP request abstractions.
 */

import {empty} from './util.js';
import {Store} from './store.js';

const methods = ['get', 'post', 'put', 'patch', 'delete'];

// Store for JSON data from a single API endpoint. Use fetch() method to refresh data for subscribers.
export class FetchStore extends Store {
    url;
    busy = new Store(false);

    constructor(url = null, initialValue = {}) {
        super(initialValue);
        if (url) {
            this.url = url;
        }
        this.fetch();
    }

    async fetch() {
        this.busy.set(true);
        await fetch(this.url).then(res => res.json()).then(data => this.set(data)).catch(this.onError).finally(() => this.busy.set(false));
    }

    onError(err) {
        //
    }
}

export class HTTPStore extends Store {
    url;
    request;
    busy = new Store(false);
    errorHandler;

    constructor(method, url, options = {}) {
        super();

        if (!methods.includes(method.toLowerCase())) {
            console.warn(`[WARN] Unknown HTTP method ${method.toUpperCase()}`);
        }

        this.url = url;
        this.request = new XMLHttpRequest();

        if (!empty(options)) {
            if (options.responseType) {
                this.request.responseType = options.responseType;
            }
            if (options.data) {
                if (this.method === 'GET') {
                    url += '?' + new URLSearchParams(options.data).toString();
                } else {
                    let formData = new FormData();
                    for (let key in options.data) {
                        // @ts-ignore
                        formData.append(key, options.data[key]);
                    }
                    this.body = formData;
                }
            }
            if (options.headers) {
                for (let header in options.headers) {
                    // @ts-ignore
                    this.request.setRequestHeader(header, options.headers[header]);
                }
            }
        }
        this.request.open(method, url, true);
    }

    async fetch() {
        this.busy.set(true);
        this.request.send(this.body);
        return await new Promise(resolve => {
            this.request.onload = () => {
                if (this.request.status >= 200 && this.request.status < 400) {
                    let response = {
                        data: this.request.response,
                        type: this.request.responseType,
                        status: this.request.status,
                        statusText: this.request.statusText,
                    };
                    this.set(response);
                    resolve();
                } else {
                    this.error();
                    throw new Error(this.request.response);
                }
            };
            this.request.onerror = (err) => this.errorHandler(err, 'error');
            this.request.ontimeout = (err) => this.errorHandler(err, 'timeout');
            this.request.onabort = (err) => this.errorHandler(err, 'abort');
        }).finally(() => this.busy.set(false));
    }

    onProgress(handler) {
        this.request.onprogress = (oEvent) => {
            if (oEvent.lengthComputable) {
                handler(oEvent.loaded / oEvent.total * 100);
            } else {
                // Unable to compute progress information since the total size is unknown
                handler(0);
            }
        };
        return this;
    }

    onError(handler) {
        this.errorHandler = handler;
    }
}

export class APIModel {
    id;

    baseURI = '';
    createEndpoint = '/create';
    loadEndpoint = '/load';
    updateEndpoint = '/update';
    deleteEndpoint = '/delete';

    fields = [];
    required = [];
    fillable = [];
    timestamps = [];

    config = {headers: new Headers({'Content-Type': 'application/json'})};
    loadParam = 'id';

    constructor(init = null, config = {}) {
        if (config !== {}) {
            this.config = {...this.config, ...config};
        }

        if (init) {
            if (typeof init == 'object') {
                this.create(init);
            } else {
                this.load(init);
            }
        }
    }

    async load(id = null) {
        try {
            if (!id) {
                id = this[this.loadParam];
            } else {
                this[this.loadParam] = id;
            }
        } catch (e) {
            throw new Error(`[${this.constructor.name} (${id})] Unable to load: ${e.message}.`);
        }

        const url = new URL(this.baseURI + this.loadEndpoint);
        url.searchParams.set(this.loadParam, id);

        await fetch(url.toString()).then(response => response.json()).then(data => {
            for (const key of this.fields) {
                try {
                    if (this.timestamps.includes(key)) {
                        this[key] = new Date(data[key]);
                    } else {
                        this[key] = data[key];
                    }
                } catch (e) {
                    console.error(`[${this.constructor.name} (${id})] Unable to assign property '${key}': ${e.message}.`);
                }
            }
        });

        return true;
    }

    async create(data = {}, method = 'POST') {
        const response = await fetch(this.payloadRequest(method, this.createEndpoint, data));
        if (response.ok) {
            await this.load(await response.text());
        }

        return response.ok;
    }

    async update(data = {}, method = 'POST') {
        if (!this[this.loadParam]) {
            return false;
        }

        const response = await fetch(this.payloadRequest(method, this.updateEndpoint, data));
        if (response.ok) {
            this[this.loadParam] = await response.text();
            await this.load();
        }

        return response.ok;
    }

    async save(method = 'POST') {
        let data = {};
        for (const key in this.fields) {
            try {
                if (!this.required.includes(key) && !this[key]) {
                    continue;
                }
                if (this.fillable.includes(key)) {
                    data[key] = this[key];
                }
            } catch (e) {
                throw new Error(`[${this.constructor.name} (${id})] Unable to save: ${e.message}.`);
            }
        }

        if (!this[this.loadParam]) {
            return await this.create(data, method);
        }

        return await this.update(data, method);
    }

    async delete(method = 'DELETE') {
        if (!this[this.loadParam]) {
            return false;
        }

        const response = await fetch(this.baseURI + this.deleteEndpoint, {
            method: method,
            body: this[this.loadParam],
            headers: this.headers,
        });
        if (response.ok) {
            delete this;
        }

        return response.ok;
    }

    payloadRequest(method, url, data) {
        this.checkMethod(method);
        this.checkRequired(data);
        this.checkFillable(data);

        return new Request(this.baseURI + url, {
            method: method,
            body: JSON.stringify(data),
            ...this.config,
        });
    }

    checkMethod(method) {
        if (!methods.includes(method)) {
            throw new Error(`[${this.constructor.name} (${id})] Unknown HTTP method: ${method}.`);
        }
        if (!['post', 'put', 'patch'].includes(method.toLowerCase())) {
            throw new Error(`[${this.constructor.name} (${id})] Unknown HTTP update method: ${method}.`);
        }
    }

    checkRequired(data) {
        if (!this.required.length) {
            return;
        }

        for (const key in data) {
            if (!this.required.includes(key)) {
                continue;
            }

            if (!data[key]) {
                throw new Error(`[${this.constructor.name} (${id})] Missing required property '` + key + '\'.');
            }
        }
    }

    checkFillable(data) {
        if (this.fillable.length) {
            for (const key in data) {
                if (this.fillable.includes(key)) {
                    continue;
                }

                throw new Error(`[${this.constructor.name} (${id})] Field '${key}' is not fillable!`);
            }
        }
    }
}
