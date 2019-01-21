/**
 * @author wangzhidong
 * @modified  YanKai 2018/7/11
 */


import {ImageLoader} from "./ImageLoader.js";
import {CubeTexture} from "../Assets/CubeTexture.js";
import {DefaultLoadingManager} from "./LoadingManager.js";


/*
function CubeTextureLoader( manager ) {

	this.manager = ( manager !== undefined ) ? manager : DefaultLoadingManager;

}

Object.assign( CubeTextureLoader.prototype, {

	crossOrigin: 'Anonymous',

	load: function ( urls, onLoad, onProgress, onError ) {

		var texture = new CubeTexture();

		var loader = new ImageLoader( this.manager );
		loader.setCrossOrigin( this.crossOrigin );
		loader.setPath( this.path );

		var loaded = 0;

		function loadTexture( i ) {

			loader.load( urls[ i ], function ( image ) {

				texture.images[ i ] = image;

				loaded ++;

				if ( loaded === 6 ) {

					texture.needsUpdate = true;

					if ( onLoad ) onLoad( texture );

				}

			}, undefined, onError );

		}

		for ( var i = 0; i < urls.length; ++ i ) {

			loadTexture( i );

		}

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


export { CubeTextureLoader };
*/
class CubeTextureLoader{
	constructor(manager){
		this.manager = ( manager !== undefined ) ? manager : DefaultLoadingManager;
		this.crossOrigin= 'Anonymous';
		this.path=null;
		this.loaded=0;
		this.texture=new CubeTexture();
	}
	load( urls, onLoad, onProgress, onError ){
		let loader = new ImageLoader( this.manager );
		loader.setCrossOrigin( this.crossOrigin );
		loader.setPath( this.path );

		for(let i = 0; i < urls.length; ++ i ){
			this._loadTexture(i,urls,onLoad,onError);
		}
		return  this.texture;
	}
	_loadTexture(i,urls,onLoad,onError){
		loader.load( urls[ i ], function ( image ) {
			this.texture.images[ i ] = image;
			this.loaded ++;
			if ( this.loaded === 6 ) {
				this.texture.needsUpdate = true;
				if ( onLoad ) onLoad( this.texture );
			}
		}, undefined, onError );	
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
export { CubeTextureLoader };