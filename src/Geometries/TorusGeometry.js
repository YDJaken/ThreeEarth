/*import { Geometry } from '../core/Geometry.js';
import { BufferGeometry } from '../core/BufferGeometry.js';
import { Float32BufferAttribute } from '../core/BufferAttribute.js';
import { Vector3 } from '../math/Vector3.js';

// TorusGeometry

function TorusGeometry( radius, tube, radialSegments, tubularSegments, arc ) {

	Geometry.call( this );

	this.type = 'TorusGeometry';

	this.parameters = {
		radius: radius,
		tube: tube,
		radialSegments: radialSegments,
		tubularSegments: tubularSegments,
		arc: arc
	};

	this.fromBufferGeometry( new TorusBufferGeometry( radius, tube, radialSegments, tubularSegments, arc ) );
	this.mergeVertices();

}

TorusGeometry.prototype = Object.create( Geometry.prototype );
TorusGeometry.prototype.constructor = TorusGeometry;

// TorusBufferGeometry

function TorusBufferGeometry( radius, tube, radialSegments, tubularSegments, arc ) {

	BufferGeometry.call( this );

	this.type = 'TorusBufferGeometry';

	this.parameters = {
		radius: radius,
		tube: tube,
		radialSegments: radialSegments,
		tubularSegments: tubularSegments,
		arc: arc
	};

	radius = radius || 1;
	tube = tube || 0.4;
	radialSegments = Math.floor( radialSegments ) || 8;
	tubularSegments = Math.floor( tubularSegments ) || 6;
	arc = arc || Math.PI * 2;

	// buffers

	var indices = [];
	var vertices = [];
	var normals = [];
	var uvs = [];

	// helper variables

	var center = new Vector3();
	var vertex = new Vector3();
	var normal = new Vector3();

	var j, i;

	// generate vertices, normals and uvs

	for ( j = 0; j <= radialSegments; j ++ ) {

		for ( i = 0; i <= tubularSegments; i ++ ) {

			var u = i / tubularSegments * arc;
			var v = j / radialSegments * Math.PI * 2;

			// vertex

			vertex.x = ( radius + tube * Math.cos( v ) ) * Math.cos( u );
			vertex.y = ( radius + tube * Math.cos( v ) ) * Math.sin( u );
			vertex.z = tube * Math.sin( v );

			vertices.push( vertex.x, vertex.y, vertex.z );

			// normal

			center.x = radius * Math.cos( u );
			center.y = radius * Math.sin( u );
			normal.subVectors( vertex, center ).normalize();

			normals.push( normal.x, normal.y, normal.z );

			// uv

			uvs.push( i / tubularSegments );
			uvs.push( j / radialSegments );

		}

	}

	// generate indices

	for ( j = 1; j <= radialSegments; j ++ ) {

		for ( i = 1; i <= tubularSegments; i ++ ) {

			// indices

			var a = ( tubularSegments + 1 ) * j + i - 1;
			var b = ( tubularSegments + 1 ) * ( j - 1 ) + i - 1;
			var c = ( tubularSegments + 1 ) * ( j - 1 ) + i;
			var d = ( tubularSegments + 1 ) * j + i;

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

TorusBufferGeometry.prototype = Object.create( BufferGeometry.prototype );
TorusBufferGeometry.prototype.constructor = TorusBufferGeometry;


export { TorusGeometry, TorusBufferGeometry };*/
/**
 * @author wangzhidong
 * modified by gby
 * @modify date 2018-7-11
 */

import { Geometry } from '../Core/Geometry.js';
import { BufferGeometry } from '../Core/BufferGeometry.js';
import { Float32BufferAttribute } from '../Core/BufferAttribute.js';
import { Vector3 } from '../Datum/Math/Vector3.js';

// TorusGeometry

class TorusGeometry extends Geometry{

	constructor(radius, tube, radialSegments, tubularSegments, arc){
		super()
		this.type = 'TorusGeometry';
		this.parameters = {
			radius: radius,
			tube: tube,
			radialSegments: radialSegments,
			tubularSegments: tubularSegments,
			arc: arc
		};
		this.radius=radius,
		this.tube=tube,
		this.radialSegments=radialSegments,
		this.tubularSegments=tubularSegments,
		this.arc=arc
		this._init()
   }
   _init(){
		this.fromBufferGeometry( new TorusBufferGeometry( this.radius, this.tube, this.adialSegments, this.tubularSegments, this.arc ) );
		this.mergeVertices();
   }   
}


class TorusBufferGeometry extends BufferGeometry{

	constructor(radius=1, tube=0.4, radialSegments, tubularSegments, arc = Math.PI * 2){
		super()
		this.type = 'TorusBufferGeometry';
		this.parameters = {
			radius: radius,
			tube: tube,
			radialSegments: radialSegments = Math.floor( radialSegments ) || 8,
			tubularSegments: tubularSegments  = Math.floor( tubularSegments ) || 6,
			arc: arc
		};
		this.radius=radius,
		this.tube=tube,
		this.radialSegments=radialSegments = Math.floor( radialSegments ) || 8,
		this.tubularSegments=tubularSegments  = Math.floor( tubularSegments ) || 6,
		this.arc=arc
		// buffers

		this.indices = [];
		this.vertices = [];
		this.normals = [];
		this.uvs = [];

		// helper variables

		this.center = new Vector3();
		this.vertex = new Vector3();
		this.normal = new Vector3();

		this.j;
		this.i;
		this._init()
   }
   _init(){
		// generate vertices, normals and uvs

		for ( this.j = 0; this.j <= this.radialSegments; this.j ++ ) {

			for ( this.i = 0; this.i <= this.tubularSegments; this.i ++ ) {

				let u = this.i / this.tubularSegments * this.arc;
				let v = this.j / this.radialSegments * Math.PI * 2;

				// vertex

				this.vertex.x = ( this.radius + this.tube * Math.cos( v ) ) * Math.cos( u );
				this.vertex.y = ( this.radius + this.tube * Math.cos( v ) ) * Math.sin( u );
				this.vertex.z = this.tube * Math.sin( v );

				this.vertices.push( this.vertex.x, this.vertex.y, this.vertex.z );

				// normal

				this.center.x = this.radius * Math.cos( u );
				this.center.y = this.radius * Math.sin( u );
				this.normal.subVectors( this.vertex, this.center ).normalize();

				this.normals.push( this.normal.x, this.normal.y, this.normal.z );

				// uv

				this.uvs.push( this.i / this.tubularSegments );
				this.uvs.push( this.j / this.radialSegments );

			}

		}

		// generate indices

		for ( this.j = 1; this.j <= this.radialSegments; this.j ++ ) {

			for ( this.i = 1; this.i <= this.tubularSegments; this.i ++ ) {

				// indices

				let a = ( this.tubularSegments + 1 ) * this.j + this.i - 1;
				let b = ( this.tubularSegments + 1 ) * ( this.j - 1 ) + this.i - 1;
				let c = ( this.tubularSegments + 1 ) * ( this.j - 1 ) + this.i;
				let d = ( this.tubularSegments + 1 ) * this.j +this.i;

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
export { TorusGeometry, TorusBufferGeometry };
