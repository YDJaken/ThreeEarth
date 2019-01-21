import { Material } from './Material.js';
import { Vector3 } from '../Datum/Math/Vector3.js';

/**
 * @author WestLangley / http://github.com/WestLangley
 * @modified DongYi 2018/07/19
 *
 * parameters = {
 *
 *  referencePosition: <float>,
 *  nearDistance: <float>,
 *  farDistance: <float>,
 *
 *  skinning: <bool>,
 *  morphTargets: <bool>,
 *
 *  map: new Speed3D.Texture( <Image> ),
 *
 *  alphaMap: new Speed3D.Texture( <Image> ),
 *
 *  displacementMap: new Speed3D.Texture( <Image> ),
 *  displacementScale: <float>,
 *  displacementBias: <float>
 *
 * }
 */

/*function MeshDistanceMaterial( parameters ) {

	Material.call( this );

	this.type = 'MeshDistanceMaterial';

	this.referencePosition = new Vector3();
	this.nearDistance = 1;
	this.farDistance = 1000;

	this.skinning = false;
	this.morphTargets = false;

	this.map = null;

	this.alphaMap = null;

	this.displacementMap = null;
	this.displacementScale = 1;
	this.displacementBias = 0;

	this.fog = false;
	this.lights = false;

	this.setValues( parameters );

}

MeshDistanceMaterial.prototype = Object.create( Material.prototype );
MeshDistanceMaterial.prototype.constructor = MeshDistanceMaterial;

MeshDistanceMaterial.prototype.isMeshDistanceMaterial = true;

MeshDistanceMaterial.prototype.copy = function ( source ) {

	Material.prototype.copy.call( this, source );

	this.referencePosition.copy( source.referencePosition );
	this.nearDistance = source.nearDistance;
	this.farDistance = source.farDistance;

	this.skinning = source.skinning;
	this.morphTargets = source.morphTargets;

	this.map = source.map;

	this.alphaMap = source.alphaMap;

	this.displacementMap = source.displacementMap;
	this.displacementScale = source.displacementScale;
	this.displacementBias = source.displacementBias;

	return this;

};*/

class MeshDistanceMaterial extends Material{
    constructor(parameters){
        super();
        this.type = 'MeshDistanceMaterial';
        this.isMeshDistanceMaterial = true;
        this.referencePosition = new Vector3();
        this.nearDistance = 1;
        this.farDistance = 1000;
        this.skinning = false;
        this.morphTargets = false;
        this.map = null;
        this.alphaMap = null;
        this.displacementMap = null;
        this.displacementScale = 1;
        this.displacementBias = 0;
        this.fog = false;
        this.lights = false;
        this.setValues( parameters );
    }

    copy(source){
        super.copy(source);
        this.referencePosition.copy( source.referencePosition );
        this.nearDistance = source.nearDistance;
        this.farDistance = source.farDistance;
        this.skinning = source.skinning;
        this.morphTargets = source.morphTargets;
        this.map = source.map;
        this.alphaMap = source.alphaMap;
        this.displacementMap = source.displacementMap;
        this.displacementScale = source.displacementScale;
        this.displacementBias = source.displacementBias;
        return this;
    }
}

export { MeshDistanceMaterial };
