/*
 * View controller and view abstraction.
 */

import {Animation} from './animation.js';
import {createElement} from './html.js';

export class ViewController {
    selector;
    currentView;

    constructor(selector) {
        this.selector = selector;
    }

    async load(view) {
        await this.clear();

        this.currentView = view;
        const renderedView = this.currentView.render(this);

        const selectedView = document.querySelector(this.selector);
        selectedView.innerHTML = '';
        selectedView.append(renderedView);

        if (this.currentView.loadHandler) {
            this.currentView.loadHandler();
        }

        // Give images a sec to load in, etc.
        await Animation.fadeIn(renderedView);
    }

    async clear() {
        if (this.currentView) {
            await this.currentView.dissolve();
            this.currentView = null;
        }
    }
}

export class View {
    element;
    handler;
    loadHandler;

    constructor(handler) {
        this.handler = handler;
    }

    onLoad(handler) {
        this.loadHandler = handler;
    }

    render(controller) {
        return this.element = createElement({className: 'view', style: {opacity: 0}},
                this.handler(this, controller),
        );
    }

    async dissolve() {
        await Animation.fadeOut(this.element);
        this.element.remove();
    }
}
