/*
// CylinderGeometry

function CylinderGeometry( radiusTop, radiusBottom, height, radialSegments, heightSegments, openEnded, thetaStart, thetaLength ) {

	Geometry.call( this );

	this.type = 'CylinderGeometry';

	this.parameters = {
		radiusTop: radiusTop,
		radiusBottom: radiusBottom,
		height: height,
		radialSegments: radialSegments,
		heightSegments: heightSegments,
		openEnded: openEnded,
		thetaStart: thetaStart,
		thetaLength: thetaLength
	};

	this.fromBufferGeometry( new CylinderBufferGeometry( radiusTop, radiusBottom, height, radialSegments, heightSegments, openEnded, thetaStart, thetaLength ) );
	this.mergeVertices();

}

CylinderGeometry.prototype = Object.create( Geometry.prototype );
CylinderGeometry.prototype.constructor = CylinderGeometry;

// CylinderBufferGeometry

function CylinderBufferGeometry( radiusTop, radiusBottom, height, radialSegments, heightSegments, openEnded, thetaStart, thetaLength ) {

	BufferGeometry.call( this );

	this.type = 'CylinderBufferGeometry';

	this.parameters = {
		radiusTop: radiusTop,
		radiusBottom: radiusBottom,
		height: height,
		radialSegments: radialSegments,
		heightSegments: heightSegments,
		openEnded: openEnded,
		thetaStart: thetaStart,
		thetaLength: thetaLength
	};

	var scope = this;

	radiusTop = radiusTop !== undefined ? radiusTop : 1;
	radiusBottom = radiusBottom !== undefined ? radiusBottom : 1;
	height = height || 1;

	radialSegments = Math.floor( radialSegments ) || 8;
	heightSegments = Math.floor( heightSegments ) || 1;

	openEnded = openEnded !== undefined ? openEnded : false;
	thetaStart = thetaStart !== undefined ? thetaStart : 0.0;
	thetaLength = thetaLength !== undefined ? thetaLength : Math.PI * 2;

	// buffers

	var indices = [];
	var vertices = [];
	var normals = [];
	var uvs = [];

	// helper variables

	var index = 0;
	var indexArray = [];
	var halfHeight = height / 2;
	var groupStart = 0;

	// generate geometry

	generateTorso();

	if ( openEnded === false ) {

		if ( radiusTop > 0 ) generateCap( true );
		if ( radiusBottom > 0 ) generateCap( false );

	}

	// build geometry

	this.setIndex( indices );
	this.addAttribute( 'position', new Float32BufferAttribute( vertices, 3 ) );
	this.addAttribute( 'normal', new Float32BufferAttribute( normals, 3 ) );
	this.addAttribute( 'uv', new Float32BufferAttribute( uvs, 2 ) );

	function generateTorso() {

		var x, y;
		var normal = new Vector3();
		var vertex = new Vector3();

		var groupCount = 0;

		// this will be used to calculate the normal
		var slope = ( radiusBottom - radiusTop ) / height;

		// generate vertices, normals and uvs

		for ( y = 0; y <= heightSegments; y ++ ) {

			var indexRow = [];

			var v = y / heightSegments;

			// calculate the radius of the current row

			var radius = v * ( radiusBottom - radiusTop ) + radiusTop;

			for ( x = 0; x <= radialSegments; x ++ ) {

				var u = x / radialSegments;

				var theta = u * thetaLength + thetaStart;

				var sinTheta = Math.sin( theta );
				var cosTheta = Math.cos( theta );

				// vertex

				vertex.x = radius * sinTheta;
				vertex.y = - v * height + halfHeight;
				vertex.z = radius * cosTheta;
				vertices.push( vertex.x, vertex.y, vertex.z );

				// normal

				normal.set( sinTheta, slope, cosTheta ).normalize();
				normals.push( normal.x, normal.y, normal.z );

				// uv

				uvs.push( u, 1 - v );

				// save index of vertex in respective row

				indexRow.push( index ++ );

			}

			// now save vertices of the row in our index array

			indexArray.push( indexRow );

		}

		// generate indices

		for ( x = 0; x < radialSegments; x ++ ) {

			for ( y = 0; y < heightSegments; y ++ ) {

				// we use the index array to access the correct indices

				var a = indexArray[ y ][ x ];
				var b = indexArray[ y + 1 ][ x ];
				var c = indexArray[ y + 1 ][ x + 1 ];
				var d = indexArray[ y ][ x + 1 ];

				// faces

				indices.push( a, b, d );
				indices.push( b, c, d );

				// update group counter

				groupCount += 6;

			}

		}

		// add a group to the geometry. this will ensure multi material support

		scope.addGroup( groupStart, groupCount, 0 );

		// calculate new start value for groups

		groupStart += groupCount;

	}

	function generateCap( top ) {

		var x, centerIndexStart, centerIndexEnd;

		var uv = new Vector2();
		var vertex = new Vector3();

		var groupCount = 0;

		var radius = ( top === true ) ? radiusTop : radiusBottom;
		var sign = ( top === true ) ? 1 : - 1;

		// save the index of the first center vertex
		centerIndexStart = index;

		// first we generate the center vertex data of the cap.
		// because the geometry needs one set of uvs per face,
		// we must generate a center vertex per face/segment

		for ( x = 1; x <= radialSegments; x ++ ) {

			// vertex

			vertices.push( 0, halfHeight * sign, 0 );

			// normal

			normals.push( 0, sign, 0 );

			// uv

			uvs.push( 0.5, 0.5 );

			// increase index

			index ++;

		}

		// save the index of the last center vertex

		centerIndexEnd = index;

		// now we generate the surrounding vertices, normals and uvs

		for ( x = 0; x <= radialSegments; x ++ ) {

			var u = x / radialSegments;
			var theta = u * thetaLength + thetaStart;

			var cosTheta = Math.cos( theta );
			var sinTheta = Math.sin( theta );

			// vertex

			vertex.x = radius * sinTheta;
			vertex.y = halfHeight * sign;
			vertex.z = radius * cosTheta;
			vertices.push( vertex.x, vertex.y, vertex.z );

			// normal

			normals.push( 0, sign, 0 );

			// uv

			uv.x = ( cosTheta * 0.5 ) + 0.5;
			uv.y = ( sinTheta * 0.5 * sign ) + 0.5;
			uvs.push( uv.x, uv.y );

			// increase index

			index ++;

		}

		// generate indices

		for ( x = 0; x < radialSegments; x ++ ) {

			var c = centerIndexStart + x;
			var i = centerIndexEnd + x;

			if ( top === true ) {

				// face top

				indices.push( i, i + 1, c );

			} else {

				// face bottom

				indices.push( i + 1, i, c );

			}

			groupCount += 3;

		}

		// add a group to the geometry. this will ensure multi material support

		scope.addGroup( groupStart, groupCount, top === true ? 1 : 2 );

		// calculate new start value for groups

		groupStart += groupCount;

	}

}

CylinderBufferGeometry.prototype = Object.create( BufferGeometry.prototype );
CylinderBufferGeometry.prototype.constructor = CylinderBufferGeometry;
*/

