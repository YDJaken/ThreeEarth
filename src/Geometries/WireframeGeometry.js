/*import { BufferGeometry } from '../core/BufferGeometry.js';
import { Float32BufferAttribute } from '../core/BufferAttribute.js';
import { Vector3 } from '../math/Vector3.js';

function WireframeGeometry( geometry ) {

	BufferGeometry.call( this );

	this.type = 'WireframeGeometry';

	// buffer

	var vertices = [];

	// helper variables

	var i, j, l, o, ol;
	var edge = [ 0, 0 ], edges = {}, e, edge1, edge2;
	var key, keys = [ 'a', 'b', 'c' ];
	var vertex;

	// different logic for Geometry and BufferGeometry

	if ( geometry && geometry.isGeometry ) {

		// create a data structure that contains all edges without duplicates

		var faces = geometry.faces;

		for ( i = 0, l = faces.length; i < l; i ++ ) {

			var face = faces[ i ];

			for ( j = 0; j < 3; j ++ ) {

				edge1 = face[ keys[ j ] ];
				edge2 = face[ keys[ ( j + 1 ) % 3 ] ];
				edge[ 0 ] = Math.min( edge1, edge2 ); // sorting prevents duplicates
				edge[ 1 ] = Math.max( edge1, edge2 );

				key = edge[ 0 ] + ',' + edge[ 1 ];

				if ( edges[ key ] === undefined ) {

					edges[ key ] = { index1: edge[ 0 ], index2: edge[ 1 ] };

				}

			}

		}

		// generate vertices

		for ( key in edges ) {

			e = edges[ key ];

			vertex = geometry.vertices[ e.index1 ];
			vertices.push( vertex.x, vertex.y, vertex.z );

			vertex = geometry.vertices[ e.index2 ];
			vertices.push( vertex.x, vertex.y, vertex.z );

		}

	} else if ( geometry && geometry.isBufferGeometry ) {

		var position, indices, groups;
		var group, start, count;
		var index1, index2;

		vertex = new Vector3();

		if ( geometry.index !== null ) {

			// indexed BufferGeometry

			position = geometry.attributes.position;
			indices = geometry.index;
			groups = geometry.groups;

			if ( groups.length === 0 ) {

				groups = [ { start: 0, count: indices.count, materialIndex: 0 } ];

			}

			// create a data structure that contains all eges without duplicates

			for ( o = 0, ol = groups.length; o < ol; ++ o ) {

				group = groups[ o ];

				start = group.start;
				count = group.count;

				for ( i = start, l = ( start + count ); i < l; i += 3 ) {

					for ( j = 0; j < 3; j ++ ) {

						edge1 = indices.getX( i + j );
						edge2 = indices.getX( i + ( j + 1 ) % 3 );
						edge[ 0 ] = Math.min( edge1, edge2 ); // sorting prevents duplicates
						edge[ 1 ] = Math.max( edge1, edge2 );

						key = edge[ 0 ] + ',' + edge[ 1 ];

						if ( edges[ key ] === undefined ) {

							edges[ key ] = { index1: edge[ 0 ], index2: edge[ 1 ] };

						}

					}

				}

			}

			// generate vertices

			for ( key in edges ) {

				e = edges[ key ];

				vertex.fromBufferAttribute( position, e.index1 );
				vertices.push( vertex.x, vertex.y, vertex.z );

				vertex.fromBufferAttribute( position, e.index2 );
				vertices.push( vertex.x, vertex.y, vertex.z );

			}

		} else {

			// non-indexed BufferGeometry

			position = geometry.attributes.position;

			for ( i = 0, l = ( position.count / 3 ); i < l; i ++ ) {

				for ( j = 0; j < 3; j ++ ) {

					// Speed3D edges per triangle, an edge is represented as (index1, index2)
					// e.g. the first triangle has the following edges: (0,1),(1,2),(2,0)

					index1 = 3 * i + j;
					vertex.fromBufferAttribute( position, index1 );
					vertices.push( vertex.x, vertex.y, vertex.z );

					index2 = 3 * i + ( ( j + 1 ) % 3 );
					vertex.fromBufferAttribute( position, index2 );
					vertices.push( vertex.x, vertex.y, vertex.z );

				}

			}

		}

	}

	// build geometry

	this.addAttribute( 'position', new Float32BufferAttribute( vertices, 3 ) );

}

WireframeGeometry.prototype = Object.create( BufferGeometry.prototype );
WireframeGeometry.prototype.constructor = WireframeGeometry;


export { WireframeGeometry };*/


/**
 * @author wangzhidong
 * @modified by gby
 * @modify date 2018-7-11
 */

import { BufferGeometry } from '../Core/BufferGeometry.js';
import { Float32BufferAttribute } from '../Core/BufferAttribute.js';
import { Vector3 } from '../Datum/Math/Vector3.js';




