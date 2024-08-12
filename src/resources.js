/*
 * 3rd party script and styling management.
 */

import {element} from './html.js';

const head = document.getElementsByTagName('head')[0];

export class ResourceManager {
    resources = [];

    constructor(...resources) {
        this.resources.push(...resources.filter(r => r instanceof Resource));
    }

    add(...resources) {
        this.resources.push(...resources);
    }

    load() {
        this.resources.forEach(r => r.load());
    }
}

export class Resource {
    element;
    attrs = {};
    src;
    filename;
    basename;
    extension;
    srcVersion;

    constructor(src, attrs = {}) {
        this.src = src;
        this.attrs = attrs;
        this.basename = this.src.split('/').pop();
        this.extension = this.basename.split('/').pop();
        this.filename = this.basename.replace(this.extension, '');
    }

    version(hash) {
        this.srcVersion = hash;

        return this;
    }

    versionedSrc() {
        if (!this.srcVersion) {
            return this.src;
        }

        const src = new URL(this.src);
        src.searchParams.set('v', this.srcVersion);

        return src.toString();
    }

    load() {
        let attrs = {
            href: this.versionedSrc(),
            ...this.attrs,
        };
        if (['svg', 'png', 'ico'].includes(this.extension)) {
            attrs['rel'] = 'icon';
        }

        this.element = createResourceTag('link', attrs);
    }
}

export class StylesheetResource extends Resource {
    constructor(href, attrs) {
        super(href, attrs);
    }

    load() {
        this.element = createResourceTag('link', {
            rel: 'stylesheet',
            type: 'text/css',
            href: this.versionedSrc(),
            ...this.attrs,
        });
    }
}

export class JavaScriptResource extends Resource {
    constructor(src, attrs) {
        super(src, attrs);
    }

    load() {
        this.element = createResourceTag('script', {
            type: 'text/javascript',
            src: this.versionedSrc(),
            ...this.attrs,
        });
    }
}

export class GoogleFontResource extends Resource {
    name;
    weights = [];

    constructor(name, weights = [400, 500, 600, 700]) {
        super('https://fonts.googleapis.com/css2?family=');

        this.name = name;
        this.weights = weights;
    }

    load() {
        const xhr = new XMLHttpRequest();
        xhr.open('GET', this.src + this.name.replace(' ', '+') + ':wght@' + this.weights.join(';') + '&display=swap', true);
        xhr.onreadystatechange = () => {
            if (xhr.readyState === 4 && xhr.status === 200) {
                this.element = createResourceTag('style', {
                    'type': 'text/css',
                    'font': this.name,
                    ...this.attrs,
                });
                this.element.innerHTML = xhr.responseText;
            }
        };
        xhr.send();
    }
}

function createResourceTag(tag, attrs) {
    const existing = getElement(tag, attrs);
    if (existing) {
        return existing;
    }

    const e = element({tag: tag, ...attrs});
    head.appendChild(e);

    return e;
}

function getElement(tag, attrs) {
    const tags = document.getElementsByTagName(tag);
    for (const tag of tags) {
        if (elementHasAttributes(tag, attrs)) {
            return tag;
        }
    }

    return false;
}

function elementHasAttributes(element, attrs) {
    for (const attr in attrs) {
        if (!element.hasAttribute(attr)) {
            return false;
        }
        if (element.getAttribute(attr) !== attrs[attr]) {
            return false;
        }
    }

    return true;
}
