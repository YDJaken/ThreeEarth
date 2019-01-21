import {Vector3} from '../Datum/Math/Vector3.js';
import {Float32BufferAttribute} from '../Core/BufferAttribute.js';
import {Object3D} from "../Core/Object3D.js";
import {BufferGeometry} from "../Core/BufferGeometry.js";
import {LineBasicMaterial} from "../Materials/LineBasicMaterial.js";
import {Matrix4} from "../Datum/Math/Matrix4.js";
import {Ray} from "../Datum/Math/Ray.js";
import {Sphere} from "../Datum/Math/Sphere.js";

/**
 * @author wangzhidong
 * @modified DongYi 2018/07/11
 */

/*function LineSegments( geometry, material ) {

	Line.call( this, geometry, material );

	this.type = 'LineSegments';

}

LineSegments.prototype = Object.assign( Object.create( Line.prototype ), {

	constructor: LineSegments,

	isLineSegments: true,

	computeLineDistances: ( function () {

		var start = new Vector3();
		var end = new Vector3();

		return function computeLineDistances() {

			var geometry = this.geometry;

			if ( geometry.isBufferGeometry ) {

				// we assume non-indexed geometry

				if ( geometry.index === null ) {

					var positionAttribute = geometry.attributes.position;
					var lineDistances = [];

					for ( var i = 0, l = positionAttribute.count; i < l; i += 2 ) {

						start.fromBufferAttribute( positionAttribute, i );
						end.fromBufferAttribute( positionAttribute, i + 1 );

						lineDistances[ i ] = ( i === 0 ) ? 0 : lineDistances[ i - 1 ];
						lineDistances[ i + 1 ] = lineDistances[ i ] + start.distanceTo( end );

					}

					geometry.addAttribute( 'lineDistance', new Float32BufferAttribute( lineDistances, 1 ) );

				} else {

					console.warn( 'Speed3DEngine.LineSegments.computeLineDistances(): Computation only possible with non-indexed BufferGeometry.' );

				}

			} else if ( geometry.isGeometry ) {

				var vertices = geometry.vertices;
				var lineDistances = geometry.lineDistances;

				for ( var i = 0, l = vertices.length; i < l; i += 2 ) {

					start.copy( vertices[ i ] );
					end.copy( vertices[ i + 1 ] );

					lineDistances[ i ] = ( i === 0 ) ? 0 : lineDistances[ i - 1 ];
					lineDistances[ i + 1 ] = lineDistances[ i ] + start.distanceTo( end );

				}

			}

			return this;

		};

	}() )

} );*/

class LineSegments extends Object3D {
    constructor(geometry = new BufferGeometry(), material = new LineBasicMaterial({color: Math.random() * 0xffffff})) {
        super();
        this.geometry = geometry;
        this.material = material;
        this.type = 'LineSegments';
        this.isLineSegments = true;
    }

    computeLineDistances() {
        let start = new Vector3();
        let end = new Vector3();
        let that = this;
        return (function computeLineDistances() {
            let geometry = that.geometry;
            if (geometry.isBufferGeometry) {
                // we assume non-indexed geometry
                if (geometry.index === null) {
                    let positionAttribute = geometry.attributes.position;
                    let lineDistances = [];
                    for (let i = 0, l = positionAttribute.count; i < l; i += 2) {
                        start.fromBufferAttribute(positionAttribute, i);
                        end.fromBufferAttribute(positionAttribute, i + 1);
                        lineDistances[i] = (i === 0) ? 0 : lineDistances[i - 1];
                        lineDistances[i + 1] = lineDistances[i] + start.distanceTo(end);
                    }
                    geometry.addAttribute('lineDistance', new Float32BufferAttribute(lineDistances, 1));
                } else {
                    console.warn('Speed3DEngine.LineSegments.computeLineDistances(): Computation only possible with non-indexed BufferGeometry.');
                }
            } else if (geometry.isGeometry) {
                let vertices = geometry.vertices;
                let lineDistances = geometry.lineDistances;
                for (let i = 0, l = vertices.length; i < l; i += 2) {
                    start.copy(vertices[i]);
                    end.copy(vertices[i + 1]);
                    lineDistances[i] = (i === 0) ? 0 : lineDistances[i - 1];
                    lineDistances[i + 1] = lineDistances[i] + start.distanceTo(end);
                }
            }
            return that;
        })();
    }

