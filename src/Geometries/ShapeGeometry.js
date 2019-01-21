/*
import { Geometry } from '../core/Geometry.js';
import { BufferGeometry } from '../core/BufferGeometry.js';
import { Float32BufferAttribute } from '../core/BufferAttribute.js';
import { ShapeUtils } from '../extras/ShapeUtils.js';

// ShapeGeometry

function ShapeGeometry( shapes, curveSegments ) {

	Geometry.call( this );

	this.type = 'ShapeGeometry';

	if ( typeof curveSegments === 'object' ) {

		console.warn( 'Speed3DEngine.ShapeGeometry: Options parameter has been removed.' );

		curveSegments = curveSegments.curveSegments;

	}

	this.parameters = {
		shapes: shapes,
		curveSegments: curveSegments
	};

	this.fromBufferGeometry( new ShapeBufferGeometry( shapes, curveSegments ) );
	this.mergeVertices();

}

ShapeGeometry.prototype = Object.create( Geometry.prototype );
ShapeGeometry.prototype.constructor = ShapeGeometry;

ShapeGeometry.prototype.toJSON = function () {

	var data = Geometry.prototype.toJSON.call( this );

	var shapes = this.parameters.shapes;

	return toJSON( shapes, data );

};

// ShapeBufferGeometry

function ShapeBufferGeometry( shapes, curveSegments ) {

	BufferGeometry.call( this );

	this.type = 'ShapeBufferGeometry';

	this.parameters = {
		shapes: shapes,
		curveSegments: curveSegments
	};

	curveSegments = curveSegments || 12;

	// buffers

	var indices = [];
	var vertices = [];
	var normals = [];
	var uvs = [];

	// helper variables

	var groupStart = 0;
	var groupCount = 0;

	// allow single and array values for "shapes" parameter

	if ( Array.isArray( shapes ) === false ) {

		addShape( shapes );

	} else {

		for ( var i = 0; i < shapes.length; i ++ ) {

			addShape( shapes[ i ] );

			this.addGroup( groupStart, groupCount, i ); // enables MultiMaterial support

			groupStart += groupCount;
			groupCount = 0;

		}

	}

	// build geometry

	this.setIndex( indices );
	this.addAttribute( 'position', new Float32BufferAttribute( vertices, 3 ) );
	this.addAttribute( 'normal', new Float32BufferAttribute( normals, 3 ) );
	this.addAttribute( 'uv', new Float32BufferAttribute( uvs, 2 ) );


	// helper functions

	function addShape( shape ) {

		var i, l, shapeHole;

		var indexOffset = vertices.length / 3;
		var points = shape.extractPoints( curveSegments );

		var shapeVertices = points.shape;
		var shapeHoles = points.holes;

		// check direction of vertices

		if ( ShapeUtils.isClockWise( shapeVertices ) === false ) {

			shapeVertices = shapeVertices.reverse();

			// also check if holes are in the opposite direction

			for ( i = 0, l = shapeHoles.length; i < l; i ++ ) {

				shapeHole = shapeHoles[ i ];

				if ( ShapeUtils.isClockWise( shapeHole ) === true ) {

					shapeHoles[ i ] = shapeHole.reverse();

				}

			}

		}

		var faces = ShapeUtils.triangulateShape( shapeVertices, shapeHoles );

		// join vertices of inner and outer paths to a single array

		for ( i = 0, l = shapeHoles.length; i < l; i ++ ) {

			shapeHole = shapeHoles[ i ];
			shapeVertices = shapeVertices.concat( shapeHole );

		}

		// vertices, normals, uvs

		for ( i = 0, l = shapeVertices.length; i < l; i ++ ) {

			var vertex = shapeVertices[ i ];

			vertices.push( vertex.x, vertex.y, 0 );
			normals.push( 0, 0, 1 );
			uvs.push( vertex.x, vertex.y ); // world uvs

		}

		// incides

		for ( i = 0, l = faces.length; i < l; i ++ ) {

			var face = faces[ i ];

			var a = face[ 0 ] + indexOffset;
			var b = face[ 1 ] + indexOffset;
			var c = face[ 2 ] + indexOffset;

			indices.push( a, b, c );
			groupCount += 3;

		}

	}

}

ShapeBufferGeometry.prototype = Object.create( BufferGeometry.prototype );
ShapeBufferGeometry.prototype.constructor = ShapeBufferGeometry;

ShapeBufferGeometry.prototype.toJSON = function () {

	var data = BufferGeometry.prototype.toJSON.call( this );

	var shapes = this.parameters.shapes;

	return toJSON( shapes, data );

};

//

function toJSON( shapes, data ) {

	data.shapes = [];

	if ( Array.isArray( shapes ) ) {

		for ( var i = 0, l = shapes.length; i < l; i ++ ) {

			var shape = shapes[ i ];

			data.shapes.push( shape.uuid );

		}

	} else {

		data.shapes.push( shapes.uuid );

	}

	return data;

}


export { ShapeGeometry, ShapeBufferGeometry };
*/


