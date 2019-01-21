import { Ray } from '../Datum/Math/Ray.js';

/**
 * @author mrdoob / http://mrdoob.com/
 * @author bhouston / http://clara.io/
 * @author stephomi / http://stephaneginier.com/
 * @refactor DongYi 2018-07-27
 */

/*function Raycaster( origin, direction, near, far ) {

	this.ray = new Ray( origin, direction );
	// direction is assumed to be normalized (for accurate distance calculations)

	this.near = near || 0;
	this.far = far || Infinity;

	this.params = {
		Mesh: {},
		Line: {},
		LOD: {},
		Points: { threshold: 1 },
		Sprite: {}
	};

	Object.defineProperties( this.params, {
		PointCloud: {
			get: function () {

				console.warn( 'Speed3D.Raycaster: params.PointCloud has been renamed to params.Points.' );
				return this.Points;

			}
		}
	} );

}

function ascSort( a, b ) {

	return a.distance - b.distance;

}

function intersectObject( object, raycaster, intersects, recursive ) {

	if ( object.visible === false ) return;

	object.raycast( raycaster, intersects );

	if ( recursive === true ) {

		var children = object.children;

		for ( var i = 0, l = children.length; i < l; i ++ ) {

			intersectObject( children[ i ], raycaster, intersects, true );

		}

	}

}

Object.assign( Raycaster.prototype, {

	linePrecision: 1,

	set: function ( origin, direction ) {

		// direction is assumed to be normalized (for accurate distance calculations)

		this.ray.set( origin, direction );

	},

	setFromCamera: function ( coords, camera ) {

		if ( ( camera && camera.isPerspectiveCamera ) ) {

			this.ray.origin.setFromMatrixPosition( camera.matrixWorld );
			this.ray.direction.set( coords.x, coords.y, 0.5 ).unproject( camera ).sub( this.ray.origin ).normalize();

		} else if ( ( camera && camera.isOrthographicCamera ) ) {

			this.ray.origin.set( coords.x, coords.y, ( camera.near + camera.far ) / ( camera.near - camera.far ) ).unproject( camera ); // set origin in plane of camera
			this.ray.direction.set( 0, 0, - 1 ).transformDirection( camera.matrixWorld );

		} else {

			console.error( 'Speed3D.Raycaster: Unsupported camera type.' );

		}

	},

	intersectObject: function ( object, recursive, optionalTarget ) {

		var intersects = optionalTarget || [];

		intersectObject( object, this, intersects, recursive );

		intersects.sort( ascSort );

		return intersects;

	},

	intersectObjects: function ( objects, recursive, optionalTarget ) {

		var intersects = optionalTarget || [];

		if ( Array.isArray( objects ) === false ) {

			console.warn( 'Speed3D.Raycaster.intersectObjects: objects is not an Array.' );
			return intersects;

		}

		for ( var i = 0, l = objects.length; i < l; i ++ ) {

			intersectObject( objects[ i ], this, intersects, recursive );

		}

		intersects.sort( ascSort );

		return intersects;

	}

} );*/

class Raycaster {
	constructor(origin,direction,near,far){
        this.ray = new Ray( origin, direction );
        // direction is assumed to be normalized (for accurate distance calculations)
        this.near = near || 0;
        this.far = far || Infinity;
        this.params = {
            Mesh: {},
            Line: {},
            LOD: {},
            Points: { threshold: 1 },
            Sprite: {},
            PointCloud: {
                get: function () {
                    console.warn( 'Speed3DGIS.Raycaster: params.PointCloud has been renamed to params.Points.' );
                    return this.Points;
                }
            }
        };
        this.linePrecision = 1;
	}

    static _ascSort(a,b){
        return a.distance - b.distance;
	}

    _intersectObject(object, raycaster, intersects, recursive){
        if ( object.visible === false ) return;
        object.raycast( raycaster, intersects );
        if ( recursive === true ) {
            let children = object.children;
            for ( let i = 0, l = children.length; i < l; i ++ ) {
                this._intersectObject( children[ i ], raycaster, intersects, true );
            }
        }
	}

	set(origin, direction){
        // direction is assumed to be normalized (for accurate distance calculations)
        this.ray.set( origin, direction );
	}

    setFromCamera( coords, camera ) {
        if ( ( camera && camera.isPerspectiveCamera ) ) {
            this.ray.origin.setFromMatrixPosition( camera.matrixWorld );
            this.ray.direction.set( coords.x, coords.y, 0.5 ).unproject( camera ).sub( this.ray.origin ).normalize();
        } else if ( ( camera && camera.isOrthographicCamera ) ) {
            this.ray.origin.set( coords.x, coords.y, ( camera.near + camera.far ) / ( camera.near - camera.far ) ).unproject( camera ); // set origin in plane of camera
            this.ray.direction.set( 0, 0, - 1 ).transformDirection( camera.matrixWorld );
        } else {
            console.error( 'Speed3DGIS.Raycaster: Unsupported camera type.' );
        }
    }

    intersectObject( object, recursive, optionalTarget ) {
        let intersects = optionalTarget || [];
        this._intersectObject( object, this , intersects, recursive );
        intersects.sort( Raycaster._ascSort );
        return intersects;
    }

    intersectObjects( objects, recursive, optionalTarget ) {
        let intersects = optionalTarget || [];
        if ( Array.isArray( objects ) === false ) {
            console.warn( 'Speed3DGIS.Raycaster.intersectObjects: objects is not an Array.' );
            return intersects;
        }
        for ( let i = 0, l = objects.length; i < l; i ++ ) {
            this._intersectObject( objects[ i ], this, intersects, recursive );
        }
        intersects.sort( Raycaster._ascSort );
        return intersects;

    }
}

export { Raycaster };
