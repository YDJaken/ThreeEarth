/**
 * @author WangZhidong
 * @modified WangSuJian 2018/07/11
 */

/*import { Texture } from './Texture.js';
import { CubeReflectionMapping } from "../Core/Constants";

function CubeTexture( images, mapping, wrapS, wrapT, magFilter, minFilter, format, type, anisotropy, encoding ) {

	images = images !== undefined ? images : [];
	mapping = mapping !== undefined ? mapping : CubeReflectionMapping;

	Texture.call( this, images, mapping, wrapS, wrapT, magFilter, minFilter, format, type, anisotropy, encoding );

	this.flipY = false;

}

CubeTexture.prototype = Object.create( Texture.prototype );
CubeTexture.prototype.constructor = CubeTexture;

CubeTexture.prototype.isCubeTexture = true;

Object.defineProperty( CubeTexture.prototype, 'images', {

	get: function () {

		return this.image;

	},

	set: function ( value ) {

		this.image = value;

	}

} );


export { CubeTexture };*/

import {Texture} from "./Texture.js";
import {CubeReflectionMapping} from "../Core/Constants.js";

class CubeTexture extends Texture {
    constructor(images, mapping, wrapS, wrapT, magFilter, minFilter, format, type, anisotropy, encoding) {
        super();
        this.type = 'CubeTexture';
        this.images = images !== undefined ? images : [];
        this.mapping = mapping !== undefined ? mapping : CubeReflectionMapping;
        this.flipY = false;
        this.isCubeTexture = true;
    }

    get() {
        return this.image;
    }

    set(value) {
        this.image = value;
    }
}

export {CubeTexture};