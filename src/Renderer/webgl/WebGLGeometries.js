/**
 * @author wangzhidong
 * @modified DongYi 2018/06/27
 */

/*import { Uint16BufferAttribute, Uint32BufferAttribute } from '../../core/BufferAttribute.js';
import { BufferGeometry } from '../../core/BufferGeometry.js';
import { arrayMax } from '../../Utils.js';*/

import {Uint16BufferAttribute, Uint32BufferAttribute} from "../../Core/BufferAttribute.js";
import {BufferGeometry} from "../../Core/BufferGeometry.js";
import {arrayMax} from '../../Utills/Utils.js';

/*
function WebGLGeometries( gl, attributes, info ) {

	var geometries = {};
	var wireframeAttributes = {};

	function onGeometryDispose( event ) {

		var geometry = event.target;
		var buffergeometry = geometries[ geometry.id ];

		if ( buffergeometry.index !== null ) {

			attributes.remove( buffergeometry.index );

		}

		for ( var name in buffergeometry.attributes ) {

			attributes.remove( buffergeometry.attributes[ name ] );

		}

		geometry.removeEventListener( 'dispose', onGeometryDispose );

		delete geometries[ geometry.id ];

		// TODO Remove duplicate code

		var attribute = wireframeAttributes[ geometry.id ];

		if ( attribute ) {

			attributes.remove( attribute );
			delete wireframeAttributes[ geometry.id ];

		}

		attribute = wireframeAttributes[ buffergeometry.id ];

		if ( attribute ) {

			attributes.remove( attribute );
			delete wireframeAttributes[ buffergeometry.id ];

		}

		//

		info.memory.geometries --;

	}

	function get( object, geometry ) {

		var buffergeometry = geometries[ geometry.id ];

		if ( buffergeometry ) return buffergeometry;

		geometry.addEventListener( 'dispose', onGeometryDispose );

		if ( geometry.isBufferGeometry ) {

			buffergeometry = geometry;

		} else if ( geometry.isGeometry ) {

			if ( geometry._bufferGeometry === undefined ) {

				geometry._bufferGeometry = new BufferGeometry().setFromObject( object );

			}

			buffergeometry = geometry._bufferGeometry;

		}

		geometries[ geometry.id ] = buffergeometry;

		info.memory.geometries ++;

		return buffergeometry;

	}

	function update( geometry ) {

		var index = geometry.index;
		var geometryAttributes = geometry.attributes;

		if ( index !== null ) {

			attributes.update( index, gl.ELEMENT_ARRAY_BUFFER );

		}

		for ( var name in geometryAttributes ) {

			attributes.update( geometryAttributes[ name ], gl.ARRAY_BUFFER );

		}

		// morph targets

		var morphAttributes = geometry.morphAttributes;

		for ( var name in morphAttributes ) {

			var array = morphAttributes[ name ];

			for ( var i = 0, l = array.length; i < l; i ++ ) {

				attributes.update( array[ i ], gl.ARRAY_BUFFER );

			}

		}

	}

	function getWireframeAttribute( geometry ) {

		var attribute = wireframeAttributes[ geometry.id ];

		if ( attribute ) return attribute;

		var indices = [];

		var geometryIndex = geometry.index;
		var geometryAttributes = geometry.attributes;

		// console.time( 'wireframe' );

		if ( geometryIndex !== null ) {

			var array = geometryIndex.array;

			for ( var i = 0, l = array.length; i < l; i += 3 ) {

				var a = array[ i + 0 ];
				var b = array[ i + 1 ];
				var c = array[ i + 2 ];

				indices.push( a, b, b, c, c, a );

			}

		} else {

			var array = geometryAttributes.position.array;

			for ( var i = 0, l = ( array.length / 3 ) - 1; i < l; i += 3 ) {

				var a = i + 0;
				var b = i + 1;
				var c = i + 2;

				indices.push( a, b, b, c, c, a );

			}

		}

		// console.timeEnd( 'wireframe' );

		attribute = new ( arrayMax( indices ) > 65535 ? Uint32BufferAttribute : Uint16BufferAttribute )( indices, 1 );

		attributes.update( attribute, gl.ELEMENT_ARRAY_BUFFER );

		wireframeAttributes[ geometry.id ] = attribute;

		return attribute;

	}

	return {

		get: get,
		update: update,

		getWireframeAttribute: getWireframeAttribute

	};

}
*/

