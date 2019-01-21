import {Vector3} from "../Datum/Math/Vector3.js";
import {Vector2} from "../Datum/Math/Vector2.js";
import {Sphere} from '../Datum/Math/Sphere.js';
import {Ray} from '../Datum/Math/Ray.js';
import {Matrix4} from '../Datum/Math/Matrix4.js';
import {Object3D} from '../Core/Object3D.js';
import {Triangle} from '../Datum/Math/Triangle.js';
import {Face3} from '../Core/Face3.js';
import {DoubleSide, BackSide, TrianglesDrawMode} from '../Core/Constants.js';
import {MeshBasicMaterial} from '../Materials/MeshBasicMaterial.js';
import {BufferGeometry} from '../Core/BufferGeometry.js';

/**
 * @author wangzhidong
 * @modified DongYi 2018/07/11

 */

/*function Mesh( geometry, material ) {

	Object3D.call( this );

	this.type = 'Mesh';

	this.geometry = geometry !== undefined ? geometry : new BufferGeometry();
	this.material = material !== undefined ? material : new MeshBasicMaterial( { color: Math.random() * 0xffffff } );

	this.drawMode = TrianglesDrawMode;

	this.updateMorphTargets();

}

Mesh.prototype = Object.assign( Object.create( Object3D.prototype ), {

	constructor: Mesh,

	isMesh: true,

	setDrawMode: function ( value ) {

		this.drawMode = value;

	},

	copy: function ( source ) {

		Object3D.prototype.copy.call( this, source );

		this.drawMode = source.drawMode;

		if ( source.morphTargetInfluences !== undefined ) {

			this.morphTargetInfluences = source.morphTargetInfluences.slice();

		}

		if ( source.morphTargetDictionary !== undefined ) {

			this.morphTargetDictionary = Object.assign( {}, source.morphTargetDictionary );

		}

		return this;

	},

	updateMorphTargets: function () {

		var geometry = this.geometry;
		var m, ml, name;

		if ( geometry.isBufferGeometry ) {

			var morphAttributes = geometry.morphAttributes;
			var keys = Object.keys( morphAttributes );

			if ( keys.length > 0 ) {

				var morphAttribute = morphAttributes[ keys[ 0 ] ];

				if ( morphAttribute !== undefined ) {

					this.morphTargetInfluences = [];
					this.morphTargetDictionary = {};

					for ( m = 0, ml = morphAttribute.length; m < ml; m ++ ) {

						name = morphAttribute[ m ].name || String( m );

						this.morphTargetInfluences.push( 0 );
						this.morphTargetDictionary[ name ] = m;

					}

				}

			}

		} else {

			var morphTargets = geometry.morphTargets;

			if ( morphTargets !== undefined && morphTargets.length > 0 ) {

				this.morphTargetInfluences = [];
				this.morphTargetDictionary = {};

				for ( m = 0, ml = morphTargets.length; m < ml; m ++ ) {

					name = morphTargets[ m ].name || String( m );

					this.morphTargetInfluences.push( 0 );
					this.morphTargetDictionary[ name ] = m;

				}

			}

		}

	},

	raycast: ( function () {

		var inverseMatrix = new Matrix4();
		var ray = new Ray();
		var sphere = new Sphere();

		var vA = new Vector3();
		var vB = new Vector3();
		var vC = new Vector3();

		var tempA = new Vector3();
		var tempB = new Vector3();
		var tempC = new Vector3();

		var uvA = new Vector2();
		var uvB = new Vector2();
		var uvC = new Vector2();

		var barycoord = new Vector3();

		var intersectionPoint = new Vector3();
		var intersectionPointWorld = new Vector3();

		function uvIntersection( point, p1, p2, p3, uv1, uv2, uv3 ) {

			Triangle.getBarycoord( point, p1, p2, p3, barycoord );

			uv1.multiplyScalar( barycoord.x );
			uv2.multiplyScalar( barycoord.y );
			uv3.multiplyScalar( barycoord.z );

			uv1.add( uv2 ).add( uv3 );

			return uv1.clone();

		}

		function checkIntersection( object, material, raycaster, ray, pA, pB, pC, point ) {

			var intersect;

			if ( material.side === BackSide ) {

				intersect = ray.intersectTriangle( pC, pB, pA, true, point );

			} else {

				intersect = ray.intersectTriangle( pA, pB, pC, material.side !== DoubleSide, point );

			}

			if ( intersect === null ) return null;

			intersectionPointWorld.copy( point );
			intersectionPointWorld.applyMatrix4( object.matrixWorld );

			var distance = raycaster.ray.origin.distanceTo( intersectionPointWorld );

			if ( distance < raycaster.near || distance > raycaster.far ) return null;

			return {
				distance: distance,
				point: intersectionPointWorld.clone(),
				object: object
			};

		}

		function checkBufferGeometryIntersection( object, raycaster, ray, position, uv, a, b, c ) {

			vA.fromBufferAttribute( position, a );
			vB.fromBufferAttribute( position, b );
			vC.fromBufferAttribute( position, c );

			var intersection = checkIntersection( object, object.material, raycaster, ray, vA, vB, vC, intersectionPoint );

			if ( intersection ) {

				if ( uv ) {

					uvA.fromBufferAttribute( uv, a );
					uvB.fromBufferAttribute( uv, b );
					uvC.fromBufferAttribute( uv, c );

					intersection.uv = uvIntersection( intersectionPoint, vA, vB, vC, uvA, uvB, uvC );

				}

				var face = new Face3( a, b, c );
				Triangle.getNormal( vA, vB, vC, face.normal );

				intersection.face = face;

			}

			return intersection;

		}

		return function raycast( raycaster, intersects ) {

			var geometry = this.geometry;
			var material = this.material;
			var matrixWorld = this.matrixWorld;

			if ( material === undefined ) return;

			// Checking boundingSphere distance to ray

			if ( geometry.boundingSphere === null ) geometry.computeBoundingSphere();

			sphere.copy( geometry.boundingSphere );
			sphere.applyMatrix4( matrixWorld );

			if ( raycaster.ray.intersectsSphere( sphere ) === false ) return;

			//

			inverseMatrix.getInverse( matrixWorld );
			ray.copy( raycaster.ray ).applyMatrix4( inverseMatrix );

			// Check boundingBox before continuing

			if ( geometry.boundingBox !== null ) {

				if ( ray.intersectsBox( geometry.boundingBox ) === false ) return;

			}

			var intersection;

			if ( geometry.isBufferGeometry ) {

				var a, b, c;
				var index = geometry.index;
				var position = geometry.attributes.position;
				var uv = geometry.attributes.uv;
				var i, l;

				if ( index !== null ) {

					// indexed buffer geometry

					for ( i = 0, l = index.count; i < l; i += 3 ) {

						a = index.getX( i );
						b = index.getX( i + 1 );
						c = index.getX( i + 2 );

						intersection = checkBufferGeometryIntersection( this, raycaster, ray, position, uv, a, b, c );

						if ( intersection ) {

							intersection.faceIndex = Math.floor( i / 3 ); // triangle number in indexed buffer semantics
							intersects.push( intersection );

						}

					}

				} else if ( position !== undefined ) {

					// non-indexed buffer geometry

					for ( i = 0, l = position.count; i < l; i += 3 ) {

						a = i;
						b = i + 1;
						c = i + 2;

						intersection = checkBufferGeometryIntersection( this, raycaster, ray, position, uv, a, b, c );

						if ( intersection ) {

							intersection.faceIndex = Math.floor( i / 3 ); // triangle number in non-indexed buffer semantics
							intersects.push( intersection );

						}

					}

				}

			} else if ( geometry.isGeometry ) {

				var fvA, fvB, fvC;
				var isMultiMaterial = Array.isArray( material );

				var vertices = geometry.vertices;
				var faces = geometry.faces;
				var uvs;

				var faceVertexUvs = geometry.faceVertexUvs[ 0 ];
				if ( faceVertexUvs.length > 0 ) uvs = faceVertexUvs;

				for ( var f = 0, fl = faces.length; f < fl; f ++ ) {

					var face = faces[ f ];
					var faceMaterial = isMultiMaterial ? material[ face.materialIndex ] : material;

					if ( faceMaterial === undefined ) continue;

					fvA = vertices[ face.a ];
					fvB = vertices[ face.b ];
					fvC = vertices[ face.c ];

					if ( faceMaterial.morphTargets === true ) {

						var morphTargets = geometry.morphTargets;
						var morphInfluences = this.morphTargetInfluences;

						vA.set( 0, 0, 0 );
						vB.set( 0, 0, 0 );
						vC.set( 0, 0, 0 );

						for ( var t = 0, tl = morphTargets.length; t < tl; t ++ ) {

							var influence = morphInfluences[ t ];

							if ( influence === 0 ) continue;

							var targets = morphTargets[ t ].vertices;

							vA.addScaledVector( tempA.subVectors( targets[ face.a ], fvA ), influence );
							vB.addScaledVector( tempB.subVectors( targets[ face.b ], fvB ), influence );
							vC.addScaledVector( tempC.subVectors( targets[ face.c ], fvC ), influence );

						}

						vA.add( fvA );
						vB.add( fvB );
						vC.add( fvC );

						fvA = vA;
						fvB = vB;
						fvC = vC;

					}

					intersection = checkIntersection( this, faceMaterial, raycaster, ray, fvA, fvB, fvC, intersectionPoint );

					if ( intersection ) {

						if ( uvs && uvs[ f ] ) {

							var uvs_f = uvs[ f ];
							uvA.copy( uvs_f[ 0 ] );
							uvB.copy( uvs_f[ 1 ] );
							uvC.copy( uvs_f[ 2 ] );

							intersection.uv = uvIntersection( intersectionPoint, fvA, fvB, fvC, uvA, uvB, uvC );

						}

						intersection.face = face;
						intersection.faceIndex = f;
						intersects.push( intersection );

					}

				}

			}

		};

	}() ),

	clone: function () {

		return new this.constructor( this.geometry, this.material ).copy( this );

	}

} );*/

