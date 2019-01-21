/*import { Geometry } from '../core/Geometry.js';
import { BufferGeometry } from '../core/BufferGeometry.js';
import { Float32BufferAttribute } from '../core/BufferAttribute.js';
import { Vector3 } from '../math/Vector3.js';
import { Vector2 } from '../math/Vector2.js';

// PolyhedronGeometry

function PolyhedronGeometry( vertices, indices, radius, detail ) {

	Geometry.call( this );

	this.type = 'PolyhedronGeometry';

	this.parameters = {
		vertices: vertices,
		indices: indices,
		radius: radius,
		detail: detail
	};

	this.fromBufferGeometry( new PolyhedronBufferGeometry( vertices, indices, radius, detail ) );
	this.mergeVertices();

}

PolyhedronGeometry.prototype = Object.create( Geometry.prototype );
PolyhedronGeometry.prototype.constructor = PolyhedronGeometry;

// PolyhedronBufferGeometry

function PolyhedronBufferGeometry( vertices, indices, radius, detail ) {

	BufferGeometry.call( this );

	this.type = 'PolyhedronBufferGeometry';

	this.parameters = {
		vertices: vertices,
		indices: indices,
		radius: radius,
		detail: detail
	};

	radius = radius || 1;
	detail = detail || 0;

	// default buffer data

	var vertexBuffer = [];
	var uvBuffer = [];

	// the subdivision creates the vertex buffer data

	subdivide( detail );

	// all vertices should lie on a conceptual sphere with a given radius

	appplyRadius( radius );

	// finally, create the uv data

	generateUVs();

	// build non-indexed geometry

	this.addAttribute( 'position', new Float32BufferAttribute( vertexBuffer, 3 ) );
	this.addAttribute( 'normal', new Float32BufferAttribute( vertexBuffer.slice(), 3 ) );
	this.addAttribute( 'uv', new Float32BufferAttribute( uvBuffer, 2 ) );

	if ( detail === 0 ) {

		this.computeVertexNormals(); // flat normals

	} else {

		this.normalizeNormals(); // smooth normals

	}

	// helper functions

	function subdivide( detail ) {

		var a = new Vector3();
		var b = new Vector3();
		var c = new Vector3();

		// iterate over all faces and apply a subdivison with the given detail value

		for ( var i = 0; i < indices.length; i += 3 ) {

			// get the vertices of the face

			getVertexByIndex( indices[ i + 0 ], a );
			getVertexByIndex( indices[ i + 1 ], b );
			getVertexByIndex( indices[ i + 2 ], c );

			// perform subdivision

			subdivideFace( a, b, c, detail );

		}

	}

	function subdivideFace( a, b, c, detail ) {

		var cols = Math.pow( 2, detail );

		// we use this multidimensional array as a data structure for creating the subdivision

		var v = [];

		var i, j;

		// construct all of the vertices for this subdivision

		for ( i = 0; i <= cols; i ++ ) {

			v[ i ] = [];

			var aj = a.clone().lerp( c, i / cols );
			var bj = b.clone().lerp( c, i / cols );

			var rows = cols - i;

			for ( j = 0; j <= rows; j ++ ) {

				if ( j === 0 && i === cols ) {

					v[ i ][ j ] = aj;

				} else {

					v[ i ][ j ] = aj.clone().lerp( bj, j / rows );

				}

			}

		}

		// construct all of the faces

		for ( i = 0; i < cols; i ++ ) {

			for ( j = 0; j < 2 * ( cols - i ) - 1; j ++ ) {

				var k = Math.floor( j / 2 );

				if ( j % 2 === 0 ) {

					pushVertex( v[ i ][ k + 1 ] );
					pushVertex( v[ i + 1 ][ k ] );
					pushVertex( v[ i ][ k ] );

				} else {

					pushVertex( v[ i ][ k + 1 ] );
					pushVertex( v[ i + 1 ][ k + 1 ] );
					pushVertex( v[ i + 1 ][ k ] );

				}

			}

		}

	}

	function appplyRadius( radius ) {

		var vertex = new Vector3();

		// iterate over the entire buffer and apply the radius to each vertex

		for ( var i = 0; i < vertexBuffer.length; i += 3 ) {

			vertex.x = vertexBuffer[ i + 0 ];
			vertex.y = vertexBuffer[ i + 1 ];
			vertex.z = vertexBuffer[ i + 2 ];

			vertex.normalize().multiplyScalar( radius );

			vertexBuffer[ i + 0 ] = vertex.x;
			vertexBuffer[ i + 1 ] = vertex.y;
			vertexBuffer[ i + 2 ] = vertex.z;

		}

	}

	function generateUVs() {

		var vertex = new Vector3();

		for ( var i = 0; i < vertexBuffer.length; i += 3 ) {

			vertex.x = vertexBuffer[ i + 0 ];
			vertex.y = vertexBuffer[ i + 1 ];
			vertex.z = vertexBuffer[ i + 2 ];

			var u = azimuth( vertex ) / 2 / Math.PI + 0.5;
			var v = inclination( vertex ) / Math.PI + 0.5;
			uvBuffer.push( u, 1 - v );

		}

		correctUVs();

		correctSeam();

	}

	function correctSeam() {

		// handle case when face straddles the seam, see #3269

		for ( var i = 0; i < uvBuffer.length; i += 6 ) {

			// uv data of a single face

			var x0 = uvBuffer[ i + 0 ];
			var x1 = uvBuffer[ i + 2 ];
			var x2 = uvBuffer[ i + 4 ];

			var max = Math.max( x0, x1, x2 );
			var min = Math.min( x0, x1, x2 );

			// 0.9 is somewhat arbitrary

			if ( max > 0.9 && min < 0.1 ) {

				if ( x0 < 0.2 ) uvBuffer[ i + 0 ] += 1;
				if ( x1 < 0.2 ) uvBuffer[ i + 2 ] += 1;
				if ( x2 < 0.2 ) uvBuffer[ i + 4 ] += 1;

			}

		}

	}

	function pushVertex( vertex ) {

		vertexBuffer.push( vertex.x, vertex.y, vertex.z );

	}

	function getVertexByIndex( index, vertex ) {

		var stride = index * 3;

		vertex.x = vertices[ stride + 0 ];
		vertex.y = vertices[ stride + 1 ];
		vertex.z = vertices[ stride + 2 ];

	}

	function correctUVs() {

		var a = new Vector3();
		var b = new Vector3();
		var c = new Vector3();

		var centroid = new Vector3();

		var uvA = new Vector2();
		var uvB = new Vector2();
		var uvC = new Vector2();

		for ( var i = 0, j = 0; i < vertexBuffer.length; i += 9, j += 6 ) {

			a.set( vertexBuffer[ i + 0 ], vertexBuffer[ i + 1 ], vertexBuffer[ i + 2 ] );
			b.set( vertexBuffer[ i + 3 ], vertexBuffer[ i + 4 ], vertexBuffer[ i + 5 ] );
			c.set( vertexBuffer[ i + 6 ], vertexBuffer[ i + 7 ], vertexBuffer[ i + 8 ] );

			uvA.set( uvBuffer[ j + 0 ], uvBuffer[ j + 1 ] );
			uvB.set( uvBuffer[ j + 2 ], uvBuffer[ j + 3 ] );
			uvC.set( uvBuffer[ j + 4 ], uvBuffer[ j + 5 ] );

			centroid.copy( a ).add( b ).add( c ).divideScalar( 3 );

			var azi = azimuth( centroid );

			correctUV( uvA, j + 0, a, azi );
			correctUV( uvB, j + 2, b, azi );
			correctUV( uvC, j + 4, c, azi );

		}

	}

	function correctUV( uv, stride, vector, azimuth ) {

		if ( ( azimuth < 0 ) && ( uv.x === 1 ) ) {

			uvBuffer[ stride ] = uv.x - 1;

		}

		if ( ( vector.x === 0 ) && ( vector.z === 0 ) ) {

			uvBuffer[ stride ] = azimuth / 2 / Math.PI + 0.5;

		}

	}

	// Angle around the Y axis, counter-clockwise when looking from above.

	function azimuth( vector ) {

		return Math.atan2( vector.z, - vector.x );

	}


	// Angle above the XZ plane.

	function inclination( vector ) {

		return Math.atan2( - vector.y, Math.sqrt( ( vector.x * vector.x ) + ( vector.z * vector.z ) ) );

	}

}

PolyhedronBufferGeometry.prototype = Object.create( BufferGeometry.prototype );
PolyhedronBufferGeometry.prototype.constructor = PolyhedronBufferGeometry;


export { PolyhedronGeometry, PolyhedronBufferGeometry };*/


