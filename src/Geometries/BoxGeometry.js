// /**
//  * @author wangzhidong
//  */

// import { Geometry } from '../core/Geometry.js';
// import { BufferGeometry } from '../core/BufferGeometry.js';
// import { Float32BufferAttribute } from '../core/BufferAttribute.js';
// import { Vector3 } from '../math/Vector3.js';

// // BoxGeometry



// function BoxGeometry( width, height, depth, widthSegments, heightSegments, depthSegments ) {

// 	Geometry.call( this );

// 	this.type = 'BoxGeometry';

// 	this.parameters = {
// 		width: width,
// 		height: height,
// 		depth: depth,
// 		widthSegments: widthSegments,
// 		heightSegments: heightSegments,
// 		depthSegments: depthSegments
// 	};

// 	this.fromBufferGeometry( new BoxBufferGeometry( width, height, depth, widthSegments, heightSegments, depthSegments ) );
// 	this.mergeVertices();

// }

// BoxGeometry.prototype = Object.create( Geometry.prototype );
// BoxGeometry.prototype.constructor = BoxGeometry;

// // BoxBufferGeometry

// function BoxBufferGeometry( width, height, depth, widthSegments, heightSegments, depthSegments ) {

// 	BufferGeometry.call( this );

// 	this.type = 'BoxBufferGeometry';

// 	this.parameters = {
// 		width: width,
// 		height: height,
// 		depth: depth,
// 		widthSegments: widthSegments,
// 		heightSegments: heightSegments,
// 		depthSegments: depthSegments
// 	};

// 	var scope = this;

// 	width = width || 1;
// 	height = height || 1;
// 	depth = depth || 1;

// 	// segments

// 	widthSegments = Math.floor( widthSegments ) || 1;
// 	heightSegments = Math.floor( heightSegments ) || 1;
// 	depthSegments = Math.floor( depthSegments ) || 1;

// 	// buffers

// 	var indices = [];
// 	var vertices = [];
// 	var normals = [];
// 	var uvs = [];

// 	// helper variables

// 	var numberOfVertices = 0;
// 	var groupStart = 0;

// 	// build each side of the box geometry

// 	buildPlane( 'z', 'y', 'x', - 1, - 1, depth, height, width, depthSegments, heightSegments, 0 ); // px
// 	buildPlane( 'z', 'y', 'x', 1, - 1, depth, height, - width, depthSegments, heightSegments, 1 ); // nx
// 	buildPlane( 'x', 'z', 'y', 1, 1, width, depth, height, widthSegments, depthSegments, 2 ); // py
// 	buildPlane( 'x', 'z', 'y', 1, - 1, width, depth, - height, widthSegments, depthSegments, 3 ); // ny
// 	buildPlane( 'x', 'y', 'z', 1, - 1, width, height, depth, widthSegments, heightSegments, 4 ); // pz
// 	buildPlane( 'x', 'y', 'z', - 1, - 1, width, height, - depth, widthSegments, heightSegments, 5 ); // nz

// 	// build geometry

// 	this.setIndex( indices );
// 	this.addAttribute( 'position', new Float32BufferAttribute( vertices, 3 ) );
// 	this.addAttribute( 'normal', new Float32BufferAttribute( normals, 3 ) );
// 	this.addAttribute( 'uv', new Float32BufferAttribute( uvs, 2 ) );

// 	function buildPlane( u, v, w, udir, vdir, width, height, depth, gridX, gridY, materialIndex ) {

// 		var segmentWidth = width / gridX;
// 		var segmentHeight = height / gridY;

// 		var widthHalf = width / 2;
// 		var heightHalf = height / 2;
// 		var depthHalf = depth / 2;

// 		var gridX1 = gridX + 1;
// 		var gridY1 = gridY + 1;

// 		var vertexCounter = 0;
// 		var groupCount = 0;

// 		var ix, iy;

// 		var vector = new Vector3();

// 		// generate vertices, normals and uvs

// 		for ( iy = 0; iy < gridY1; iy ++ ) {

// 			var y = iy * segmentHeight - heightHalf;

// 			for ( ix = 0; ix < gridX1; ix ++ ) {