/**
 * @author wangzhidong
 * @modified by gby
 * @modify date 2018-7-11
 * @modified by DongYi 2018-07-18
 */

import {Geometry} from '../Core/Geometry.js';
import {BufferGeometry} from '../Core/BufferGeometry.js';
import {Float32BufferAttribute} from '../Core/BufferAttribute.js';
import {Vector3} from '../Datum/Math/Vector3.js';
import {Vector2} from '../Datum/Math/Vector2.js';

// CylinderGeometry


class CylinderGeometry extends Geometry {
    constructor(radiusTop, radiusBottom, height, radialSegments, heightSegments, openEnded, thetaStart, thetaLength) {
        super()
        this.type = 'CylinderGeometry';
        this.parameters = {
            radiusTop: radiusTop,
            radiusBottom: radiusBottom,
            height: height,
            radialSegments: radialSegments,
            heightSegments: heightSegments,
            openEnded: openEnded,
            thetaStart: thetaStart,
            thetaLength: thetaLength
        };
        this.fromBufferGeometry(new CylinderBufferGeometry(radiusTop, radiusBottom, height, radialSegments, heightSegments, openEnded, thetaStart, thetaLength));
        this.mergeVertices();
    }

}


class CylinderBufferGeometry extends BufferGeometry {
    constructor(radiusTop = 1, radiusBottom = 1, height = 1, radialSegments = 8, heightSegments = 1, openEnded = false, thetaStart = 0.0, thetaLength = Math.PI * 2) {
        super();
        this.type = 'CylinderBufferGeometry';
        this.parameters = {
            radiusTop: radiusTop,
            radiusBottom: radiusBottom,
            height: height,
            radialSegments: radialSegments,
            heightSegments: heightSegments,
            openEnded: openEnded,
            thetaStart: thetaStart,
            thetaLength: thetaLength
        };
        this.radiusTop = radiusTop !== undefined ? radiusTop : 1;
        this.radiusBottom = radiusBottom !== undefined ? radiusBottom : 1;
        this.height = height || 1;
        this.radialSegments = Math.floor(radialSegments)|| 8;
        this.heightSegments = Math.floor(heightSegments)|| 1;
        this.openEnded = openEnded!== undefined ? openEnded : false;
        this.thetaStart = thetaStart !== undefined ? thetaStart : 0.0;
        this.thetaLength = thetaLength !== undefined ? thetaLength : Math.PI * 2;
        this.indices = [];
        this.vertices = [];
        this.normals = [];
        this.uvs = [];
        // helper variables
        this.index = 0;
        this.indexArray = [];
        this.halfHeight = height / 2;
        this.groupStart = 0;
        this._init()

    }

