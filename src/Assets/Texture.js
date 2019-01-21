/**
 *作者： WangZhiDong
 *日期：18-6-25
 *时间：下午1:18
 * @modified WangSuJian 2018/07/11
 */

import {UVMapping} from "../Core/Constants.js";
import {
    MirroredRepeatWrapping,
    ClampToEdgeWrapping,
    RepeatWrapping,
    LinearEncoding,
    UnsignedByteType,
    RGBAFormat,
    LinearMipMapLinearFilter,
    LinearFilter
} from "../Core/Constants.js";
import {_Math} from "../Datum/Math/Math.js";
import {Vector2} from "../Datum/Math/Vector2.js";
import {Matrix3} from "../Datum/Math/Matrix3.js";
import {EventDispatcher} from "../Core/EventDispatcher.js";

var texturedId_Speed3DGis = 0;

class Texture extends EventDispatcher {
    constructor(image, mapping, wrapS = ClampToEdgeWrapping, wrapT = ClampToEdgeWrapping, magFilter = LinearFilter, minFilter = LinearMipMapLinearFilter, format = RGBAFormat, type = UnsignedByteType, anisotropy = 1, encoding = LinearEncoding) {
        super();
        this.DEFAULT_IMAGE = undefined;
        this.DEFAULT_MAPPING = UVMapping;
        this.isTexture = true;
        this.id = texturedId_Speed3DGis++;
        this.uuid = _Math.generateUUID();
        this.name = '';
        this.image = image !== undefined ? image : this.DEFAULT_IMAGE;
        this.mipmaps = [];
        this.mapping = mapping !== undefined ? mapping : this.DEFAULT_MAPPING;
        this.wrapS = wrapS;
        this.wrapT = wrapT;
        this.magFilter = magFilter;
        this.minFilter = minFilter;
        this.anisotropy = anisotropy;
        this.format = format;
        this.type = type;
        this.offset = new Vector2(0, 0);
        this.repeat = new Vector2(1, 1);
        this.center = new Vector2(0, 0);
        this.rotation = 0;
        this.matrixAutoUpdate = true;
        this.matrix = new Matrix3();
        this.generateMipmaps = true;
        this.premultiplyAlpha = false;
        this.flipY = true;
        this.unpackAlignment = 4;
        this.encoding = encoding;
        this.version = 0;
        this.onUpdate = null;
    }

    updateMatrix() {
        this.matrix.setUvTransform( this.offset.x, this.offset.y, this.repeat.x, this.repeat.y, this.rotation, this.center.x, this.center.y );
    }

    clone() {
        return new this.constructor().copy( this );
    }

    copy( source ) {
        this.name = source.name;
        this.image = source.image;
        this.mipmaps = source.mipmaps.slice( 0 );
        this.mapping = source.mapping;
        this.wrapS = source.wrapS;
        this.wrapT = source.wrapT;
        this.magFilter = source.magFilter;
        this.minFilter = source.minFilter;
        this.anisotropy = source.anisotropy;
        this.format = source.format;
        this.type = source.type;
        this.offset.copy( source.offset );
        this.repeat.copy( source.repeat );
        this.center.copy( source.center );
        this.rotation = source.rotation;
        this.matrixAutoUpdate = source.matrixAutoUpdate;
        this.matrix.copy( source.matrix );
        this.generateMipmaps = source.generateMipmaps;
        this.premultiplyAlpha = source.premultiplyAlpha;
        this.flipY = source.flipY;
        this.unpackAlignment = source.unpackAlignment;
        this.encoding = source.encoding;
        return this;
    }

    toJSON( meta ) {
        let isRootObject = ( meta === undefined || typeof meta === 'string' );
        if ( ! isRootObject && meta.textures[ this.uuid ] !== undefined ) {
            return meta.textures[ this.uuid ];
        }
        function getDataURL( image ) {
            let canvas;
            if ( image instanceof HTMLCanvasElement ) {
                canvas = image;
            } else {
                canvas = document.createElementNS( 'http://www.w3.org/1999/xhtml', 'canvas' );
                canvas.width = image.width;
                canvas.height = image.height;
                let context = canvas.getContext( '2d' );
                if ( image instanceof ImageData ) {
                    context.putImageData( image, 0, 0 );
                } else {
                    context.drawImage( image, 0, 0, image.width, image.height );
                }
            }
            if ( canvas.width > 2048 || canvas.height > 2048 ) {
                return canvas.toDataURL( 'image/jpeg', 0.6 );

            } else {
                return canvas.toDataURL( 'image/png' );
            }
        }
        let output = {
            metadata: {
                version: 4.5,
                type: 'Texture',
                generator: 'Texture.toJSON'
            },
            uuid: this.uuid,
            name: this.name,
            mapping: this.mapping,
            repeat: [ this.repeat.x, this.repeat.y ],
            offset: [ this.offset.x, this.offset.y ],
            center: [ this.center.x, this.center.y ],
            rotation: this.rotation,
            wrap: [ this.wrapS, this.wrapT ],
            format: this.format,
            minFilter: this.minFilter,
            magFilter: this.magFilter,
            anisotropy: this.anisotropy,
            flipY: this.flipY
        };
        if ( this.image !== undefined ) {
            let image = this.image;
            if ( image.uuid === undefined ) {
                image.uuid = _Math.generateUUID(); // UGH
            }
            if ( ! isRootObject && meta.images[ image.uuid ] === undefined ) {
                let url;
                if ( Array.isArray( image ) ) {
                    // process array of images e.g. CubeTexture
                    url = [];
                    for ( let i = 0, l = image.length; i < l; i ++ ) {
                        url.push( getDataURL( image[ i ] ) );
                    }
                } else {
                    // process single image
                    url = getDataURL( image );
                }
                meta.images[ image.uuid ] = {
                    uuid: image.uuid,
                    url: url
                };
            }
            output.image = image.uuid;
        }
        if ( ! isRootObject ) {
            meta.textures[ this.uuid ] = output;
        }
        return output;
    }

    dispose() {
        this.dispatchEvent( { type: 'dispose' } );
    }

    transformUv( uv ) {
        if ( this.mapping !== UVMapping ) return;
        uv.applyMatrix3( this.matrix );
        if ( uv.x < 0 || uv.x > 1 ) {
            switch ( this.wrapS ) {
                case RepeatWrapping:
                    uv.x = uv.x - Math.floor( uv.x );
                    break;
                case ClampToEdgeWrapping:
                    uv.x = uv.x < 0 ? 0 : 1;
                    break;
                case MirroredRepeatWrapping:
                    if ( Math.abs( Math.floor( uv.x ) % 2 ) === 1 ) {
                        uv.x = Math.ceil( uv.x ) - uv.x;
                    } else {
                        uv.x = uv.x - Math.floor( uv.x );
                    }
                    break;
            }
        }
        if ( uv.y < 0 || uv.y > 1 ) {
            switch ( this.wrapT ) {
                case RepeatWrapping:
                    uv.y = uv.y - Math.floor( uv.y );
                    break;
                case ClampToEdgeWrapping:
                    uv.y = uv.y < 0 ? 0 : 1;
                    break;
                case MirroredRepeatWrapping:
                    if ( Math.abs( Math.floor( uv.y ) % 2 ) === 1 ) {
                        uv.y = Math.ceil( uv.y ) - uv.y;
                    } else {
                        uv.y = uv.y - Math.floor( uv.y );
                    }
                    break;
            }
        }
        if ( this.flipY ) {
            uv.y = 1 - uv.y;
        }
    }

    set needsUpdate(value) {
        if (value === true)
            this.version++;
    }

}

export {Texture};