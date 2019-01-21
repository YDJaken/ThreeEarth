import {Color} from '../../Datum/Math/Color.js';
import {Vector2} from '../../Datum/Math/Vector2.js';
import {Matrix3} from '../../Datum/Math/Matrix3.js';

/**
 * @Author WangZhiDong
 * @modified DongYi 2018/07/14
 */

/*var UniformsLib = {

	common: {

		diffuse: { value: new Color( 0xeeeeee ) },
		opacity: { value: 1.0 },

		map: { value: null },
		uvTransform: { value: new Matrix3() },

		alphaMap: { value: null },

	},

	specularmap: {

		specularMap: { value: null },

	},

	envmap: {

		envMap: { value: null },
		flipEnvMap: { value: - 1 },
		reflectivity: { value: 1.0 },
		refractionRatio: { value: 0.98 },
		maxMipLevel: { value: 0 }

	},

	aomap: {

		aoMap: { value: null },
		aoMapIntensity: { value: 1 }

	},

	lightmap: {

		lightMap: { value: null },
		lightMapIntensity: { value: 1 }

	},

	emissivemap: {

		emissiveMap: { value: null }

	},

	bumpmap: {

		bumpMap: { value: null },
		bumpScale: { value: 1 }

	},

	normalmap: {

		normalMap: { value: null },
		normalScale: { value: new Vector2( 1, 1 ) }

	},

	displacementmap: {

		displacementMap: { value: null },
		displacementScale: { value: 1 },
		displacementBias: { value: 0 }

	},

	roughnessmap: {

		roughnessMap: { value: null }

	},

	metalnessmap: {

		metalnessMap: { value: null }

	},

	gradientmap: {

		gradientMap: { value: null }

	},

	fog: {

		fogDensity: { value: 0.00025 },
		fogNear: { value: 1 },
		fogFar: { value: 2000 },
		fogColor: { value: new Color( 0xffffff ) }

	},

	lights: {

		ambientLightColor: { value: [] },

		directionalLights: { value: [], properties: {
			direction: {},
			color: {},

			shadow: {},
			shadowBias: {},
			shadowRadius: {},
			shadowMapSize: {}
		} },

		directionalShadowMap: { value: [] },
		directionalShadowMatrix: { value: [] },

		spotLights: { value: [], properties: {
			color: {},
			position: {},
			direction: {},
			distance: {},
			coneCos: {},
			penumbraCos: {},
			decay: {},

			shadow: {},
			shadowBias: {},
			shadowRadius: {},
			shadowMapSize: {}
		} },

		spotShadowMap: { value: [] },
		spotShadowMatrix: { value: [] },

		pointLights: { value: [], properties: {
			color: {},
			position: {},
			decay: {},
			distance: {},

			shadow: {},
			shadowBias: {},
			shadowRadius: {},
			shadowMapSize: {},
			shadowCameraNear: {},
			shadowCameraFar: {}
		} },

		pointShadowMap: { value: [] },
		pointShadowMatrix: { value: [] },

		hemisphereLights: { value: [], properties: {
			direction: {},
			skyColor: {},
			groundColor: {}
		} },

		// TODO (abelnation): RectAreaLight BRDF data needs to be moved from example to main src
		rectAreaLights: { value: [], properties: {
			color: {},
			position: {},
			width: {},
			height: {}
		} }

	},

	points: {

		diffuse: { value: new Color( 0xeeeeee ) },
		opacity: { value: 1.0 },
		size: { value: 1.0 },
		scale: { value: 1.0 },
		map: { value: null },
		uvTransform: { value: new Matrix3() }

	}

};*/

class uniformsLib {
    constructor(){
        this.common = {
            diffuse: {value: new Color(0xeeeeee)},
            opacity: {value: 1.0},
            map: {value: null},
            uvTransform: {value: new Matrix3()},
            alphaMap: {value: null},
        };

        this.specularmap = {
            specularMap: {value: null},
        };

        this.envmap = {
            envMap: {value: null},
            flipEnvMap: {value: -1},
            reflectivity: {value: 1.0},
            refractionRatio: {value: 0.98},
            maxMipLevel: {value: 0}
        };

        this.aomap = {
            aoMap: {value: null},
            aoMapIntensity: {value: 1}
        };

        this.lightmap = {
            lightMap: {value: null},
            lightMapIntensity: {value: 1}
        };

        this.emissivemap = {
            emissiveMap: {value: null}
        };

        this.bumpmap = {
            bumpMap: {value: null},
            bumpScale: {value: 1}
        };

        this.normalmap = {
            normalMap: {value: null},
            normalScale: {value: new Vector2(1, 1)}
        };

        this.displacementmap = {
            displacementMap: {value: null},
            displacementScale: {value: 1},
            displacementBias: {value: 0}
        };

        this.roughnessmap = {
            roughnessMap: {value: null}
        };

        this.metalnessmap = {
            metalnessMap: {value: null}
        };

        this.gradientmap = {
            gradientMap: {value: null}
        };

        this.fog = {
            fogDensity: {value: 0.00025},
            fogNear: {value: 1},
            fogFar: {value: 2000},
            fogColor: {value: new Color(0xffffff)}
        };

        this.lights = {
            ambientLightColor: {value: []},
            directionalLights: {
                value: [], properties: {
                    direction: {},
                    color: {},
                    shadow: {},
                    shadowBias: {},
                    shadowRadius: {},
                    shadowMapSize: {}
                }
            },
            directionalShadowMap: {value: []},
            directionalShadowMatrix: {value: []},
            spotLights: {
                value: [],
                properties: {
                    color: {},
                    position: {},
                    direction: {},
                    distance: {},
                    coneCos: {},
                    penumbraCos: {},
                    decay: {},
                    shadow: {},
                    shadowBias: {},
                    shadowRadius: {},
                    shadowMapSize: {}
                }
            },
            spotShadowMap: {value: []},
            spotShadowMatrix: {value: []},
            pointLights: {
                value: [],
                properties: {
                    color: {},
                    position: {},
                    decay: {},
                    distance: {},
                    shadow: {},
                    shadowBias: {},
                    shadowRadius: {},
                    shadowMapSize: {},
                    shadowCameraNear: {},
                    shadowCameraFar: {}
                }
            },
            pointShadowMap: {value: []},
            pointShadowMatrix: {value: []},
            hemisphereLights: {value: [], properties: {direction: {}, skyColor: {}, groundColor: {}}},
            // TODO (abelnation): RectAreaLight BRDF data needs to be moved from example to main src
            rectAreaLights: {value: [], properties: {color: {}, position: {}, width: {}, height: {}}}
        };

        this. points= {
            diffuse: {value: new Color(0xeeeeee)},
            opacity: {value: 1.0},
            size: {value: 1.0},
            scale: {value: 1.0},
            map: {value: null},
            uvTransform: {value: new Matrix3()}
        }
    }

}

const UniformsLib = new uniformsLib();

export {UniformsLib};
