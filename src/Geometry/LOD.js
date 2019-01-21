import {Vector3} from '../Datum/Math/Vector3.js';
import {Object3D} from '../Core/Object3D.js';

/**
 * @author wangzhidong
 * @modified DongYi 2018/07/11
 */

/*function LOD() {

	Object3D.call( this );

	this.type = 'LOD';

	Object.defineProperties( this, {
		levels: {
			enumerable: true,
			value: []
		}
	} );

}

LOD.prototype = Object.assign( Object.create( Object3D.prototype ), {

	constructor: LOD,

	copy: function ( source ) {

		Object3D.prototype.copy.call( this, source, false );

		var levels = source.levels;

		for ( var i = 0, l = levels.length; i < l; i ++ ) {

			var level = levels[ i ];

			this.addLevel( level.object.clone(), level.distance );

		}

		return this;

	},

	addLevel: function ( object, distance ) {

		if ( distance === undefined ) distance = 0;

		distance = Math.abs( distance );

		var levels = this.levels;

		for ( var l = 0; l < levels.length; l ++ ) {

			if ( distance < levels[ l ].distance ) {

				break;

			}

		}

		levels.splice( l, 0, { distance: distance, object: object } );

		this.add( object );

	},

	getObjectForDistance: function ( distance ) {

		var levels = this.levels;

		for ( var i = 1, l = levels.length; i < l; i ++ ) {

			if ( distance < levels[ i ].distance ) {

				break;

			}

		}

		return levels[ i - 1 ].object;

	},

	raycast: ( function () {

		var matrixPosition = new Vector3();

		return function raycast( raycaster, intersects ) {

			matrixPosition.setFromMatrixPosition( this.matrixWorld );

			var distance = raycaster.ray.origin.distanceTo( matrixPosition );

			this.getObjectForDistance( distance ).raycast( raycaster, intersects );

		};

	}() ),

	update: function () {

		var v1 = new Vector3();
		var v2 = new Vector3();

		return function update( camera ) {

			var levels = this.levels;

			if ( levels.length > 1 ) {

				v1.setFromMatrixPosition( camera.matrixWorld );
				v2.setFromMatrixPosition( this.matrixWorld );

				var distance = v1.distanceTo( v2 );

				levels[ 0 ].object.visible = true;

				for ( var i = 1, l = levels.length; i < l; i ++ ) {

					if ( distance >= levels[ i ].distance ) {

						levels[ i - 1 ].object.visible = false;
						levels[ i ].object.visible = true;

					} else {

						break;

					}

				}

				for ( ; i < l; i ++ ) {

					levels[ i ].object.visible = false;

				}

			}

		};

	}(),

	toJSON: function ( meta ) {

		var data = Object3D.prototype.toJSON.call( this, meta );

		data.object.levels = [];

		var levels = this.levels;

		for ( var i = 0, l = levels.length; i < l; i ++ ) {

			var level = levels[ i ];

			data.object.levels.push( {
				object: level.object.uuid,
				distance: level.distance
			} );

		}

		return data;

	}

} );*/

class LOD extends Object3D {
    constructor() {
        super();
        this.type = 'LOD';
        this.levels = [];
    }

    copy(source) {
        super.copy(source, false);
        let levels = source.levels;
        for (let i = 0, l = levels.length; i < l; i++) {
            let level = levels[i];
            this.addLevel(level.object.clone(), level.distance);
        }
        return this;
    }

    addLevel(object = 0, distance) {
        distance = Math.abs(distance);
        let levels = this.levels;
        let l = 0;
        for (; l < levels.length; l++) {
            if (distance < levels[l].distance) {
                break;
            }
        }
        levels.splice(l, 0, {distance: distance, object: object});
        this.add(object);
    }

    getObjectForDistance(distance) {
        let levels = this.levels;
        let i = 1, l = levels.length;
        for (; i < l; i++) {
            if (distance < levels[i].distance) {
                break;
            }
        }
        return levels[i - 1].object;
    }

    raycast(raycaster, intersects) {
        let matrixPosition = new Vector3();
        let that = this;
        return (function raycast() {
            matrixPosition.setFromMatrixPosition(that.matrixWorld);
            let distance = raycaster.ray.origin.distanceTo(matrixPosition);
            that.getObjectForDistance(distance).raycast(raycaster, intersects);
        })();
    }

    update(camera) {
        let v1 = new Vector3();
        let v2 = new Vector3();
        let that = this;
        return (function update() {
            let levels = that.levels;
            if (levels.length > 1) {
                v1.setFromMatrixPosition(camera.matrixWorld);
                v2.setFromMatrixPosition(that.matrixWorld);
                let distance = v1.distanceTo(v2);
                levels[0].object.visible = true;
                let i = 1, l = levels.length;
                for (; i < l; i++) {
                    if (distance >= levels[i].distance) {
                        levels[i - 1].object.visible = false;
                        levels[i].object.visible = true;
                    } else {
                        break;
                    }
                }
                for (; i < l; i++) {
                    levels[i].object.visible = false;
                }
            }
        })();
    }

    toJSON(meta) {
        let data = super.toJSON(meta);
        data.object.levels = [];
        let levels = this.levels;
        for (let i = 0, l = levels.length; i < l; i++) {
            let level = levels[i];
            data.object.levels.push({
                object: level.object.uuid,
                distance: level.distance
            });
        }
        return data;
    }
}

export {LOD};
