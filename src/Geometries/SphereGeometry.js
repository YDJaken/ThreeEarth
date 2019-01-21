// SphereGeometry
/*
function SphereGeometry( radius, widthSegments, heightSegments, phiStart, phiLength, thetaStart, thetaLength ) {

	Geometry.call( this );

	this.type = 'SphereGeometry';

	this.parameters = {
		radius: radius,
		widthSegments: widthSegments,
		heightSegments: heightSegments,
		phiStart: phiStart,
		phiLength: phiLength,
		thetaStart: thetaStart,
		thetaLength: thetaLength
	};

	this.fromBufferGeometry( new SphereBufferGeometry( radius, widthSegments, heightSegments, phiStart, phiLength, thetaStart, thetaLength ) );
	this.mergeVertices();

}

SphereGeometry.prototype = Object.create( Geometry.prototype );
SphereGeometry.prototype.constructor = SphereGeometry;

// SphereBufferGeometry

function SphereBufferGeometry( radius, widthSegments, heightSegments, phiStart, phiLength, thetaStart, thetaLength ) {

	BufferGeometry.call( this );

	this.type = 'SphereBufferGeometry';

	this.parameters = {
		radius: radius,
		widthSegments: widthSegments,
		heightSegments: heightSegments,
		phiStart: phiStart,
		phiLength: phiLength,
		thetaStart: thetaStart,
		thetaLength: thetaLength
	};

	radius = radius || 1;

	widthSegments = Math.max( 3, Math.floor( widthSegments ) || 8 );
	heightSegments = Math.max( 2, Math.floor( heightSegments ) || 6 );

	phiStart = phiStart !== undefined ? phiStart : 0;
	phiLength = phiLength !== undefined ? phiLength : Math.PI * 2;

	thetaStart = thetaStart !== undefined ? thetaStart : 0;
	thetaLength = thetaLength !== undefined ? thetaLength : Math.PI;

	var thetaEnd = thetaStart + thetaLength;

	var ix, iy;

	var index = 0;
	var grid = [];

	var vertex = new Vector3();
	var normal = new Vector3();

	// buffers

	var indices = [];
	var vertices = [];
	var normals = [];
	var uvs = [];

	// generate vertices, normals and uvs

	for ( iy = 0; iy <= heightSegments; iy ++ ) {

		var verticesRow = [];

		var v = iy / heightSegments;

		for ( ix = 0; ix <= widthSegments; ix ++ ) {

			var u = ix / widthSegments;

			// vertex

			vertex.x = - radius * Math.cos( phiStart + u * phiLength ) * Math.sin( thetaStart + v * thetaLength );
			vertex.y = radius * Math.cos( thetaStart + v * thetaLength );
			vertex.z = radius * Math.sin( phiStart + u * phiLength ) * Math.sin( thetaStart + v * thetaLength );

			vertices.push( vertex.x, vertex.y, vertex.z );

			// normal

			normal.set( vertex.x, vertex.y, vertex.z ).normalize();
			normals.push( normal.x, normal.y, normal.z );

			// uv

			uvs.push( u, 1 - v );

			verticesRow.push( index ++ );

		}

		grid.push( verticesRow );

	}

	// indices

	for ( iy = 0; iy < heightSegments; iy ++ ) {

		for ( ix = 0; ix < widthSegments; ix ++ ) {

			var a = grid[ iy ][ ix + 1 ];
			var b = grid[ iy ][ ix ];
			var c = grid[ iy + 1 ][ ix ];
			var d = grid[ iy + 1 ][ ix + 1 ];

			if ( iy !== 0 || thetaStart > 0 ) indices.push( a, b, d );
			if ( iy !== heightSegments - 1 || thetaEnd < Math.PI ) indices.push( b, c, d );

		}

	}

	// build geometry

	this.setIndex( indices );
	this.addAttribute( 'position', new Float32BufferAttribute( vertices, 3 ) );
	this.addAttribute( 'normal', new Float32BufferAttribute( normals, 3 ) );
	this.addAttribute( 'uv', new Float32BufferAttribute( uvs, 2 ) );

}

SphereBufferGeometry.prototype = Object.create( BufferGeometry.prototype );
SphereBufferGeometry.prototype.constructor = SphereBufferGeometry;
*/
/**
 * @author wangzhidong
 * @modified by gby
 * @modify date 2018-7-11
 * @modified DongYi 2018/7/19
 */

import {Geometry} from '../Core/Geometry.js';
import {BufferGeometry} from '../Core/BufferGeometry.js';
import {Float32BufferAttribute} from '../Core/BufferAttribute.js';
import {Vector3} from '../Datum/Math/Vector3.js';

// SphereGeometry

class SphereGeometry extends Geometry {

