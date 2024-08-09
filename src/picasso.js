/*
Picasso HTML5 Canvas Abstraction
*/

export class Picasso {
    element;
    ctx;
    width;
    height;
    ratio;
    defaultTextColor;
    defaultFont;
    backgroundColor;

    constructor(canvas, options) {
        this.element = canvas;
        this.ctx = canvas.getContext('2d');
        this.width = options.width;
        this.height = options.height;
        this.defaultTextColor = options.defaultTextColor ?? '#121212';
        this.defaultFont = options.defaultFont ?? '18px Helvetica, sans-serif';
        this.backgroundColor = options.backgroundColor ?? null;

        if (!options.ratio) {
            const devicePixelRatio = window.devicePixelRatio || 1;
            const backingStorePixelRatio = this.ctx.webkitBackingStorePixelRatio ||
                this.ctx.mozBackingStorePixelRatio ||
                this.ctx.msBackingStorePixelRatio ||
                this.ctx.oBackingStorePixelRatio ||
                this.ctx.backingStorePixelRatio || 1;

            this.ratio = devicePixelRatio / backingStorePixelRatio;
        } else {
            this.ratio = options.ratio;
        }

        this.element.style.width = this.width + 'px';
        this.element.style.height = this.height + 'px';
        this.element.width = this.width * this.ratio;
        this.element.height = this.height * this.ratio;
        this.ctx.setTransform(this.ratio, 0, 0, this.ratio, 0, 0);
    }

    // Clear the canvas.
    clearScreen() {
        this.ctx.clearRect(0, 0, this.width, this.height);

        return this;
    }

    // Save current canvas context.
    saveCtx() {
        this.ctx.save();

        return this;
    }

    // Restore canvas context.
    restoreCtx() {
        this.ctx.restore();

        return this;
    }

    // Initiate a canvas draw loop.
    async paint(callback) {
        this.clearScreen();
        this.saveCtx();

        if (this.backgroundColor) {
            this.box(this.backgroundColor, 0, 0, this.width, this.height);
        }

        if (callback) {
            callback();
        }

        this.restoreCtx();
        await nextFrame();
        window.requestAnimationFrame(() => {
            this.paint(callback);
        });
    }

    // Draw a box on the canvas.
    box(fill, x, y, width, height) {
        this.ctx.fillStyle = fill;
        this.ctx.fillRect(x, y, width, height);

        return this;
    }

    // Draw a circle on the canvas.
    circle(fill, x, y, ratio) {
        // TODO: Implement circle drawing
    }

    // Draw an image on the canvas.
    image(src, x, y, width, height) {
        const image = new Image();
        image.src = src;
        this.ctx.drawImage(image, x, y, width, height);

        return this;
    }

    // Draw text on the canvas.
    text(text, x = 0, y = 0, fill) {
        this.ctx.font = this.defaultFont;
        this.ctx.fillStyle = fill ?? this.defaultTextColor;
        this.ctx.textAlign = 'left';
        this.ctx.textBaseline = 'top';
        this.ctx.fillText(text, x, y);

        return this;
    }

    // Measure width of text on canvas.
    textWidth(text) {
        return this.ctx.measureText(text).width;
    }
}

export async function nextFrame() {
    await new Promise(resolve => setTimeout(resolve));
}