/**
 * @author wangzhidong
 * @modified by gby
 * @modify date 2018-7-12
 */

import { Geometry } from '../Core/Geometry.js';
import { BufferGeometry } from '../Core/BufferGeometry.js';
import { Float32BufferAttribute } from '../Core/BufferAttribute.js';
import { ShapeUtils } from '../../Extras/ShapeUtils.js';



/*
class ShapeGeometry extends Geometry{

	constructor(shapes, curveSegments){
		super()
		this.type = 'ShapeGeometry';
		this.parameters = {
			shapes: shapes,
			curveSegments: curveSegments
		};
		this.shapes=shapes,
		this.curveSegments=curveSegments
		// this.fater = super()
		this._init()
   }
   _init(){
		if ( typeof this.curveSegments === 'object' ) {
			console.warn( 'Speed3DEngine.ShapeGeometry: Options parameter has been removed.' );
			this.curveSegments = this.curveSegments.curveSegments;
		}
		this.fromBufferGeometry( new ShapeBufferGeometry( this.shapes, this.curveSegments ) );
		this.mergeVertices();
   }
   //重写
   toJSON() {
	let data = this.fater.toJSON();
	let shapes = this.parameters.shapes;
	return toJSONFinal( shapes, data );
   };
   //重构公共函数toJSON为toJSONFinal
   toJSONFinal( shapes, data ) {
	data.shapes = [];
	if ( Array.isArray( shapes ) ) {
		for ( let i = 0, l = shapes.length; i < l; i ++ ) {
			let shape = shapes[ i ];
			data.shapes.push( shape.uuid );
		}

	} else {
		data.shapes.push( shapes.uuid );
	}
	return data;
	}
}


class ShapeBufferGeometry extends BufferGeometry{
	constructor(shapes, curveSegments=12){
		super()
		this.type = 'ShapeBufferGeometry';
		this.parameters = {
			shapes: shapes,
			curveSegments: curveSegments
		};
		this.shapes=shapes,
		this.curveSegments=curveSegments
		// buffers

		this.indices = [];
		this.vertices = [];
		this.normals = [];
		this.uvs = [];

		// helper variables

		this.groupStart = 0;
		this.groupCount = 0;
		this._init()
   }
   _init(){

	// allow single and array values for "shapes" parameter

	if ( Array.isArray( this.shapes ) === false ) {

		this.addShape( this.shapes );

	} else {

		for ( let i = 0; i < this.shapes.length; i ++ ) {

			this.addShape( this.shapes[ i ] );

			this.addGroup( this.groupStart, this.groupCount, i ); // enables MultiMaterial support

			this.groupStart += this.groupCount;
			this.groupCount = 0;

		}

	}

	// build geometry

	this.setIndex( this.indices );
	this.addAttribute( 'position', new Float32BufferAttribute( this.vertices, 3 ) );
	this.addAttribute( 'normal', new Float32BufferAttribute( this.normals, 3 ) );
	this.addAttribute( 'uv', new Float32BufferAttribute( this.uvs, 2 ) );

   }
	// helper functions

   addShape( shape ) {
		// if(shape===undefined){
		// 	return;
		// }

		let i, l, shapeHole;

		let indexOffset = this.vertices.length / 3;
		let points = shape.extractPoints( this.curveSegments );
		let shapeVertices = points.shape;
		let shapeHoles = points.holes;

		// check direction of vertices

		if ( ShapeUtils.isClockWise( shapeVertices ) === false ) {

			shapeVertices = shapeVertices.reverse();

			// also check if holes are in the opposite direction

			for ( i = 0, l = shapeHoles.length; i < l; i ++ ) {

				shapeHole = shapeHoles[ i ];

				if ( ShapeUtils.isClockWise( shapeHole ) === true ) {

					shapeHoles[ i ] = shapeHole.reverse();

				}

			}

		}

		let faces = ShapeUtils.triangulateShape( shapeVertices, shapeHoles );

		// join vertices of inner and outer paths to a single array

		for ( i = 0, l = shapeHoles.length; i < l; i ++ ) {

			shapeHole = shapeHoles[ i ];
			shapeVertices = shapeVertices.concat( shapeHole );

		}

		// vertices, normals, uvs

		for ( i = 0, l = shapeVertices.length; i < l; i ++ ) {

			let vertex = shapeVertices[ i ];

			this.vertices.push( vertex.x, vertex.y, 0 );
			this.normals.push( 0, 0, 1 );
			this.uvs.push( vertex.x, vertex.y ); // world uvs

		}

		// incides

		for ( i = 0, l = faces.length; i < l; i ++ ) {

			let face = faces[ i ];

			let a = face[ 0 ] + indexOffset;
			let b = face[ 1 ] + indexOffset;
			let c = face[ 2 ] + indexOffset;

			this.indices.push( a, b, c );
			this.groupCount += 3;

		}

	}

}
*/
class ShapeGeometry extends Geometry{
		constructor( shapes, curveSegments ){
			super();
            this.type = 'ShapeGeometry';
            if ( typeof curveSegments === 'object' ) {
                console.warn( 'Speed3DEngine.ShapeGeometry: Options parameter has been removed.' );
                curveSegments = curveSegments.curveSegments;
            }
            this.parameters = {
                shapes: shapes,
                curveSegments: curveSegments
            };
            this.fromBufferGeometry( new ShapeBufferGeometry( shapes, curveSegments ) );
            this.mergeVertices();
		}
    	toJSON(){
			let data=super.toJSON();
            let shapes = this.parameters.shapes;
            return toJSON( shapes, data );
		}
}

