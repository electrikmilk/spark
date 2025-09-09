/*
 * HTML & DOM functions.
 */

import {Animation} from './animation.js';

const inputTypes = ['text', 'search', 'url', 'number', 'password', 'email', 'tel'];

/**
 * Create element with configuration containing elements.
 * Configurations contain either element attributes or properties.
 * These can be in any order.
 *
 * ```
 * createElement({tag: 'div'})
 * createElement(createElement({tag: 'div', class}), {tag: 'div'})
 * ```
 *
 * @param elements
 */
export function createElement(...elements) {
    let tag = 'div';
    if (elements) {
        let config = {};
        elements.forEach(e => !(e instanceof HTMLElement) && !(e instanceof Text) ? config = {...config, ...e} : null);
        if (config) {
            if (config['tag']) {
                tag = config['tag'];
                delete config['tag'];
            }
        }

        return html(tag, config, ...elements.filter(e => e instanceof HTMLElement || e instanceof Text));
    }

    return html(tag);
}

// Create HTML tag.
function html(tag, config, ...elements) {
    const element = document.createElement(tag);
    if (elements) {
        element.append(...elements);
    }
    for (let key in config) {
        if (key in element) {
            if (key === 'style' && typeof config[key] === 'object') {
                for (let key in config['style']) {
                    element.style[key] = config['style'][key];
                }
                continue;
            }
            element[key] = config[key];
        } else {
            applyAttribute(element, key, config[key]);
        }
    }

    return element;
}

// Create a temporary hidden element in the document body, then removes it once the callback finishes.
export async function tempElement(callback, tagName = 'div') {
    const temp = createElement({
        style: {
            display: 'none',
        },
    });

    document.body.append(temp);

    await callback(temp);
    temp.remove();
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
    const e = createElement({
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
    if (element.checkVisibility()) {
        await Animation.fadeOut(element);
    }

    await callback(element);

    await Animation.fadeIn(element);
}

// Unescape an HTML string into a DOM object. Strips script tags.
export function unescapeHTML(html) {
    return createElement({innerHTML: sanitizeHTML(html)});
}

const scriptTagsRegex = new RegExp(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script\s*>/gi);

export function sanitizeHTML(html) {
    if (!scriptTagsRegex.test(html)) {
        return html;
    }

    const temp = createElement({innerHTML: html.replace(scriptTagsRegex, '')});
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
