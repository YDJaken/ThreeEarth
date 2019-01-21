/**
 * @author wangzhidong
 * @modified DongYi 2018/06/27
 */

/*import { Color } from '../../math/Color.js';
import { Matrix4 } from '../../math/Matrix4.js';
import { Vector2 } from '../../math/Vector2.js';
import { Vector3 } from '../../math/Vector3.js';*/

import {Color} from "../../Datum/Math/Color.js";
import {Matrix4} from "../../Datum/Math/Matrix4.js";
import {Vector2} from '../../Datum/Math/Vector2.js';
import {Vector3} from '../../Datum/Math/Vector3.js';

/*function UniformsCache() {

	var lights = {};

	return {

		get: function ( light ) {

			if ( lights[ light.id ] !== undefined ) {

				return lights[ light.id ];

			}

			var uniforms;

			switch ( light.type ) {

				case 'DirectionalLight':
					uniforms = {
						direction: new Vector3(),
						color: new Color(),

						shadow: false,
						shadowBias: 0,
						shadowRadius: 1,
						shadowMapSize: new Vector2()
					};
					break;

				case 'SpotLight':
					uniforms = {
						position: new Vector3(),
						direction: new Vector3(),
						color: new Color(),
						distance: 0,
						coneCos: 0,
						penumbraCos: 0,
						decay: 0,

						shadow: false,
						shadowBias: 0,
						shadowRadius: 1,
						shadowMapSize: new Vector2()
					};
					break;

				case 'PointLight':
					uniforms = {
						position: new Vector3(),
						color: new Color(),
						distance: 0,
						decay: 0,

						shadow: false,
						shadowBias: 0,
						shadowRadius: 1,
						shadowMapSize: new Vector2(),
						shadowCameraNear: 1,
						shadowCameraFar: 1000
					};
					break;

				case 'HemisphereLight':
					uniforms = {
						direction: new Vector3(),
						skyColor: new Color(),
						groundColor: new Color()
					};
					break;

				case 'RectAreaLight':
					uniforms = {
						color: new Color(),
						position: new Vector3(),
						halfWidth: new Vector3(),
						halfHeight: new Vector3()
						// TODO (abelnation): set RectAreaLight shadow uniforms
					};
					break;

			}

			lights[ light.id ] = uniforms;

			return uniforms;

		}

	};

}

var count = 0;

function WebGLLights() {

	var cache = new UniformsCache();

	var state = {

		id: count ++,

		hash: '',

		ambient: [ 0, 0, 0 ],
		directional: [],
		directionalShadowMap: [],
		directionalShadowMatrix: [],
		spot: [],
		spotShadowMap: [],
		spotShadowMatrix: [],
		rectArea: [],
		point: [],
		pointShadowMap: [],
		pointShadowMatrix: [],
		hemi: []

	};

	var vector3 = new Vector3();
	var matrix4 = new Matrix4();
	var matrix42 = new Matrix4();

	function setup( lights, shadows, camera ) {

		var r = 0, g = 0, b = 0;

		var directionalLength = 0;
		var pointLength = 0;
		var spotLength = 0;
		var rectAreaLength = 0;
		var hemiLength = 0;

		var viewMatrix = camera.matrixWorldInverse;

		for ( var i = 0, l = lights.length; i < l; i ++ ) {

			var light = lights[ i ];

			var color = light.color;
			var intensity = light.intensity;
			var distance = light.distance;

			var shadowMap = ( light.shadow && light.shadow.map ) ? light.shadow.map.texture : null;

			if ( light.isAmbientLight ) {

				r += color.r * intensity;
				g += color.g * intensity;
				b += color.b * intensity;

			} else if ( light.isDirectionalLight ) {

				var uniforms = cache.get( light );

				uniforms.color.copy( light.color ).multiplyScalar( light.intensity );
				uniforms.direction.setFromMatrixPosition( light.matrixWorld );
				vector3.setFromMatrixPosition( light.target.matrixWorld );
				uniforms.direction.sub( vector3 );
				uniforms.direction.transformDirection( viewMatrix );

				uniforms.shadow = light.castShadow;

				if ( light.castShadow ) {

					var shadow = light.shadow;

					uniforms.shadowBias = shadow.bias;
					uniforms.shadowRadius = shadow.radius;
					uniforms.shadowMapSize = shadow.mapSize;

				}

				state.directionalShadowMap[ directionalLength ] = shadowMap;
				state.directionalShadowMatrix[ directionalLength ] = light.shadow.matrix;
				state.directional[ directionalLength ] = uniforms;

				directionalLength ++;

			} else if ( light.isSpotLight ) {

				var uniforms = cache.get( light );

				uniforms.position.setFromMatrixPosition( light.matrixWorld );
				uniforms.position.applyMatrix4( viewMatrix );

				uniforms.color.copy( color ).multiplyScalar( intensity );
				uniforms.distance = distance;

				uniforms.direction.setFromMatrixPosition( light.matrixWorld );
				vector3.setFromMatrixPosition( light.target.matrixWorld );
				uniforms.direction.sub( vector3 );
				uniforms.direction.transformDirection( viewMatrix );

				uniforms.coneCos = Math.cos( light.angle );
				uniforms.penumbraCos = Math.cos( light.angle * ( 1 - light.penumbra ) );
				uniforms.decay = ( light.distance === 0 ) ? 0.0 : light.decay;

				uniforms.shadow = light.castShadow;

				if ( light.castShadow ) {

					var shadow = light.shadow;

					uniforms.shadowBias = shadow.bias;
					uniforms.shadowRadius = shadow.radius;
					uniforms.shadowMapSize = shadow.mapSize;

				}

				state.spotShadowMap[ spotLength ] = shadowMap;
				state.spotShadowMatrix[ spotLength ] = light.shadow.matrix;
				state.spot[ spotLength ] = uniforms;

				spotLength ++;

			} else if ( light.isRectAreaLight ) {

				var uniforms = cache.get( light );

				// (a) intensity is the total visible light emitted
				//uniforms.color.copy( color ).multiplyScalar( intensity / ( light.width * light.height * Math.PI ) );

				// (b) intensity is the brightness of the light
				uniforms.color.copy( color ).multiplyScalar( intensity );

				uniforms.position.setFromMatrixPosition( light.matrixWorld );
				uniforms.position.applyMatrix4( viewMatrix );

				// extract local rotation of light to derive width/height half vectors
				matrix42.identity();
				matrix4.copy( light.matrixWorld );
				matrix4.premultiply( viewMatrix );
				matrix42.extractRotation( matrix4 );

				uniforms.halfWidth.set( light.width * 0.5, 0.0, 0.0 );
				uniforms.halfHeight.set( 0.0, light.height * 0.5, 0.0 );

				uniforms.halfWidth.applyMatrix4( matrix42 );
				uniforms.halfHeight.applyMatrix4( matrix42 );

				// TODO (abelnation): RectAreaLight distance?
				// uniforms.distance = distance;

				state.rectArea[ rectAreaLength ] = uniforms;

				rectAreaLength ++;

			} else if ( light.isPointLight ) {

				var uniforms = cache.get( light );

				uniforms.position.setFromMatrixPosition( light.matrixWorld );
				uniforms.position.applyMatrix4( viewMatrix );

				uniforms.color.copy( light.color ).multiplyScalar( light.intensity );
				uniforms.distance = light.distance;
				uniforms.decay = ( light.distance === 0 ) ? 0.0 : light.decay;

				uniforms.shadow = light.castShadow;

				if ( light.castShadow ) {

					var shadow = light.shadow;

					uniforms.shadowBias = shadow.bias;
					uniforms.shadowRadius = shadow.radius;
					uniforms.shadowMapSize = shadow.mapSize;
					uniforms.shadowCameraNear = shadow.camera.near;
					uniforms.shadowCameraFar = shadow.camera.far;

				}

				state.pointShadowMap[ pointLength ] = shadowMap;
				state.pointShadowMatrix[ pointLength ] = light.shadow.matrix;
				state.point[ pointLength ] = uniforms;

				pointLength ++;

			} else if ( light.isHemisphereLight ) {

				var uniforms = cache.get( light );

				uniforms.direction.setFromMatrixPosition( light.matrixWorld );
				uniforms.direction.transformDirection( viewMatrix );
				uniforms.direction.normalize();

				uniforms.skyColor.copy( light.color ).multiplyScalar( intensity );
				uniforms.groundColor.copy( light.groundColor ).multiplyScalar( intensity );

				state.hemi[ hemiLength ] = uniforms;

				hemiLength ++;

			}

		}

		state.ambient[ 0 ] = r;
		state.ambient[ 1 ] = g;
		state.ambient[ 2 ] = b;

		state.directional.length = directionalLength;
		state.spot.length = spotLength;
		state.rectArea.length = rectAreaLength;
		state.point.length = pointLength;
		state.hemi.length = hemiLength;

		state.hash = state.id + ',' + directionalLength + ',' + pointLength + ',' + spotLength + ',' + rectAreaLength + ',' + hemiLength + ',' + shadows.length;

	}

	return {
		setup: setup,
		state: state
	};

}*/

