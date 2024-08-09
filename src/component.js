/*
 * Base component class.
 */

import {Store} from './store.js';
import {html} from './html.js';
import {empty} from './util.js';
import {pushCSS} from './style.js';

export class Component {
    // Initialize properties on class as stores.
    store(props) {
        for (const prop in props) {
            this[prop] = new Store(props[prop] ?? null);
        }
    }

    // Base mounted method to override.
    mounted() {
        //
    }

    // Base template method to override.
    template() {
        return html();
    }

    // Base CSS template method to override.
    css() {
        return {};
    }
}

// Render a component.
// e.g. `component(new Component)`;
export function component(component) {
    const componentCSS = component.css();
    if (!empty(componentCSS)) {
        pushCSS(componentCSS);
    }

    const template = component.template();
    template.onload = component.mounted();

    return template;
}
