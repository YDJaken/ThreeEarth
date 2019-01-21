/**
 * @author wangzhidong
 * @modified YanKai 2018/7/11
 */



import {RGBAFormat,RGBFormat} from "../Core/Constants.js";
import {ImageLoader} from "./ImageLoader.js";
import {Texture} from "../Assets/Texture.js";
import {DefaultLoadingManager} from "./LoadingManager.js";

/*
function TextureLoader( manager ) {

	this.manager = ( manager !== undefined ) ? manager : DefaultLoadingManager;

}

Object.assign( TextureLoader.prototype, {

	crossOrigin: 'Anonymous',

	load: function ( url, onLoad, onProgress, onError ) {

		var texture = new Texture();

		var loader = new ImageLoader( this.manager );
		loader.setCrossOrigin( this.crossOrigin );
		loader.setPath( this.path );

		loader.load( url, function ( image ) {

			texture.image = image;

			// JPEGs can't have an alpha channel, so memory can be saved by storing them as RGB.
			var isJPEG = url.search( /\.(jpg|jpeg)$/ ) > 0 || url.search( /^data\:image\/jpeg/ ) === 0;

			texture.format = isJPEG ? RGBFormat : RGBAFormat;
			texture.needsUpdate = true;

			if ( onLoad !== undefined ) {

				onLoad( texture );

			}

		}, onProgress, onError );

		return texture;

	},

	setCrossOrigin: function ( value ) {

		this.crossOrigin = value;
		return this;

	},

	setPath: function ( value ) {

		this.path = value;
		return this;

	}

} );
*/

class TextureLoader{
	constructor(manager){
		this.manager=( manager !== undefined ) ? manager : DefaultLoadingManager;
		this.crossOrigin='true';
	}
	
	load(url, onLoad, onProgress, onError){
		let texture = new Texture();
		let loader = new ImageLoader( this.manager );
		loader.setCrossOrigin( this.crossOrigin );
		loader.setPath( this.path );
		loader.load( url, function ( image ) {
			texture.image = image;
			// JPEGs can't have an alpha channel, so memory can be saved by storing them as RGB.
			let isJPEG = url.search( /\.(jpg|jpeg)$/ ) > 0 || url.search( /^data\:image\/jpeg/ ) === 0;
			texture.format = isJPEG ? RGBFormat : RGBAFormat;
			texture.needsUpdate = true;
			if ( onLoad !== undefined ) {
				onLoad( texture );
			}
		}, onProgress, onError );
		return texture;
	}

	setCrossOrigin(value){
		this.crossOrigin = value;
		return this;
	}

	setPath(value){
		this.path = value;
		return this;
	}
}

export { TextureLoader };
