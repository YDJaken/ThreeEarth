import {Vector2} from "./Vector2";

/**
 * @author wangzhidong
 * @modified DongYi 2018/07/11
 */

/*function Box2( min, max ) {

	this.min = ( min !== undefined ) ? min : new Vector2( + Infinity, + Infinity );
	this.max = ( max !== undefined ) ? max : new Vector2( - Infinity, - Infinity );

}

Object.assign( Box2.prototype, {

	set: function ( min, max ) {

		this.min.copy( min );
		this.max.copy( max );

		return this;

	},

	setFromPoints: function ( points ) {

		this.makeEmpty();

		for ( var i = 0, il = points.length; i < il; i ++ ) {

			this.expandByPoint( points[ i ] );

		}

		return this;

	},

	setFromCenterAndSize: function () {

		var v1 = new Vector2();

		return function setFromCenterAndSize( center, size ) {

			var halfSize = v1.copy( size ).multiplyScalar( 0.5 );
			this.min.copy( center ).sub( halfSize );
			this.max.copy( center ).add( halfSize );

			return this;

		};

	}(),

	clone: function () {

		return new this.constructor().copy( this );

	},

	copy: function ( box ) {

		this.min.copy( box.min );
		this.max.copy( box.max );

		return this;

	},

	makeEmpty: function () {

		this.min.x = this.min.y = + Infinity;
		this.max.x = this.max.y = - Infinity;

		return this;

	},

	isEmpty: function () {

		// this is a more robust check for empty than ( volume <= 0 ) because volume can get positive with two negative axes

		return ( this.max.x < this.min.x ) || ( this.max.y < this.min.y );

	},

	getCenter: function ( target ) {

		if ( target === undefined ) {

			console.warn( 'Speed3DEngine.Box2: .getCenter() target is now required' );
			target = new Vector2();

		}

		return this.isEmpty() ? target.set( 0, 0 ) : target.addVectors( this.min, this.max ).multiplyScalar( 0.5 );

	},

	getSize: function ( target ) {

		if ( target === undefined ) {

			console.warn( 'Speed3DEngine.Box2: .getSize() target is now required' );
			target = new Vector2();

		}

		return this.isEmpty() ? target.set( 0, 0 ) : target.subVectors( this.max, this.min );

	},

	expandByPoint: function ( point ) {

		this.min.min( point );
		this.max.max( point );

		return this;

	},

	expandByVector: function ( vector ) {

		this.min.sub( vector );
		this.max.add( vector );

		return this;

	},

	expandByScalar: function ( scalar ) {

		this.min.addScalar( - scalar );
		this.max.addScalar( scalar );

		return this;

	},

	containsPoint: function ( point ) {

		return point.x < this.min.x || point.x > this.max.x ||
			point.y < this.min.y || point.y > this.max.y ? false : true;

	},

	containsBox: function ( box ) {

		return this.min.x <= box.min.x && box.max.x <= this.max.x &&
			this.min.y <= box.min.y && box.max.y <= this.max.y;

	},

	getParameter: function ( point, target ) {

		// This can potentially have a divide by zero if the box
		// has a size dimension of 0.

		if ( target === undefined ) {

			console.warn( 'Speed3DEngine.Box2: .getParameter() target is now required' );
			target = new Vector2();

		}

		return target.set(
			( point.x - this.min.x ) / ( this.max.x - this.min.x ),
			( point.y - this.min.y ) / ( this.max.y - this.min.y )
		);

	},

	intersectsBox: function ( box ) {

		// using 4 splitting planes to rule out intersections

		return box.max.x < this.min.x || box.min.x > this.max.x ||
			box.max.y < this.min.y || box.min.y > this.max.y ? false : true;

	},

	clampPoint: function ( point, target ) {

		if ( target === undefined ) {

			console.warn( 'Speed3DEngine.Box2: .clampPoint() target is now required' );
			target = new Vector2();

		}

		return target.copy( point ).clamp( this.min, this.max );

	},

	distanceToPoint: function () {

		var v1 = new Vector2();

		return function distanceToPoint( point ) {

			var clampedPoint = v1.copy( point ).clamp( this.min, this.max );
			return clampedPoint.sub( point ).length();

		};

	}(),

	intersect: function ( box ) {

		this.min.max( box.min );
		this.max.min( box.max );

		return this;

	},

	union: function ( box ) {

		this.min.min( box.min );
		this.max.max( box.max );

		return this;

	},

	translate: function ( offset ) {

		this.min.add( offset );
		this.max.add( offset );

		return this;

	},

	equals: function ( box ) {

		return box.min.equals( this.min ) && box.max.equals( this.max );

	}

} );*/

