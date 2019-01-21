import {Light} from "./Light.js";
import {DirectionalLightShadow} from "./DirectionalLightShadow.js";
import {Object3D} from "../../Core/Object3D.js";

/**
 * @author wangzhidong
 * @modified DongYi 2018/07/11
 */

/*function DirectionalLight( color, intensity ) {

	Light.call( this, color, intensity );

	this.type = 'DirectionalLight';

	this.position.copy( Object3D.DefaultUp );
	this.updateMatrix();

	this.target = new Object3D();

	this.shadow = new DirectionalLightShadow();

}

DirectionalLight.prototype = Object.assign( Object.create( Light.prototype ), {

	constructor: DirectionalLight,

	isDirectionalLight: true,

	copy: function ( source ) {

		Light.prototype.copy.call( this, source );

		this.target = source.target.clone();

		this.shadow = source.shadow.clone();

		return this;

	}

} );*/

class DirectionalLight extends Light{
    constructor(color, intensity) {
        super(color, intensity);
        this.type = 'DirectionalLight';
        this.position.copy(Object3D.DefaultUp);
        this.updateMatrix();
        this.target = new Object3D();
        this.shadow = new DirectionalLightShadow();
        this.isDirectionalLight = true;
    }

    copy(source) {
        Light.prototype.copy.call( this, source );
        this.target = source.target.clone();
        this.shadow = source.shadow.clone();
        return this;
    }
}

export {DirectionalLight};