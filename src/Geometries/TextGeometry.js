/*import { Geometry } from '../core/Geometry.js';
import { ExtrudeBufferGeometry } from './ExtrudeGeometry.js';

// TextGeometry

function TextGeometry( text, parameters ) {

	Geometry.call( this );

	this.type = 'TextGeometry';

	this.parameters = {
		text: text,
		parameters: parameters
	};

	this.fromBufferGeometry( new TextBufferGeometry( text, parameters ) );
	this.mergeVertices();

}

TextGeometry.prototype = Object.create( Geometry.prototype );
TextGeometry.prototype.constructor = TextGeometry;

// TextBufferGeometry

function TextBufferGeometry( text, parameters ) {

	parameters = parameters || {};

	var font = parameters.font;

	if ( ! ( font && font.isFont ) ) {

		console.error( 'Speed3DEngine.TextGeometry: font parameter is not an instance of Speed3DEngine.Font.' );
		return new Geometry();

	}

	var shapes = font.generateShapes( text, parameters.size );

	// translate parameters to ExtrudeGeometry API

	parameters.depth = parameters.height !== undefined ? parameters.height : 50;

	// defaults

	if ( parameters.bevelThickness === undefined ) parameters.bevelThickness = 10;
	if ( parameters.bevelSize === undefined ) parameters.bevelSize = 8;
	if ( parameters.bevelEnabled === undefined ) parameters.bevelEnabled = false;

	ExtrudeBufferGeometry.call( this, shapes, parameters );

	this.type = 'TextBufferGeometry';

}

TextBufferGeometry.prototype = Object.create( ExtrudeBufferGeometry.prototype );
TextBufferGeometry.prototype.constructor = TextBufferGeometry;


export { TextGeometry, TextBufferGeometry };*/

/**
 * @author wangzhidong
 * @modified by gby
 * @modify date 2018-7-11
 */

import { Geometry } from '../Core/Geometry.js';
import { ExtrudeBufferGeometry } from './ExtrudeGeometry.js';

// TextGeometry



class TextGeometry extends Geometry{

	constructor(text, parameter){
		super()
		this.type = 'TextGeometry';
		this.parameters = {
			text: text,
			parameters: parameters
		};
		this.text=text,
		this.parameters=parameters
		this._init()
   }
   _init(){
		this.fromBufferGeometry( new TextBufferGeometry( this.text, this.parameters ) );
		this.mergeVertices();
   }   
}


class TextBufferGeometry extends ExtrudeBufferGeometry{

	constructor(text, parameters={}){
		let font = parameters.font;
		if ( ! ( font && font.isFont ) ) {
			console.error( 'Speed3DEngine.TextGeometry: font parameter is not an instance of Speed3DEngine.Font.' );
			return new Geometry();
		}
		let shapes = font.generateShapes( text, parameters.size );
		// translate parameters to ExtrudeGeometry API
		parameters.depth = parameters.height !== undefined ? parameters.height : 50;
		// defaults
		if ( parameters.bevelThickness === undefined ) parameters.bevelThickness = 10;
		if ( parameters.bevelSize === undefined ) parameters.bevelSize = 8;
		if ( parameters.bevelEnabled === undefined ) parameters.bevelEnabled = false;
		super(shapes,parameters)
		this.type = 'TextBufferGeometry';
		this._init()
   }
   _init(){
	   
		
   }   
}

export { TextGeometry, TextBufferGeometry };
