import {Material} from "./Material.js";
import {Color} from "../Datum/Math/Color.js";

/**
 * @author WangZhiDong
 * @modified YanKai 2018/7/13
 */

/*
function PointsMaterial( parameters ) {

	Material.call( this );

	this.type = 'PointsMaterial';

	this.color = new Color( 0xffffff );

	this.map = null;

	this.size = 1;
	this.sizeAttenuation = true;

	this.morphTargets = false;

	this.lights = false;

	this.setValues( parameters );

}

PointsMaterial.prototype = Object.create( Material.prototype );
PointsMaterial.prototype.constructor = PointsMaterial;

PointsMaterial.prototype.isPointsMaterial = true;

PointsMaterial.prototype.copy = function ( source ) {

	Material.prototype.copy.call( this, source );

	this.color.copy( source.color );

	this.map = source.map;

	this.size = source.size;
	this.sizeAttenuation = source.sizeAttenuation;

	this.morphTargets = source.morphTargets;

	return this;

};


export { PointsMaterial };*/


class  PointsMaterial extends Material  {
    constructor(parameters ){
		super();
		this.parameters=parameters;
        this.type = 'PointsMaterial';
        this.color = new Color( 0xff0000 );
        this.map = null;
        this.size = 1000;
        this.sizeAttenuation = true;
        this.morphTargets = false;
        this.lights = false;
        this.setValues(parameters);
        this.isPointsMaterial = true
    }

    copy(source){
		super.copy(source);
        this.color.copy( source.color );
        this.map = source.map;
        this.size = source.size;
        this.sizeAttenuation = source.sizeAttenuation;
        this.morphTargets = source.morphTargets;
        return this;
    }


}

export {PointsMaterial}
