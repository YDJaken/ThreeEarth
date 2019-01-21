/*
import { Matrix4 } from "../Datum/Math/Matrix4";
import { _Math } from "../Datum/Math/Math";
import { PerspectiveCamera } from "./PerspectiveCamera";

/!**
 * @author wangzhidong
 * @modified WangSuJian 2018/07/11
 *!/

function StereoCamera() {

	this.type = 'StereoCamera';

	this.aspect = 1;

	this.eyeSep = 0.064;

	this.cameraL = new PerspectiveCamera();
	this.cameraL.layers.enable( 1 );
	this.cameraL.matrixAutoUpdate = false;

	this.cameraR = new PerspectiveCamera();
	this.cameraR.layers.enable( 2 );
	this.cameraR.matrixAutoUpdate = false;

}

Object.assign( StereoCamera.prototype, {

	update: ( function () {

		var instance, focus, fov, aspect, near, far, zoom, eyeSep;

		var eyeRight = new Matrix4();
		var eyeLeft = new Matrix4();

		return function update( camera ) {

			var needsUpdate = instance !== this || focus !== camera.focus || fov !== camera.fov ||
												aspect !== camera.aspect * this.aspect || near !== camera.near ||
												far !== camera.far || zoom !== camera.zoom || eyeSep !== this.eyeSep;

			if ( needsUpdate ) {

				instance = this;
				focus = camera.focus;
				fov = camera.fov;
				aspect = camera.aspect * this.aspect;
				near = camera.near;
				far = camera.far;
				zoom = camera.zoom;

				// Off-axis stereoscopic effect based on
				// http://paulbourke.net/stereographics/stereorender/

				var projectionMatrix = camera.projectionMatrix.clone();
				eyeSep = this.eyeSep / 2;
				var eyeSepOnProjection = eyeSep * near / focus;
				var ymax = ( near * Math.tan( _Math.DEG2RAD() * fov * 0.5 ) ) / zoom;
				var xmin, xmax;

				// translate xOffset

				eyeLeft.elements[ 12 ] = - eyeSep;
				eyeRight.elements[ 12 ] = eyeSep;

				// for left eye

				xmin = - ymax * aspect + eyeSepOnProjection;
				xmax = ymax * aspect + eyeSepOnProjection;

				projectionMatrix.elements[ 0 ] = 2 * near / ( xmax - xmin );
				projectionMatrix.elements[ 8 ] = ( xmax + xmin ) / ( xmax - xmin );

				this.cameraL.projectionMatrix.copy( projectionMatrix );

				// for right eye

				xmin = - ymax * aspect - eyeSepOnProjection;
				xmax = ymax * aspect - eyeSepOnProjection;

				projectionMatrix.elements[ 0 ] = 2 * near / ( xmax - xmin );
				projectionMatrix.elements[ 8 ] = ( xmax + xmin ) / ( xmax - xmin );

				this.cameraR.projectionMatrix.copy( projectionMatrix );

			}

			this.cameraL.matrixWorld.copy( camera.matrixWorld ).multiply( eyeLeft );
			this.cameraR.matrixWorld.copy( camera.matrixWorld ).multiply( eyeRight );

		};

	} )()

} );


export { StereoCamera };
*/

import { Matrix4 } from "../Datum/Math/Matrix4.js";
import { _Math } from "../Datum/Math/Math.js";
import { PerspectiveCamera } from "./PerspectiveCamera.js";

class StereoCamera {
    constructor() {
        this.type = 'StereoCamera';
        this.aspect = 1;
        this.eyeSep = 0.064;
        this.cameraL = new PerspectiveCamera();
        this.cameraL.layers.enable(1);
        this.cameraL.matrixAutoUpdate = false;
        this.cameraR = new PerspectiveCamera();
        this.cameraR.layers.enable(2);
        this.cameraR.matrixAutoUpdate = false;
    }

    update(camera){
        let instance, focus, fov, aspect, near, far, zoom, eyeSep;
        let eyeRight = new Matrix4();
        let eyeLeft = new Matrix4();
        let scope = this;
        return (function update() {
            //camera 内属性focus,fov,aspect,near,far,zoom未找到
            let needsUpdate = instance !== scope || focus !== camera.focus || fov !== camera.fov ||
                aspect !== camera.aspect * scope.aspect || near !== camera.near ||
                far !== camera.far || zoom !== camera.zoom || eyeSep !== scope.eyeSep;
            if (needsUpdate) {
                instance = scope;
                focus = camera.focus;
                fov = camera.fov;
                aspect = camera.aspect * scope.aspect;
                near = camera.near;
                far = camera.far;
                zoom = camera.zoom;
                // Off-axis stereoscopic effect based on
                // http://paulbourke.net/stereographics/stereorender/
                let projectionMatrix = camera.projectionMatrix.clone();
                eyeSep = scope.eyeSep / 2;
                let eyeSepOnProjection = eyeSep * near / focus;
                let ymax = (near * Math.tan(_Math.DEG2RAD() * fov * 0.5)) / zoom;
                let xmin, xmax;
                // translate xOffset
                eyeLeft.elements[12] = -eyeSep;
                eyeRight.elements[12] = eyeSep;
                // for left eye
                xmin = -ymax * aspect + eyeSepOnProjection;
                xmax = ymax * aspect + eyeSepOnProjection;
                projectionMatrix.elements[0] = 2 * near / (xmax - xmin);
                projectionMatrix.elements[8] = (xmax + xmin) / (xmax - xmin);
                scope.cameraL.projectionMatrix.copy(projectionMatrix);
                // for right eye
                xmin = -ymax * aspect - eyeSepOnProjection;
                xmax = ymax * aspect - eyeSepOnProjection;
                projectionMatrix.elements[0] = 2 * near / (xmax - xmin);
                projectionMatrix.elements[8] = (xmax + xmin) / (xmax - xmin);
                scope.cameraR.projectionMatrix.copy(projectionMatrix);
            }
            scope.cameraL.matrixWorld.copy(camera.matrixWorld).multiply(eyeLeft);
            scope.cameraR.matrixWorld.copy(camera.matrixWorld).multiply(eyeRight);
        })();
        }
    }

export {StereoCamera};
