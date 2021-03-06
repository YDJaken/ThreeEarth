import { Matrix4 } from "../../Datum/Math/Matrix4.js";
import { Vector2 } from "../../Datum/Math/Vector2.js";

/**
 * @author wangzhidong
 * @modified DongYi 2018/07/11
 */

/*function LightShadow( camera ) {
	this.camera = camera;
	this.bias = 0;
	this.radius = 1;
	this.mapSize = new Vector2( 512, 512 );
	this.map = null;
	this.matrix = new Matrix4();
}

Object.assign( LightShadow.prototype, {

	copy: function ( source ) {

		this.camera = source.camera.clone();

		this.bias = source.bias;
		this.radius = source.radius;

		this.mapSize.copy( source.mapSize );

		return this;

	},

	clone: function () {

		return new this.constructor().copy( this );

	},

	toJSON: function () {

		var object = {};

		if ( this.bias !== 0 ) object.bias = this.bias;
		if ( this.radius !== 1 ) object.radius = this.radius;
		if ( this.mapSize.x !== 512 || this.mapSize.y !== 512 ) object.mapSize = this.mapSize.toArray();

		object.camera = this.camera.toJSON( false ).object;
		delete object.camera.matrix;

		return object;

	}

} );*/

class LightShadow {
	constructor(camera){
        this.camera = camera;
        this.bias = 0;
        this.radius = 1;
        this.mapSize = new Vector2( 512, 512 );
        this.map = null;
        this.matrix = new Matrix4();
	}

    copy(source) {
        this.camera = source.camera.clone();
        this.bias = source.bias;
        this.radius = source.radius;
        this.mapSize.copy( source.mapSize );
        return this;
    }

    clone() {
        return new this.copy( this );
    }

    toJSON() {
        let object = {};
        if ( this.bias !== 0 ) object.bias = this.bias;
        if ( this.radius !== 1 ) object.radius = this.radius;
        if ( this.mapSize.x !== 512 || this.mapSize.y !== 512 ) object.mapSize = this.mapSize.toArray();
        object.camera = this.camera.toJSON( false ).object;
        delete object.camera.matrix;
        return object;
    }
}

export { LightShadow };
