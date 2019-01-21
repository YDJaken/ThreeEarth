/**
 *Created By WangZhiDong on 18-6-13.
 */

import {TextureLoader} from "./Loaders/TextureLoader.js";
import {CubeTextureLoader} from "./Loaders/CubeTextureLoader.js";

export var ImageUtils = {

    crossOrigin: undefined,

    loadTexture: function ( url, mapping, onLoad, onError ) {

        var loader = new TextureLoader();
        loader.setCrossOrigin( this.crossOrigin );

        var texture = loader.load( url, onLoad, undefined, onError );

        if ( mapping ) texture.mapping = mapping;

        return texture;

    },

    loadTextureCube: function ( urls, mapping, onLoad, onError ) {

        var loader = new CubeTextureLoader();
        loader.setCrossOrigin( this.crossOrigin );

        var texture = loader.load( urls, onLoad, undefined, onError );

        if ( mapping ) texture.mapping = mapping;

        return texture;

    },

    loadCompressedTexture: function () {

        console.error( 'Speed3DEngine.ImageUtils.loadCompressedTexture has been removed. Use Speed3DEngine.DDSLoader instead.' );

    },

    loadCompressedTextureCube: function () {

        console.error( 'Speed3DEngine.ImageUtils.loadCompressedTextureCube has been removed. Use Speed3DEngine.DDSLoader instead.' );

    }

};