/**
 * Speed3D 入口类
 * @Author DongYi
 */
import {Atmosphere} from "../Atmosphere/Atmosphere.js";

var Rotation_value = -0.0002;

class Speed3D {
    constructor(obj) {
        this.sphere = obj.sphere;
        this.stars = obj.stars;
        this.scene = obj.scene;
        this.ModelLayer = obj.ModelLayer;
        this.camera = obj.camera;
        this.renderer = obj.renderer;
        this.controls = obj.controls;
        this.atmosphere = obj.atmosphere;
    }

    static render() {
        const {renderer, controls, stars, scene, camera, atmosphere} = window.top.Speed3D;
        let width = window.innerWidth,
            height = window.innerHeight;
        if (renderer.parameterSet._width !== width || renderer.parameterSet._height !== height) renderer.setSize(width, height);
        stars.rotation.y += Rotation_value;
        if (stars.rotation.y <= -500 || stars.rotation.y >= 500) {
            Rotation_value = -Rotation_value;
        }
        stars.renderOrder = -2;
        requestAnimationFrame(Speed3D.render);
        controls.update();
        renderer.render(scene, camera);
        if (atmosphere === true) {
            if (Atmosphere.loaded === false) {
                Atmosphere.init();
            }
            Atmosphere.active();
        } else {
            if (Atmosphere.usingAtmosphere === true) {
                Atmosphere.deActive();
            }
        }

    }
}

export {Speed3D}