class Mesh extends Object3D {
    constructor(geometry = new BufferGeometry(), material = new MeshBasicMaterial({color: Math.random() * 0xffffff})) {
        super();
        this.type = 'Mesh';
        this.geometry = geometry;
        this.material = material;
        this.drawMode = TrianglesDrawMode;
        this.isMesh = true;
        this.updateMorphTargets();
    }

    setDrawMode(value) {
        this.drawMode = value;
    }

    copy(source) {
        super.copy(source);
        this.drawMode = source.drawMode;
        if (source.morphTargetInfluences !== undefined) {
            this.morphTargetInfluences = source.morphTargetInfluences.slice();
        }
        if (source.morphTargetDictionary !== undefined) {
            this.morphTargetDictionary = Object.assign({}, source.morphTargetDictionary);
        }
        return this;
    }

    updateMorphTargets() {
        let geometry = this.geometry;
        let m, ml, name;
        if (geometry.isBufferGeometry) {
            let morphAttributes = geometry.morphAttributes;
            let keys = Object.keys(morphAttributes);
            if (keys.length > 0) {
                let morphAttribute = morphAttributes[keys[0]];
                if (morphAttribute !== undefined) {
                    this.morphTargetInfluences = [];
                    this.morphTargetDictionary = {};
                    for (m = 0, ml = morphAttribute.length; m < ml; m++) {
                        name = morphAttribute[m].name || String(m);
                        this.morphTargetInfluences.push(0);
                        this.morphTargetDictionary[name] = m;
                    }
                }
            }
        } else {
            let morphTargets = geometry.morphTargets;
            if (morphTargets !== undefined && morphTargets.length > 0) {
                this.morphTargetInfluences = [];
                this.morphTargetDictionary = {};
                for (m = 0, ml = morphTargets.length; m < ml; m++) {
                    name = morphTargets[m].name || String(m);
                    this.morphTargetInfluences.push(0);
                    this.morphTargetDictionary[name] = m;
                }
            }
        }
    }

