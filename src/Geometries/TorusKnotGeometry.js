/*import { Geometry } from '../core/Geometry.js';
import { BufferGeometry } from '../core/BufferGeometry.js';
import { Float32BufferAttribute } from '../core/BufferAttribute.js';
import { Vector3 } from '../math/Vector3.js';

// TorusKnotGeometry

function TorusKnotGeometry( radius, tube, tubularSegments, radialSegments, p, q, heightScale ) {

	Geometry.call( this );

	this.type = 'TorusKnotGeometry';

	this.parameters = {
		radius: radius,
		tube: tube,
		tubularSegments: tubularSegments,
		radialSegments: radialSegments,
		p: p,
		q: q
	};

	if ( heightScale !== undefined ) console.warn( 'Speed3DEngine.TorusKnotGeometry: heightScale has been deprecated. Use .scale( x, y, z ) instead.' );

	this.fromBufferGeometry( new TorusKnotBufferGeometry( radius, tube, tubularSegments, radialSegments, p, q ) );
	this.mergeVertices();

}

TorusKnotGeometry.prototype = Object.create( Geometry.prototype );
TorusKnotGeometry.prototype.constructor = TorusKnotGeometry;

// TorusKnotBufferGeometry

function TorusKnotBufferGeometry( radius, tube, tubularSegments, radialSegments, p, q ) {

	BufferGeometry.call( this );

	this.type = 'TorusKnotBufferGeometry';

	this.parameters = {
		radius: radius,
		tube: tube,
		tubularSegments: tubularSegments,
		radialSegments: radialSegments,
		p: p,
		q: q
	};

	radius = radius || 1;
	tube = tube || 0.4;
	tubularSegments = Math.floor( tubularSegments ) || 64;
	radialSegments = Math.floor( radialSegments ) || 8;
	p = p || 2;
	q = q || 3;

	// buffers

	var indices = [];
	var vertices = [];
	var normals = [];
	var uvs = [];

	// helper variables

	var i, j;

	var vertex = new Vector3();
	var normal = new Vector3();

	var P1 = new Vector3();
	var P2 = new Vector3();

	var B = new Vector3();
	var T = new Vector3();
	var N = new Vector3();

	// generate vertices, normals and uvs

	for ( i = 0; i <= tubularSegments; ++ i ) {

		// the radian "u" is used to calculate the position on the torus curve of the current tubular segement

		var u = i / tubularSegments * p * Math.PI * 2;

		// now we calculate two points. P1 is our current position on the curve, P2 is a little farther ahead.
		// these points are used to create a special "coordinate space", which is necessary to calculate the correct vertex positions

		calculatePositionOnCurve( u, p, q, radius, P1 );
		calculatePositionOnCurve( u + 0.01, p, q, radius, P2 );

		// calculate orthonormal basis

		T.subVectors( P2, P1 );
		N.addVectors( P2, P1 );
		B.crossVectors( T, N );
		N.crossVectors( B, T );

		// normalize B, N. T can be ignored, we don't use it

		B.normalize();
		N.normalize();

		for ( j = 0; j <= radialSegments; ++ j ) {

			// now calculate the vertices. they are nothing more than an extrusion of the torus curve.
			// because we extrude a shape in the xy-plane, there is no need to calculate a z-value.

			var v = j / radialSegments * Math.PI * 2;
			var cx = - tube * Math.cos( v );
			var cy = tube * Math.sin( v );

			// now calculate the final vertex position.
			// first we orient the extrusion with our basis vectos, then we add it to the current position on the curve

			vertex.x = P1.x + ( cx * N.x + cy * B.x );
			vertex.y = P1.y + ( cx * N.y + cy * B.y );
			vertex.z = P1.z + ( cx * N.z + cy * B.z );

			vertices.push( vertex.x, vertex.y, vertex.z );

			// normal (P1 is always the center/origin of the extrusion, thus we can use it to calculate the normal)

			normal.subVectors( vertex, P1 ).normalize();

			normals.push( normal.x, normal.y, normal.z );

			// uv

			uvs.push( i / tubularSegments );
			uvs.push( j / radialSegments );

		}

	}

	// generate indices

	for ( j = 1; j <= tubularSegments; j ++ ) {

		for ( i = 1; i <= radialSegments; i ++ ) {

			// indices

			var a = ( radialSegments + 1 ) * ( j - 1 ) + ( i - 1 );
			var b = ( radialSegments + 1 ) * j + ( i - 1 );
			var c = ( radialSegments + 1 ) * j + i;
			var d = ( radialSegments + 1 ) * ( j - 1 ) + i;

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

	// this function calculates the current position on the torus curve

	function calculatePositionOnCurve( u, p, q, radius, position ) {

		var cu = Math.cos( u );
		var su = Math.sin( u );
		var quOverP = q / p * u;
		var cs = Math.cos( quOverP );

		position.x = radius * ( 2 + cs ) * 0.5 * cu;
		position.y = radius * ( 2 + cs ) * su * 0.5;
		position.z = radius * Math.sin( quOverP ) * 0.5;

	}

}

TorusKnotBufferGeometry.prototype = Object.create( BufferGeometry.prototype );
TorusKnotBufferGeometry.prototype.constructor = TorusKnotBufferGeometry;


export { TorusKnotGeometry, TorusKnotBufferGeometry };*/
/**
 * @author wangzhidong
 * @modified by gby
 * @modify date 2018-7-11
 */

import { Geometry } from '../Core/Geometry.js';
import { BufferGeometry } from '../Core/BufferGeometry.js';
import { Float32BufferAttribute } from '../Core/BufferAttribute.js';
import { Vector3 } from '../Datum/Math/Vector3.js';

