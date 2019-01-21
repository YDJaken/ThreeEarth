/*import { Geometry } from '../core/Geometry.js';
import { BufferGeometry } from '../core/BufferGeometry.js';
import { Float32BufferAttribute } from '../core/BufferAttribute.js';
import { Vector2 } from '../math/Vector2.js';
import { Vector3 } from '../math/Vector3.js';

// RingGeometry

function RingGeometry( innerRadius, outerRadius, thetaSegments, phiSegments, thetaStart, thetaLength ) {

	Geometry.call( this );

	this.type = 'RingGeometry';

	this.parameters = {
		innerRadius: innerRadius,
		outerRadius: outerRadius,
		thetaSegments: thetaSegments,
		phiSegments: phiSegments,
		thetaStart: thetaStart,
		thetaLength: thetaLength
	};

	this.fromBufferGeometry( new RingBufferGeometry( innerRadius, outerRadius, thetaSegments, phiSegments, thetaStart, thetaLength ) );
	this.mergeVertices();

}

RingGeometry.prototype = Object.create( Geometry.prototype );
RingGeometry.prototype.constructor = RingGeometry;

// RingBufferGeometry

function RingBufferGeometry( innerRadius, outerRadius, thetaSegments, phiSegments, thetaStart, thetaLength ) {

	BufferGeometry.call( this );

	this.type = 'RingBufferGeometry';

	this.parameters = {
		innerRadius: innerRadius,
		outerRadius: outerRadius,
		thetaSegments: thetaSegments,
		phiSegments: phiSegments,
		thetaStart: thetaStart,
		thetaLength: thetaLength
	};

	innerRadius = innerRadius || 0.5;
	outerRadius = outerRadius || 1;

	thetaStart = thetaStart !== undefined ? thetaStart : 0;
	thetaLength = thetaLength !== undefined ? thetaLength : Math.PI * 2;

	thetaSegments = thetaSegments !== undefined ? Math.max( 3, thetaSegments ) : 8;
	phiSegments = phiSegments !== undefined ? Math.max( 1, phiSegments ) : 1;

	// buffers

	var indices = [];
	var vertices = [];
	var normals = [];
	var uvs = [];

	// some helper variables

	var segment;
	var radius = innerRadius;
	var radiusStep = ( ( outerRadius - innerRadius ) / phiSegments );
	var vertex = new Vector3();
	var uv = new Vector2();
	var j, i;

	// generate vertices, normals and uvs

	for ( j = 0; j <= phiSegments; j ++ ) {

		for ( i = 0; i <= thetaSegments; i ++ ) {

			// values are generate from the inside of the ring to the outside

			segment = thetaStart + i / thetaSegments * thetaLength;

			// vertex

			vertex.x = radius * Math.cos( segment );
			vertex.y = radius * Math.sin( segment );

			vertices.push( vertex.x, vertex.y, vertex.z );

			// normal

			normals.push( 0, 0, 1 );

			// uv

			uv.x = ( vertex.x / outerRadius + 1 ) / 2;
			uv.y = ( vertex.y / outerRadius + 1 ) / 2;

			uvs.push( uv.x, uv.y );

		}

		// increase the radius for next row of vertices

		radius += radiusStep;

	}

	// indices

	for ( j = 0; j < phiSegments; j ++ ) {

		var thetaSegmentLevel = j * ( thetaSegments + 1 );

		for ( i = 0; i < thetaSegments; i ++ ) {

			segment = i + thetaSegmentLevel;

			var a = segment;
			var b = segment + thetaSegments + 1;
			var c = segment + thetaSegments + 2;
			var d = segment + 1;

			// faces

			indices.push( a, b, d );
			indices.push( b, c, d );

		}

	}

	// build geometry

	this.setIndex( indices );
	this.addAttribute( 'position', new Float32BufferAttribute( vertices, 3 ) );
	this.addAttribute( 'normal', new Float32BufferAttribute( normals, 3 ) );
	this.addAttribute( 'uv', new Float32BufferAttribute( uvs, 2 ) );

}

RingBufferGeometry.prototype = Object.create( BufferGeometry.prototype );
RingBufferGeometry.prototype.constructor = RingBufferGeometry;


export { RingGeometry, RingBufferGeometry };*/

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

// RingGeometry

class RingGeometry extends Geometry{

