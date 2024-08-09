/*
 * HTML & DOM functions.
 */

import {autoModel} from './store.js';
import {Animate} from './animate.js';

const inputTypes = ['text', 'search', 'url', 'number', 'password', 'email', 'tel'];

// Create tree of HTML elements.
export function element(...elements) {
    let tag = 'div';
    if (elements) {
        let config = {};
        elements.forEach(e => !(e instanceof HTMLElement) ? config = {...config, ...e} : null);
        if (config) {
            if (config['tag']) {
                tag = config['tag'];
                delete config['tag'];
            }
            if (config['model']) {
                const model = config['model'];
                delete config['model'];
                return autoModel(model, {tag: tag, ...config});
            }
        }

        return html(tag, config, ...elements.filter(e => e instanceof HTMLElement || e instanceof Text));
    }

    return html(tag);
}

// Create HTML tag.
export function html(tag, config, ...elements) {
    const element = document.createElement(tag);
    if (elements) {
        element.append(...elements);
    }
    for (let key in config) {
        if (key in element) {
            element[key] = config[key];
        } else {
            applyAttribute(element, key, config[key]);
        }
    }

    return element;
}

// Applies an attribute to an element. Toggles attribute if value is a boolean.
export function applyAttribute(element, attr, value) {
    if (typeof value === 'boolean') {
        value ? element.setAttribute(attr, '') : element.removeAttribute(attr);
        return;
    }

    element.setAttribute(attr, sanitizeHTML(value));
}

// Create HTML text node.
export function text(text) {
    return document.createTextNode(text);
}

const SINGLE_PIXEL_PNG_BASE64 = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=';

export function lazyImage(src, attrs = {}) {
    const e = element({
        tag: 'img',
        src: SINGLE_PIXEL_PNG_BASE64,
        ...attrs,
    });
    loadImage(e, src);

    return e;
}

export function loadImage(imgElement, src) {
    const image = new Image();
    image.onload = () => {
        refreshElement(imgElement, () => {
            imgElement.src = image.src;
        });
    };
    image.src = src;
}

// Fades an element between a callback.
export async function refreshElement(element, callback) {
    if (element.innerHTML !== '' && element.checkVisibility()) {
        await Animate.blurOut(element);
    }

    await callback(element);

    await Animate.focusIn(element);
}

// Transition element between states.
async function transitionState(newValue, element, render) {
    await refreshElement(element, () => {
        element.innerHTML = '';
        element.append(render);
    });
}

// Unescape an HTML string into a DOM object. Strips script tags.
export function unescapeHTML(html) {
    return element({innerHTML: sanitizeHTML(html)});
}

const scriptTagsRegex = new RegExp(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script\s*>/gi);

export function sanitizeHTML(html) {
    if (!scriptTagsRegex.test(html)) {
        return html;
    }

    const temp = document.createElement('div');
    temp.innerHTML = html.replace(scriptTagsRegex, '');
    const scriptTags = temp.getElementsByTagName('script');
    for (const tag of scriptTags) {
        tag.remove();
    }

    return temp.innerHTML;
}

export function tagName(element) {
    return element.tagName.toLowerCase();
}

export function inputTag(element) {
    const tag = tagName(element);
    return ((tag === 'input' && inputTypes.includes(element.type)) || tag === 'textarea');
}

export function getSelector(element) {
    if (element.selector) {
        return element.selector;
    }

    let selector = tagName(element);
    if (element.id) {
        selector += '#' + element.id;
    } else if (element.className) {
        selector += '.' + element.className;
    }

    return selector;
}
