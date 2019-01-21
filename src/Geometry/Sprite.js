import {Vector2} from '../Datum/Math/Vector2.js';
import {Vector3} from '../Datum/Math/Vector3.js';
import {Object3D} from '../Core/Object3D.js';
import {SpriteMaterial} from '../Materials/SpriteMaterial.js';

/**
 * @author wangzhidong
 * @modified DongYi 2018/07/11
 */

/*function Sprite( material ) {

	Object3D.call( this );

	this.type = 'Sprite';

	this.material = ( material !== undefined ) ? material : new SpriteMaterial();

	this.center = new Vector2( 0.5, 0.5 );

}

Sprite.prototype = Object.assign( Object.create( Object3D.prototype ), {

	constructor: Sprite,

	isSprite: true,

	raycast: ( function () {

		var intersectPoint = new Vector3();
		var worldPosition = new Vector3();
		var worldScale = new Vector3();

		return function raycast( raycaster, intersects ) {

			worldPosition.setFromMatrixPosition( this.matrixWorld );
			raycaster.ray.closestPointToPoint( worldPosition, intersectPoint );

			worldScale.setFromMatrixScale( this.matrixWorld );
			var guessSizeSq = worldScale.x * worldScale.y / 4;

			if ( worldPosition.distanceToSquared( intersectPoint ) > guessSizeSq ) return;

			var distance = raycaster.ray.origin.distanceTo( intersectPoint );

			if ( distance < raycaster.near || distance > raycaster.far ) return;

			intersects.push( {

				distance: distance,
				point: intersectPoint.clone(),
				face: null,
				object: this

			} );

		};

	}() ),

	clone: function () {

		return new this.constructor( this.material ).copy( this );

	},

	copy: function ( source ) {

		Object3D.prototype.copy.call( this, source );

		if ( source.center !== undefined ) this.center.copy( source.center );

		return this;

	}


} );*/

class Sprite extends Object3D {
    constructor(material = new SpriteMaterial()) {
        super();
        this.type = 'Sprite';
        this.material = material;
        this.center = new Vector2(0.5, 0.5);
        this.isSprite = true;
    }

    raycast(raycaster, intersects) {
        let intersectPoint = new Vector3();
        let worldPosition = new Vector3();
        let worldScale = new Vector3();
        let that = this;
        return (function raycast() {
            worldPosition.setFromMatrixPosition(that.matrixWorld);
            raycaster.ray.closestPointToPoint(worldPosition, intersectPoint);
            worldScale.setFromMatrixScale(that.matrixWorld);
            let guessSizeSq = worldScale.x * worldScale.y / 4;
            if (worldPosition.distanceToSquared(intersectPoint) > guessSizeSq) return;
            let distance = raycaster.ray.origin.distanceTo(intersectPoint);
            if (distance < raycaster.near || distance > raycaster.far) return;
            intersects.push({
                distance: distance,
                point: intersectPoint.clone(),
                face: null,
                object: that
            });
        })();
    }

    clone() {
        return new this.copy(this);
    }

    copy(source) {
        super.copy(source);
        if (source.center !== undefined) this.center.copy(source.center);
        return this;
    }
}

export {Sprite};
