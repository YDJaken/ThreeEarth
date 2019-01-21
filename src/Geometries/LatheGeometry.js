/*import { Geometry } from '../core/Geometry.js';
import { Float32BufferAttribute } from '../core/BufferAttribute.js';
import { BufferGeometry } from '../core/BufferGeometry.js';
import { Vector3 } from '../math/Vector3.js';
import { Vector2 } from '../math/Vector2.js';
import { _Math } from '../math/Math.js';

// LatheGeometry

function LatheGeometry( points, segments, phiStart, phiLength ) {

	Geometry.call( this );

	this.type = 'LatheGeometry';

	this.parameters = {
		points: points,
		segments: segments,
		phiStart: phiStart,
		phiLength: phiLength
	};

	this.fromBufferGeometry( new LatheBufferGeometry( points, segments, phiStart, phiLength ) );
	this.mergeVertices();

}

LatheGeometry.prototype = Object.create( Geometry.prototype );
LatheGeometry.prototype.constructor = LatheGeometry;

// LatheBufferGeometry

function LatheBufferGeometry( points, segments, phiStart, phiLength ) {

	BufferGeometry.call( this );

	this.type = 'LatheBufferGeometry';

	this.parameters = {
		points: points,
		segments: segments,
		phiStart: phiStart,
		phiLength: phiLength
	};

	segments = Math.floor( segments ) || 12;
	phiStart = phiStart || 0;
	phiLength = phiLength || Math.PI * 2;

	// clamp phiLength so it's in range of [ 0, 2PI ]

	phiLength = _Math.clamp( phiLength, 0, Math.PI * 2 );


	// buffers

	var indices = [];
	var vertices = [];
	var uvs = [];

	// helper variables

	var base;
	var inverseSegments = 1.0 / segments;
	var vertex = new Vector3();
	var uv = new Vector2();
	var i, j;

	// generate vertices and uvs

	for ( i = 0; i <= segments; i ++ ) {

		var phi = phiStart + i * inverseSegments * phiLength;

		var sin = Math.sin( phi );
		var cos = Math.cos( phi );

		for ( j = 0; j <= ( points.length - 1 ); j ++ ) {

			// vertex

			vertex.x = points[ j ].x * sin;
			vertex.y = points[ j ].y;
			vertex.z = points[ j ].x * cos;

			vertices.push( vertex.x, vertex.y, vertex.z );

			// uv

			uv.x = i / segments;
			uv.y = j / ( points.length - 1 );

			uvs.push( uv.x, uv.y );


		}

	}

	// indices

	for ( i = 0; i < segments; i ++ ) {

		for ( j = 0; j < ( points.length - 1 ); j ++ ) {

			base = j + i * points.length;

			var a = base;
			var b = base + points.length;
			var c = base + points.length + 1;
			var d = base + 1;

			// faces

			indices.push( a, b, d );
			indices.push( b, c, d );

		}

	}

	// build geometry

	this.setIndex( indices );
	this.addAttribute( 'position', new Float32BufferAttribute( vertices, 3 ) );
	this.addAttribute( 'uv', new Float32BufferAttribute( uvs, 2 ) );

	// generate normals

	this.computeVertexNormals();

	// if the geometry is closed, we need to average the normals along the seam.
	// because the corresponding vertices are identical (but still have different UVs).

	if ( phiLength === Math.PI * 2 ) {

		var normals = this.attributes.normal.array;
		var n1 = new Vector3();
		var n2 = new Vector3();
		var n = new Vector3();

		// this is the buffer offset for the last line of vertices

		base = segments * points.length * 3;

		for ( i = 0, j = 0; i < points.length; i ++, j += 3 ) {

			// select the normal of the vertex in the first line

			n1.x = normals[ j + 0 ];
			n1.y = normals[ j + 1 ];
			n1.z = normals[ j + 2 ];

			// select the normal of the vertex in the last line

			n2.x = normals[ base + j + 0 ];
			n2.y = normals[ base + j + 1 ];
			n2.z = normals[ base + j + 2 ];

			// average normals

			n.addVectors( n1, n2 ).normalize();

			// assign the new values to both normals

			normals[ j + 0 ] = normals[ base + j + 0 ] = n.x;
			normals[ j + 1 ] = normals[ base + j + 1 ] = n.y;
			normals[ j + 2 ] = normals[ base + j + 2 ] = n.z;

		}

	}

}

LatheBufferGeometry.prototype = Object.create( BufferGeometry.prototype );
LatheBufferGeometry.prototype.constructor = LatheBufferGeometry;


export { LatheGeometry, LatheBufferGeometry };*/

/**
 * @author wangzhidong
 * @modified by gby
 * @modify date 2018-7-11
 */

