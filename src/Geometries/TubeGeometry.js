/*import { Geometry } from '../core/Geometry.js';
import { BufferGeometry } from '../core/BufferGeometry.js';
import { Float32BufferAttribute } from '../core/BufferAttribute.js';
import { Vector2 } from '../math/Vector2.js';
import { Vector3 } from '../math/Vector3.js';

// TubeGeometry

function TubeGeometry( path, tubularSegments, radius, radialSegments, closed, taper ) {

	Geometry.call( this );

	this.type = 'TubeGeometry';

	this.parameters = {
		path: path,
		tubularSegments: tubularSegments,
		radius: radius,
		radialSegments: radialSegments,
		closed: closed
	};

	if ( taper !== undefined ) console.warn( 'Speed3DEngine.TubeGeometry: taper has been removed.' );

	var bufferGeometry = new TubeBufferGeometry( path, tubularSegments, radius, radialSegments, closed );

	// expose internals

	this.tangents = bufferGeometry.tangents;
	this.normals = bufferGeometry.normals;
	this.binormals = bufferGeometry.binormals;

	// create geometry

	this.fromBufferGeometry( bufferGeometry );
	this.mergeVertices();

}

TubeGeometry.prototype = Object.create( Geometry.prototype );
TubeGeometry.prototype.constructor = TubeGeometry;

// TubeBufferGeometry

function TubeBufferGeometry( path, tubularSegments, radius, radialSegments, closed ) {

	BufferGeometry.call( this );

	this.type = 'TubeBufferGeometry';

	this.parameters = {
		path: path,
		tubularSegments: tubularSegments,
		radius: radius,
		radialSegments: radialSegments,
		closed: closed
	};

	tubularSegments = tubularSegments || 64;
	radius = radius || 1;
	radialSegments = radialSegments || 8;
	closed = closed || false;

	var frames = path.computeFrenetFrames( tubularSegments, closed );

	// expose internals

	this.tangents = frames.tangents;
	this.normals = frames.normals;
	this.binormals = frames.binormals;

	// helper variables

	var vertex = new Vector3();
	var normal = new Vector3();
	var uv = new Vector2();
	var P = new Vector3();

	var i, j;

	// buffer

	var vertices = [];
	var normals = [];
	var uvs = [];
	var indices = [];

	// create buffer data

	generateBufferData();

	// build geometry

	this.setIndex( indices );
	this.addAttribute( 'position', new Float32BufferAttribute( vertices, 3 ) );
	this.addAttribute( 'normal', new Float32BufferAttribute( normals, 3 ) );
	this.addAttribute( 'uv', new Float32BufferAttribute( uvs, 2 ) );

	// functions

	function generateBufferData() {

		for ( i = 0; i < tubularSegments; i ++ ) {

			generateSegment( i );

		}

		// if the geometry is not closed, generate the last row of vertices and normals
		// at the regular position on the given path
		//
		// if the geometry is closed, duplicate the first row of vertices and normals (uvs will differ)

		generateSegment( ( closed === false ) ? tubularSegments : 0 );

		// uvs are generated in a separate function.
		// this makes it easy compute correct values for closed geometries

		generateUVs();

		// finally create faces

		generateIndices();

	}

	function generateSegment( i ) {

		// we use getPointAt to sample evenly distributed points from the given path

		P = path.getPointAt( i / tubularSegments, P );

		// retrieve corresponding normal and binormal

		var N = frames.normals[ i ];
		var B = frames.binormals[ i ];

		// generate normals and vertices for the current segment

		for ( j = 0; j <= radialSegments; j ++ ) {

			var v = j / radialSegments * Math.PI * 2;

			var sin = Math.sin( v );
			var cos = - Math.cos( v );

			// normal

			normal.x = ( cos * N.x + sin * B.x );
			normal.y = ( cos * N.y + sin * B.y );
			normal.z = ( cos * N.z + sin * B.z );
			normal.normalize();

			normals.push( normal.x, normal.y, normal.z );

			// vertex

			vertex.x = P.x + radius * normal.x;
			vertex.y = P.y + radius * normal.y;
			vertex.z = P.z + radius * normal.z;

			vertices.push( vertex.x, vertex.y, vertex.z );

		}

	}

	function generateIndices() {

		for ( j = 1; j <= tubularSegments; j ++ ) {

			for ( i = 1; i <= radialSegments; i ++ ) {

				var a = ( radialSegments + 1 ) * ( j - 1 ) + ( i - 1 );
				var b = ( radialSegments + 1 ) * j + ( i - 1 );
				var c = ( radialSegments + 1 ) * j + i;
				var d = ( radialSegments + 1 ) * ( j - 1 ) + i;

				// faces

				indices.push( a, b, d );
				indices.push( b, c, d );

			}

		}

	}

	function generateUVs() {

		for ( i = 0; i <= tubularSegments; i ++ ) {

			for ( j = 0; j <= radialSegments; j ++ ) {

				uv.x = i / tubularSegments;
				uv.y = j / radialSegments;

				uvs.push( uv.x, uv.y );

			}

		}

	}

}

TubeBufferGeometry.prototype = Object.create( BufferGeometry.prototype );
TubeBufferGeometry.prototype.constructor = TubeBufferGeometry;


export { TubeGeometry, TubeBufferGeometry };*/


/**
 * @author wangzhidong
 * @modified by gby
 * @modify date 2018-7-11
 */

import { Geometry } from '../Core/Geometry.js';
import { BufferGeometry } from '../Core/BufferGeometry.js';
import { Float32BufferAttribute } from '../Core/BufferAttribute.js';
import { Vector2 } from '../Datum/Math/Vector2.js';
import { Vector3 } from '../Datum/Math/Vector3.js';

