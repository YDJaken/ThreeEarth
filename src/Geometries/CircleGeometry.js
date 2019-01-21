/*import { Geometry } from '../core/Geometry.js';
import { BufferGeometry } from '../core/BufferGeometry.js';
import { Float32BufferAttribute } from '../core/BufferAttribute.js';
import { Vector3 } from '../math/Vector3.js';
import { Vector2 } from '../math/Vector2.js';

// CircleGeometry

function CircleGeometry( radius, segments, thetaStart, thetaLength ) {

	Geometry.call( this );

	this.type = 'CircleGeometry';

	this.parameters = {
		radius: radius,
		segments: segments,
		thetaStart: thetaStart,
		thetaLength: thetaLength
	};

	this.fromBufferGeometry( new CircleBufferGeometry( radius, segments, thetaStart, thetaLength ) );
	this.mergeVertices();

}

CircleGeometry.prototype = Object.create( Geometry.prototype );
CircleGeometry.prototype.constructor = CircleGeometry;

// CircleBufferGeometry

function CircleBufferGeometry( radius, segments, thetaStart, thetaLength ) {

	BufferGeometry.call( this );

	this.type = 'CircleBufferGeometry';

	this.parameters = {
		radius: radius,
		segments: segments,
		thetaStart: thetaStart,
		thetaLength: thetaLength
	};

	radius = radius || 1;
	segments = segments !== undefined ? Math.max( 3, segments ) : 8;

	thetaStart = thetaStart !== undefined ? thetaStart : 0;
	thetaLength = thetaLength !== undefined ? thetaLength : Math.PI * 2;

	// buffers

	var indices = [];
	var vertices = [];
	var normals = [];
	var uvs = [];

	// helper variables

	var i, s;
	var vertex = new Vector3();
	var uv = new Vector2();

	// center point

	vertices.push( 0, 0, 0 );
	normals.push( 0, 0, 1 );
	uvs.push( 0.5, 0.5 );

	for ( s = 0, i = 3; s <= segments; s ++, i += 3 ) {

		var segment = thetaStart + s / segments * thetaLength;

		// vertex

		vertex.x = radius * Math.cos( segment );
		vertex.y = radius * Math.sin( segment );

		vertices.push( vertex.x, vertex.y, vertex.z );

		// normal

		normals.push( 0, 0, 1 );

		// uvs

		uv.x = ( vertices[ i ] / radius + 1 ) / 2;
		uv.y = ( vertices[ i + 1 ] / radius + 1 ) / 2;

		uvs.push( uv.x, uv.y );

	}

	// indices

	for ( i = 1; i <= segments; i ++ ) {

		indices.push( i, i + 1, 0 );

	}

	// build geometry

	this.setIndex( indices );
	this.addAttribute( 'position', new Float32BufferAttribute( vertices, 3 ) );
	this.addAttribute( 'normal', new Float32BufferAttribute( normals, 3 ) );
	this.addAttribute( 'uv', new Float32BufferAttribute( uvs, 2 ) );

}

CircleBufferGeometry.prototype = Object.create( BufferGeometry.prototype );
CircleBufferGeometry.prototype.constructor = CircleBufferGeometry;


export { CircleGeometry, CircleBufferGeometry };*/

/**
 * @author wangzhidong
 * @modified by gby
 * @modify date 2018-7-11
*/
import { Geometry } from '../Core/Geometry.js';
import { BufferGeometry } from '../Core/BufferGeometry.js';
import { Float32BufferAttribute } from '../Core/BufferAttribute.js';
import { Vector3 } from '../Datum/Math/Vector3.js';
import { Vector2 } from '../Datum/Math/Vector2.js';

// CircleGeometry
class CircleGeometry extends Geometry{
   constructor(radius, segments, thetaStart, thetaLength){
	  super()
	  this.type = 'CircleGeometry';
	  this.parameters = {
		radius: radius,
		segments: segments,
		thetaStart: thetaStart,
		thetaLength: thetaLength
	};
	  this.radius=radius
	  this.segments=segments
	  this.thetaStart=thetaStart
	  this.thetaLength=thetaLength
	  this._init()
   }
   _init(){
	this.fromBufferGeometry( new CircleBufferGeometry(this.radius, this.segments, this.thetaStart, this.thetaLength ) );
	this.mergeVertices();
   }
}



class CircleBufferGeometry extends BufferGeometry{
    constructor(radius=1, segments, thetaStart, thetaLength){
		super()
		this.type = 'CircleBufferGeometry';
		this.parameters = {
			radius: radius,
			segments: segments!== undefined ? Math.max( 3, segments ) : 8,
			thetaStart: thetaStart!== undefined ? thetaStart : 0,
			thetaLength: thetaLength!== undefined ? thetaLength : Math.PI * 2,
		};
		this.radius=radius,
		this.segments = segments!== undefined ? Math.max( 3, segments ) : 8,
		this.thetaStart=thetaStart!== undefined ? thetaStart : 0,
		this.thetaLength=thetaLength!== undefined ? thetaLength : Math.PI * 2,
		this.indices = [];
		this.vertices = [];
		this.normals = [];
		this.uvs = [];
		this.i;
		this.s;
		this.vertex = new Vector3();
		this.uv = new Vector2();
	}
	_init(){
		this.vertices.push( 0, 0, 0 );
		this.normals.push( 0, 0, 1 );
		this.uvs.push( 0.5, 0.5 );
	for ( this.s = 0, this.i = 3; this.s <= segments; this.s ++, this.i += 3 ) {

		let segment = this.thetaStart + this.s / this.segments * this.thetaLength;

		// vertex

		this.vertex.x = this.radius * Math.cos( segment );
		this.vertex.y = this.radius * Math.sin( segment );

		this.vertices.push( this.vertex.x, this.vertex.y, this.vertex.z );

		// normal

		this.normals.push( 0, 0, 1 );

		// uvs

		this.uv.x = ( this.vertices[ i ] / this.radius + 1 ) / 2;
		this.uv.y = ( this.vertices[ i + 1 ] / this.radius + 1 ) / 2;

		this.uvs.push( this.uv.x, this.uv.y );
	}
	for ( this.i = 1; this.i <= this.segments; this.i ++ ) {

		this.indices.push( this.i, this.i + 1, 0 );

	}
	this.setIndex( indices );
	this.addAttribute( 'position', new Float32BufferAttribute( this.vertices, 3 ) );
	this.addAttribute( 'normal', new Float32BufferAttribute( this.normals, 3 ) );
	this.addAttribute( 'uv', new Float32BufferAttribute( this.uvs, 2 ) );

  }
}
export { CircleGeometry, CircleBufferGeometry };
