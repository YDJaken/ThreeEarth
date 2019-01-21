/**
 * @author wangzhidong
 * @modified DongYi 2018/06/27
 */

class WebGLAnimation {
    constructor() {
        this.context = null;
        this.isAnimating = false;
        this.animationLoop = null;
    }

    onAnimationFrame(time, frame) {
        if (this.isAnimating === false) return;
        this.animationLoop(time, frame);
        this.context.requestAnimationFrame(onAnimationFrame);
    }

    start() {
        if (this.isAnimating === true) return;
        if (this.animationLoop === null) return;
        this.context.requestAnimationFrame(onAnimationFrame);
        this.isAnimating = true;
    }

    stop() {
        this.isAnimating = false;
    }

    setAnimationLoop(callback) {
        this.animationLoop = callback;
    }

    setContext(value) {
        this.context = value;
    }
}

export {WebGLAnimation};