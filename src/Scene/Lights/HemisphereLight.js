import {Light} from "./Light.js";
import {Color} from "../../Datum/Math/Color.js";
import {Object3D} from "../../Core/Object3D.js";

/**
 * @author wangzhidong
 * @modified DongYi 2018/07/11
 */

/*function HemisphereLight( skyColor, groundColor, intensity ) {
	Light.call( this, skyColor, intensity );
	this.type = 'HemisphereLight';
	this.castShadow = undefined;
	this.position.copy( Object3D.DefaultUp );
	this.updateMatrix();
	this.groundColor = new Color( groundColor );
}

HemisphereLight.prototype = Object.assign( Object.create( Light.prototype ), {
	constructor: HemisphereLight,
	isHemisphereLight: true,
	copy: function ( source ) {
		Light.prototype.copy.call( this, source );
		this.groundColor.copy( source.groundColor );
		return this;
	}
} );*/

class HemisphereLight extends Light{
    constructor(skyColor, groundColor, intensity) {
        super(skyColor, intensity);
        this.type = 'HemisphereLight';
        this.castShadow = undefined;
        this.position.copy(Object3D.DefaultUp);
        this.updateMatrix();
        this.groundColor = new Color(groundColor);
    }

    copy(source) {
        Light.prototype.copy.call(this, source);
        this.groundColor.copy(source.groundColor);
        return this;
    }
}

export {HemisphereLight};