    raycast(raycaster, intersects) {
        let inverseMatrix = new Matrix4();
        let ray = new Ray();
        let sphere = new Sphere();
        let vA = new Vector3();
        let vB = new Vector3();
        let vC = new Vector3();
        let tempA = new Vector3();
        let tempB = new Vector3();
        let tempC = new Vector3();
        let uvA = new Vector2();
        let uvB = new Vector2();
        let uvC = new Vector2();
        let barycoord = new Vector3();
        let intersectionPoint = new Vector3();
        let intersectionPointWorld = new Vector3();
        let that = this;

        function uvIntersection(point, p1, p2, p3, uv1, uv2, uv3) {
            Triangle._getBarycoord(point, p1, p2, p3, barycoord);
            uv1.multiplyScalar(barycoord.x);
            uv2.multiplyScalar(barycoord.y);
            uv3.multiplyScalar(barycoord.z);
            uv1.add(uv2).add(uv3);
            return uv1.clone();
        }

        function checkIntersection(object, material, raycaster, ray, pA, pB, pC, point) {
            let intersect;
            if (material.side === BackSide) {
                intersect = ray.intersectTriangle(pC, pB, pA, true, point);
            } else {
                intersect = ray.intersectTriangle(pA, pB, pC, material.side !== DoubleSide, point);
            }
            if (intersect === null) return null;
            intersectionPointWorld.copy(point);
            intersectionPointWorld.applyMatrix4(object.matrixWorld);
            let distance = raycaster.ray.origin.distanceTo(intersectionPointWorld);
            if (distance < raycaster.near || distance > raycaster.far) return null;
            return {
                distance: distance,
                point: intersectionPointWorld.clone(),
                object: object
            };
        }

        function checkBufferGeometryIntersection(object, raycaster, ray, position, uv, a, b, c) {
            vA.fromBufferAttribute(position, a);
            vB.fromBufferAttribute(position, b);
            vC.fromBufferAttribute(position, c);
            let intersection = checkIntersection(object, object.material, raycaster, ray, vA, vB, vC, intersectionPoint);
            if (intersection) {
                if (uv) {
                    uvA.fromBufferAttribute(uv, a);
                    uvB.fromBufferAttribute(uv, b);
                    uvC.fromBufferAttribute(uv, c);
                    intersection.uv = uvIntersection(intersectionPoint, vA, vB, vC, uvA, uvB, uvC);
                }
                let face = new Face3(a, b, c);
                Triangle._getNormal(vA, vB, vC, face.normal);
                intersection.face = face;
            }
            return intersection;
        }

        return (function raycast() {
            let geometry = that.geometry;
            let material = that.material;
            let matrixWorld = that.matrixWorld;
            if (material === undefined) return;
            // Checking boundingSphere distance to ray
            if (geometry.boundingSphere === null) geometry.computeBoundingSphere();
            sphere.copy(geometry.boundingSphere);
            sphere.applyMatrix4(matrixWorld);
            if (raycaster.ray.intersectsSphere(sphere) === false) return;
            //
            inverseMatrix.getInverse(matrixWorld);
            ray.copy(raycaster.ray).applyMatrix4(inverseMatrix);
            // Check boundingBox before continuing
            if (geometry.boundingBox !== null) {
                if (ray.intersectsBox(geometry.boundingBox) === false) return;
            }
            let intersection;
            if (geometry.isBufferGeometry) {
                let a, b, c;
                let index = geometry.index;
                let position = geometry.attributes.position;
                let uv = geometry.attributes.uv;
                let i, l;
                if (index !== null) {
                    // indexed buffer geometry
                    for (i = 0, l = index.count; i < l; i += 3) {
                        a = index.getX(i);
                        b = index.getX(i + 1);
                        c = index.getX(i + 2);
                        intersection = checkBufferGeometryIntersection(that, raycaster, ray, position, uv, a, b, c);
                        if (intersection) {
                            intersection.faceIndex = Math.floor(i / 3); // triangle number in indexed buffer semantics
                            intersects.push(intersection);
                        }
                    }
                } else if (position !== undefined) {
                    // non-indexed buffer geometry
                    for (i = 0, l = position.count; i < l; i += 3) {
                        a = i;
                        b = i + 1;
                        c = i + 2;
                        intersection = checkBufferGeometryIntersection(that, raycaster, ray, position, uv, a, b, c);
                        if (intersection) {
                            intersection.faceIndex = Math.floor(i / 3); // triangle number in non-indexed buffer semantics
                            intersects.push(intersection);
                        }
                    }
                }
            } else if (geometry.isGeometry) {
                let fvA, fvB, fvC;
                let isMultiMaterial = Array.isArray(material);
                let vertices = geometry.vertices;
                let faces = geometry.faces;
                let uvs;
                let faceVertexUvs = geometry.faceVertexUvs[0];
                if (faceVertexUvs.length > 0) uvs = faceVertexUvs;
                for (let f = 0, fl = faces.length; f < fl; f++) {
                    let face = faces[f];
                    let faceMaterial = isMultiMaterial ? material[face.materialIndex] : material;
                    if (faceMaterial === undefined) continue;
                    fvA = vertices[face.a];
                    fvB = vertices[face.b];
                    fvC = vertices[face.c];
                    if (faceMaterial.morphTargets === true) {
                        let morphTargets = geometry.morphTargets;
                        let morphInfluences = that.morphTargetInfluences;
                        vA.set(0, 0, 0);
                        vB.set(0, 0, 0);
                        vC.set(0, 0, 0);
                        for (let t = 0, tl = morphTargets.length; t < tl; t++) {
                            let influence = morphInfluences[t];
                            if (influence === 0) continue;
                            let targets = morphTargets[t].vertices;
                            vA.addScaledVector(tempA.subVectors(targets[face.a], fvA), influence);
                            vB.addScaledVector(tempB.subVectors(targets[face.b], fvB), influence);
                            vC.addScaledVector(tempC.subVectors(targets[face.c], fvC), influence);
                        }
                        vA.add(fvA);
                        vB.add(fvB);
                        vC.add(fvC);
                        fvA = vA;
                        fvB = vB;
                        fvC = vC;
                    }
                    intersection = checkIntersection(that, faceMaterial, raycaster, ray, fvA, fvB, fvC, intersectionPoint);
                    if (intersection) {
                        if (uvs && uvs[f]) {
                            let uvs_f = uvs[f];
                            uvA.copy(uvs_f[0]);
                            uvB.copy(uvs_f[1]);
                            uvC.copy(uvs_f[2]);
                            intersection.uv = uvIntersection(intersectionPoint, fvA, fvB, fvC, uvA, uvB, uvC);
                        }
                        intersection.face = face;
                        intersection.faceIndex = f;
                        intersects.push(intersection);
                    }
                }
            }
        })();
    }

    clone() {
        return  new Mesh(this.geometry, this.material).copy(this);
        // return new this.constructor(this.geometry, this.material).copy(this);
    }
}

export {Mesh};
