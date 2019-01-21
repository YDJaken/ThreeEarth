/*
import { Object3D } from "../Core/Object3D";
import { WebGLRenderTargetCube } from "../Renderer/WebGLRenderTargetCube";
import { LinearFilter, RGBFormat } from "../Core/Constants";
import { Vector3 } from "../Datum/Math/Vector3";
import { PerspectiveCamera } from "./PerspectiveCamera";

/!**
 * @author wangzhidong
 * @modified WangSuJian 2018/07/11
 *!/

function CubeCamera( near, far, cubeResolution ) {

	Object3D.call( this );

	this.type = 'CubeCamera';

	var fov = 90, aspect = 1;

	var cameraPX = new PerspectiveCamera( fov, aspect, near, far );
	cameraPX.up.set( 0, - 1, 0 );
	cameraPX.lookAt( new Vector3( 1, 0, 0 ) );
	this.add( cameraPX );

	var cameraNX = new PerspectiveCamera( fov, aspect, near, far );
	cameraNX.up.set( 0, - 1, 0 );
	cameraNX.lookAt( new Vector3( - 1, 0, 0 ) );
	this.add( cameraNX );

	var cameraPY = new PerspectiveCamera( fov, aspect, near, far );
	cameraPY.up.set( 0, 0, 1 );
	cameraPY.lookAt( new Vector3( 0, 1, 0 ) );
	this.add( cameraPY );

	var cameraNY = new PerspectiveCamera( fov, aspect, near, far );
	cameraNY.up.set( 0, 0, - 1 );
	cameraNY.lookAt( new Vector3( 0, - 1, 0 ) );
	this.add( cameraNY );

	var cameraPZ = new PerspectiveCamera( fov, aspect, near, far );
	cameraPZ.up.set( 0, - 1, 0 );
	cameraPZ.lookAt( new Vector3( 0, 0, 1 ) );
	this.add( cameraPZ );

	var cameraNZ = new PerspectiveCamera( fov, aspect, near, far );
	cameraNZ.up.set( 0, - 1, 0 );
	cameraNZ.lookAt( new Vector3( 0, 0, - 1 ) );
	this.add( cameraNZ );

	var options = { format: RGBFormat, magFilter: LinearFilter, minFilter: LinearFilter };

	this.renderTarget = new WebGLRenderTargetCube( cubeResolution, cubeResolution, options );
	this.renderTarget.texture.name = "CubeCamera";

	this.update = function ( renderer, scene ) {

		if ( this.parent === null ) this.updateMatrixWorld();

		var renderTarget = this.renderTarget;
		var generateMipmaps = renderTarget.texture.generateMipmaps;

		renderTarget.texture.generateMipmaps = false;

		renderTarget.activeCubeFace = 0;
		renderer.render( scene, cameraPX, renderTarget );

		renderTarget.activeCubeFace = 1;
		renderer.render( scene, cameraNX, renderTarget );

		renderTarget.activeCubeFace = 2;
		renderer.render( scene, cameraPY, renderTarget );

		renderTarget.activeCubeFace = 3;
		renderer.render( scene, cameraNY, renderTarget );

		renderTarget.activeCubeFace = 4;
		renderer.render( scene, cameraPZ, renderTarget );

		renderTarget.texture.generateMipmaps = generateMipmaps;

		renderTarget.activeCubeFace = 5;
		renderer.render( scene, cameraNZ, renderTarget );

		renderer.setRenderTarget( null );

	};

	this.clear = function ( renderer, color, depth, stencil ) {

		var renderTarget = this.renderTarget;

		for ( var i = 0; i < 6; i ++ ) {

			renderTarget.activeCubeFace = i;
			renderer.setRenderTarget( renderTarget );

			renderer.clear( color, depth, stencil );

		}

		renderer.setRenderTarget( null );

	};

}

CubeCamera.prototype = Object.create( Object3D.prototype );
CubeCamera.prototype.constructor = CubeCamera;


export { CubeCamera };
*/

