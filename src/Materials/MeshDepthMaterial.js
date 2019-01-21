import {Material} from './Material.js';
import {BasicDepthPacking} from '../Core/Constants.js';

/**
 * @author mrdoob / http://mrdoob.com/
 * @author alteredq / http://alteredqualia.com/
 * @author bhouston / https://clara.io
 * @author WestLangley / http://github.com/WestLangley
 * @modified DongYi 2018/07/19
 *
 * parameters = {
 *
 *  opacity: <float>,
 *
 *  map: new Speed3D.Texture( <Image> ),
 *
 *  alphaMap: new Speed3D.Texture( <Image> ),
 *
 *  displacementMap: new Speed3D.Texture( <Image> ),
 *  displacementScale: <float>,
 *  displacementBias: <float>,
 *
 *  wireframe: <boolean>,
 *  wireframeLinewidth: <float>
 * }
 */

/*function MeshDepthMaterial( parameters ) {

	Material.call( this );

	this.type = 'MeshDepthMaterial';

	this.depthPacking = BasicDepthPacking;

	this.skinning = false;
	this.morphTargets = false;

	this.map = null;

	this.alphaMap = null;

	this.displacementMap = null;
	this.displacementScale = 1;
	this.displacementBias = 0;

	this.wireframe = false;
	this.wireframeLinewidth = 1;

	this.fog = false;
	this.lights = false;

	this.setValues( parameters );

}

MeshDepthMaterial.prototype = Object.create( Material.prototype );
MeshDepthMaterial.prototype.constructor = MeshDepthMaterial;

MeshDepthMaterial.prototype.isMeshDepthMaterial = true;

MeshDepthMaterial.prototype.copy = function ( source ) {

	Material.prototype.copy.call( this, source );

	this.depthPacking = source.depthPacking;

	this.skinning = source.skinning;
	this.morphTargets = source.morphTargets;

	this.map = source.map;

	this.alphaMap = source.alphaMap;

	this.displacementMap = source.displacementMap;
	this.displacementScale = source.displacementScale;
	this.displacementBias = source.displacementBias;

	this.wireframe = source.wireframe;
	this.wireframeLinewidth = source.wireframeLinewidth;

	return this;

};*/

class MeshDepthMaterial extends Material {
    constructor(parameters) {
        super();
        this.type = 'MeshDepthMaterial';
        this.isMeshDepthMaterial = true;
        this.depthPacking = BasicDepthPacking;
        this.skinning = false;
        this.morphTargets = false;
        this.map = null;
        this.alphaMap = null;
        this.displacementMap = null;
        this.displacementScale = 1;
        this.displacementBias = 0;
        this.wireframe = false;
        this.wireframeLinewidth = 1;
        this.fog = false;
        this.lights = false;
        this.setValues(parameters);
    }

    copy(source) {
        super.copy(source);
        this.depthPacking = source.depthPacking;
        this.skinning = source.skinning;
        this.morphTargets = source.morphTargets;
        this.map = source.map;
        this.alphaMap = source.alphaMap;
        this.displacementMap = source.displacementMap;
        this.displacementScale = source.displacementScale;
        this.displacementBias = source.displacementBias;
        this.wireframe = source.wireframe;
        this.wireframeLinewidth = source.wireframeLinewidth;
        return this;
    }
}

export {MeshDepthMaterial};
