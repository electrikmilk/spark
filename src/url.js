/*
 * URL mutation and management.
 */

export class LiveURLParams {
    url;

    constructor() {
        this.refreshURL();
    }

    has(key) {
        return this.url.searchParams.has(key);
    }

    get(key) {
        return this.url.searchParams.get(key);
    }

    set(key, value) {
        this.url.searchParams.set(key, value);
        this.push();
    }

    update(key, handler) {
        this.set(key, handler(this.get(key)));
    }

    delete(key) {
        this.url.searchParams.delete(key);
        this.push();
    }

    push() {
        history.pushState(null, null, this.url.toString());
        this.refreshURL();
    }

    refreshURL() {
        this.url = new URL(window.location.href);
    }
}
