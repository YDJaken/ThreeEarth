import {Material} from "./Material.js";
import {Color} from "../Datum/Math/Color.js";

/**
 * @author WangZhiDong
 * @modified YanKai 2018/7/13
 */
/*
* function SpriteMaterial( parameters ) {

	Material.call( this );

	this.type = 'SpriteMaterial';

	this.color = new Color( 0xffffff );
	this.map = null;1

	this.rotation = 0;

	this.fog = false;
	this.lights = false;

	this.setValues( parameters );

}

SpriteMaterial.prototype = Object.create( Material.prototype );
SpriteMaterial.prototype.constructor = SpriteMaterial;
SpriteMaterial.prototype.isSpriteMaterial = true;

SpriteMaterial.prototype.copy = function ( source ) {

	Material.prototype.copy.call( this, source );

	this.color.copy( source.color );
	this.map = source.map;

	this.rotation = source.rotation;

	return this;

};


export { SpriteMaterial };
* */


class SpriteMaterial extends  Material{
	constructor(parameters){
		super();
		this.parameters=parameters;
        this.type = 'SpriteMaterial';
        this.color = new Color( 0xffffff );
        this.map = null;
        this.rotation = 0;
        this.fog = false;
        this.lights = false;
        this.setValues( parameters );
        this.isSpriteMaterial = true;
	}
    copy(source){
		super.copy(source);
        this.color.copy( source.color );
        this.map = source.map;
        this.rotation = source.rotation;
        return this;
	}

}

export {SpriteMaterial};


