import { ShaderMaterial } from '../src/Materials/ShaderMaterial.js';

/**
 * @Refactor DongYi
 */

/*function RawShaderMaterial( parameters ) {

	ShaderMaterial.call( this, parameters );

	this.type = 'RawShaderMaterial';

}

RawShaderMaterial.prototype = Object.create( ShaderMaterial.prototype );
RawShaderMaterial.prototype.constructor = RawShaderMaterial;

RawShaderMaterial.prototype.isRawShaderMaterial = true;*/

class RawShaderMaterial extends ShaderMaterial{
    constructor(parameters) {
        super(parameters);
        this.type = 'RawShaderMaterial';
        this.isRawShaderMaterial = true;
    }

}

export { RawShaderMaterial };
