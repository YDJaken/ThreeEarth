/**
 * @author wangzhidong
 * @modified DongYi 2018/07/10
 */

import {Matrix4} from '../../Datum/Math/Matrix4.js';
import {Vector3} from '../../Datum/Math/Vector3.js';
import {Vector4} from '../../Datum/Math/Vector4.js';
import {Quaternion} from '../../Datum/Math/Quaternion.js';
import {ArrayCamera} from '../../Camera/ArrayCamera.js';
import {PerspectiveCamera} from '../../Camera/PerspectiveCamera.js';
import {WebGLAnimation} from '../webgl/WebGLAnimation.js';

/*function WebVRManager( renderer ) {

	var scope = this;

	var device = null;
	var frameData = null;

	var poseTarget = null;

	var standingMatrix = new Matrix4();
	var standingMatrixInverse = new Matrix4();

	if ( typeof window !== 'undefined' && 'VRFrameData' in window ) {

		frameData = new window.VRFrameData();
		window.addEventListener( 'vrdisplaypresentchange', onVRDisplayPresentChange, false );

	}

	var matrixWorldInverse = new Matrix4();
	var tempQuaternion = new Quaternion();
	var tempPosition = new Vector3();

	var cameraL = new PerspectiveCamera();
	cameraL.bounds = new Vector4( 0.0, 0.0, 0.5, 1.0 );
	cameraL.layers.enable( 1 );

	var cameraR = new PerspectiveCamera();
	cameraR.bounds = new Vector4( 0.5, 0.0, 0.5, 1.0 );
	cameraR.layers.enable( 2 );

	var cameraVR = new ArrayCamera( [ cameraL, cameraR ] );
	cameraVR.layers.enable( 1 );
	cameraVR.layers.enable( 2 );

	//

	function isPresenting() {

		return device !== null && device.isPresenting === true;

	}

	var currentSize, currentPixelRatio;

	function onVRDisplayPresentChange() {

		if ( isPresenting() ) {

			var eyeParameters = device.getEyeParameters( 'left' );
			var renderWidth = eyeParameters.renderWidth;
			var renderHeight = eyeParameters.renderHeight;

			currentPixelRatio = renderer.getPixelRatio();
			currentSize = renderer.getSize();

			renderer.setDrawingBufferSize( renderWidth * 2, renderHeight, 1 );

			animation.start();

		} else if ( scope.enabled ) {

			renderer.setDrawingBufferSize( currentSize.width, currentSize.height, currentPixelRatio );

			animation.stop();

		}

	}

	//

	this.enabled = false;
	this.userHeight = 1.6;

	this.getDevice = function () {

		return device;

	};

	this.setDevice = function ( value ) {

		if ( value !== undefined ) device = value;

		animation.setContext( value );

	};

	this.setPoseTarget = function ( object ) {

		if ( object !== undefined ) poseTarget = object;

	};

	this.getCamera = function ( camera ) {

		if ( device === null ) return camera;

		device.depthNear = camera.near;
		device.depthFar = camera.far;

		device.getFrameData( frameData );

		//

		var stageParameters = device.stageParameters;

		if ( stageParameters ) {

			standingMatrix.fromArray( stageParameters.sittingToStandingTransform );

		} else {

			standingMatrix.makeTranslation( 0, scope.userHeight, 0 );

		}


		var pose = frameData.pose;
		var poseObject = poseTarget !== null ? poseTarget : camera;

		// We want to manipulate poseObject by its position and quaternion components since users may rely on them.
		poseObject.matrix.copy( standingMatrix );
		poseObject.matrix.decompose( poseObject.position, poseObject.quaternion, poseObject.scale );

		if ( pose.orientation !== null ) {

			tempQuaternion.fromArray( pose.orientation );
			poseObject.quaternion.multiply( tempQuaternion );

		}

		if ( pose.position !== null ) {

			tempQuaternion.setFromRotationMatrix( standingMatrix );
			tempPosition.fromArray( pose.position );
			tempPosition.applyQuaternion( tempQuaternion );
			poseObject.position.add( tempPosition );

		}

		poseObject.updateMatrixWorld();

		if ( device.isPresenting === false ) return camera;

		//

		cameraL.near = camera.near;
		cameraR.near = camera.near;

		cameraL.far = camera.far;
		cameraR.far = camera.far;

		cameraVR.matrixWorld.copy( camera.matrixWorld );
		cameraVR.matrixWorldInverse.copy( camera.matrixWorldInverse );

		cameraL.matrixWorldInverse.fromArray( frameData.leftViewMatrix );
		cameraR.matrixWorldInverse.fromArray( frameData.rightViewMatrix );

		// TODO (mrdoob) Double check this code

		standingMatrixInverse.getInverse( standingMatrix );

		cameraL.matrixWorldInverse.multiply( standingMatrixInverse );
		cameraR.matrixWorldInverse.multiply( standingMatrixInverse );

		var parent = poseObject.parent;

		if ( parent !== null ) {

			matrixWorldInverse.getInverse( parent.matrixWorld );

			cameraL.matrixWorldInverse.multiply( matrixWorldInverse );
			cameraR.matrixWorldInverse.multiply( matrixWorldInverse );

		}

		// envMap and Mirror needs camera.matrixWorld

		cameraL.matrixWorld.getInverse( cameraL.matrixWorldInverse );
		cameraR.matrixWorld.getInverse( cameraR.matrixWorldInverse );

		cameraL.projectionMatrix.fromArray( frameData.leftProjectionMatrix );
		cameraR.projectionMatrix.fromArray( frameData.rightProjectionMatrix );

		// HACK (mrdoob)
		// https://github.com/w3c/webvr/issues/203

		cameraVR.projectionMatrix.copy( cameraL.projectionMatrix );

		//

		var layers = device.getLayers();

		if ( layers.length ) {

			var layer = layers[ 0 ];

			if ( layer.leftBounds !== null && layer.leftBounds.length === 4 ) {

				cameraL.bounds.fromArray( layer.leftBounds );

			}

			if ( layer.rightBounds !== null && layer.rightBounds.length === 4 ) {

				cameraR.bounds.fromArray( layer.rightBounds );

			}

		}

		return cameraVR;

	};

	this.getStandingMatrix = function () {

		return standingMatrix;

	};

	this.isPresenting = isPresenting;

	// Animation Loop

	var animation = new WebGLAnimation();

	this.setAnimationLoop = function ( callback ) {

		animation.setAnimationLoop( callback );

	};

	this.submitFrame = function () {

		if ( isPresenting() ) device.submitFrame();

	};

	this.dispose = function () {

		if ( typeof window !== 'undefined' ) {

			window.removeEventListener( 'vrdisplaypresentchange', onVRDisplayPresentChange );

		}

	};

}*/

