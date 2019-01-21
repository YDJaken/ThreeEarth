// /**
//  * @author wangzhidong
//  */

// import { Geometry } from '../core/Geometry.js';
// import { BufferGeometry } from '../core/BufferGeometry.js';
// import { Float32BufferAttribute } from '../core/BufferAttribute.js';

// // PlaneGeometry

// function PlaneGeometry( width, height, widthSegments, heightSegments ) {

// 	Geometry.call( this );

// 	this.type = 'PlaneGeometry';

// 	this.parameters = {
// 		width: width,
// 		height: height,
// 		widthSegments: widthSegments,
// 		heightSegments: heightSegments
// 	};

// 	this.fromBufferGeometry( new PlaneBufferGeometry( width, height, widthSegments, heightSegments ) );
// 	this.mergeVertices();

// }

// PlaneGeometry.prototype = Object.create( Geometry.prototype );
// PlaneGeometry.prototype.constructor = PlaneGeometry;

// // PlaneBufferGeometry

// function PlaneBufferGeometry( width, height, widthSegments, heightSegments ) {

// 	BufferGeometry.call( this );

// 	this.type = 'PlaneBufferGeometry';

// 	this.parameters = {
// 		width: width,
// 		height: height,
// 		widthSegments: widthSegments,
// 		heightSegments: heightSegments
// 	};

// 	width = width || 1;
// 	height = height || 1;

// 	var width_half = width / 2;
// 	var height_half = height / 2;

// 	var gridX = Math.floor( widthSegments ) || 1;
// 	var gridY = Math.floor( heightSegments ) || 1;

// 	var gridX1 = gridX + 1;
// 	var gridY1 = gridY + 1;

// 	var segment_width = width / gridX;
// 	var segment_height = height / gridY;

// 	var ix, iy;

// 	// buffers

// 	var indices = [];
// 	var vertices = [];
// 	var normals = [];
// 	var uvs = [];

// 	// generate vertices, normals and uvs

// 	for ( iy = 0; iy < gridY1; iy ++ ) {

// 		var y = iy * segment_height - height_half;

// 		for ( ix = 0; ix < gridX1; ix ++ ) {

// 			var x = ix * segment_width - width_half;

// 			vertices.push( x, - y, 0 );

// 			normals.push( 0, 0, 1 );

// 			uvs.push( ix / gridX );
// 			uvs.push( 1 - ( iy / gridY ) );

// 		}

// 	}

// 	// indices

// 	for ( iy = 0; iy < gridY; iy ++ ) {

// 		for ( ix = 0; ix < gridX; ix ++ ) {

// 			var a = ix + gridX1 * iy;
// 			var b = ix + gridX1 * ( iy + 1 );
// 			var c = ( ix + 1 ) + gridX1 * ( iy + 1 );
// 			var d = ( ix + 1 ) + gridX1 * iy;

// 			// faces

// 			indices.push( a, b, d );
// 			indices.push( b, c, d );

// 		}

// 	}

// 	// build geometry

// 	this.setIndex( indices );
// 	this.addAttribute( 'position', new Float32BufferAttribute( vertices, 3 ) );
// 	this.addAttribute( 'normal', new Float32BufferAttribute( normals, 3 ) );
// 	this.addAttribute( 'uv', new Float32BufferAttribute( uvs, 2 ) );

// }

// PlaneBufferGeometry.prototype = Object.create( BufferGeometry.prototype );
// PlaneBufferGeometry.prototype.constructor = PlaneBufferGeometry;


// export { PlaneGeometry, PlaneBufferGeometry };


/**
 * @author wangzhidong
 * @modified by gby
 * @modify date 2018-7-11
 */

import { Geometry } from '../Core/Geometry.js';
import { BufferGeometry } from '../Core/BufferGeometry.js';
import { Float32BufferAttribute } from '../Core/BufferAttribute.js';

// PlaneGeometry

class PlaneGeometry extends Geometry{
	constructor(width, height, widthSegments, heightSegments){
		super()
		this.type = 'PlaneGeometry';
		
		this.parameters = {
			width: width,
			height: height,
			widthSegments: widthSegments,
			heightSegments: heightSegments
		};
		this.width=width
		this.height=height
		this.widthSegments=widthSegments
		this.heightSegments=heightSegments
		this._init()
   }
   _init(){
	this.fromBufferGeometry( new PlaneBufferGeometry( this.width, this.height, this.widthSegments, this.heightSegments ) );
	this.mergeVertices();
   }
}
	
class PlaneBufferGeometry extends BufferGeometry{

	constructor(width=1, height=1, widthSegments, heightSegments){
		super()
		this.type = 'PlaneBufferGeometry';
		this.parameters = {
			width: width,
			height: height,
			widthSegments: widthSegments,
			heightSegments: heightSegments
		};
		this.width=width
		this.height=height
		this.widthSegments=widthSegments
		this.heightSegments=heightSegments
		this.width_half=width / 2;
		this.height_half=height / 2;
		this.gridX = Math.floor( widthSegments ) || 1;
		this.gridY = Math.floor( heightSegments ) || 1;

		this.gridX1 = this.gridX + 1;
		this.gridY1 = this.gridY + 1;

		this.segment_width = this.width / this.gridX;
		this.segment_height = this.height / this.gridY;

		this.ix=''
		this.iy='';

	    // buffers
	    this.indices = [];
		this.vertices = [];
		this.normals = [];
		this.uvs = [];
		this._init()
   }
   _init(){

	// generate vertices, normals and uvs

	for ( this.iy = 0; this.iy < this.gridY1; this.iy ++ ) {

		let y = this.iy * this.segment_height - this.height_half;

		for ( this.ix = 0; this.ix < this.gridX1; this.ix ++ ) {

			let x = this.ix * this.segment_width - this.width_half;

			this.vertices.push( x, - y, 0 );

			this.normals.push( 0, 0, 1 );

			this.uvs.push( this.ix / this.gridX );
			this.uvs.push( 1 - ( this.iy / this.gridY ) );

		}

	}

	// indices

	for ( this.iy = 0; this.iy < this.gridY; this.iy ++ ) {

		for ( this.ix = 0; this.ix < this.gridX; this.ix ++ ) {

			let a = this.ix + this.gridX1 * this.iy;
			let b = this.ix + this.gridX1 * ( this.iy + 1 );
			let c = ( this.ix + 1 ) + this.gridX1 * ( this.iy + 1 );
			let d = ( this.ix + 1 ) + this.gridX1 * this.iy;

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
   
export { PlaneGeometry, PlaneBufferGeometry };