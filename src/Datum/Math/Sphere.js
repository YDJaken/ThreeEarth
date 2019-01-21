import {Box3} from "./Box3.js";
import {Vector3} from "./Vector3.js";

/**
 * @author wangzhidong
 * @modified DongYi 2018/07/11
 */

/*function Sphere( center, radius ) {

	this.center = ( center !== undefined ) ? center : new Vector3();
	this.radius = ( radius !== undefined ) ? radius : 0;

}

Object.assign( Sphere.prototype, {

	set: function ( center, radius ) {

		this.center.copy( center );
		this.radius = radius;

		return this;

	},

	setFromPoints: function () {

		var box = new Box3();

		return function setFromPoints( points, optionalCenter ) {

			var center = this.center;

			if ( optionalCenter !== undefined ) {

				center.copy( optionalCenter );

			} else {

				box.setFromPoints( points ).getCenter( center );

			}

			var maxRadiusSq = 0;

			for ( var i = 0, il = points.length; i < il; i ++ ) {

				maxRadiusSq = Math.max( maxRadiusSq, center.distanceToSquared( points[ i ] ) );

			}

			this.radius = Math.sqrt( maxRadiusSq );

			return this;

		};

	}(),

	clone: function () {

		return new this.constructor().copy( this );

	},

	copy: function ( sphere ) {

		this.center.copy( sphere.center );
		this.radius = sphere.radius;

		return this;

	},

	empty: function () {

		return ( this.radius <= 0 );

	},

	containsPoint: function ( point ) {

		return ( point.distanceToSquared( this.center ) <= ( this.radius * this.radius ) );

	},

	distanceToPoint: function ( point ) {

		return ( point.distanceTo( this.center ) - this.radius );

	},

	intersectsSphere: function ( sphere ) {

		var radiusSum = this.radius + sphere.radius;

		return sphere.center.distanceToSquared( this.center ) <= ( radiusSum * radiusSum );

	},

	intersectsBox: function ( box ) {

		return box.intersectsSphere( this );

	},

	intersectsPlane: function ( plane ) {

		return Math.abs( plane.distanceToPoint( this.center ) ) <= this.radius;

	},

	clampPoint: function ( point, target ) {

		var deltaLengthSq = this.center.distanceToSquared( point );

		if ( target === undefined ) {

			console.warn( 'Speed3DEngine.Sphere: .clampPoint() target is now required' );
			target = new Vector3();

		}

		target.copy( point );

		if ( deltaLengthSq > ( this.radius * this.radius ) ) {

			target.sub( this.center ).normalize();
			target.multiplyScalar( this.radius ).add( this.center );

		}

		return target;

	},

	getBoundingBox: function ( target ) {

		if ( target === undefined ) {

			console.warn( 'Speed3DEngine.Sphere: .getBoundingBox() target is now required' );
			target = new Box3();

		}

		target.set( this.center, this.center );
		target.expandByScalar( this.radius );

		return target;

	},

	applyMatrix4: function ( matrix ) {

		this.center.applyMatrix4( matrix );
		this.radius = this.radius * matrix.getMaxScaleOnAxis();

		return this;

	},

	translate: function ( offset ) {

		this.center.add( offset );

		return this;

	},

	equals: function ( sphere ) {

		return sphere.center.equals( this.center ) && ( sphere.radius === this.radius );

	}

} );*/

class Sphere {
    constructor(center = new Vector3(), radius = 0) {
        this.center = center;
        this.radius = radius;
    }

    set(center, radius) {
        this.center.copy(center);
        this.radius = radius;
        return this;
    }

    setFromPoints(points, optionalCenter) {
        let box = new Box3();
        let that = this;
        return (function setFromPoints() {
            let center = that.center;
            if (optionalCenter !== undefined) {
                center.copy(optionalCenter);
            } else {
                box.setFromPoints(points).getCenter(center);
            }
            let maxRadiusSq = 0;
            for (let i = 0, il = points.length; i < il; i++) {
                maxRadiusSq = Math.max(maxRadiusSq, center.distanceToSquared(points[i]));
            }
            that.radius = Math.sqrt(maxRadiusSq);
            return that;
        })();
    }

    clone() {
        return new this.constructor().copy(this);
    }

    copy(sphere) {
        this.center.copy(sphere.center);
        this.radius = sphere.radius;
        return this;
    }

    empty() {
        return (this.radius <= 0);
    }

    containsPoint(point) {
        return (point.distanceToSquared(this.center) <= (this.radius * this.radius));
    }

    distanceToPoint(point) {
        return (point.distanceTo(this.center) - this.radius);
    }

    intersectsSphere(sphere) {
        let radiusSum = this.radius + sphere.radius;
        return sphere.center.distanceToSquared(this.center) <= (radiusSum * radiusSum);
    }

    intersectsBox(box) {
        return box.intersectsSphere(this);
    }

    intersectsPlane(plane) {
        return Math.abs(plane.distanceToPoint(this.center)) <= this.radius;
    }

    clampPoint(point, target) {
        let deltaLengthSq = this.center.distanceToSquared(point);
        if (target === undefined) {
            console.warn('Speed3DEngine.Sphere: .clampPoint() target is now required');
            target = new Vector3();
        }
        target.copy(point);
        if (deltaLengthSq > (this.radius * this.radius)) {
            target.sub(this.center).normalize();
            target.multiplyScalar(this.radius).add(this.center);
        }
        return target;
    }

    getBoundingBox(target) {
        if (target === undefined) {
            console.warn('Speed3DEngine.Sphere: .getBoundingBox() target is now required');
            target = new Box3();
        }
        target.set(this.center, this.center);
        target.expandByScalar(this.radius);
        return target;
    }

    applyMatrix4(matrix) {
        this.center.applyMatrix4(matrix);
        this.radius = this.radius * matrix.getMaxScaleOnAxis();
        return this;
    }

    translate(offset) {
        this.center.add(offset);
        return this;
    }

    equals(sphere) {
        return sphere.center.equals(this.center) && (sphere.radius === this.radius);
    }
}

export {Sphere};
