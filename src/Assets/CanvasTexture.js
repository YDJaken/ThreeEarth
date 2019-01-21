/**
 * @author mrdoob / http://mrdoob.com/
 * @modified DongYi 2018/07/19
 */

import { Texture } from './Texture.js';

/*function CanvasTexture( canvas, mapping, wrapS, wrapT, magFilter, minFilter, format, type, anisotropy ) {

	Texture.call( this, canvas, mapping, wrapS, wrapT, magFilter, minFilter, format, type, anisotropy );

	this.needsUpdate = true;

}

CanvasTexture.prototype = Object.create( Texture.prototype );
CanvasTexture.prototype.constructor = CanvasTexture;
CanvasTexture.prototype.isCanvasTexture = true;*/

class CanvasTexture extends Texture{
	constructor(canvas, mapping, wrapS, wrapT, magFilter, minFilter, format, type, anisotropy){
		super(canvas, mapping, wrapS, wrapT, magFilter, minFilter, format, type, anisotropy);
        this.needsUpdate = true;
        this.isCanvasTexture = true;
	}
}

export { CanvasTexture };
