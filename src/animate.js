/*
 * CSS animation.
 */

import {nextFrame, sleep} from './util.js';

const CUBIC_BEZIER_EASING = 'cubic-bezier(0.42, 0, 0.58, 1)';

export class Scene {
    actors = [];

    constructor(...actors) {
        this.actors = actors;
    }

    play() {
        for (const actor of this.actors) {
            actor.play();
        }
    }
}

export class Actor {
    element;
    keyframes = [];
    duration;
    iterations;

    constructor(element, keyframes, duration = 1000, iterations = 1) {
        this.element = element;
        this.keyframes = keyframes;
        this.duration = duration;
        this.iterations = iterations;
    }

    async play() {
        await Animate.animate(
                this.element,
                this.keyframes,
                this.duration,
                this.iterations,
        );
    }
}

export const Animate = {
    async animate(element, keyframes, duration = 1000, iterations = 1) {
        element.animate(keyframes, {
            duration: duration,
            fill: 'forwards',
            easing: CUBIC_BEZIER_EASING,
            iterations: iterations,
        });

        await sleep(duration);

        return await nextFrame();
    },
    async focusIn(element, duration = 300) {
        return await this.animate(element, [
            {
                filter: 'blur(0)',
                opacity: 1,
            },
        ], duration);
    },
    async blurOut(element, duration = 300) {
        return await this.animate(element, [
            {
                filter: 'blur(.3rem)',
                opacity: 0,
            },
        ], duration);
    },
    async fadeIn(element, duration = 300) {
        return await this.animate(element, [
            {
                opacity: 1,
            },
        ], duration);
    },
    async fadeOut(element, duration = 300) {
        return await this.animate(element, [
            {
                opacity: 0,
            },
        ], duration);
    },
    async fadeInUp(element, duration = 1000) {
        return await this.animate([
            {
                opacity: '0%',
                transform: 'translateY(40px)',
            },
            {
                opacity: '100%',
                transform: 'translateY(0)',
            },
        ], duration);
    },
    async fadeInLeft(element, duration = 1000) {
        return await this.animate(element, [
            {
                opacity: '0%',
                transform: 'translateX(-40px)',
            },
            {
                opacity: '100%',
                transform: 'translateY(0)',
            },
        ], duration);
    },
    async fadeInRight(element, duration = 1000) {
        return await this.animate(element, [
            {
                opacity: '0%',
                transform: 'translateX(40px)',
            },
            {
                opacity: '100%',
                transform: 'translateX(0)',
            },
        ], duration);
    },
    async fadeOutDown(element, duration = 1000) {
        return await this.animate(element, [
            {
                opacity: '100%',
                transform: 'translateY(0)',
            },
            {
                opacity: '0%',
                transform: 'translateY(40px)',
            },
        ], duration);
    },
    async fadeOutLeft(element, duration = 1000) {
        return await this.element.animate([
            {
                opacity: '100%',
                transform: 'translateX(0)',
            },
            {
                opacity: '0%',
                transform: 'translateX(-40px)',
            },
        ], duration);
    },
    async fadeOutRight(element, duration = 1000) {
        return await this.animate(element, [
            {
                opacity: '100%',
                transform: 'translateX(0)',
            },
            {
                opacity: '0%',
                transform: 'translateX(40px)',
            },
        ], duration);
    },
    async grow(element, duration = 1000) {
        return await this.animate(element, [
            {
                transform: 'scale(0)',
            },
            {
                transform: 'scale(1)',
            },
        ], duration);
    },
    async shrink(element, duration = 1000) {
        return await this.element.animate(element, [
            {
                transform: 'scale(1)',
            },
            {
                transform: 'scale(0)',
            },
        ], duration);
    },
    async rotate(element, duration = 1000, iterations = 1) {
        return await this.animate(element, [
            {
                transform: 'rotate(0deg)',
            },
            {
                transform: 'rotate(360deg)',
            },
        ], duration);
    },
    async bounce(element, duration = 500, iterations = 1) {
        return await this.animate(element, [
            {
                transform: 'translateY(0)',
            },
            {
                transform: 'translateY(-30px)',
            },
            {
                transform: 'translateY(0)',
            },
            {
                transform: 'translateY(-15px)',
            },
            {
                transform: 'translateY(0)',
            },
            {
                transform: 'translateY(-30px)',
            },
            {
                transform: 'translateY(0)',
            },
            {
                transform: 'translateY(-15px)',
            },
            {
                transform: 'translateY(0)',
            },
            {
                transform: 'translateY(0)',
            },
        ], duration, iterations);
    },
    async flip(element, duration = 500) {
        return await this.animate(element, [
            {
                transform: 'perspective(400px) rotateY(0)',
                animationTimingFunction: 'ease-out',
            },
            {
                transform: 'perspective(400px) rotateY(0)',
                animationTimingFunction: 'ease-out',
            },
            {
                transform: 'perspective(400px) rotateY(0)',
                animationTimingFunction: 'ease-out',
            },
            {
                transform: 'perspective(400px) translateZ(150px) rotateY(170deg)',
                animationTimingFunction: 'ease-out',
            },
            {
                transform: 'perspective(400px) translateZ(150px) rotateY(190deg) scale(1)',
                animationTimingFunction: 'ease-in',
            },
            {
                transform: 'perspective(400px) translateZ(150px) rotateY(190deg) scale(1)',
                animationTimingFunction: 'ease-in',
            },
            {
                transform: 'perspective(400px) translateZ(150px) rotateY(190deg) scale(1)',
                animationTimingFunction: 'ease-in',
            },
            {
                transform: 'perspective(400px) rotateY(360deg) scale(.95)',
                animationTimingFunction: 'ease-in',
            },
            {
                transform: 'perspective(400px) rotateY(360deg) scale(.95)',
                animationTimingFunction: 'ease-in',
            },
            {
                transform: 'perspective(400px) scale(1)',
                animationTimingFunction: 'ease-in',
            },
        ], duration);
    },
    async shake(element, duration = 1000, iterations = 1) {
        return await this.animate(element, [
            {
                transform: 'translateX(0)',
            },
            {
                transform: 'translateX(-10px)',
            },
            {
                transform: 'translateX(10px)',
            },
            {
                transform: 'translateX(-10px)',
            },
            {
                transform: 'translateX(10px)',
            },
            {
                transform: 'translateX(-10px)',
            },
            {
                transform: 'translateX(10px)',
            },
            {
                transform: 'translateX(-10px)',
            },
            {
                transform: 'translateX(10px)',
            },
            {
                transform: 'translateX(-10px)',
            },
            {
                transform: 'translateX(0)',
            },
        ], duration, iterations);
    },
};
