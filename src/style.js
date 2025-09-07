/*
 * Styling elements.
 */

// Style an element with an object.

import {createElement, getSelector} from './html.js';
import {Store} from './store.js';

// Push document style.
export function pushCSS(rules) {
    if (!styleTag) {
        document.head.append(createElement({
            tag: 'style',
            type: 'text/css',
        }));
    }
    if (styleRules.indexOf(rules) === -1) {
        styleRules.push(rules);
    }
    styleTag.innerText = obj2CSS(styleRules);
}

/* Convert an object to CSS.
"rule": {
    "property": "value"
}
 */
export function obj2CSS(obj) {
    let css = '';
    for (const rules of obj) {
        for (const rule in rules) {
            css += rule + '{';
            for (const property in rules[rule]) {
                css += `${property}:${rules[rule][property]};`;
            }
            css += '}';
        }
    }

    return css;
}

export function applyStyle(element, styles) {
    for (const style in styles) {
        element.style[style] = styles[style];
    }
}

let styleRules = [];
let styleTag = null;

export function applyEffect(element, effect, rules) {
    let selector = getSelector(element);
    if (selector.includes(',')) {
        let selectors = selector.trim().split(',');
        selector = selectors.join(':' + effect + ',') + ':' + effect;
    } else {
        selector += ':' + effect;
    }
    let styleRules = {};
    styleRules[`${selector}`] = rules;

    pushCSS(styleRules);
}

export class MediaStore extends Store {
    mediaQueryList;

    constructor(query) {
        const matchMedia = window.matchMedia(query);
        super(matchMedia.matches);
        this.mediaQueryList = matchMedia;
        this.mediaQueryList.addEventListener('change', (e) => this.set(e.matches));
    }
}
