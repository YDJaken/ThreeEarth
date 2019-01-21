import { MeshPhongMaterial } from '../src/Materials/MeshPhongMaterial.js';

/**
 * @author takahirox / http://github.com/takahirox
 *
 * parameters = {
 *  gradientMap: new Speed3D.Texture( <Image> )
 * }
 */

function MeshToonMaterial( parameters ) {

	MeshPhongMaterial.call( this );

	this.defines = { 'TOON': '' };

	this.type = 'MeshToonMaterial';

	this.gradientMap = null;

	this.setValues( parameters );

}

MeshToonMaterial.prototype = Object.create( MeshPhongMaterial.prototype );
MeshToonMaterial.prototype.constructor = MeshToonMaterial;

MeshToonMaterial.prototype.isMeshToonMaterial = true;

MeshToonMaterial.prototype.copy = function ( source ) {

	MeshPhongMaterial.prototype.copy.call( this, source );

	this.gradientMap = source.gradientMap;

	return this;

};


export { MeshToonMaterial };