/**
 * @author wangzhidong
 * @modified by gby
 * @modify date 2018-7-12
 */




import { Geometry } from '../Core/Geometry.js';
import { BufferGeometry } from '../Core/BufferGeometry.js';
import { Float32BufferAttribute } from '../Core/BufferAttribute.js';
import { Vector3 } from '../Datum/Math/Vector3.js';
import { Vector2 } from '../Datum/Math/Vector2.js';

// PolyhedronGeometry

class PolyhedronGeometry extends Geometry{

	constructor(vertices, indices, radius, detail){
		super()
		this.type = 'PolyhedronGeometry';
		this.parameters = {
			vertices: vertices,
			indices: indices,
			radius: radius,
			detail: detail
		};
		this.vertices=vertices,
		this.indices=indices,
		this.radius=radius,
		this.detail=detail
		this._init()
   }
   _init(){
		this.fromBufferGeometry( new PolyhedronBufferGeometry( this.vertices, this.indices, this.radius, this.detail ) );
		this.mergeVertices();
   }   

}

class PolyhedronBufferGeometry extends BufferGeometry{

	constructor(vertices, indices, radius, detail){
		super()
		this.type = 'PolyhedronBufferGeometry';
		this.parameters = {
			vertices: vertices,
			indices: indices,
			radius: radius,
			detail: detail
		};
		this.vertices = vertices;
		this.indices = indices;
		this.radius = radius;
		this.detail = detail;
		this.vertexBuffer = [];
		this.uvBuffer = [];
		this._init()
   }
   _init(){
		// the subdivision creates the vertex buffer data

		this.subdivide( this.detail );

		// all vertices should lie on a conceptual sphere with a given radius

		this.appplyRadius( this.radius );

		// finally, create the uv data

		this.generateUVs();

		// build non-indexed geometry

		this.addAttribute( 'position', new Float32BufferAttribute( this.vertexBuffer, 3 ) );
		this.addAttribute( 'normal', new Float32BufferAttribute( this.vertexBuffer.slice(), 3 ) );
		this.addAttribute( 'uv', new Float32BufferAttribute( this.uvBuffer, 2 ) );

		if ( this.detail === 0 ) {

			this.computeVertexNormals(); // flat normals

		} else {

			this.normalizeNormals(); // smooth normals

		}
   }   
   // helper functions

