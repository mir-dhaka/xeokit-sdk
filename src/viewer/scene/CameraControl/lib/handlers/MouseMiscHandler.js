/**
 * @private
 */
class MouseMiscHandler {

    constructor(scene, controllers, configs, states, updates) {

        this._scene = scene;

        const canvas = this._scene.canvas.canvas;

        canvas.addEventListener("mouseenter", this._mouseEnterHandler = () => {
            states.mouseover = true;
        });

        canvas.addEventListener("mouseleave", this._mouseLeaveHandler = () => {
            states.mouseover = false;
        });

        canvas.addEventListener("mousemove", this._mouseMoveHandler = (e) => {
            getCanvasPosFromEvent(e, states.mouseCanvasPos);
        });

        canvas.addEventListener("mousedown", this._mouseDownHandler = (e) => {
            getCanvasPosFromEvent(e, states.mouseCanvasPos);
            states.mouseover = true;
        });
    }

    reset() {
    }

    destroy() {

        const canvas = this._scene.canvas.canvas;

        canvas.addEventListener("mousemove", this._mouseMoveHandler);
        canvas.addEventListener("mouseenter", this._mouseEnterHandler);
        canvas.removeEventListener("mouseleave", this._mouseLeaveHandler);
        canvas.removeEventListener("mousedown", this._mouseDownHandler);
    }
}

function getCanvasPosFromEvent(event, canvasPos) {
    if (!event) {
        event = window.event;
        canvasPos[0] = event.x;
        canvasPos[1] = event.y;
    } else {
        let element = event.target;
        let totalOffsetLeft = 0;
        let totalOffsetTop = 0;
        while (element.offsetParent) {
            totalOffsetLeft += element.offsetLeft;
            totalOffsetTop += element.offsetTop;
            element = element.offsetParent;
        }
        canvasPos[0] = event.pageX - totalOffsetLeft;
        canvasPos[1] = event.pageY - totalOffsetTop;
    }
    return canvasPos;
}

export {MouseMiscHandler};