class ShapeBufferGeometry extends BufferGeometry{
	constructor(shapes, curveSegments){
		super();
        this.type = 'ShapeBufferGeometry';
        this.parameters = {
            shapes: shapes,
            curveSegments: curveSegments
        };
        this.curveSegments = curveSegments || 12;
        this.indices = [];
        this.vertices = [];
        this.normals = [];
        this.uvs = [];

        // helper variables

        this.groupStart = 0;
        this.groupCount = 0;

        // allow single and array values for "shapes" parameter

        if ( Array.isArray( this.parameters.shapes ) === false ) {

            this.addShape( shapes );
        } else {
            for ( var i = 0; i < this.parameters.shapes.length; i ++ ) {
                this.addShape( shapes[ i ] );

                this.addGroup( this.groupStart, this.groupCount, i ); // enables MultiMaterial support
                this.groupStart += this.groupCount;
                this.groupCount = 0;
            }
        }

        // build geometry

        this.setIndex( this.indices );
        this.addAttribute( 'position', new Float32BufferAttribute( this.vertices, 3 ) );
        this.addAttribute( 'normal', new Float32BufferAttribute( this.normals, 3 ) );
        this.addAttribute( 'uv', new Float32BufferAttribute( this.uvs, 2 ) );

	}
    addShape(shape){
        let i, l, shapeHole;

        let indexOffset = this.vertices.length / 3;
        let points = shape.extractPoints( this.curveSegments );

        let shapeVertices = points.shape;
        let shapeHoles = points.holes;

        // check direction of vertices

        if ( ShapeUtils.isClockWise( shapeVertices ) === false ) {
            shapeVertices = shapeVertices.reverse();
            // also check if holes are in the opposite direction

            for ( i = 0, l = shapeHoles.length; i < l; i ++ ) {

                shapeHole = shapeHoles[ i ];

                if ( ShapeUtils.isClockWise( shapeHole ) === true ) {

                    shapeHoles[ i ] = shapeHole.reverse();

                }

            }

        }

        let faces = ShapeUtils.triangulateShape( shapeVertices, shapeHoles );

        // join vertices of inner and outer paths to a single array

        for ( i = 0, l = shapeHoles.length; i < l; i ++ ) {

            shapeHole = shapeHoles[ i ];
            shapeVertices = shapeVertices.concat( shapeHole );

        }

        // vertices, normals, uvs

        for ( i = 0, l = shapeVertices.length; i < l; i ++ ) {
            let vertex = shapeVertices[ i ];
            this.vertices.push( vertex.x, vertex.y, 0 );
            this.normals.push( 0, 0, 1 );
            this.uvs.push( vertex.x, vertex.y ); // world uvs
        }

        // incides

        for ( i = 0, l = faces.length; i < l; i ++ ) {

            let face = faces[ i ];
            let a = face[ 0 ] + indexOffset;
            let b = face[ 1 ] + indexOffset;
            let c = face[ 2 ] + indexOffset;
            this.indices.push( a, b, c );
            this.groupCount += 3;

        }
	}
    toJSON(){
        let data =super.toJSON();
        let shapes = this.parameters.shapes;
        return toJSON( shapes, data );
	}
    toJSON( shapes, data ){
        data.shapes = [];
        if ( Array.isArray( shapes ) ) {
            for ( let i = 0, l = shapes.length; i < l; i ++ ) {
                let shape = shapes[ i ];
                data.shapes.push( shape.uuid );
            }
        } else {
            data.shapes.push( shapes.uuid );
        }
        return data;
	}

}
export { ShapeGeometry, ShapeBufferGeometry };