class UniformsCache {

    constructor() {
        this.lights = {};
    }

    get(light) {
        if (this.lights[light.id] !== undefined) {
            return this.lights[light.id];
        }
        let uniforms;
        switch (light.type) {
            case 'DirectionalLight':
                uniforms = {
                    direction: new Vector3(),
                    color: new Color(),

                    shadow: false,
                    shadowBias: 0,
                    shadowRadius: 1,
                    shadowMapSize: new Vector2()
                };
                break;
            case 'SpotLight':
                uniforms = {
                    position: new Vector3(),
                    direction: new Vector3(),
                    color: new Color(),
                    distance: 0,
                    coneCos: 0,
                    penumbraCos: 0,
                    decay: 0,

                    shadow: false,
                    shadowBias: 0,
                    shadowRadius: 1,
                    shadowMapSize: new Vector2()
                };
                break;
            case 'PointLight':
                uniforms = {
                    position: new Vector3(),
                    color: new Color(),
                    distance: 0,
                    decay: 0,
                    shadow: false,
                    shadowBias: 0,
                    shadowRadius: 1,
                    shadowMapSize: new Vector2(),
                    shadowCameraNear: 1,
                    shadowCameraFar: 1000
                };
                break;
            case 'HemisphereLight':
                uniforms = {
                    direction: new Vector3(),
                    skyColor: new Color(),
                    groundColor: new Color()
                };
                break;
            case 'RectAreaLight':
                uniforms = {
                    color: new Color(),
                    position: new Vector3(),
                    halfWidth: new Vector3(),
                    halfHeight: new Vector3()
                    // TODO (abelnation): set RectAreaLight shadow uniforms
                };
                break;
        }
        this.lights[light.id] = uniforms;
        return uniforms;
    }
}

