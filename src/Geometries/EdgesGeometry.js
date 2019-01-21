/*import { BufferGeometry } from '../core/BufferGeometry.js';
import { Float32BufferAttribute } from '../core/BufferAttribute.js';
import { Geometry } from '../core/Geometry.js';
import { _Math } from '../math/Math.js';

function EdgesGeometry( geometry, thresholdAngle ) {

	BufferGeometry.call( this );

	this.type = 'EdgesGeometry';

	this.parameters = {
		thresholdAngle: thresholdAngle
	};

	thresholdAngle = ( thresholdAngle !== undefined ) ? thresholdAngle : 1;

	// buffer

	var vertices = [];

	// helper variables

	var thresholdDot = Math.cos( _Math.DEG2RAD() * thresholdAngle );
	var edge = [ 0, 0 ], edges = {}, edge1, edge2;
	var key, keys = [ 'a', 'b', 'c' ];

	// prepare source geometry

	var geometry2;

	if ( geometry.isBufferGeometry ) {

		geometry2 = new Geometry();
		geometry2.fromBufferGeometry( geometry );

	} else {

		geometry2 = geometry.clone();

	}

	geometry2.mergeVertices();
	geometry2.computeFaceNormals();

	var sourceVertices = geometry2.vertices;
	var faces = geometry2.faces;

	// now create a data structure where each entry represents an edge with its adjoining faces

	for ( var i = 0, l = faces.length; i < l; i ++ ) {

		var face = faces[ i ];

		for ( var j = 0; j < 3; j ++ ) {

			edge1 = face[ keys[ j ] ];
			edge2 = face[ keys[ ( j + 1 ) % 3 ] ];
			edge[ 0 ] = Math.min( edge1, edge2 );
			edge[ 1 ] = Math.max( edge1, edge2 );

			key = edge[ 0 ] + ',' + edge[ 1 ];

			if ( edges[ key ] === undefined ) {

				edges[ key ] = { index1: edge[ 0 ], index2: edge[ 1 ], face1: i, face2: undefined };

			} else {

				edges[ key ].face2 = i;

			}

		}

	}

	// generate vertices

	for ( key in edges ) {

		var e = edges[ key ];

		// an edge is only rendered if the angle (in degrees) between the face normals of the adjoining faces exceeds this value. default = 1 degree.

		if ( e.face2 === undefined || faces[ e.face1 ].normal.dot( faces[ e.face2 ].normal ) <= thresholdDot ) {

			var vertex = sourceVertices[ e.index1 ];
			vertices.push( vertex.x, vertex.y, vertex.z );

			vertex = sourceVertices[ e.index2 ];
			vertices.push( vertex.x, vertex.y, vertex.z );

		}

	}

	// build geometry

	this.addAttribute( 'position', new Float32BufferAttribute( vertices, 3 ) );

}

EdgesGeometry.prototype = Object.create( BufferGeometry.prototype );
EdgesGeometry.prototype.constructor = EdgesGeometry;


export { EdgesGeometry };*/
/**
 * @author wangzhidong
 * @modified by gby
 * @modify date 2018-7-11
 */

import { BufferGeometry } from '../Core/BufferGeometry.js';
import { Float32BufferAttribute } from '../Core/BufferAttribute.js';
import { Geometry } from '../Core/Geometry.js';
import { _Math } from '../Datum/Math/Math.js';

class EdgesGeometry extends BufferGeometry{
    constructor(geometry, thresholdAngle ){
		super()
		this.type = 'EdgesGeometry';
		this.parameters = {
			thresholdAngle: thresholdAngle = ( thresholdAngle !== undefined ) ? thresholdAngle : 1
		};
		this.geometry = geometry
		this.thresholdAngle = thresholdAngle = ( thresholdAngle !== undefined ) ? thresholdAngle : 1
		this.vertices = []
        this.thresholdDot = Math.cos( _Math.DEG2RAD() * thresholdAngle );
		this.edge = [ 0, 0 ]
		this.edges = {}
		this.edge1
		this.edge2
		this.key
		this.keys = [ 'a', 'b', 'c' ];
		this.geometry2
		this._init()
	}
	_init(){
		if ( this.geometry.isBufferGeometry ) {

			this.geometry2 = new Geometry();
			this.geometry2.fromBufferGeometry( this.geometry );
	
		} else {
	
			this.geometry2 = this.geometry.clone();
	
		}
	
		this.geometry2.mergeVertices();
		this.geometry2.computeFaceNormals();
	
		let sourceVertices = this.geometry2.vertices;
		let faces = this.geometry2.faces;
	
		// now create a data structure where each entry represents an edge with its adjoining faces
	
		for ( let i = 0, l = faces.length; i < l; i ++ ) {
	
			let face = faces[ i ];
	
			for ( let j = 0; j < 3; j ++ ) {
	
				this.edge1 = face[ keys[ j ] ];
				this.edge2 = face[ keys[ ( j + 1 ) % 3 ] ];
				this.edge[ 0 ] = Math.min( this.edge1, this.edge2 );
				this.edge[ 1 ] = Math.max( this.edge1, this.edge2 );
	
				this.key = this.edge[ 0 ] + ',' + this.edge[ 1 ];
	
				if ( this.edges[ this.key ] === undefined ) {
	
					this.edges[ this.key ] = { index1:this.edge[ 0 ], index2: this.edge[ 1 ], face1: i, face2: undefined };
	
				} else {
	
					this.edges[ this.key ].face2 = i;
	
				}
	
			}
	
		}
	
		// generate vertices
	
		for ( key in this.edges ) {
	
			let e = edges[ key ];
	
			// an edge is only rendered if the angle (in degrees) between the face normals of the adjoining faces exceeds this value. default = 1 degree.
	
			if ( e.face2 === undefined || faces[ e.face1 ].normal.dot( faces[ e.face2 ].normal ) <= this.thresholdDot ) {
	
				let vertex = sourceVertices[ e.index1 ];
				this.vertices.push( vertex.x, vertex.y, vertex.z );
	
				vertex = sourceVertices[ e.index2 ];
				this.vertices.push( vertex.x, vertex.y, vertex.z );
	
			}
	
		}
	
		// build geometry
	
		this.addAttribute( 'position', new Float32BufferAttribute( this.vertices, 3 ) );
	}

}

export { EdgesGeometry };