	subdivide( detail ) {

		let a = new Vector3();
		let b = new Vector3();
		let c = new Vector3();

		// iterate over all faces and apply a subdivison with the given detail value

		for ( let i = 0; i < this.indices.length; i += 3 ) {

			// get the vertices of the face

			this.getVertexByIndex( this.indices[ i + 0 ], a );
			this.getVertexByIndex( this.indices[ i + 1 ], b );
			this.getVertexByIndex( this.indices[ i + 2 ], c );

			// perform subdivision

			this.subdivideFace( a, b, c, detail );

		}

	}
	subdivideFace( a, b, c, detail ) {

		let cols = Math.pow( 2, detail );

		// we use this multidimensional array as a data structure for creating the subdivision

		let v = [];

		let i; 
		let j;

		// construct all of the vertices for this subdivision

		for ( i = 0; i <= cols; i ++ ) {

			v[ i ] = [];

			let aj = a.clone().lerp( c, i / cols );
			let bj = b.clone().lerp( c, i / cols );

			let rows = cols - i;

			for ( j = 0; j <= rows; j ++ ) {

				if ( j === 0 && i === cols ) {

					v[ i ][ j ] = aj;

				} else {

					v[ i ][ j ] = aj.clone().lerp( bj, j / rows );

				}

			}

		}

		// construct all of the faces

		for ( i = 0; i < cols; i ++ ) {

			for ( j = 0; j < 2 * ( cols - i ) - 1; j ++ ) {

				let k = Math.floor( j / 2 );

				if ( j % 2 === 0 ) {

					this.pushVertex( v[ i ][ k + 1 ] );
					this.pushVertex( v[ i + 1 ][ k ] );
					this.pushVertex( v[ i ][ k ] );

				} else {

					this.pushVertex( v[ i ][ k + 1 ] );
					this.pushVertex( v[ i + 1 ][ k + 1 ] );
					this.pushVertex( v[ i + 1 ][ k ] );

				}

			}

		}

	}
	appplyRadius( radius ) {

		let vertex = new Vector3();

		// iterate over the entire buffer and apply the radius to each vertex

		for ( let i = 0; i < this.vertexBuffer.length; i += 3 ) {

			vertex.x = this.vertexBuffer[ i + 0 ];
			vertex.y = this.vertexBuffer[ i + 1 ];
			vertex.z = this.vertexBuffer[ i + 2 ];

			vertex.normalize().multiplyScalar( radius );

			this.vertexBuffer[ i + 0 ] = vertex.x;
			this.vertexBuffer[ i + 1 ] = vertex.y;
			this.vertexBuffer[ i + 2 ] = vertex.z;

		}

	}
	generateUVs() {

		let vertex = new Vector3();

		for ( let i = 0; i < this.vertexBuffer.length; i += 3 ) {

			vertex.x = this.vertexBuffer[ i + 0 ];
			vertex.y = this.vertexBuffer[ i + 1 ];
			vertex.z = this.vertexBuffer[ i + 2 ];

			let u = azimuth( vertex ) / 2 / Math.PI + 0.5;
			let v = inclination( vertex ) / Math.PI + 0.5;
			this.uvBuffer.push( u, 1 - v );

		}

		this.correctUVs();

		this.correctSeam();

	}
	correctSeam() {

		// handle case when face straddles the seam, see #3269

		for ( let i = 0; i < this.uvBuffer.length; i += 6 ) {

			// uv data of a single face

			let x0 = this.uvBuffer[ i + 0 ];
			let x1 = this.uvBuffer[ i + 2 ];
			let x2 = this.uvBuffer[ i + 4 ];

			let max = Math.max( x0, x1, x2 );
			let min = Math.min( x0, x1, x2 );

			// 0.9 is somewhat arbitrary

			if ( max > 0.9 && min < 0.1 ) {

				if ( x0 < 0.2 ) this.uvBuffer[ i + 0 ] += 1;
				if ( x1 < 0.2 ) this.uvBuffer[ i + 2 ] += 1;
				if ( x2 < 0.2 ) this.uvBuffer[ i + 4 ] += 1;

			}

		}

	}
	pushVertex( vertex ) {

		this.vertexBuffer.push( vertex.x, vertex.y, vertex.z );

	}
	getVertexByIndex( index, vertex ) {

		let stride = index * 3;

		vertex.x = this.vertices[ stride + 0 ];
		vertex.y = this.vertices[ stride + 1 ];
		vertex.z = this.vertices[ stride + 2 ];

	}
	correctUVs() {

		let a = new Vector3();
		let b = new Vector3();
		let c = new Vector3();

		let centroid = new Vector3();

		let uvA = new Vector2();
		let uvB = new Vector2();
		let uvC = new Vector2();

		for ( let i = 0, j = 0; i < this.vertexBuffer.length; i += 9, j += 6 ) {

			a.set( this.vertexBuffer[ i + 0 ], this.vertexBuffer[ i + 1 ], this.vertexBuffer[ i + 2 ] );
			b.set( this.vertexBuffer[ i + 3 ], this.vertexBuffer[ i + 4 ], this.vertexBuffer[ i + 5 ] );
			c.set( this.vertexBuffer[ i + 6 ], this.vertexBuffer[ i + 7 ], this.vertexBuffer[ i + 8 ] );

			uvA.set( this.uvBuffer[ j + 0 ], this.uvBuffer[ j + 1 ] );
			uvB.set( this.uvBuffer[ j + 2 ], this.uvBuffer[ j + 3 ] );
			uvC.set( this.uvBuffer[ j + 4 ], this.uvBuffer[ j + 5 ] );

			centroid.copy( a ).add( b ).add( c ).divideScalar( 3 );

			let azi = azimuth( centroid );

			correctUV( uvA, j + 0, a, azi );
			correctUV( uvB, j + 2, b, azi );
			correctUV( uvC, j + 4, c, azi );

		}

	}
	correctUV( uv, stride, vector, azimuth ) {

		if ( ( azimuth < 0 ) && ( uv.x === 1 ) ) {

			this.uvBuffer[ stride ] = uv.x - 1;

		}

		if ( ( vector.x === 0 ) && ( vector.z === 0 ) ) {

			this.uvBuffer[ stride ] = azimuth / 2 / Math.PI + 0.5;

		}

	}
	azimuth( vector ) {

		return Math.atan2( vector.z, - vector.x );

	}
	inclination( vector ) {

		return Math.atan2( - vector.y, Math.sqrt( ( vector.x * vector.x ) + ( vector.z * vector.z ) ) );

	}

}


export { PolyhedronGeometry, PolyhedronBufferGeometry };
