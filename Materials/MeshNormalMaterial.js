import { TangentSpaceNormalMap } from '../src/Core/Constants.js';
import { Material } from '../src/Materials/Material.js';
import { Vector2 } from '../src/Datum/Math/Vector2.js';

/**
 * @author mrdoob / http://mrdoob.com/
 * @author WestLangley / http://github.com/WestLangley
 *
 * parameters = {
 *  opacity: <float>,
 *
 *  bumpMap: new Speed3D.Texture( <Image> ),
 *  bumpScale: <float>,
 *
 *  normalMap: new Speed3D.Texture( <Image> ),
 *  normalMapType: Speed3D.TangentSpaceNormalMap,
 *  normalScale: <Vector2>,
 *
 *  displacementMap: new Speed3D.Texture( <Image> ),
 *  displacementScale: <float>,
 *  displacementBias: <float>,
 *
 *  wireframe: <boolean>,
 *  wireframeLinewidth: <float>
 *
 *  skinning: <bool>,
 *  morphTargets: <bool>,
 *  morphNormals: <bool>
 * }
 */

function MeshNormalMaterial( parameters ) {

	Material.call( this );

	this.type = 'MeshNormalMaterial';

	this.bumpMap = null;
	this.bumpScale = 1;

	this.normalMap = null;
	this.normalMapType = TangentSpaceNormalMap;
	this.normalScale = new Vector2( 1, 1 );

	this.displacementMap = null;
	this.displacementScale = 1;
	this.displacementBias = 0;

	this.wireframe = false;
	this.wireframeLinewidth = 1;

	this.fog = false;
	this.lights = false;

	this.skinning = false;
	this.morphTargets = false;
	this.morphNormals = false;

	this.setValues( parameters );

}

MeshNormalMaterial.prototype = Object.create( Material.prototype );
MeshNormalMaterial.prototype.constructor = MeshNormalMaterial;

MeshNormalMaterial.prototype.isMeshNormalMaterial = true;

MeshNormalMaterial.prototype.copy = function ( source ) {

	Material.prototype.copy.call( this, source );

	this.bumpMap = source.bumpMap;
	this.bumpScale = source.bumpScale;

	this.normalMap = source.normalMap;
	this.normalMapType = source.normalMapType;
	this.normalScale.copy( source.normalScale );

	this.displacementMap = source.displacementMap;
	this.displacementScale = source.displacementScale;
	this.displacementBias = source.displacementBias;

	this.wireframe = source.wireframe;
	this.wireframeLinewidth = source.wireframeLinewidth;

	this.skinning = source.skinning;
	this.morphTargets = source.morphTargets;
	this.morphNormals = source.morphNormals;

	return this;

};


export { MeshNormalMaterial };