// 				var x = ix * segmentWidth - widthHalf;

// 				// set values to correct vector component

// 				vector[ u ] = x * udir;
// 				vector[ v ] = y * vdir;
// 				vector[ w ] = depthHalf;

// 				// now apply vector to vertex buffer

// 				vertices.push( vector.x, vector.y, vector.z );

// 				// set values to correct vector component

// 				vector[ u ] = 0;
// 				vector[ v ] = 0;
// 				vector[ w ] = depth > 0 ? 1 : - 1;

// 				// now apply vector to normal buffer

// 				normals.push( vector.x, vector.y, vector.z );

// 				// uvs

// 				uvs.push( ix / gridX );
// 				uvs.push( 1 - ( iy / gridY ) );

// 				// counters

// 				vertexCounter += 1;

// 			}

// 		}

// 		// indices

// 		// 1. you need Speed3D indices to draw a single face
// 		// 2. a single segment consists of two faces
// 		// 3. so we need to generate six (2*3) indices per segment

// 		for ( iy = 0; iy < gridY; iy ++ ) {

// 			for ( ix = 0; ix < gridX; ix ++ ) {

// 				var a = numberOfVertices + ix + gridX1 * iy;
// 				var b = numberOfVertices + ix + gridX1 * ( iy + 1 );
// 				var c = numberOfVertices + ( ix + 1 ) + gridX1 * ( iy + 1 );
// 				var d = numberOfVertices + ( ix + 1 ) + gridX1 * iy;

// 				// faces

// 				indices.push( a, b, d );
// 				indices.push( b, c, d );

// 				// increase counter

// 				groupCount += 6;

// 			}

// 		}

// 		// add a group to the geometry. this will ensure multi material support

// 		scope.addGroup( groupStart, groupCount, materialIndex );

// 		// calculate new start value for groups

// 		groupStart += groupCount;

// 		// update total number of vertices

// 		numberOfVertices += vertexCounter;

// 	}

// }

// BoxBufferGeometry.prototype = Object.create( BufferGeometry.prototype );
// BoxBufferGeometry.prototype.constructor = BoxBufferGeometry;


// export { BoxGeometry, BoxBufferGeometry };


/**
 * @author wangzhidong
 * @modified by gby
 * @modify date 2018-7-11
 */

import { Geometry } from '../Core/Geometry.js';
import { BufferGeometry } from '../Core/BufferGeometry.js';
import { Float32BufferAttribute } from '../Core/BufferAttribute.js';
import { Vector3 } from '../Datum/Math/Vector3.js';

// BoxGeometry
class BoxGeometry extends Geometry{
   constructor(width, height, depth, widthSegments, heightSegments, depthSegments){
	super()
	this.type = 'BoxGeometry';
	this.parameters = {
		width:width,
		height:height,
		depth: depth,
		widthSegments: widthSegments,
		heightSegments: heightSegments,
		depthSegments: depthSegments
	};
	this.width=width
	this.height=height,
	this.depth=depth,
	this.widthSegments=widthSegments,
	this.heightSegments=heightSegments,
	this.depthSegments=depthSegments

	this.fromBufferGeometry( new BoxBufferGeometry( this.width, this.height, this.depth, this.widthSegments, this.heightSegments, this.depthSegments ) );
	this.mergeVertices();
   }
}