// TubeGeometry



class TubeGeometry extends Geometry{

	constructor(path, tubularSegments, radius, radialSegments, closed, taper){
		super()
		this.type = 'TubeGeometry';
		this.parameters = {
			path: path,
			tubularSegments: tubularSegments,
			radius: radius,
			radialSegments: radialSegments,
			closed: closed
		};
		this.path=path,
		this.tubularSegments=tubularSegments,
		this.radius=radius,
		this.radialSegments=radialSegments,
		this.closed=closed
        this.taper=taper
		this.bufferGeometry = new TubeBufferGeometry( this.path, this.tubularSegments, this.radius, this.radialSegments, this.closed );
		this.tangents = this.bufferGeometry.tangents;
		this.normals = this.bufferGeometry.normals;
		this.binormals = this.bufferGeometry.binormals;

		this._init()
   }
   _init(){
		if ( this.taper !== undefined ) console.warn( 'Speed3DEngine.TubeGeometry: taper has been removed.' );
		this.fromBufferGeometry( this.bufferGeometry );
		this.mergeVertices();
   }   
}


class TubeBufferGeometry extends BufferGeometry{

	constructor(path, tubularSegments=64, radius=1, radialSegments=8, closed=false){
		super()
		this.type = 'TubeBufferGeometry';
		this.parameters = {
			path: path,
			tubularSegments: tubularSegments,
			radius: radius,
			radialSegments: radialSegments,
			closed: closed
		};
		this.path=path,
		this.tubularSegments=tubularSegments,
		this.radius=radius,
		this.radialSegments=radialSegments,
		this.closed=closed
		this.frames = this.path.computeFrenetFrames( this.tubularSegments, this.closed );

		// expose internals
	
		this.tangents = this.frames.tangents;
		this.normals = this.frames.normals;
		this.binormals = this.frames.binormals;
	
		// helper variables
	
		this.vertex = new Vector3();
		this.normal = new Vector3();
		this.uv = new Vector2();
		this.P = new Vector3();
	
		this.i='', 
		this.j='';
	
		// buffer
	
		this.vertices = [];
		this.normals = [];
		this.uvs = [];
		this.indices = [];

		this._init()
   }
   _init(){
	   	// create buffer data
	    this.generateBufferData();
	    // build geometry
		this.setIndex( this.indices );
		this.addAttribute( 'position', new Float32BufferAttribute( this.vertices, 3 ) );
		this.addAttribute( 'normal', new Float32BufferAttribute( this.normals, 3 ) );
		this.addAttribute( 'uv', new Float32BufferAttribute( this.uvs, 2 ) );
   }   
   generateBufferData() {

	for ( this.i = 0; this.i < this.tubularSegments; this.i ++ ) {

		this.generateSegment( this.i );

	}

	// if the geometry is not closed, generate the last row of vertices and normals
	// at the regular position on the given path
	//
	// if the geometry is closed, duplicate the first row of vertices and normals (uvs will differ)

	this.generateSegment( ( this.closed === false ) ? this.tubularSegments : 0 );

	// uvs are generated in a separate function.
	// this makes it easy compute correct values for closed geometries

	this.generateUVs();

	// finally create faces

	this.generateIndices();

  }
   generateSegment( i ) {

	// we use getPointAt to sample evenly distributed points from the given path

	this.P = this.path.getPointAt( i / this.tubularSegments, this.P );

	// retrieve corresponding normal and binormal

	let N = this.frames.normals[ i ];
	let B = this.frames.binormals[ i ];

	// generate normals and vertices for the current segment

	for ( this.j = 0; this.j <= this.radialSegments; this.j ++ ) {

		let v = this.j / this.radialSegments * Math.PI * 2;

		let sin = Math.sin( v );
		let cos = - Math.cos( v );

		// normal

		this.normal.x = ( cos * N.x + sin * B.x );
		this.normal.y = ( cos * N.y + sin * B.y );
		this.normal.z = ( cos * N.z + sin * B.z );
		this.normal.normalize();

		this.normals.push( this.normal.x, this.normal.y, this.normal.z );

		// vertex

		this.vertex.x = this.P.x + this.radius * this.normal.x;
		this.vertex.y = this.P.y + this.radius * this.normal.y;
		this.vertex.z = this.P.z + this.radius * this.normal.z;

		this.vertices.push( this.vertex.x, this.vertex.y, this.vertex.z );

	}

  }
   generateIndices() {

	for ( this.j = 1; this.j <= this.tubularSegments; this.j ++ ) {

		for ( this.i = 1; this.i <= this.radialSegments; this.i ++ ) {

			let a = ( this.radialSegments + 1 ) * ( this.j - 1 ) + ( this.i - 1 );
			let b = ( this.radialSegments + 1 ) * this.j + ( this.i - 1 );
			let c = ( this.radialSegments + 1 ) * this.j + this.i;
			let d = ( this.radialSegments + 1 ) * ( this.j - 1 ) + this.i;

			// faces

			this.indices.push( a, b, d );
			this.indices.push( b, c, d );

		}

	}

   }  
	

   generateUVs() {

	for ( this.i = 0; this.i <= this.tubularSegments; this.i ++ ) {

		for ( this.j = 0; this.j <= this.radialSegments; this.j ++ ) {

			this.uv.x = this.i / this.tubularSegments;
			this.uv.y = this.j / this.radialSegments;

			this.uvs.push( this.uv.x, this.uv.y );

		}

	}

   }
}

export { TubeGeometry, TubeBufferGeometry };