// TorusKnotGeometry


class TorusKnotGeometry extends Geometry{

	constructor(radius, tube, tubularSegments, radialSegments, p, q, heightScale){
		super()
		this.type = 'TorusKnotGeometry';
		this.parameters = {
			radius: radius,
			tube: tube,
			tubularSegments: tubularSegments,
			radialSegments: radialSegments,
			p: p,
			q: q
		};
		this.radius=radius,
		this.tube=tube,
		this.tubularSegments=tubularSegments,
		this.radialSegments=radialSegments,
		this.p=p,
		this.q=q
		this.heightScale = heightScale
		this._init()
   }
   _init(){
		if (this.heightScale !== undefined ) console.warn( 'Speed3DEngine.TorusKnotGeometry: heightScale has been deprecated. Use .scale( x, y, z ) instead.' );
		this.fromBufferGeometry( new TorusKnotBufferGeometry( this.radius, this.tube, this.tubularSegments, this.radialSegments, this.p, this.q ) );
		this.mergeVertices();
   }   
}



class TorusKnotBufferGeometry extends BufferGeometry{

	constructor(radius=1, tube=0.4, tubularSegments, radialSegments, p=2, q=3){
		super()
		this.type = 'TorusKnotBufferGeometry';
		this.parameters = {
			radius: radius,
			tube: tube,
			tubularSegments: tubularSegments = Math.floor( tubularSegments ) || 64,
			radialSegments: radialSegments = Math.floor( radialSegments ) || 8,
			p: p,
			q: q
		};
		this.radius=radius,
		this.tube=tube,
		this.tubularSegments=tubularSegments = Math.floor( tubularSegments ) || 64,
		this.radialSegments=radialSegments = Math.floor( radialSegments ) || 8,
		this.p=p,
		this.q=q

		// buffers

		this.indices = [];
		this.vertices = [];
		this.normals = [];
		this.uvs = [];

		// helper variables

		this.i=''
		this.j='';
		this.vertex = new Vector3();
		this.normal = new Vector3();

		this.P1 = new Vector3();
		this.P2 = new Vector3();

		this.B = new Vector3();
		this.T = new Vector3();
		this.N = new Vector3();
		this._init()
   }
   _init(){
	   // generate vertices, normals and uvs

	for ( this.i = 0; this.i <= this.tubularSegments; ++ this.i ) {

		// the radian "u" is used to calculate the position on the torus curve of the current tubular segement

		let u = this.i / this.tubularSegments * this.p * Math.PI * 2;

		// now we calculate two points. P1 is our current position on the curve, P2 is a little farther ahead.
		// these points are used to create a special "coordinate space", which is necessary to calculate the correct vertex positions

		this.calculatePositionOnCurve( u, this.p, this.q, this.radius, this.P1 );
		this.calculatePositionOnCurve( u + 0.01, this.p, this.q, this.radius, this.P2 );

		// calculate orthonormal basis

		this.T.subVectors( this.P2, this.P1 );
		this.N.addVectors( this.P2, this.P1 );
		this.B.crossVectors( this.T, this.N );
		this.N.crossVectors( this.B, this.T );

		// normalize B, N. T can be ignored, we don't use it

		this.B.normalize();
		this.N.normalize();

		for ( this.j = 0; this.j <= this.radialSegments; ++ this.j ) {

			// now calculate the vertices. they are nothing more than an extrusion of the torus curve.
			// because we extrude a shape in the xy-plane, there is no need to calculate a z-value.

			let v = this.j / this.radialSegments * Math.PI * 2;
			let cx = - this.tube * Math.cos( v );
			let cy = this.tube * Math.sin( v );

			// now calculate the final vertex position.
			// first we orient the extrusion with our basis vectos, then we add it to the current position on the curve

			this.vertex.x = this.P1.x + ( cx * this.N.x + cy * this.B.x );
			this.vertex.y = this.P1.y + ( cx * this.N.y + cy * this.B.y );
			this.vertex.z = this.P1.z + ( cx * this.N.z + cy * this.B.z );

			this.vertices.push( this.vertex.x, this.vertex.y, this.vertex.z );

			// normal (P1 is always the center/origin of the extrusion, thus we can use it to calculate the normal)

			this.normal.subVectors( this.vertex, this.P1 ).normalize();

			this.normals.push( this.normal.x,this.normal.y, this.normal.z );

			// uv

			this.uvs.push( this.i / this.tubularSegments );
			this.uvs.push( this.j / this.radialSegments );

		}

	}

	// generate indices

	for ( this.j = 1; this.j <= this.tubularSegments; this.j ++ ) {

		for ( this.i = 1; this.i <= this.radialSegments; this.i ++ ) {

			// indices

			let a = ( this.radialSegments + 1 ) * (this.j - 1 ) + ( this.i - 1 );
			let b = ( this.radialSegments + 1 ) * this.j + ( this.i - 1 );
			let c = ( this.radialSegments + 1 ) * this.j + this.i;
			let d = ( this.radialSegments + 1 ) * ( this.j - 1 ) + this.i;

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
   // this function calculates the current position on the torus curve
   calculatePositionOnCurve( u, p, q, radius, position ) {

	let cu = Math.cos( u );
	let su = Math.sin( u );
	let quOverP = q / p * u;
	let cs = Math.cos( quOverP );

	position.x = radius * ( 2 + cs ) * 0.5 * cu;
	position.y = radius * ( 2 + cs ) * su * 0.5;
	position.z = radius * Math.sin( quOverP ) * 0.5;

   }

}
export { TorusKnotGeometry, TorusKnotBufferGeometry };
