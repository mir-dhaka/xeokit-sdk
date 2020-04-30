import {math} from "../../../math/math.js";

const center = math.vec3();
const tempVec3a = math.vec3();
const tempVec3b = math.vec3();
const tempVec3c = math.vec3();
const tempVec3d = math.vec3();

const tempCameraTarget = {
    eye: math.vec3(),
    look: math.vec3(),
    up: math.vec3()
};

/**
 * @private
 */
class KeyboardAxisViewHandler {

    constructor(scene, controllers, configs, states, updates) {

        this._scene = scene;
        const input = scene.input;

        const camera = scene.camera;

        document.addEventListener("keydown", this._documentKeyDownHandler = (e) => {

            if (!(configs.active && configs.pointerEnabled) || (!scene.input.keyboardEnabled)) {
                return;
            }

            if (!states.mouseover) {
                return;
            }

            const keyCode = e.keyCode;

            if (keyCode !== input.KEY_NUM_1 && keyCode !== input.KEY_NUM_2 && keyCode !== input.KEY_NUM_3 &&
                keyCode !== input.KEY_NUM_4 && keyCode !== input.KEY_NUM_5 && keyCode !== input.KEY_NUM_6) {
                return;
            }

            const aabb = scene.aabb;
            const diag = math.getAABB3Diag(aabb);

            center[0] = aabb[0] + aabb[3] / 2.0;
            center[1] = aabb[1] + aabb[4] / 2.0;
            center[2] = aabb[2] + aabb[5] / 2.0;

            const dist = Math.abs((diag) / Math.tan(controllers.cameraFlight.fitFOV / 2));

            switch (keyCode) {

                case input.KEY_NUM_1: // Right
                    tempCameraTarget.eye.set(math.addVec3(center, math.mulVec3Scalar(camera.worldRight, dist, tempVec3a), tempVec3d));
                    tempCameraTarget.look.set(center);
                    tempCameraTarget.up.set(camera.worldUp);
                    break;

                case input.KEY_NUM_2: // Back
                    tempCameraTarget.eye.set(math.addVec3(center, math.mulVec3Scalar(camera.worldForward, dist, tempVec3a), tempVec3d));
                    tempCameraTarget.look.set(center);
                    tempCameraTarget.up.set(camera.worldUp);
                    break;

                case input.KEY_NUM_3: // Left
                    tempCameraTarget.eye.set(math.addVec3(center, math.mulVec3Scalar(camera.worldRight, -dist, tempVec3a), tempVec3d));
                    tempCameraTarget.look.set(center);
                    tempCameraTarget.up.set(camera.worldUp);
                    break;

                case input.KEY_NUM_4: // Front
                    tempCameraTarget.eye.set(math.addVec3(center, math.mulVec3Scalar(camera.worldForward, -dist, tempVec3a), tempVec3d));
                    tempCameraTarget.look.set(center);
                    tempCameraTarget.up.set(camera.worldUp);
                    break;

                case input.KEY_NUM_5: // Top
                    tempCameraTarget.eye.set(math.addVec3(center, math.mulVec3Scalar(camera.worldUp, dist, tempVec3a), tempVec3d));
                    tempCameraTarget.look.set(center);
                    tempCameraTarget.up.set(math.normalizeVec3(math.mulVec3Scalar(camera.worldForward, 1, tempVec3b), tempVec3c));
                    break;

                case input.KEY_NUM_6: // Bottom
                    tempCameraTarget.eye.set(math.addVec3(center, math.mulVec3Scalar(camera.worldUp, -dist, tempVec3a), tempVec3d));
                    tempCameraTarget.look.set(center);
                    tempCameraTarget.up.set(math.normalizeVec3(math.mulVec3Scalar(camera.worldForward, -1, tempVec3b)));
                    break;

                default:
                    return;
            }

            if (controllers.cameraFlight.duration > 0) {
                controllers.cameraFlight.flyTo(tempCameraTarget, () => {
                    if (controllers.pivotController.getPivoting()) {
                        controllers.pivotController.showPivot();
                    }
                });

            } else {
                controllers.cameraFlight.jumpTo(tempCameraTarget);
                if (controllers.pivotController.getPivoting()) {
                    controllers.pivotController.showPivot();
                }
            }
        });
    }

    reset() {
    }

    destroy() {
        document.removeEventListener("keydown", this._documentKeyDownHandler);
    }
}

export {KeyboardAxisViewHandler};