import { Geometry } from '../Core/Geometry.js';
import { Float32BufferAttribute } from '../Core/BufferAttribute.js';
import { BufferGeometry } from '../Core/BufferGeometry.js';
import { Vector3 } from '../Datum/Math/Vector3.js';
import { Vector2 } from '../Datum/Math/Vector2.js';
import { _Math } from '../Datum/Math/Math.js';

// LatheGeometry

class LatheGeometry extends Geometry{

	constructor(points, segments, phiStart, phiLength){
		super()
		this.type = 'LatheGeometry'
		this.parameters = {
			points: points,
			segments: segments,
			phiStart: phiStart,
			phiLength: phiLength
		}
		this.points=points,
		this.segments=segments,
		this.phiStart=phiStart,
		this.phiLength=phiLength
        this._init()
	  }
       _init(){
		this.fromBufferGeometry( new LatheBufferGeometry( this.points, this.segments, this.phiStart, this.phiLength ) );
		this.mergeVertices();
	   }
}


class LatheBufferGeometry extends BufferGeometry{

   constructor(points, segments, phiStart=0, phiLength=Math.PI * 2){
	    super()
	    this.type = 'LatheBufferGeometry';

		this.parameters = {
		points: points,
		segments: segments = Math.floor( segments ) || 12,
		phiStart: phiStart,
		phiLength: phiLength = _Math.clamp( phiLength, 0, Math.PI * 2 )
	};
	    this.points=points,
		this.segments=segments = Math.floor( segments ) || 12;
		this.phiStart=phiStart,
		this.phiLength=phiLength = _Math.clamp( phiLength, 0, Math.PI * 2 );

		this.indices = [];
		this.vertices = [];
		this.uvs = [];
		// helper variables
		this.base;
		this.inverseSegments = 1.0 / segments;
		this.vertex = new Vector3();
		this.uv = new Vector2();
		this.i, j;
	    this._init()
   }


   _init(){
	for ( this.i = 0; this.i <= this.segments; this.i ++ ) {

		let phi = this.phiStart + this.i * this.inverseSegments * this.phiLength;

		let sin = Math.sin( phi );
		let cos = Math.cos( phi );

		for ( this.j = 0; this.j <= ( this.points.length - 1 ); this.j ++ ) {

			// vertex

			this.vertex.x = this.points[ this.j ].x * sin;
			this.vertex.y = this.points[ this.j ].y;
			this.vertex.z = this.points[ this.j ].x * cos;

			this.vertices.push( this.vertex.x, this.vertex.y, this.vertex.z );

			// uv

			this.uv.x = i / this.segments;
			this.uv.y = j / ( this.points.length - 1 );

			this.uvs.push( uv.x, uv.y );


		}

	}

	// indices

	for ( this.i = 0; this.i < this.segments; this.i ++ ) {

		for ( this.j = 0; this.j < ( this.points.length - 1 ); this.j ++ ) {

			this.base = this.j + this.i * this.points.length;

			let a = this.base;
			let b = this.base + this.points.length;
			let c = this.base + this.points.length + 1;
			let d = this.base + 1;

			// faces

			this.indices.push( a, b, d );
			this.indices.push( b, c, d );

		}

	}

	// build geometry

	this.setIndex( this.indices );
	this.addAttribute( 'position', new Float32BufferAttribute( this.vertices, 3 ) );
	this.addAttribute( 'uv', new Float32BufferAttribute( this.uvs, 2 ) );

	// generate normals

	this.computeVertexNormals();

	// if the geometry is closed, we need to average the normals along the seam.
	// because the corresponding vertices are identical (but still have different UVs).

	if ( this.phiLength === Math.PI * 2 ) {

		let normals = this.attributes.normal.array;
		let n1 = new Vector3();
		let n2 = new Vector3();
		let n = new Vector3();

		// this is the buffer offset for the last line of vertices

		this.base = this.segments * this.points.length * 3;

		for ( this.i = 0, this.j = 0; this.i < this.points.length; this.i ++, this.j += 3 ) {

			// select the normal of the vertex in the first line

			n1.x = normals[ this.j + 0 ];
			n1.y = normals[ this.j + 1 ];
			n1.z = normals[ this.j + 2 ];

			// select the normal of the vertex in the last line

			n2.x = normals[ this.base + this.j + 0 ];
			n2.y = normals[ this.base + this.j + 1 ];
			n2.z = normals[ this.base + this.j + 2 ];

			// average normals

			n.addVectors( n1, n2 ).normalize();

			// assign the new values to both normals

			normals[ this.j + 0 ] = normals[ this.base + this.j + 0 ] = n.x;
			normals[ this.j + 1 ] = normals[ this.base + this.j + 1 ] = n.y;
			normals[ this.j + 2 ] = normals[ this.base + this.j + 2 ] = n.z;

		}

	}

   }
}



export { LatheGeometry, LatheBufferGeometry };
