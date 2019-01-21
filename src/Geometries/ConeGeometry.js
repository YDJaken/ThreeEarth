/*
function ConeGeometry( radius, height, radialSegments, heightSegments, openEnded, thetaStart, thetaLength ) {

	CylinderGeometry.call( this, 0, radius, height, radialSegments, heightSegments, openEnded, thetaStart, thetaLength );

	this.type = 'ConeGeometry';

	this.parameters = {
		radius: radius,
		height: height,
		radialSegments: radialSegments,
		heightSegments: heightSegments,
		openEnded: openEnded,
		thetaStart: thetaStart,
		thetaLength: thetaLength
	};

}

ConeGeometry.prototype = Object.create( CylinderGeometry.prototype );
ConeGeometry.prototype.constructor = ConeGeometry;

// ConeBufferGeometry

function ConeBufferGeometry( radius, height, radialSegments, heightSegments, openEnded, thetaStart, thetaLength ) {

	CylinderBufferGeometry.call( this, 0, radius, height, radialSegments, heightSegments, openEnded, thetaStart, thetaLength );

	this.type = 'ConeBufferGeometry';

	this.parameters = {
		radius: radius,
		height: height,
		radialSegments: radialSegments,
		heightSegments: heightSegments,
		openEnded: openEnded,
		thetaStart: thetaStart,
		thetaLength: thetaLength
	};

}

ConeBufferGeometry.prototype = Object.create( CylinderBufferGeometry.prototype );
ConeBufferGeometry.prototype.constructor = ConeBufferGeometry;
*/

/**
 * @author wangzhidong
 * @modified by gby
 * @modify date 2018-7-11
 */

import { CylinderGeometry } from './CylinderGeometry.js';
import { CylinderBufferGeometry } from './CylinderGeometry.js';

// ConeGeometry


class ConeGeometry extends CylinderGeometry{
   constructor(radius, height, radialSegments, heightSegments, openEnded, thetaStart, thetaLengt){
	  super(radius, height, radialSegments, heightSegments, openEnded, thetaStart, thetaLength)
	  this.type = 'ConeGeometry';
	  this.parameters = {
			radius: radius,
			height: height,
			radialSegments: radialSegments,
			heightSegments: heightSegments,
			openEnded: openEnded,
			thetaStart: thetaStart,
			thetaLength: thetaLength
		};
	  this.radius=radius,
	  this.height=height,
	  this.radialSegments=radialSegments,
	  this.heightSegments=heightSegments,
	  this.openEnded=openEnded,
	  this.thetaStart=thetaStart,
	  this.thetaLength=thetaLength	
   }
}



class ConeBufferGeometry extends CylinderBufferGeometry{
    constructor(radius, height, radialSegments, heightSegments, openEnded, thetaStart, thetaLength){
		super(0, radius, height, radialSegments, heightSegments, openEnded, thetaStart, thetaLength)
		this.type = 'ConeBufferGeometry';
		this.parameters = {
			radius: radius,
			height: height,
			radialSegments: radialSegments,
			heightSegments: heightSegments,
			openEnded: openEnded,
			thetaStart: thetaStart,
			thetaLength: thetaLength
		};
		this.radius=radius,
		this.height=height,
		this.radialSegments=radialSegments,
		this.heightSegments=heightSegments,
		this.openEnded=openEnded,
		this.thetaStart=thetaStart,
		this.thetaLength=thetaLength
	}
}
export { ConeGeometry, ConeBufferGeometry };
