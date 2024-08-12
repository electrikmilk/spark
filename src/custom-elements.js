/*
 * Custom elements abstraction.
 */

export class CustomElement extends HTMLElement {
    name;
    attributes = {};
    _internals;

    constructor(name) {
        super();
        this.name = name;
    }

    addInternals() {
        this._internals = this.attachInternals();
    }

    registerAttribute(name, def) {
        return this.attributes[name] = def;
    }

    attributeChangedCallback(name, oldValue, newValue) {
        if (!this.attributes[name]) {
            return;
        }

        switch (true) {
            case oldValue === null:
                this.attributes[name].added(newValue);
                break;
            case newValue === null:
                this.attributes[name].removed(oldValue);
                break;
            case oldValue !== newValue:
                this.attributes[name].changed(oldValue, newValue);
                break;
        }

        this.attributes[name].updated(oldValue, newValue);
    }

    attribute(name) {
        if (this.hasAttribute(name)) {
            this.attributes[name].value = this.getAttribute(name);
            return this.attributes[name];
        }

        return null;
    }
}

export class CustomElementAttribute {
    name;
    value;

    constructor(name) {
        this.name = name;
    }

    // The attribute was updated on the element.
    updated(oldValue, newValue) {
        //
    }

    // The attribute was added to the element.
    added(value) {
        //
    }

    // The value of the attribute has changed.
    changed(oldValue, newValue) {
        //
    }

    // The attribute was removed from the element.
    removed(oldValue) {
        //
    }
}

// Define multiple custom elements.
export function defineElements(elementConstructors) {
    for (const name in elementConstructors) {
        customElements.define(name, elementConstructors[name]);
    }
}
