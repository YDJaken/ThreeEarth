import {LightShadow} from "./LightShadow.js";
import {_Math} from "../../Datum/Math/Math.js";
import {PerspectiveCamera} from "../../Camera/PerspectiveCamera.js";

/**
 * @author wangzhidong
 * @modified DongYi 2018/07/11
 */

/*function SpotLightShadow() {

	LightShadow.call( this, new PerspectiveCamera( 50, 1, 0.5, 500 ) );

}

SpotLightShadow.prototype = Object.assign( Object.create( LightShadow.prototype ), {

	constructor: SpotLightShadow,

	isSpotLightShadow: true,

	update: function ( light ) {

		var camera = this.camera;

		var fov = _Math.RAD2DEG() * 2 * light.angle;
		var aspect = this.mapSize.width / this.mapSize.height;
		var far = light.distance || camera.far;

		if ( fov !== camera.fov || aspect !== camera.aspect || far !== camera.far ) {

			camera.fov = fov;
			camera.aspect = aspect;
			camera.far = far;
			camera.updateProjectionMatrix();

		}

	}

} );*/

class SpotLightShadow extends LightShadow{
    constructor() {
        super(new PerspectiveCamera(50, 1, 0.5, 500));
        this.isSpotLightShadow = true;
    }

    update(light) {
        let camera = this.camera;
        let fov = _Math.RAD2DEG() * 2 * light.angle;
        let aspect = this.mapSize.width / this.mapSize.height;
        let far = light.distance || camera.far;
        if (fov !== camera.fov || aspect !== camera.aspect || far !== camera.far) {
            camera.fov = fov;
            camera.aspect = aspect;
            camera.far = far;
            camera.updateProjectionMatrix();
        }
    }
}

export {SpotLightShadow};
