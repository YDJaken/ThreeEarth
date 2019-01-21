/*import { Geometry } from '../core/Geometry.js';
import { PolyhedronBufferGeometry } from './PolyhedronGeometry.js';

function OctahedronGeometry( radius, detail ) {

	Geometry.call( this );

	this.type = 'OctahedronGeometry';

	this.parameters = {
		radius: radius,
		detail: detail
	};

	this.fromBufferGeometry( new OctahedronBufferGeometry( radius, detail ) );
	this.mergeVertices();

}

OctahedronGeometry.prototype = Object.create( Geometry.prototype );
OctahedronGeometry.prototype.constructor = OctahedronGeometry;

// OctahedronBufferGeometry

function OctahedronBufferGeometry( radius, detail ) {

	var vertices = [
		1, 0, 0, 	- 1, 0, 0,	0, 1, 0,
		0, - 1, 0, 	0, 0, 1,	0, 0, - 1
	];

	var indices = [
		0, 2, 4,	0, 4, 3,	0, 3, 5,
		0, 5, 2,	1, 2, 5,	1, 5, 3,
		1, 3, 4,	1, 4, 2
	];

	PolyhedronBufferGeometry.call( this, vertices, indices, radius, detail );

	this.type = 'OctahedronBufferGeometry';

	this.parameters = {
		radius: radius,
		detail: detail
	};

}

OctahedronBufferGeometry.prototype = Object.create( PolyhedronBufferGeometry.prototype );
OctahedronBufferGeometry.prototype.constructor = OctahedronBufferGeometry;


export { OctahedronGeometry, OctahedronBufferGeometry };*/
/**
 * @author wangzhidong
 * @modified by gby
 * @modify date 2018-7-11
 */



import { Geometry } from '../Core/Geometry.js';
import { PolyhedronBufferGeometry } from './PolyhedronGeometry.js';

class OctahedronGeometry extends Geometry{

   constructor(radius, detail){
		super()
		this.type = 'OctahedronGeometry';
		this.parameters = {
			radius: radius,
			detail: detail
		};
		this.radius = radius
		this.detail = detail
		this._init()
   }
   _init(){
		this.fromBufferGeometry( new OctahedronBufferGeometry( this.radius, this.detail ) );
		this.mergeVertices();
   }   
}

class OctahedronBufferGeometry extends PolyhedronBufferGeometry{
	constructor(radius, detail){
		let vertices = [
			1, 0, 0, 	- 1, 0, 0,	0, 1, 0,
			0, - 1, 0, 	0, 0, 1,	0, 0, - 1
		];
	
		let indices = [
			0, 2, 4,	0, 4, 3,	0, 3, 5,
			0, 5, 2,	1, 2, 5,	1, 5, 3,
			1, 3, 4,	1, 4, 2
		];
		super(vertices, indices, radius, detail)
		this.type = 'OctahedronBufferGeometry';
		this.parameters = {
			radius: radius,
			detail: detail
		};
		this.radius = radius
		this.detail = detail
   }

}
export { OctahedronGeometry, OctahedronBufferGeometry };
