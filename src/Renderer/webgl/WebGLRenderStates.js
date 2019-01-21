/**
 * @author wangzhidong
 * @modified DongYi 2018/06/27
 */

import {WebGLLights} from './WebGLLights.js';

/*function WebGLRenderState() {

	var lights = new WebGLLights();

	var lightsArray = [];
	var shadowsArray = [];
	var spritesArray = [];

	function init() {

		lightsArray.length = 0;
		shadowsArray.length = 0;
		spritesArray.length = 0;

	}

	function pushLight( light ) {

		lightsArray.push( light );

	}

	function pushShadow( shadowLight ) {

		shadowsArray.push( shadowLight );

	}

	function pushSprite( shadowLight ) {

		spritesArray.push( shadowLight );

	}

	function setupLights( camera ) {

		lights.setup( lightsArray, shadowsArray, camera );

	}

	var state = {
		lightsArray: lightsArray,
		shadowsArray: shadowsArray,
		spritesArray: spritesArray,

		lights: lights
	};

	return {
		init: init,
		state: state,
		setupLights: setupLights,

		pushLight: pushLight,
		pushShadow: pushShadow,
		pushSprite: pushSprite
	};

}

function WebGLRenderStates() {

	var renderStates = {};

	function get( scene, camera ) {

		var hash = scene.id + ',' + camera.id;

		var renderState = renderStates[ hash ];

		if ( renderState === undefined ) {

			renderState = new WebGLRenderState();
			renderStates[ hash ] = renderState;

		}

		return renderState;

	}

	function dispose() {

		renderStates = {};

	}

	return {
		get: get,
		dispose: dispose
	};

}*/
class WebGLRenderState {

    constructor() {
        this.lights = new WebGLLights();
        this.lightsArray = [];
        this.shadowsArray = [];
        this.spritesArray = [];
        this.state = {
            lightsArray: this.lightsArray,
            shadowsArray: this.shadowsArray,
            spritesArray: this.spritesArray,
            lights: this.lights
        };
    }

    init() {
        this.lightsArray.length = 0;
        this.shadowsArray.length = 0;
        this.spritesArray.length = 0;
    }

    pushLight(light) {
        this.lightsArray.push(light);
    }

    pushShadow(shadowLight) {
        this.shadowsArray.push(shadowLight);
    }

    pushSprite(shadowLight) {
        this.spritesArray.push(shadowLight);
    }

    setupLights(camera) {
        this.lights.setup(this.lightsArray, this.shadowsArray, camera);
    }
}

class WebGLRenderStates {

    constructor() {
        this.renderStates = {};
    }

    get(scene, camera) {
        let hash = scene.id + ',' + camera.id;
        let renderState = this.renderStates[hash];
        if (renderState === undefined) {
            renderState = new WebGLRenderState();
            this.renderStates[hash] = renderState;
        }
        return renderState;
    }

    dispose() {
        this.renderStates = {};
    }
}

export {WebGLRenderStates};