class WebVRManager {
    constructor(renderer) {
        this.renderer = renderer;
        this.device = null;
        this.frameData = null;
        this.poseTarget = null;
        this.standingMatrix = new Matrix4();
        this.standingMatrixInverse = new Matrix4();
        if (typeof window !== 'undefined' && 'VRFrameData' in window) {

            this.frameData = new window.VRFrameData();
            window.addEventListener('vrdisplaypresentchange', this._onVRDisplayPresentChange, false);

        }
        this.matrixWorldInverse = new Matrix4();
        this.tempQuaternion = new Quaternion();
        this.tempPosition = new Vector3();
        this.cameraL = new PerspectiveCamera();
        this.cameraL.bounds = new Vector4(0.0, 0.0, 0.5, 1.0);
        this.cameraL.layers.enable(1);
        this.cameraR = new PerspectiveCamera();
        this.cameraR.bounds = new Vector4(0.5, 0.0, 0.5, 1.0);
        this.cameraR.layers.enable(2);
        this.cameraVR = new ArrayCamera([this.cameraL, this.cameraR]);
        this.cameraVR.layers.enable(1);
        this.cameraVR.layers.enable(2);
        this.currentSize;
        this.currentPixelRatio;
        this.enabled = false;
        this.userHeight = 1.6;
        this.animation = new WebGLAnimation();
    }

    isPresenting() {
        return this.device !== null && this.device.isPresenting === true;
    }

    _onVRDisplayPresentChange() {
        if (this.isPresenting()) {
            let eyeParameters = this.device.getEyeParameters('left');
            let renderWidth = eyeParameters.renderWidth;
            let renderHeight = eyeParameters.renderHeight;
            this.currentPixelRatio = this.renderer.getPixelRatio();
            this.currentSize = this.renderer.getSize();
            this.renderer.setDrawingBufferSize(renderWidth * 2, renderHeight, 1);
            this.animation.start();
        } else if (this.enabled) {
            this.renderer.setDrawingBufferSize(this.currentSize.width, this.currentSize.height, this.currentPixelRatio);
            this.animation.stop();
        }
    }