	constructor(innerRadius, outerRadius, thetaSegments, phiSegments, thetaStart, thetaLength){
		super()
		this.type = 'RingGeometry';
		this.parameters = {
			innerRadius: innerRadius,
			outerRadius: outerRadius,
			thetaSegments: thetaSegments,
			phiSegments: phiSegments,
			thetaStart: thetaStart,
			thetaLength: thetaLength
		};
		this.innerRadius=innerRadius,
		this.outerRadius=outerRadius,
		this.thetaSegments=thetaSegments,
		this.phiSegments=phiSegments,
		this.thetaStart=thetaStart,
		this.thetaLength=thetaLength
		this._init()
   }
   _init(){
		this.fromBufferGeometry( new RingBufferGeometry( this.innerRadius, this.outerRadius, this.thetaSegments, this.phiSegments, this.thetaStart, this.thetaLength ) );
		this.mergeVertices();
   }   
}


class RingBufferGeometry extends BufferGeometry{

	constructor(innerRadius=0.5, outerRadius=1, thetaSegments, phiSegments, thetaStart, thetaLength){
		super()
		this.type = 'RingBufferGeometry';
		this.parameters = {
			innerRadius: innerRadius,
			outerRadius: outerRadius,
			thetaSegments: thetaSegments = thetaSegments !== undefined ? Math.max( 3, thetaSegments ) : 8,
			phiSegments: phiSegments = phiSegments !== undefined ? Math.max( 1, phiSegments ) : 1,
			thetaStart: thetaStart = thetaStart !== undefined ? thetaStart : 0,
			thetaLength: thetaLength = thetaLength !== undefined ? thetaLength : Math.PI * 2
		};
		this.innerRadius = innerRadius
		this.outerRadius = outerRadius
		this.thetaSegments = thetaSegments = thetaSegments !== undefined ? Math.max( 3, thetaSegments ) : 8
		this.phiSegments = phiSegments = phiSegments !== undefined ? Math.max( 1, phiSegments ) : 1
		this.thetaStart = thetaStart = thetaStart !== undefined ? thetaStart : 0
		this.thetaLength = thetaLength = thetaLength !== undefined ? thetaLength : Math.PI * 2
		// buffers

		this.indices = [];
		this.vertices = [];
		this.normals = [];
		this.uvs = [];

		// some helper variables

		this.segment;
		this.radius = innerRadius;
		this.radiusStep = ( ( outerRadius - innerRadius ) / phiSegments );
		this.vertex = new Vector3();
		this.uv = new Vector2();
		this.j='';
		this.i='';

		this._init()
   }
   _init(){
	   // generate vertices, normals and uvs

	for ( this.j = 0; this.j <= this.phiSegments; this.j ++ ) {

		for ( this.i = 0; this.i <= this.thetaSegments; this.i ++ ) {

			// values are generate from the inside of the ring to the outside

			this.segment = this.thetaStart + this.i / this.thetaSegments * this.thetaLength;

			// vertex

			this.vertex.x = this.radius * Math.cos( this.segment );
			this.vertex.y = this.radius * Math.sin( this.segment );

			this.vertices.push( this.vertex.x, this.vertex.y, this.vertex.z );

			// normal

			this.normals.push( 0, 0, 1 );

			// uv

			this.uv.x = ( this.vertex.x / this.outerRadius + 1 ) / 2;
			this.uv.y = ( this.vertex.y /this.outerRadius + 1 ) / 2;

			this.uvs.push( this.uv.x, this.uv.y );

		}

		// increase the radius for next row of vertices

		this.radius += this.radiusStep;

	}

	// indices

	for ( this.j = 0; this.j < this.phiSegments; this.j ++ ) {

		let thetaSegmentLevel = this.j * ( this.thetaSegments + 1 );

		for ( this.i = 0; this.i < this.thetaSegments; this.i ++ ) {

			this.segment = this.i + thetaSegmentLevel;

			let a = this.segment;
			let b = this.segment + this.thetaSegments + 1;
			let c = this.segment + this.thetaSegments + 2;
			let d = this.segment + 1;

			// faces

			this.indices.push( a, b, d );
			this.indices.push( b, c, d );

		}

	}

	// build geometry

	this.setIndex( this.indices );
	this.addAttribute( 'position', new Float32BufferAttribute( this.vertices, 3 ) );
	this.addAttribute( 'normal', new Float32BufferAttribute( this.normals, 3 ) );
	this.addAttribute( 'uv', new Float32BufferAttribute( this.uvs, 2 ) );	
   }   

}

export { RingGeometry, RingBufferGeometry };