    _init() {
        this.generateTorso();
        if (this.openEnded === false) {
            if (this.radiusTop > 0) this.generateCap(true);
            if (this.radiusBottom > 0) this.generateCap(false);
        }
        this.setIndex(this.indices);
        this.addAttribute('position', new Float32BufferAttribute(this.vertices, 3));
        this.addAttribute('normal', new Float32BufferAttribute(this.normals, 3));
        this.addAttribute('uv', new Float32BufferAttribute(this.uvs, 2));


    }

    generateTorso() {
        if(!this.groupStart){
            return ;
        }
        let x, y;
        let normal = new Vector3();
        let vertex = new Vector3();
        let groupCount = 0;
        // this will be used to calculate the normal
        let slope = (this.radiusBottom - this.radiusTop) / this.height;
        // generate vertices, normals and uvs
        for (y = 0; y <= this.heightSegments; y++) {
            let indexRow = [];
            let v = y / this.heightSegments;
            // calculate the radius of the current row
            let radius = v * (this.radiusBottom - this.radiusTop) + this.radiusTop;
            for (x = 0; x <= this.radialSegments; x++) {
                let u = x / this.radialSegments;
                let theta = u * this.thetaLength + this.thetaStart;
                let sinTheta = Math.sin(theta);
                let cosTheta = Math.cos(theta);
                // vertex
                vertex.x = radius * sinTheta;
                vertex.y = -v * this.height + this.halfHeight;
                vertex.z = radius * cosTheta;
                this.vertices.push(vertex.x, vertex.y, vertex.z);
                // normal
                normal.set(sinTheta, slope, cosTheta).normalize();
                this.normals.push(normal.x, normal.y, normal.z);
                // uv
                this.uvs.push(this.u, 1 - this.v);
                // save index of vertex in respective row
                indexRow.push(this.index++);
            }
            // now save vertices of the row in our index array
            this.indexArray.push(indexRow);
        }
        // generate indices
        for (x = 0; x < this.radialSegments; x++) {
            for (y = 0; y < this.heightSegments; y++) {
                // we use the index array to access the correct indices
                let a = this.indexArray[y][x];
                let b = this.indexArray[y + 1][x];
                let c = this.indexArray[y + 1][x + 1];
                let d = this.indexArray[y][x + 1];
                // faces
                this.indices.push(a, b, d);
                this.indices.push(b, c, d);
                // update group counter
                groupCount += 6;
            }
        }
        // add a group to the geometry. this will ensure multi material support
        this.addGroup(this.groupStart, groupCount, 0);
        // calculate new start value for groups
        this.groupStart += groupCount;
    }

    generateCap(top) {
        if(!this.groupStart){
            return ;
        }
        let x, centerIndexStart, centerIndexEnd;
        let uv = new Vector2();
        let vertex = new Vector3();
        let groupCount = 0;
        let radius = (top === true) ? this.radiusTop : this.radiusBottom;
        let sign = (top === true) ? 1 : -1;
        // save the index of the first center vertex
        centerIndexStart = this.index;
        // first we generate the center vertex data of the cap.
        // because the geometry needs one set of uvs per face,
        // we must generate a center vertex per face/segment
        for (x = 1; x <= this.radialSegments; x++) {
            // vertex
            this.vertices.push(0, this.halfHeight * sign, 0);
            // normal
            this.normals.push(0, sign, 0);
            // uv
            this.uvs.push(0.5, 0.5);
            // increase index
            this.index++;
        }
        // save the index of the last center vertex
        centerIndexEnd = this.index;
        // now we generate the surrounding vertices, normals and uvs
        for (x = 0; x <= this.radialSegments; x++) {
            let u = x / this.radialSegments;
            let theta = u * this.thetaLength + this.thetaStart;
            let cosTheta = Math.cos(theta);
            let sinTheta = Math.sin(theta);
            // vertex
            vertex.x = radius * sinTheta;
            vertex.y = this.halfHeight * sign;
            vertex.z = radius * cosTheta;
            this.vertices.push(vertex.x, vertex.y, vertex.z);
            // normal
            this.normals.push(0, sign, 0);
            // uv
            uv.x = (cosTheta * 0.5) + 0.5;
            uv.y = (sinTheta * 0.5 * sign) + 0.5;
            this.uvs.push(uv.x, uv.y);
            // increase index
            this.index++;
        }
        // generate indices
        for (x = 0; x < this.radialSegments; x++) {
            let c = centerIndexStart + x;
            let i = centerIndexEnd + x;
            if (top === true) {
                // face top
                this.indices.push(i, i + 1, c);
            } else {
                // face bottom
                this.indices.push(i + 1, i, c);
            }
            groupCount += 3;
        }
        // add a group to the geometry. this will ensure multi material support
        this.addGroup(this.groupStart, groupCount, top === true ? 1 : 2);
        // calculate new start value for groups
        this.groupStart += groupCount;
    }
}

export {CylinderGeometry, CylinderBufferGeometry};
