import {Material} from "./Material.js";
import {Color} from "../Datum/Math/Color.js";

/**
 * @author WangZhiDong
 * @modified YanKai 2018/7/13
 */
/*
* function LineBasicMaterial( parameters ) {

	Material.call( this );

	this.type = 'LineBasicMaterial';

	this.color = new Color( 0xffffff );

	this.linewidth = 1;
	this.linecap = 'round';
	this.linejoin = 'round';

	this.lights = false;

	this.setValues( parameters );

}

LineBasicMaterial.prototype = Object.create( Material.prototype );
LineBasicMaterial.prototype.constructor = LineBasicMaterial;

LineBasicMaterial.prototype.isLineBasicMaterial = true;

LineBasicMaterial.prototype.copy = function ( source ) {

	Material.prototype.copy.call( this, source );

	this.color.copy( source.color );

	this.linewidth = source.linewidth;
	this.linecap = source.linecap;
	this.linejoin = source.linejoin;

	return this;

};

* */

class LineBasicMaterial extends Material{
	constructor(parameters){
		super();
		// this.parameters=parameters;
        this.type = 'LineBasicMaterial';
        this.color = new Color( 0xffffff );
        this.linewidth = 10000;
        this.linecap = 'round';
        this.linejoin = 'round';
        this.lights = false;
        this.setValues( parameters );
        this.isLineBasicMaterial = true;
	}
    copy(source){
		super.copy(source);
        this.color.copy( source.color );
        this.linewidth = source.linewidth;
        this.linecap = source.linecap;
        this.linejoin = source.linejoin;
        return this;
	}
}

export {LineBasicMaterial};