var count_WebGLLights;

class WebGLLights {

    constructor() {
        this.cache = new UniformsCache();
        this.state = {
            id: count_WebGLLights++,
            hash: '',
            ambient: [0, 0, 0],
            directional: [],
            directionalShadowMap: [],
            directionalShadowMatrix: [],
            spot: [],
            spotShadowMap: [],
            spotShadowMatrix: [],
            rectArea: [],
            point: [],
            pointShadowMap: [],
            pointShadowMatrix: [],
            hemi: []
        };
        this.vector3 = new Vector3();
        this.matrix4 = new Matrix4();
        this.matrix42 = new Matrix4();
    }

    setup(lights, shadows, camera) {
        let r = 0, g = 0, b = 0;
        let directionalLength = 0;
        let pointLength = 0;
        let spotLength = 0;
        let rectAreaLength = 0;
        let hemiLength = 0;
        let viewMatrix = camera.matrixWorldInverse;
        for (let i = 0, l = lights.length; i < l; i++) {
            let light = lights[i];
            let color = light.color;
            let intensity = light.intensity;
            let distance = light.distance;
            let shadowMap = (light.shadow && light.shadow.map) ? light.shadow.map.texture : null;
            if (light.isAmbientLight) {
                r += color.r * intensity;
                g += color.g * intensity;
                b += color.b * intensity;
            } else if (light.isDirectionalLight) {
                let uniforms = this.cache.get(light);
                uniforms.color.copy(light.color).multiplyScalar(light.intensity);
                uniforms.direction.setFromMatrixPosition(light.matrixWorld);
                this.vector3.setFromMatrixPosition(light.target.matrixWorld);
                uniforms.direction.sub(this.vector3);
                uniforms.direction.transformDirection(viewMatrix);
                uniforms.shadow = light.castShadow;
                if (light.castShadow) {
                    let shadow = light.shadow;
                    uniforms.shadowBias = shadow.bias;
                    uniforms.shadowRadius = shadow.radius;
                    uniforms.shadowMapSize = shadow.mapSize;
                }
                this.state.directionalShadowMap[directionalLength] = shadowMap;
                this.state.directionalShadowMatrix[directionalLength] = light.shadow.matrix;
                this.state.directional[directionalLength] = uniforms;
                directionalLength++;
            } else if (light.isSpotLight) {
                let uniforms = this.cache.get(light);
                uniforms.position.setFromMatrixPosition(light.matrixWorld);
                uniforms.position.applyMatrix4(viewMatrix);
                uniforms.color.copy(color).multiplyScalar(intensity);
                uniforms.distance = distance;
                uniforms.direction.setFromMatrixPosition(light.matrixWorld);
                this.vector3.setFromMatrixPosition(light.target.matrixWorld);
                uniforms.direction.sub(this.vector3);
                uniforms.direction.transformDirection(viewMatrix);
                uniforms.coneCos = Math.cos(light.angle);
                uniforms.penumbraCos = Math.cos(light.angle * (1 - light.penumbra));
                uniforms.decay = (light.distance === 0) ? 0.0 : light.decay;
                uniforms.shadow = light.castShadow;
                if (light.castShadow) {
                    let shadow = light.shadow;
                    uniforms.shadowBias = shadow.bias;
                    uniforms.shadowRadius = shadow.radius;
                    uniforms.shadowMapSize = shadow.mapSize;
                }
                this.state.spotShadowMap[spotLength] = shadowMap;
                this.state.spotShadowMatrix[spotLength] = light.shadow.matrix;
                this.state.spot[spotLength] = uniforms;
                spotLength++;
            } else if (light.isRectAreaLight) {
                let uniforms = this.cache.get(light);
                // (a) intensity is the total visible light emitted
                //uniforms.color.copy( color ).multiplyScalar( intensity / ( light.width * light.height * Math.PI ) );
                // (b) intensity is the brightness of the light
                uniforms.color.copy(color).multiplyScalar(intensity);
                uniforms.position.setFromMatrixPosition(light.matrixWorld);
                uniforms.position.applyMatrix4(viewMatrix);
                // extract local rotation of light to derive width/height half vectors
                this.matrix42.identity();
                this.matrix4.copy(light.matrixWorld);
                this.matrix4.premultiply(viewMatrix);
                this.matrix42.extractRotation(this.matrix4);
                uniforms.halfWidth.set(light.width * 0.5, 0.0, 0.0);
                uniforms.halfHeight.set(0.0, light.height * 0.5, 0.0);
                uniforms.halfWidth.applyMatrix4(this.matrix42);
                uniforms.halfHeight.applyMatrix4(this.matrix42);
                // TODO (abelnation): RectAreaLight distance?
                // uniforms.distance = distance;
                this.state.rectArea[rectAreaLength] = uniforms;
                rectAreaLength++;
            } else if (light.isPointLight) {
                let uniforms = this.cache.get(light);
                uniforms.position.setFromMatrixPosition(light.matrixWorld);
                uniforms.position.applyMatrix4(viewMatrix);
                uniforms.color.copy(light.color).multiplyScalar(light.intensity);
                uniforms.distance = light.distance;
                uniforms.decay = (light.distance === 0) ? 0.0 : light.decay;
                uniforms.shadow = light.castShadow;
                if (light.castShadow) {
                    let shadow = light.shadow;
                    uniforms.shadowBias = shadow.bias;
                    uniforms.shadowRadius = shadow.radius;
                    uniforms.shadowMapSize = shadow.mapSize;
                    uniforms.shadowCameraNear = shadow.camera.near;
                    uniforms.shadowCameraFar = shadow.camera.far;
                }
                this.state.pointShadowMap[pointLength] = shadowMap;
                this.state.pointShadowMatrix[pointLength] = light.shadow.matrix;
                this.state.point[pointLength] = uniforms;
                pointLength++;
            } else if (light.isHemisphereLight) {
                let uniforms = this.cache.get(light);
                uniforms.direction.setFromMatrixPosition(light.matrixWorld);
                uniforms.direction.transformDirection(viewMatrix);
                uniforms.direction.normalize();
                uniforms.skyColor.copy(light.color).multiplyScalar(intensity);
                uniforms.groundColor.copy(light.groundColor).multiplyScalar(intensity);
                this.state.hemi[hemiLength] = uniforms;
                hemiLength++;
            }
        }
        this.state.ambient[0] = r;
        this.state.ambient[1] = g;
        this.state.ambient[2] = b;
        this.state.directional.length = directionalLength;
        this.state.spot.length = spotLength;
        this.state.rectArea.length = rectAreaLength;
        this.state.point.length = pointLength;
        this.state.hemi.length = hemiLength;
        this.state.hash = `${this.state.id},${directionalLength},${pointLength},${spotLength},${rectAreaLength},${hemiLength},${shadows.length}`;
    }
}

export {WebGLLights};