class WebGLGeometries {

    constructor(gl, attributes, info) {
        this.geometries = {};
        this.wireframeAttributes = {};
        this.gl = gl;
        this.attributes = attributes;
        this.info = info;
    }

    onGeometryDispose(event) {
        let geometry = event.target;
        let buffergeometry = this.geometries[geometry.id];
        if (buffergeometry.index !== null) {
            this.attributes.remove(buffergeometry.index);
        }
        for (let name in buffergeometry.attributes) {
            this.attributes.remove(buffergeometry.attributes[name]);
        }
        //可能有误
        geometry.removeEventListener('dispose', this.onGeometryDispose);
        delete this.geometries[geometry.id];
        let attribute = this.wireframeAttributes[geometry.id];
        if (attribute) {
            this.attributes.remove(attribute);
            delete this.wireframeAttributes[geometry.id];
        }
        attribute = this.wireframeAttributes[buffergeometry.id];
        if (attribute) {
            this.attributes.remove(attribute);
            delete this.wireframeAttributes[buffergeometry.id];
        }
        this.info.memory.geometries--;
    }

    get(object, geometry) {
        let buffergeometry = this.geometries[geometry.id];
        if (buffergeometry) return buffergeometry;
        //可能有误
        geometry.addEventListener('dispose', this.onGeometryDispose);
        if (geometry.isBufferGeometry) {
            buffergeometry = geometry;
        } else if (geometry.isGeometry) {
            if (geometry._bufferGeometry === undefined) {
                geometry._bufferGeometry = new BufferGeometry().setFromObject(object);
            }
            buffergeometry = geometry._bufferGeometry;
        }
        this.geometries[geometry.id] = buffergeometry;
        this.info.memory.geometries++;
        return buffergeometry;
    }

    update(geometry) {
        let index = geometry.index;
        let geometryAttributes = geometry.attributes;
        if (index !== null) {
            this.attributes.update(index, this.gl.ELEMENT_ARRAY_BUFFER);
        }
        for (let name in geometryAttributes) {
            this.attributes.update(geometryAttributes[name], this.gl.ARRAY_BUFFER);
        }
        // morph targets
        let morphAttributes = geometry.morphAttributes;
        for (let name in morphAttributes) {
            let array = morphAttributes[name];
            for (let i = 0, l = array.length; i < l; i++) {
                this.attributes.update(array[i], this.gl.ARRAY_BUFFER);
            }
        }
    }

    getWireframeAttribute(geometry) {
        let attribute = this.wireframeAttributes[geometry.id];
        if (attribute) return attribute;
        let indices = [];
        let geometryIndex = geometry.index;
        let geometryAttributes = geometry.attributes;
        // console.time( 'wireframe' );
        if (geometryIndex !== null) {
            let array = geometryIndex.array;
            for (let i = 0, l = array.length; i < l; i += 3) {
                let a = array[i + 0];
                let b = array[i + 1];
                let c = array[i + 2];
                indices.push(a, b, b, c, c, a);
            }
        } else {
            let array = geometryAttributes.position.array;
            for (let i = 0, l = (array.length / 3) - 1; i < l; i += 3) {
                let a = i + 0;
                let b = i + 1;
                let c = i + 2;
                indices.push(a, b, b, c, c, a);
            }
        }
        // console.timeEnd( 'wireframe' );
        //let temp = (arrayMax.arrayMax(indices) > 65535 ? Uint32BufferAttribute : Uint16BufferAttribute)
        attribute = new ( arrayMax.arrayMax( indices ) > 65535 ? Uint32BufferAttribute : Uint16BufferAttribute )( indices, 1 );
        this.attributes.update(attribute, this.gl.ELEMENT_ARRAY_BUFFER);
        this.wireframeAttributes[geometry.id] = attribute;
        return attribute;
    }
}

export {WebGLGeometries};