    constructor(radius, widthSegments, heightSegments, phiStart, phiLength, thetaStart, thetaLength) {
        super();
        this.type = 'SphereGeometry';
        this.parameters = {
            radius: radius,
            widthSegments: widthSegments,
            heightSegments: heightSegments,
            phiStart: phiStart,
            phiLength: phiLength,
            thetaStart: thetaStart,
            thetaLength: thetaLength
        };
        this.fromBufferGeometry(new SphereBufferGeometry(radius, widthSegments, heightSegments, phiStart, phiLength, thetaStart, thetaLength));
        this.mergeVertices();
    }
}
class SphereBufferGeometry extends BufferGeometry {
    constructor(radius = 1, widthSegments = 8, heightSegments = 6, phiStart = 0, phiLength = Math.PI * 2, thetaStart = 0, thetaLength = Math.PI) {
        super();
        this.type = 'SphereBufferGeometry';
        this.parameters = {
            radius: radius,
            widthSegments: widthSegments,
            heightSegments: heightSegments,
            phiStart: phiStart,
            phiLength: phiLength,
            thetaStart: thetaStart,
            thetaLength: thetaLength
        };
        this._init(radius,widthSegments,heightSegments,phiStart,phiLength,thetaStart,thetaLength)
    }
    SetRaius(radius){
        this.parameters.radius=radius;
    }
    _init(radius1,widthSegments1,heightSegments1,phiStart1,phiLength1,thetaStart1,thetaLength1) {
        this.parameters.radius=radius1||1;
        this.parameters.widthSegments = Math.max(3, Math.floor(widthSegments1)||8);
        this.parameters.heightSegments = Math.max(2, Math.floor(heightSegments1)||6);
        this.parameters.phiStart = phiStart1;
        this.parameters.phiLength = phiLength1;
        this.parameters.thetaStart = thetaStart1;
        this.parameters.thetaLength = thetaLength1;
        this.parameters.thetaEnd = this.parameters.thetaStart + this.parameters.thetaLength;
        // let radius = radius1||1;
        // let widthSegments = Math.max(3, Math.floor(widthSegments1)||8);
        // let heightSegments = Math.max(2, Math.floor(heightSegments1)||6);
        // let phiStart = phiStart1;
        // let phiLength = phiLength1;
        // let thetaStart = thetaStart1;
        // let thetaLength = thetaLength1;
        // let thetaEnd = thetaStart + thetaLength;
        let heightSegments=this.parameters.heightSegments;
        let widthSegments=this.parameters.widthSegments;
        let radius=this.parameters.radius;
        let phiStart=this.parameters.phiStart;
        let thetaLength=this.parameters.thetaLength;
        let phiLength=this.parameters.phiLength;
        let thetaStart=this.parameters.thetaStart;
        let thetaEnd=this.parameters.thetaEnd;
        // let
        let ix, iy;
        let index = 0;
        let grid = [];
        let vertex = new Vector3();
        let normal = new Vector3();
        // buffers
        let indices = [];
        let vertices = [];
        let normals = [];
        let uvs = [];
        // generate vertices, normals and uvs
        for (iy = 0; iy <= heightSegments; iy++) {
            let verticesRow = [];
            let v = iy / heightSegments;
            for (ix = 0; ix <= widthSegments; ix++) {
                let u = ix / widthSegments;
                // vertex
                vertex.x = -radius * Math.cos(phiStart + u * phiLength) * Math.sin(thetaStart + v * thetaLength);
                vertex.y = radius * Math.cos(thetaStart + v * thetaLength);
                vertex.z = radius * Math.sin(phiStart + u * phiLength) * Math.sin(thetaStart + v * thetaLength);
                vertices.push(vertex.x, vertex.y, vertex.z);
                // normal
                normal.set(vertex.x, vertex.y, vertex.z).normalize();
                normals.push(normal.x, normal.y, normal.z);
                // uv
                uvs.push(u, 1 - v);
                verticesRow.push(index++);
            }
            grid.push(verticesRow);
        }
        // indices
        for (iy = 0; iy < heightSegments; iy++) {
            for (ix = 0; ix < widthSegments; ix++) {
                let a = grid[iy][ix + 1];
                let b = grid[iy][ix];
                let c = grid[iy + 1][ix];
                let d = grid[iy + 1][ix + 1];
                if (iy !== 0 || thetaStart > 0) indices.push(a, b, d);
                if (iy !== heightSegments - 1 || thetaEnd < Math.PI) indices.push(b, c, d);
            }
        }
        // build geometry
        this.setIndex(indices);
        this.addAttribute('position', new Float32BufferAttribute(vertices, 3));
        this.addAttribute('normal', new Float32BufferAttribute(normals, 3));
        this.addAttribute('uv', new Float32BufferAttribute(uvs, 2));
    }
}

export {SphereGeometry, SphereBufferGeometry};
