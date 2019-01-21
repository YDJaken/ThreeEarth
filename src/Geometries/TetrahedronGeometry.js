/*/!**
 * @author wangzhidong
 *!/

import { Geometry } from '../core/Geometry.js';
import { PolyhedronBufferGeometry } from './PolyhedronGeometry.js';

// TetrahedronGeometry

function TetrahedronGeometry( radius, detail ) {

	Geometry.call( this );

	this.type = 'TetrahedronGeometry';

	this.parameters = {
		radius: radius,
		detail: detail
	};

	this.fromBufferGeometry( new TetrahedronBufferGeometry( radius, detail ) );
	this.mergeVertices();

}

TetrahedronGeometry.prototype = Object.create( Geometry.prototype );
TetrahedronGeometry.prototype.constructor = TetrahedronGeometry;

// TetrahedronBufferGeometry

function TetrahedronBufferGeometry( radius, detail ) {

	var vertices = [
		1, 1, 1, 	- 1, - 1, 1, 	- 1, 1, - 1, 	1, - 1, - 1
	];

	var indices = [
		2, 1, 0, 	0, 3, 2,	1, 3, 0,	2, 3, 1
	];

	PolyhedronBufferGeometry.call( this, vertices, indices, radius, detail );

	this.type = 'TetrahedronBufferGeometry';

	this.parameters = {
		radius: radius,
		detail: detail
	};

}

TetrahedronBufferGeometry.prototype = Object.create( PolyhedronBufferGeometry.prototype );
TetrahedronBufferGeometry.prototype.constructor = TetrahedronBufferGeometry;


export { TetrahedronGeometry, TetrahedronBufferGeometry };*/



/**
 * @author wangzhidong
 * @modified by gby
 * @modify date 2018-7-11
 */

import { Geometry } from '../Core/Geometry.js';
import { PolyhedronBufferGeometry } from './PolyhedronGeometry.js';

// TetrahedronGeometry


class TetrahedronGeometry extends Geometry{

	constructor(radius, detail){
		super()
		this.type = 'TetrahedronGeometry';
		this.parameters = {
			radius: radius,
			detail: detail
		};
		this.radius=radius
		this.detail=detail
		this._init()
   }
   _init(){
		this.fromBufferGeometry( new TetrahedronBufferGeometry( this.radius, this.detail ) );
		this.mergeVertices();
   }  
}


class TetrahedronBufferGeometry extends PolyhedronBufferGeometry{
	constructor(radius, detail){
		let vertices = [
			1, 1, 1, 	- 1, - 1, 1, 	- 1, 1, - 1, 	1, - 1, - 1
		];
	
		let indices = [
			2, 1, 0, 	0, 3, 2,	1, 3, 0,	2, 3, 1
		];
		
		super(vertices, indices, radius, detail)
		this.parameters = {
			radius: radius,
			detail: detail
		};
		this.radius=radius,
		this.detail=detail
		this.type = 'TetrahedronBufferGeometry';
		
		this._init()
   }
   _init(){
		
   }  

}

export { TetrahedronGeometry, TetrahedronBufferGeometry };
