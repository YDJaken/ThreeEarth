/**
 * @author wangzhidong
 * @modified DongYi 2018/06/27
 */

import {Matrix3} from "../../Datum/Math/Matrix3.js";
import {Plane} from "../../Datum/Math/Plane.js";

/*function WebGLClipping() {

	var scope = this,

		globalState = null,
		numGlobalPlanes = 0,
		localClippingEnabled = false,
		renderingShadows = false,

		plane = new Plane(),
		viewNormalMatrix = new Matrix3(),

		uniform = { value: null, needsUpdate: false };

	this.uniform = uniform;
	this.numPlanes = 0;
	this.numIntersection = 0;

	this.init = function ( planes, enableLocalClipping, camera ) {

		var enabled =
			planes.length !== 0 ||
			enableLocalClipping ||
			// enable state of previous frame - the clipping code has to
			// run another frame in order to reset the state:
			numGlobalPlanes !== 0 ||
			localClippingEnabled;

		localClippingEnabled = enableLocalClipping;

		globalState = projectPlanes( planes, camera, 0 );
		numGlobalPlanes = planes.length;

		return enabled;

	};

	this.beginShadows = function () {

		renderingShadows = true;
		projectPlanes( null );

	};

	this.endShadows = function () {

		renderingShadows = false;
		resetGlobalState();

	};

	this.setState = function ( planes, clipIntersection, clipShadows, camera, cache, fromCache ) {

		if ( ! localClippingEnabled || planes === null || planes.length === 0 || renderingShadows && ! clipShadows ) {

			// there's no local clipping

			if ( renderingShadows ) {

				// there's no global clipping

				projectPlanes( null );

			} else {

				resetGlobalState();

			}

		} else {

			var nGlobal = renderingShadows ? 0 : numGlobalPlanes,
				lGlobal = nGlobal * 4,

				dstArray = cache.clippingState || null;

			uniform.value = dstArray; // ensure unique state

			dstArray = projectPlanes( planes, camera, lGlobal, fromCache );

			for ( var i = 0; i !== lGlobal; ++ i ) {

				dstArray[ i ] = globalState[ i ];

			}

			cache.clippingState = dstArray;
			this.numIntersection = clipIntersection ? this.numPlanes : 0;
			this.numPlanes += nGlobal;

		}


	};

	function resetGlobalState() {

		if ( uniform.value !== globalState ) {

			uniform.value = globalState;
			uniform.needsUpdate = numGlobalPlanes > 0;

		}

		scope.numPlanes = numGlobalPlanes;
		scope.numIntersection = 0;

	}

	function projectPlanes( planes, camera, dstOffset, skipTransform ) {

		var nPlanes = planes !== null ? planes.length : 0,
			dstArray = null;

		if ( nPlanes !== 0 ) {

			dstArray = uniform.value;

			if ( skipTransform !== true || dstArray === null ) {

				var flatSize = dstOffset + nPlanes * 4,
					viewMatrix = camera.matrixWorldInverse;

				viewNormalMatrix.getNormalMatrix( viewMatrix );

				if ( dstArray === null || dstArray.length < flatSize ) {

					dstArray = new Float32Array( flatSize );

				}

				for ( var i = 0, i4 = dstOffset; i !== nPlanes; ++ i, i4 += 4 ) {

					plane.copy( planes[ i ] ).applyMatrix4( viewMatrix, viewNormalMatrix );

					plane.normal.toArray( dstArray, i4 );
					dstArray[ i4 + 3 ] = plane.constant;

				}

			}

			uniform.value = dstArray;
			uniform.needsUpdate = true;

		}

		scope.numPlanes = nPlanes;

		return dstArray;

	}

}*/

class WebGLClipping {

    constructor() {
        this.globalState = null;
        this.numGlobalPlanes = 0;
        this.localClippingEnabled = false;
        this.renderingShadows = false;
        this.plane = new Plane();
        this.viewNormalMatrix = new Matrix3();
        this.uniform = {value: null, needsUpdate: false};
        this.numPlanes = 0;
        this.numIntersection = 0;
    }

    init(planes, enableLocalClipping, camera) {
        let enabled =
            planes.length !== 0 ||
            enableLocalClipping ||
            // enable state of previous frame - the clipping code has to
            // run another frame in order to reset the state:
            this.numGlobalPlanes !== 0 ||
            this.localClippingEnabled;
        this.localClippingEnabled = enableLocalClipping;
        this.globalState = this._projectPlanes(planes, camera, 0);
        this.numGlobalPlanes = planes.length;
        return enabled;
    }

    beginShadows() {
        this.renderingShadows = true;
        this._projectPlanes(null);
    }

    endShadows() {
        this.renderingShadows = false;
        this._resetGlobalState();
    }

    setState(planes, clipIntersection, clipShadows, camera, cache, fromCache) {
        if (!this.localClippingEnabled || planes === null || planes.length === 0 || this.renderingShadows && !clipShadows) {
            // there's no local clipping
            if (this.renderingShadows) {
                // there's no global clipping
                this._projectPlanes(null);
            } else {
                this._resetGlobalState();
            }
        } else {
            let nGlobal = this.renderingShadows ? 0 : this.numGlobalPlanes,
                lGlobal = nGlobal * 4,
                dstArray = cache.clippingState || null;
            this.uniform.value = dstArray; // ensure unique state
            dstArray = this._projectPlanes(planes, camera, lGlobal, fromCache);
            for (let i = 0; i !== lGlobal; ++i) {
                dstArray[i] = this.globalState[i];
            }
            cache.clippingState = dstArray;
            this.numIntersection = clipIntersection ? this.numPlanes : 0;
            this.numPlanes += nGlobal;
        }
    }

    _resetGlobalState() {
        if (this.uniform.value !== this.globalState) {
            this.uniform.value = this.globalState;
            this.uniform.needsUpdate = this.numGlobalPlanes > 0;
        }
        this.numPlanes = this.numGlobalPlanes;
        this.numIntersection = 0;
    }

    _projectPlanes(planes, camera, dstOffset, skipTransform) {
        let nPlanes = planes !== null ? planes.length : 0,
            dstArray = null;
        if (nPlanes !== 0) {
            dstArray = this.uniform.value;
            if (skipTransform !== true || dstArray === null) {
                let flatSize = dstOffset + nPlanes * 4,
                    viewMatrix = camera.matrixWorldInverse;
                this.viewNormalMatrix.getNormalMatrix(viewMatrix);
                if (dstArray === null || dstArray.length < flatSize) {
                    dstArray = new Float32Array(flatSize);
                }
                for (let i = 0, i4 = dstOffset; i !== nPlanes; ++i, i4 += 4) {
                    this.plane.copy(planes[i]).applyMatrix4(viewMatrix, this.viewNormalMatrix);
                    this.plane.normal.toArray(dstArray, i4);
                    dstArray[i4 + 3] = this.plane.constant;
                }
            }
            this.uniform.value = dstArray;
            this.uniform.needsUpdate = true;
        }
        this.numPlanes = nPlanes;
        return dstArray;
    }
}

export {WebGLClipping};