class WireframeGeometry extends BufferGeometry{
	constructor(geometry){
		super()
		this.type = 'WireframeGeometry';
		// buffer
		this.vertices = [];
		// helper variables
		this.i, this.j, this.l, this.o, this.ol;
		this.edge = [ 0, 0 ], this.edges = {}, this.e, this.edge1, this.edge2;
		this.key, this.keys = [ 'a', 'b', 'c' ];
		this.vertex;
		this.geometry = geometry
		this._init()
   }
   _init(){
		// different logic for Geometry and BufferGeometry

		if (this.geometry && this.geometry.isGeometry ) {

			// create a data structure that contains all edges without duplicates

			let faces = this.geometry.faces;

			for ( this.i = 0, this.l = faces.length; this.i < this.l; this.i ++ ) {

				let face = faces[ this.i ];

				for ( this.j = 0; this.j < 3; this.j ++ ) {

					this.edge1 = face[ this.keys[ this.j ] ];
					this.edge2 = face[ this.keys[ ( this.j + 1 ) % 3 ] ];
					this.edge[ 0 ] = Math.min( this.edge1, this.edge2 ); // sorting prevents duplicates
					this.edge[ 1 ] = Math.max( this.edge1, this.edge2 );

					this.key = this.edge[ 0 ] + ',' + this.edge[ 1 ];

					if ( this.edges[ this.key ] === undefined ) {

						this.edges[ this.key ] = { index1: this.edge[ 0 ], index2: this.edge[ 1 ] };

					}

				}

			}

			// generate vertices

			for ( this.key in this.edges ) {

				this.e = this.edges[ this.key ];

				this.vertex = this.geometry.vertices[ this.e.index1 ];
				this.vertices.push( this.vertex.x, this.vertex.y, this.vertex.z );

				this.vertex = this.geometry.vertices[ this.e.index2 ];
				this.vertices.push( this.vertex.x, this.vertex.y, this.vertex.z );

			}

		} else if ( this.geometry && this.geometry.isBufferGeometry ) {

			let position, indices, groups;
			let group, start, count;
			let index1, index2;

			this.vertex = new Vector3();

			if ( this.geometry.index !== null ) {

				// indexed BufferGeometry

				position = this.geometry.attributes.position;
				indices = this.geometry.index;
				groups = this.geometry.groups;

				if ( groups.length === 0 ) {

					groups = [ { start: 0, count: indices.count, materialIndex: 0 } ];

				}

				// create a data structure that contains all eges without duplicates

				for ( this.o = 0, this.ol = groups.length; this.o < this.ol; ++ this.o ) {

					group = groups[ this.o ];

					start = group.start;
					count = group.count;

					for ( this.i = start, this.l = ( start + count ); this.i < this.l; this.i += 3 ) {

						for ( this.j = 0; this.j < 3; this.j ++ ) {

							this.edge1 = this.indices.getX( this.i + this.j );
							this.edge2 = this.indices.getX( this.i + ( this.j + 1 ) % 3 );
							this.edge[ 0 ] = Math.min( this.edge1, this.edge2 ); // sorting prevents duplicates
							this.edge[ 1 ] = Math.max( this.edge1, this.edge2 );

							this.key = this.edge[ 0 ] + ',' + this.edge[ 1 ];

							if ( this.edges[ this.key ] === undefined ) {

								this.edges[ this.key ] = { index1: this.edge[ 0 ], index2: this.edge[ 1 ] };

							}

						}

					}

				}

				// generate vertices

				for ( key in this.edges ) {

					this.e = this.edges[ key ];

					this.vertex.fromBufferAttribute( position, this.e.index1 );
					this.vertices.push( this.vertex.x, this.vertex.y, this.vertex.z );

					this.vertex.fromBufferAttribute( position, this.e.index2 );
					this.vertices.push( this.vertex.x, this.vertex.y, this.vertex.z );

				}

			} else {

				// non-indexed BufferGeometry

				position = this.geometry.attributes.position;

				for ( this.i = 0, this.l = ( position.count / 3 ); this.i < this.l; this.i ++ ) {

					for ( this.j = 0; this.j < 3; this.j ++ ) {

						// Speed3D edges per triangle, an edge is represented as (index1, index2)
						// e.g. the first triangle has the following edges: (0,1),(1,2),(2,0)

						index1 = 3 * i + j;
						this.vertex.fromBufferAttribute( position, index1 );
						this.vertices.push( this.vertex.x, this.vertex.y, this.vertex.z );

						index2 = 3 * i + ( ( j + 1 ) % 3 );
						this.vertex.fromBufferAttribute( position, index2 );
						this.vertices.push( this.vertex.x, this.vertex.y, this.vertex.z );

					}

				}

			}

		}

					// build geometry

				this.addAttribute( 'position', new Float32BufferAttribute( this.vertices, 3 ) );
		}   

}

export { WireframeGeometry };
