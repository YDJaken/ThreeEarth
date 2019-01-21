import {Light} from "./Light.js";

/**
 * @author wangzhidong
 * @modified DongYi 2018/07/11
 */

/*
function RectAreaLight( color, intensity, width, height ) {

	Light.call( this, color, intensity );

	this.type = 'RectAreaLight';

	this.width = ( width !== undefined ) ? width : 10;
	this.height = ( height !== undefined ) ? height : 10;

}

RectAreaLight.prototype = Object.assign( Object.create( Light.prototype ), {

	constructor: RectAreaLight,

	isRectAreaLight: true,

	copy: function ( source ) {

		Light.prototype.copy.call( this, source );

		this.width = source.width;
		this.height = source.height;

		return this;

	},

	toJSON: function ( meta ) {

		var data = Light.prototype.toJSON.call( this, meta );

		data.object.width = this.width;
		data.object.height = this.height;

		return data;

	}

} );
*/

class RectAreaLight  extends Light{
    constructor(color, intensity, width, height) {
        super(color, intensity);
        this.type = 'RectAreaLight';
        this.width = (width !== undefined) ? width : 10;
        this.height = (height !== undefined) ? height : 10;
        this.isRectAreaLight = true
    }

    copy(source) {
        Light.prototype.copy.call(this, source);
        this.width = source.width;
        this.height = source.height;
        return this;
    }

    toJSON(meta) {
        let data = Light.prototype.toJSON.call(this, meta);
        data.object.width = this.width;
        data.object.height = this.height;
        return data;
    }
}

export {RectAreaLight};
