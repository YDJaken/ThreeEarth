/**
 * @author wangzhidong
 * @modified DongYi 2018/07/11
 */

/*function Cylindrical( radius, theta, y ) {

	this.radius = ( radius !== undefined ) ? radius : 1.0; // distance from the origin to a point in the x-z plane
	this.theta = ( theta !== undefined ) ? theta : 0; // counterclockwise angle in the x-z plane measured in radians from the positive z-axis
	this.y = ( y !== undefined ) ? y : 0; // height above the x-z plane

	return this;

}

Object.assign( Cylindrical.prototype, {

	set: function ( radius, theta, y ) {

		this.radius = radius;
		this.theta = theta;
		this.y = y;

		return this;

	},

	clone: function () {

		return new this.constructor().copy( this );

	},

	copy: function ( other ) {

		this.radius = other.radius;
		this.theta = other.theta;
		this.y = other.y;

		return this;

	},

	setFromVector3: function ( vec3 ) {

		this.radius = Math.sqrt( vec3.x * vec3.x + vec3.z * vec3.z );
		this.theta = Math.atan2( vec3.x, vec3.z );
		this.y = vec3.y;

		return this;

	}

} );*/

class Cylindrical {
    constructor(radius = 1.0, theta = 0, y = 0) {
        this.radius = radius;
        this.theta = theta;
        this.y = y;
    }

    set( radius, theta, y ) {
        this.radius = radius;
        this.theta = theta;
        this.y = y;
        return this;
    }

    clone() {
        return new this.constructor().copy( this );
    }

    copy( other ) {
        this.radius = other.radius;
        this.theta = other.theta;
        this.y = other.y;
        return this;
    }

    setFromVector3( vec3 ) {
        this.radius = Math.sqrt( vec3.x * vec3.x + vec3.z * vec3.z );
        this.theta = Math.atan2( vec3.x, vec3.z );
        this.y = vec3.y;
        return this;
    }

    toString(){
        return `radius=${this.radius},theta=${this.theta},y=${this.y}`;
    }
}

export {Cylindrical};
