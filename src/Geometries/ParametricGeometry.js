/*import { Geometry } from '../core/Geometry.js';
import { BufferGeometry } from '../core/BufferGeometry.js';
import { Float32BufferAttribute } from '../core/BufferAttribute.js';
import { Vector3 } from '../math/Vector3.js';

// ParametricGeometry


function ParametricGeometry( func, slices, stacks ) {

	Geometry.call( this );

	this.type = 'ParametricGeometry';

	this.parameters = {
		func: func,
		slices: slices,
		stacks: stacks
	};

	this.fromBufferGeometry( new ParametricBufferGeometry( func, slices, stacks ) );
	this.mergeVertices();

}

ParametricGeometry.prototype = Object.create( Geometry.prototype );
ParametricGeometry.prototype.constructor = ParametricGeometry;

// ParametricBufferGeometry

function ParametricBufferGeometry( func, slices, stacks ) {

	BufferGeometry.call( this );

	this.type = 'ParametricBufferGeometry';

	this.parameters = {
		func: func,
		slices: slices,
		stacks: stacks
	};

	// buffers

	var indices = [];
	var vertices = [];
	var normals = [];
	var uvs = [];

	var EPS = 0.00001;

	var normal = new Vector3();

	var p0 = new Vector3(), p1 = new Vector3();
	var pu = new Vector3(), pv = new Vector3();

	var i, j;

	if ( func.length < 3 ) {

		console.error( 'Speed3DEngine.ParametricGeometry: Function must now modify a Vector3 as third parameter.' );

	}

	// generate vertices, normals and uvs

	var sliceCount = slices + 1;

	for ( i = 0; i <= stacks; i ++ ) {

		var v = i / stacks;

		for ( j = 0; j <= slices; j ++ ) {

			var u = j / slices;

			// vertex

			func( u, v, p0 );
			vertices.push( p0.x, p0.y, p0.z );

			// normal

			// approximate tangent vectors via finite differences

			if ( u - EPS >= 0 ) {

				func( u - EPS, v, p1 );
				pu.subVectors( p0, p1 );

			} else {

				func( u + EPS, v, p1 );
				pu.subVectors( p1, p0 );

			}

			if ( v - EPS >= 0 ) {

				func( u, v - EPS, p1 );
				pv.subVectors( p0, p1 );

			} else {

				func( u, v + EPS, p1 );
				pv.subVectors( p1, p0 );

			}

			// cross product of tangent vectors returns surface normal

			normal.crossVectors( pu, pv ).normalize();
			normals.push( normal.x, normal.y, normal.z );

			// uv

			uvs.push( u, v );

		}

	}

	// generate indices

	for ( i = 0; i < stacks; i ++ ) {

		for ( j = 0; j < slices; j ++ ) {

			var a = i * sliceCount + j;
			var b = i * sliceCount + j + 1;
			var c = ( i + 1 ) * sliceCount + j + 1;
			var d = ( i + 1 ) * sliceCount + j;

			// faces one and two

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

ParametricBufferGeometry.prototype = Object.create( BufferGeometry.prototype );
ParametricBufferGeometry.prototype.constructor = ParametricBufferGeometry;


export { ParametricGeometry, ParametricBufferGeometry };*/


/**
 * @author wangzhidong
 * @modified by gby
 * @modify date 2018-7-11
 */

import { Geometry } from '../Core/Geometry.js';
import { BufferGeometry } from '../Core/BufferGeometry.js';
import { Float32BufferAttribute } from '../Core/BufferAttribute.js';
import { Vector3 } from '../Datum/Math/Vector3.js';

class ParametricGeometry extends Geometry{
	constructor(func, slices, stacks){
		super()
		this.type = 'ParametricGeometry';
		this.parameters = {
			func: func,
			slices: slices,
			stacks: stacks
		};
		this.func = func
		this.slices = slices
		this.stacks = stacks
		this._init()
   }
   _init(){
		this.fromBufferGeometry( new ParametricBufferGeometry( this.func, this.slices, this.stacks ) );
		this.mergeVertices();
   }   
}

class ParametricBufferGeometry extends BufferGeometry{
	constructor(func, slices, stacks){
		super()
		this.type = 'ParametricBufferGeometry';
		this.parameters = {
			func: func,
			slices: slices,
			stacks: stacks,
		};
		this.func = func;
		this.slices = slices;
		this.stacks = stacks;
		this.indices = [];
	    this.vertices = [];
	    this.normals = [];
	    this.uvs = [];
		this.EPS = 0.00001;

		this.normal = new Vector3();

		this.p0 = new Vector3(), this.p1 = new Vector3();
		this.pu = new Vector3(), this.pv = new Vector3();
		this.i;
		this.j;
		this._init()
   }
   _init(){
	if ( this.func.length < 3 ) {

		console.error( 'Speed3DEngine.ParametricGeometry: Function must now modify a Vector3 as third parameter.' );

	}
	// generate vertices, normals and uvs

	let sliceCount = this.slices + 1;

	for ( this.i = 0; this.i <= this.stacks; this.i ++ ) {

		let v = this.i / this.stacks;

		for ( this.j = 0; this.j <= this.slices; this.j ++ ) {

			let u = this.j / this.slices;

			// vertex

			this.func( u, v, this.p0 );
			this.vertices.push( this.p0.x, this.p0.y, this.p0.z );

			// normal

			// approximate tangent vectors via finite differences

			if ( u - this.EPS >= 0 ) {

				this.func( u - this.EPS, v, this.p1 );
				this.pu.subVectors( this.p0, this.p1 );

			} else {

				this.func( u + this.EPS, v, this.p1 );
				this.pu.subVectors( this.p1, this.p0 );

			}

			if ( v - this.EPS >= 0 ) {

				this.func( u, v - this.EPS, this.p1 );
				this.pv.subVectors( this.p0, this.p1 );

			} else {

				this.func( u, v + this.EPS, this.p1 );
				this.pv.subVectors( this.p1, this.p0 );

			}

			// cross product of tangent vectors returns surface normal

			this.normal.crossVectors( this.pu, this.pv ).normalize();
			this.normals.push( this.normal.x, this.normal.y, this.normal.z );

			// uv

			this.uvs.push( u, v );

		}

	}

	// generate indices

	for ( this.i = 0; this.i < this.stacks; this.i ++ ) {

		for ( this.j = 0; this.j < this.slices; this.j ++ ) {

			let a = this.i * sliceCount + this.j;
			let b = this.i * sliceCount + this.j + 1;
			let c = ( this.i + 1 ) * sliceCount + this.j + 1;
			let d = ( this.i + 1 ) * sliceCount + this.j;

			// faces one and two

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

export { ParametricGeometry, ParametricBufferGeometry };
