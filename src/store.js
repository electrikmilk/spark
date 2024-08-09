/*
 * Reactive store.
 */

import {tagName} from './html.js';
import {empty} from './util.js';

export class Store {
    value = null;
    handlers = [];

    constructor(initialValue) {
        this.value = initialValue;
        this.publish();
    }

    // Set new value.
    set(newValue) {
        this.value = newValue;
        this.publish();
    }

    // Update value using handler. Sets value to value returned from handler.
    async update(handler) {
        this.value = await handler(this.value);
        this.publish();
    }

    // Get the size of the value.
    size() {
        return this.value.hasOwnProperty('length') ? this.value.length : 0;
    }

    // Check if value is empty.
    empty() {
        return empty(this.value);
    }

    // Add a value update handler.
    subscribe(handler) {
        handler(this.value);
        this.handlers.push(handler);
    }

    // Subscribe an element to a store value automatically.
    bind(element) {
        let modelFunction = (element, newValue) => element.innerText = newValue;

        const tag = tagName(element);
        switch (tag) {
            case 'input':
            case 'select':
            case 'textarea':
                const inputChange = (e) => this.set(e.target.value);
                element.addEventListener('change', inputChange);
                element.addEventListener('keyup', inputChange);

                if (tag === 'input') {
                    const type = element.getAttribute('type');
                    if (type === 'checkbox' || type === 'radio') {
                        modelFunction = checkboxModel;
                        break;
                    }
                }

                modelFunction = inputModel;
                break;
            case 'button':
                modelFunction = buttonModel;
                break;
        }

        this.subscribe((newValue) => {
            modelFunction(element, newValue);
        }, false);

        return element;
    }

    // Push new value to handlers.
    publish() {
        this.handlers.forEach(s => s(this.value));
    }
}

function buttonModel(e, newValue) {
    e.textContent = newValue;
}

function inputModel(e, newValue) {
    e.value = newValue;
}

function checkboxModel(e, newValue) {
    newValue ? e.setAttribute('checked', '') : e.removeAttribute('checked');
}