class Box2 {
    constructor(min =new Vector2(+Infinity, +Infinity), max =new Vector2(-Infinity, -Infinity)) {
        this.min = min;
        this.max = max;
    }

    set(min, max) {
        this.min.copy(min);
        this.max.copy(max);
        return this;
    }

    setFromPoints(points) {
        this.makeEmpty();
        for (let i = 0, il = points.length; i < il; i++) {
            this.expandByPoint(points[i]);
        }
        return this;
    }

    setFromCenterAndSize(center,size) {
        let v1 = new Vector2();
        return (function setFromCenterAndSize() {
            let halfSize = v1.copy(size).multiplyScalar(0.5);
            this.min.copy(center).sub(halfSize);
            this.max.copy(center).add(halfSize);
            return this;
        })();
    }

    clone() {
        return new this.constructor().copy(this);
    }

    copy(box) {
        this.min.copy(box.min);
        this.max.copy(box.max);
        return this;
    }

    makeEmpty() {
        this.min.x = this.min.y = +Infinity;
        this.max.x = this.max.y = -Infinity;
        return this;

    }

    isEmpty() {
        // this is a more robust check for empty than ( volume <= 0 ) because volume can get positive with two negative axes
        return (this.max.x < this.min.x) || (this.max.y < this.min.y);
    }

    getCenter(target) {
        if (target === undefined) {
            console.warn('Speed3DEngine.Box2: .getCenter() target is now required');
            target = new Vector2();
        }
        return this.isEmpty() ? target.set(0, 0) : target.addVectors(this.min, this.max).multiplyScalar(0.5);
    }

    getSize(target) {
        if (target === undefined) {
            console.warn('Speed3DEngine.Box2: .getSize() target is now required');
            target = new Vector2();
        }
        return this.isEmpty() ? target.set(0, 0) : target.subVectors(this.max, this.min);
    }

    expandByPoint(point) {
        this.min.min(point);
        this.max.max(point);
        return this;
    }

    expandByVector(vector) {
        this.min.sub(vector);
        this.max.add(vector);
        return this;
    }

    expandByScalar(scalar) {
        this.min.addScalar(-scalar);
        this.max.addScalar(scalar);
        return this;
    }

    containsPoint(point) {
        return point.x < this.min.x || point.x > this.max.x ||
        point.y < this.min.y || point.y > this.max.y ? false : true;
    }

    containsBox(box) {

        return this.min.x <= box.min.x && box.max.x <= this.max.x &&
            this.min.y <= box.min.y && box.max.y <= this.max.y;

    }

    getParameter(point, target) {
        // This can potentially have a divide by zero if the box
        // has a size dimension of 0.
        if (target === undefined) {
            console.warn('Speed3DEngine.Box2: .getParameter() target is now required');
            target = new Vector2();
        }
        return target.set(
            (point.x - this.min.x) / (this.max.x - this.min.x),
            (point.y - this.min.y) / (this.max.y - this.min.y)
        );
    }

    intersectsBox(box) {
        // using 4 splitting planes to rule out intersections
        return box.max.x < this.min.x || box.min.x > this.max.x ||
        box.max.y < this.min.y || box.min.y > this.max.y ? false : true;
    }

    clampPoint(point, target) {
        if (target === undefined) {
            console.warn('Speed3DEngine.Box2: .clampPoint() target is now required');
            target = new Vector2();
        }
        return target.copy(point).clamp(this.min, this.max);
    }

    distanceToPoint(point) {
        let v1 = new Vector2();
        return (function distanceToPoint() {
            let clampedPoint = v1.copy(point).clamp(this.min, this.max);
            return clampedPoint.sub(point).length();
        })();
    }

    intersect(box) {
        this.min.max(box.min);
        this.max.min(box.max);
        return this;
    }

    union(box) {
        this.min.min(box.min);
        this.max.max(box.max);
        return this;
    }

    translate(offset) {
        this.min.add(offset);
        this.max.add(offset);
        return this;
    }

    equals(box) {
        return box.min.equals(this.min) && box.max.equals(this.max);
    }

    toString(){
        return `min: ${this.min.toArray().toLocaleString()},max:${this.max.toArray().toLocaleString()}`
    }

}

export {Box2};
