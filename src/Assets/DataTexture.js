/**
 *作者： WangZhiDong
 *日期：18-6-25
 *时间：13:54
 * @modified WangSuJian 2018/07/11
 */
import {Texture} from "./Texture.js";
import {NearestFilter} from "../Core/Constants.js";

/*function DataTexture( data, width, height, format, type, mapping, wrapS, wrapT, magFilter, minFilter, anisotropy, encoding ) {

    Texture.call( this, null, mapping, wrapS, wrapT, magFilter, minFilter, format, type, anisotropy, encoding );

    this.image = { data: data, width: width, height: height };

    this.magFilter = magFilter !== undefined ? magFilter : NearestFilter;
    this.minFilter = minFilter !== undefined ? minFilter : NearestFilter;

    this.generateMipmaps = false;
    this.flipY = false;
    this.unpackAlignment = 1;

}

DataTexture.prototype = Object.create( Texture.prototype );
DataTexture.prototype.constructor = DataTexture;

DataTexture.prototype.isDataTexture = true;*/

class DataTexture extends Texture{
    constructor(data, width, height, format, type, mapping, wrapS, wrapT, magFilter = NearestFilter, minFilter = NearestFilter, anisotropy, encoding){
        super(null, mapping, wrapS, wrapT, magFilter, minFilter, format, type, anisotropy, encoding);
        this.image = { data: data, width: width, height: height };
        this.isDataTexture = true;
        this.magFilter = magFilter;
        this.minFilter = minFilter;
        this.generateMipmaps = false;
        this.flipY = false;
        this.unpackAlignment = 1;
        this.isDataTexture = true;
    }
}

export {DataTexture};