import { Object3D } from "../Core/Object3D.js";
import { WebGLRenderTargetCube } from "../Renderer/WebGLRenderTargetCube.js";
import { LinearFilter, RGBFormat } from "../Core/Constants.js";
import { Vector3 } from "../Datum/Math/Vector3.js";
import { PerspectiveCamera } from "./PerspectiveCamera.js";

class CubeCamera extends Object3D {
    constructor(near, far, cubeResolution) {
        super();
        this.type = 'CubeCamera';
        this.near = near;
        this.far = far;
        this.cubeResolution = cubeResolution;
        this.fov = 90;
        this.aspect = 1;
        this.cameraPX = new PerspectiveCamera(this.fov, this.aspect, this.near, this.far);
        this.cameraPX.up.set(0, -1, 0);
        this.cameraPX.lookAt(new Vector3(1, 0, 0));
        this.add(this.cameraPX);
        this.cameraNX = new PerspectiveCamera(this.fov, this.aspect, this.near, this.far);
        this.cameraNX.up.set(0, -1, 0);
        this.cameraNX.lookAt(new Vector3(-1, 0, 0));
        this.add(this.cameraNX);
        this.cameraPY = new PerspectiveCamera(this.fov, this.aspect, this.near, this.far);
        this.cameraPY.up.set(0, 0, 1);
        this.cameraPY.lookAt(new Vector3(0, 1, 0));
        this.add(this.cameraPY);
        this.cameraNY = new PerspectiveCamera(this.fov, this.aspect, this.near, this.far);
        this.cameraNY.up.set(0, 0, -1);
        this.cameraNY.lookAt(new Vector3(0, -1, 0));
        this.add(this.cameraNY);
        this.cameraPZ = new PerspectiveCamera(this.fov, this.aspect, this.near, this.far);
        this.cameraPZ.up.set(0, -1, 0);
        this.cameraPZ.lookAt(new Vector3(0, 0, 1));
        this.add(this.cameraPZ);
        this.cameraNZ = new PerspectiveCamera(this.fov, this.aspect, this.near, this.far);
        this.cameraNZ.up.set(0, -1, 0);
        this.cameraNZ.lookAt(new Vector3(0, 0, -1));
        this.add(this.cameraNZ);
        this.options = {format: RGBFormat, magFilter: LinearFilter, minFilter: LinearFilter};
        this.renderTarget = new WebGLRenderTargetCube(this.cubeResolution, this.cubeResolution, this.options);
        this.renderTarget.texture.name = "CubeCamera";
    }

    update(renderer, scene) {
        if (this.parent === null) this.updateMatrixWorld();
        let renderTarget = this.renderTarget;
        let generateMipmaps = renderTarget.texture.generateMipmaps;
        renderTarget.texture.generateMipmaps = false;
        renderTarget.activeCubeFace = 0;
        renderer.render(scene, this.cameraPX, renderTarget);
        renderTarget.activeCubeFace = 1;
        renderer.render(scene, this.cameraNX, renderTarget);
        renderTarget.activeCubeFace = 2;
        renderer.render(scene, this.cameraPY, renderTarget);
        renderTarget.activeCubeFace = 3;
        renderer.render(scene, this.cameraNY, renderTarget);
        renderTarget.activeCubeFace = 4;
        renderer.render(scene, this.cameraPZ, renderTarget);
        renderTarget.texture.generateMipmaps = generateMipmaps;
        renderTarget.activeCubeFace = 5;
        renderer.render(scene, this.cameraNZ, renderTarget);
        renderer.setRenderTarget(null);
    }

    clear(renderer, color, depth, stencil) {
        let renderTarget = this.renderTarget;
        for (let i = 0; i < 6; i++) {
            renderTarget.activeCubeFace = i;
            renderer.setRenderTarget(renderTarget);
            renderer.clear(color, depth, stencil);
        }
        renderer.setRenderTarget(null);
    }
}

export {CubeCamera};