    getDevice() {
        return this.device;
    }

    setDevice(value = undefined) {
        if (value !== undefined) this.device = value;
        this.animation.setContext(value);
    }

    setPoseTarget(object = undefined) {
        if (object !== undefined) this.poseTarget = object;
    }

    getCamera(camera) {
        let device = this.device;
        if (device === null) return camera;
        device.depthNear = camera.near;
        device.depthFar = camera.far;
        device.getFrameData(this.frameData);
        //
        let stageParameters = device.stageParameters;
        if (stageParameters) {
            this.standingMatrix.fromArray(stageParameters.sittingToStandingTransform);
        } else {
            this.standingMatrix.makeTranslation(0, this.userHeight, 0);
        }
        let pose = this.frameData.pose;
        let poseObject = this.poseTarget !== null ? this.poseTarget : camera;
        // We want to manipulate poseObject by its position and quaternion components since users may rely on them.
        poseObject.matrix.copy(this.standingMatrix);
        poseObject.matrix.decompose(poseObject.position, poseObject.quaternion, poseObject.scale);
        if (pose.orientation !== null) {
            this.tempQuaternion.fromArray(pose.orientation);
            poseObject.quaternion.multiply(this.tempQuaternion);
        }
        if (pose.position !== null) {
            this.tempQuaternion.setFromRotationMatrix(this.standingMatrix);
            this.tempPosition.fromArray(pose.position);
            this.tempPosition.applyQuaternion(this.tempQuaternion);
            poseObject.position.add(this.tempPosition);
        }
        poseObject.updateMatrixWorld();
        if (device.isPresenting === false) return camera;
        //
        this.cameraL.near = camera.near;
        this.cameraR.near = camera.near;
        this.cameraL.far = camera.far;
        this.cameraR.far = camera.far;
        this.cameraVR.matrixWorld.copy(camera.matrixWorld);
        this.cameraVR.matrixWorldInverse.copy(camera.matrixWorldInverse);
        this.cameraL.matrixWorldInverse.fromArray(this.frameData.leftViewMatrix);
        this.cameraR.matrixWorldInverse.fromArray(this.frameData.rightViewMatrix);
        // TODO (mrdoob) Double check this code
        this.standingMatrixInverse.getInverse(this.standingMatrix);
        this.cameraL.matrixWorldInverse.multiply(this.standingMatrixInverse);
        this.cameraR.matrixWorldInverse.multiply(this.standingMatrixInverse);
        let parent = poseObject.parent;
        if (parent !== null) {
            this.matrixWorldInverse.getInverse(parent.matrixWorld);
            this.cameraL.matrixWorldInverse.multiply(this.matrixWorldInverse);
            this.cameraR.matrixWorldInverse.multiply(this.matrixWorldInverse);
        }
        // envMap and Mirror needs camera.matrixWorld
        this.cameraL.matrixWorld.getInverse(this.cameraL.matrixWorldInverse);
        this.cameraR.matrixWorld.getInverse(this.cameraR.matrixWorldInverse);
        this.cameraL.projectionMatrix.fromArray(this.frameData.leftProjectionMatrix);
        this.cameraR.projectionMatrix.fromArray(this.frameData.rightProjectionMatrix);
        // HACK (mrdoob)
        // https://github.com/w3c/webvr/issues/203
        this.cameraVR.projectionMatrix.copy(this.cameraL.projectionMatrix);
        //
        let layers = device.getLayers();
        if (layers.length) {
            let layer = layers[0];
            if (layer.leftBounds !== null && layer.leftBounds.length === 4) {
                this.cameraL.bounds.fromArray(layer.leftBounds);
            }
            if (layer.rightBounds !== null && layer.rightBounds.length === 4) {
                this.cameraR.bounds.fromArray(layer.rightBounds);
            }
        }
        return this.cameraVR;
    }

    getStandingMatrix() {
        return this.standingMatrix;
    }

    setAnimationLoop(callback) {
        this.animation.setAnimationLoop(callback);
    }

    submitFrame() {
        if (this.isPresenting()) this.device.submitFrame();
    }

    dispose() {
        if (typeof window !== 'undefined') {
            window.removeEventListener('vrdisplaypresentchange', this._onVRDisplayPresentChange);
        }
    }
}

export {WebVRManager};