    raycast(raycaster, intersects) {
        let inverseMatrix = new Matrix4();
        let ray = new Ray();
        let sphere = new Sphere();
        let that = this;
        return (function raycast() {
            let precision = raycaster.linePrecision;
            let precisionSq = precision * precision;
            let geometry = that.geometry;
            let matrixWorld = that.matrixWorld;
            // Checking boundingSphere distance to ray
            if (geometry.boundingSphere === null) geometry.computeBoundingSphere();
            sphere.copy(geometry.boundingSphere);
            sphere.applyMatrix4(matrixWorld);
            if (raycaster.ray.intersectsSphere(sphere) === false) return;
            //
            inverseMatrix.getInverse(matrixWorld);
            ray.copy(raycaster.ray).applyMatrix4(inverseMatrix);
            let vStart = new Vector3();
            let vEnd = new Vector3();
            let interSegment = new Vector3();
            let interRay = new Vector3();
            let step = (that && that.isLineSegments) ? 2 : 1;
            if (geometry.isBufferGeometry) {
                let index = geometry.index;
                let attributes = geometry.attributes;
                let positions = attributes.position.array;
                if (index !== null) {
                    let indices = index.array;
                    for (let i = 0, l = indices.length - 1; i < l; i += step) {
                        let a = indices[i];
                        let b = indices[i + 1];
                        vStart.fromArray(positions, a * 3);
                        vEnd.fromArray(positions, b * 3);
                        let distSq = ray.distanceSqToSegment(vStart, vEnd, interRay, interSegment);
                        if (distSq > precisionSq) continue;
                        interRay.applyMatrix4(that.matrixWorld); //Move back to world space for distance calculation
                        let distance = raycaster.ray.origin.distanceTo(interRay);
                        if (distance < raycaster.near || distance > raycaster.far) continue;
                        intersects.push({
                            distance: distance,
                            // What do we want? intersection point on the ray or on the segment??
                            // point: raycaster.ray.at( distance ),
                            point: interSegment.clone().applyMatrix4(that.matrixWorld),
                            index: i,
                            face: null,
                            faceIndex: null,
                            object: that
                        });
                    }
                } else {
                    for (let i = 0, l = positions.length / 3 - 1; i < l; i += step) {
                        vStart.fromArray(positions, 3 * i);
                        vEnd.fromArray(positions, 3 * i + 3);
                        let distSq = ray.distanceSqToSegment(vStart, vEnd, interRay, interSegment);
                        if (distSq > precisionSq) continue;
                        interRay.applyMatrix4(that.matrixWorld); //Move back to world space for distance calculation
                        let distance = raycaster.ray.origin.distanceTo(interRay);
                        if (distance < raycaster.near || distance > raycaster.far) continue;
                        intersects.push({
                            distance: distance,
                            // What do we want? intersection point on the ray or on the segment??
                            // point: raycaster.ray.at( distance ),
                            point: interSegment.clone().applyMatrix4(that.matrixWorld),
                            index: i,
                            face: null,
                            faceIndex: null,
                            object: that
                        });
                    }
                }
            } else if (geometry.isGeometry) {
                let vertices = geometry.vertices;
                let nbVertices = vertices.length;
                for (let i = 0; i < nbVertices - 1; i += step) {
                    let distSq = ray.distanceSqToSegment(vertices[i], vertices[i + 1], interRay, interSegment);
                    if (distSq > precisionSq) continue;
                    interRay.applyMatrix4(that.matrixWorld); //Move back to world space for distance calculation
                    let distance = raycaster.ray.origin.distanceTo(interRay);
                    if (distance < raycaster.near || distance > raycaster.far) continue;
                    intersects.push({
                        distance: distance,
                        // What do we want? intersection point on the ray or on the segment??
                        // point: raycaster.ray.at( distance ),
                        point: interSegment.clone().applyMatrix4(that.matrixWorld),
                        index: i,
                        face: null,
                        faceIndex: null,
                        object: that
                    });
                }
            }
        })();
    }

    clone() {
        return new this.constructor(this.geometry, this.material).copy(this);
    }
}

export {LineSegments};