class BoxBufferGeometry extends BufferGeometry{
    constructor(width=1, height=1, depth=1, widthSegments=1, heightSegments=1, depthSegments=1){
	   super()
	   this.type = 'BoxBufferGeometry';
	   this.parameters = {
		width: width,
		height: height,
		depth: depth,
		widthSegments: Math.floor( widthSegments ) || 1,
		heightSegments: Math.floor( heightSegments ) || 1,
		depthSegments: Math.floor( depthSegments ) || 1
	   };
	   this.width=width,
	   this.height=height,
	   this.depth=depth,
	   this.widthSegments = Math.floor( widthSegments ) || 1,
	   this.heightSegments = Math.floor( heightSegments ) || 1,
	   this.depthSegments = Math.floor( depthSegments ) || 1,
	   this.indices = [];
	   this.vertices = [];
	   this.normals = [];
	   this.uvs = [];
   
	   // helper variables
   
	   this.numberOfVertices = 0;
	   this.groupStart = 0;
	   this._init()

	}
	_init(){

		this.buildPlane( 'z', 'y', 'x', - 1, - 1, this.depth, this.height, this.width, this.depthSegments, this.heightSegments, 0 ); // px
		this.buildPlane( 'z', 'y', 'x', 1, - 1, this.depth, this.height, - this.width, this.depthSegments, this.heightSegments, 1 ); // nx
		this.buildPlane( 'x', 'z', 'y', 1, 1, this.width, this.depth, this.height, this.widthSegments, this.depthSegments, 2 ); // py
		this.buildPlane( 'x', 'z', 'y', 1, - 1, this.width, this.depth, - this.height, this.widthSegments, this.depthSegments, 3 ); // ny
		this.buildPlane( 'x', 'y', 'z', 1, - 1, this.width, this.height, this.depth, this.widthSegments, this.heightSegments, 4 ); // pz
		this.buildPlane( 'x', 'y', 'z', - 1, - 1, this.width, this.height, - this.depth, this.widthSegments, this.heightSegments, 5 ); // nz

	// build geometry

		this.setIndex( this.indices );
		this.addAttribute( 'position', new Float32BufferAttribute( this.vertices, 3 ) );
		this.addAttribute( 'normal', new Float32BufferAttribute( this.normals, 3 ) );
		this.addAttribute( 'uv', new Float32BufferAttribute( this.uvs, 2 ) );

	}

	buildPlane( u, v, w, udir, vdir, width, height, depth, gridX, gridY, materialIndex ) {

		let segmentWidth = width / gridX;
		let segmentHeight = height / gridY;

		let widthHalf = width / 2;
		let heightHalf = height / 2;
		let depthHalf = depth / 2;

		let gridX1 = gridX + 1;
		let gridY1 = gridY + 1;

		let vertexCounter = 0;
		let groupCount = 0;

		let ix, iy;

		let vector = new Vector3();

		// generate vertices, normals and uvs

		for ( iy = 0; iy < gridY1; iy ++ ) {

			let y = iy * segmentHeight - heightHalf;

			for ( ix = 0; ix < gridX1; ix ++ ) {

				let x = ix * segmentWidth - widthHalf;

				// set values to correct vector component

				vector[ u ] = x * udir;
				vector[ v ] = y * vdir;
				vector[ w ] = depthHalf;

				// now apply vector to vertex buffer

				this.vertices.push( vector.x, vector.y, vector.z );

				// set values to correct vector component

				vector[ u ] = 0;
				vector[ v ] = 0;
				vector[ w ] = depth > 0 ? 1 : - 1;

				// now apply vector to normal buffer

				this.normals.push( vector.x, vector.y, vector.z );

				// uvs

				this.uvs.push( ix / gridX );
				this.uvs.push( 1 - ( iy / gridY ) );

				// counters

				vertexCounter += 1;

			}

		}

		// indices

		// 1. you need Speed3D indices to draw a single face
		// 2. a single segment consists of two faces
		// 3. so we need to generate six (2*3) indices per segment

		for ( iy = 0; iy < gridY; iy ++ ) {

			for ( ix = 0; ix < gridX; ix ++ ) {

				let a = this.numberOfVertices + ix + gridX1 * iy;
				let b = this.numberOfVertices + ix + gridX1 * ( iy + 1 );
				let c = this.numberOfVertices + ( ix + 1 ) + gridX1 * ( iy + 1 );
				let d = this.numberOfVertices + ( ix + 1 ) + gridX1 * iy;

				// faces

				this.indices.push( a, b, d );
				this.indices.push( b, c, d );

				// increase counter

				this.groupCount += 6;

			}

		}

		// add a group to the geometry. this will ensure multi material support

		this.addGroup( this.groupStart, this.groupCount, this.materialIndex );

		// calculate new start value for groups

		this.groupStart += this.groupCount;

		// update total number of vertices

		this.numberOfVertices += vertexCounter;
	}








}
export { BoxGeometry, BoxBufferGeometry };