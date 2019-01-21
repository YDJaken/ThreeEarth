/*function BufferAttribute( array, itemSize, normalized ) {

	if ( Array.isArray( array ) ) {

		throw new TypeError( 'Speed3DEngine.BufferAttribute: array should be a Typed Array.' );

	}

	this.name = '';

	this.array = array;
	this.itemSize = itemSize;
	this.count = array !== undefined ? array.length / itemSize : 0;
	this.normalized = normalized === true;

	this.dynamic = false;
	this.updateRange = { offset: 0, count: - 1 };

	this.version = 0;

}

Object.defineProperty( BufferAttribute.prototype, 'needsUpdate', {

	set: function ( value ) {

		if ( value === true ) this.version ++;

	}

} );

Object.assign( BufferAttribute.prototype, {

	isBufferAttribute: true,
 
	onUploadCallback: function () {},

	setArray: function ( array ) {

		if ( Array.isArray( array ) ) {

			throw new TypeError( 'Speed3DEngine.BufferAttribute: array should be a Typed Array.' );

		}

		this.count = array !== undefined ? array.length / this.itemSize : 0;
		this.array = array;

		return this;
 
	},

	setDynamic: function ( value ) {

		this.dynamic = value;

		return this;

	},

	copy: function ( source ) {

		this.name = source.name;
		this.array = new source.array.constructor( source.array );
		this.itemSize = source.itemSize;
		this.count = source.count;
		this.normalized = source.normalized;

		this.dynamic = source.dynamic;

		return this;

	},

	copyAt: function ( index1, attribute, index2 ) {

		index1 *= this.itemSize;
		index2 *= attribute.itemSize;

		for ( var i = 0, l = this.itemSize; i < l; i ++ ) {

			this.array[ index1 + i ] = attribute.array[ index2 + i ];

		}

		return this;

	},

	copyArray: function ( array ) {

		this.array.set( array );

		return this;

	},

	copyColorsArray: function ( colors ) {

		var array = this.array, offset = 0;

		for ( var i = 0, l = colors.length; i < l; i ++ ) {

			var color = colors[ i ];

			if ( color === undefined ) {

				console.warn( 'Speed3DEngine.BufferAttribute.copyColorsArray(): color is undefined', i );
				color = new Color();

			}

			array[ offset ++ ] = color.r;
			array[ offset ++ ] = color.g;
			array[ offset ++ ] = color.b;

		}

		return this;

	},

	copyVector2sArray: function ( vectors ) {

		var array = this.array, offset = 0;

		for ( var i = 0, l = vectors.length; i < l; i ++ ) {

			var vector = vectors[ i ];

			if ( vector === undefined ) {

				console.warn( 'Speed3DEngine.BufferAttribute.copyVector2sArray(): vector is undefined', i );
				vector = new Vector2();

			}

			array[ offset ++ ] = vector.x;
			array[ offset ++ ] = vector.y;

		}

		return this;

	},

	copyVector3sArray: function ( vectors ) {

		var array = this.array, offset = 0;

		for ( var i = 0, l = vectors.length; i < l; i ++ ) {

			var vector = vectors[ i ];

			if ( vector === undefined ) {

				console.warn( 'Speed3DEngine.BufferAttribute.copyVector3sArray(): vector is undefined', i );
				vector = new Vector3();

			}

			array[ offset ++ ] = vector.x;
			array[ offset ++ ] = vector.y;
			array[ offset ++ ] = vector.z;

		}

		return this;

	},

	copyVector4sArray: function ( vectors ) {

		var array = this.array, offset = 0;

		for ( var i = 0, l = vectors.length; i < l; i ++ ) {

			var vector = vectors[ i ];

			if ( vector === undefined ) {

				console.warn( 'Speed3DEngine.BufferAttribute.copyVector4sArray(): vector is undefined', i );
				vector = new Vector4();

			}

			array[ offset ++ ] = vector.x;
			array[ offset ++ ] = vector.y;
			array[ offset ++ ] = vector.z;
			array[ offset ++ ] = vector.w;

		}

		return this;

	},

	set: function ( value, offset ) {

		if ( offset === undefined ) offset = 0;

		this.array.set( value, offset );

		return this;

	},

	getX: function ( index ) {

		return this.array[ index * this.itemSize ];

	},

	setX: function ( index, x ) {

		this.array[ index * this.itemSize ] = x;

		return this;

	},

	getY: function ( index ) {

		return this.array[ index * this.itemSize + 1 ];

	},

	setY: function ( index, y ) {

		this.array[ index * this.itemSize + 1 ] = y;

		return this;

	},

	getZ: function ( index ) {

		return this.array[ index * this.itemSize + 2 ];

	},

	setZ: function ( index, z ) {

		this.array[ index * this.itemSize + 2 ] = z;

		return this;

	},

	getW: function ( index ) {

		return this.array[ index * this.itemSize + 3 ];

	},

	setW: function ( index, w ) {

		this.array[ index * this.itemSize + 3 ] = w;

		return this;

	},

	setXY: function ( index, x, y ) {

		index *= this.itemSize;

		this.array[ index + 0 ] = x;
		this.array[ index + 1 ] = y;

		return this;

	},

	setXYZ: function ( index, x, y, z ) {

		index *= this.itemSize;

		this.array[ index + 0 ] = x;
		this.array[ index + 1 ] = y;
		this.array[ index + 2 ] = z;

		return this;

	},

	setXYZW: function ( index, x, y, z, w ) {

		index *= this.itemSize;

		this.array[ index + 0 ] = x;
		this.array[ index + 1 ] = y;
		this.array[ index + 2 ] = z;
		this.array[ index + 3 ] = w;

		return this;

	},

	onUpload: function ( callback ) {

		this.onUploadCallback = callback;

		return this;

	},

	clone: function () {

		return new this.constructor( this.array, this.itemSize ).copy( this );

	}

} );

//

function Int8BufferAttribute( array, itemSize, normalized ) {

	BufferAttribute.call( this, new Int8Array( array ), itemSize, normalized );

}

Int8BufferAttribute.prototype = Object.create( BufferAttribute.prototype );
Int8BufferAttribute.prototype.constructor = Int8BufferAttribute;


function Uint8BufferAttribute( array, itemSize, normalized ) {

	BufferAttribute.call( this, new Uint8Array( array ), itemSize, normalized );

}

Uint8BufferAttribute.prototype = Object.create( BufferAttribute.prototype );
Uint8BufferAttribute.prototype.constructor = Uint8BufferAttribute;


function Uint8ClampedBufferAttribute( array, itemSize, normalized ) {

	BufferAttribute.call( this, new Uint8ClampedArray( array ), itemSize, normalized );

}

Uint8ClampedBufferAttribute.prototype = Object.create( BufferAttribute.prototype );
Uint8ClampedBufferAttribute.prototype.constructor = Uint8ClampedBufferAttribute;


function Int16BufferAttribute( array, itemSize, normalized ) {

	BufferAttribute.call( this, new Int16Array( array ), itemSize, normalized );

}

Int16BufferAttribute.prototype = Object.create( BufferAttribute.prototype );
Int16BufferAttribute.prototype.constructor = Int16BufferAttribute;


function Uint16BufferAttribute( array, itemSize, normalized ) {

	BufferAttribute.call( this, new Uint16Array( array ), itemSize, normalized );

}

Uint16BufferAttribute.prototype = Object.create( BufferAttribute.prototype );
Uint16BufferAttribute.prototype.constructor = Uint16BufferAttribute;


function Int32BufferAttribute( array, itemSize, normalized ) {

	BufferAttribute.call( this, new Int32Array( array ), itemSize, normalized );

}

Int32BufferAttribute.prototype = Object.create( BufferAttribute.prototype );
Int32BufferAttribute.prototype.constructor = Int32BufferAttribute;


function Uint32BufferAttribute( array, itemSize, normalized ) {

	BufferAttribute.call( this, new Uint32Array( array ), itemSize, normalized );

}

Uint32BufferAttribute.prototype = Object.create( BufferAttribute.prototype );
Uint32BufferAttribute.prototype.constructor = Uint32BufferAttribute;


function Float32BufferAttribute( array, itemSize, normalized ) {

	BufferAttribute.call( this, new Float32Array( array ), itemSize, normalized );

}

Float32BufferAttribute.prototype = Object.create( BufferAttribute.prototype );
Float32BufferAttribute.prototype.constructor = Float32BufferAttribute;


function Float64BufferAttribute( array, itemSize, normalized ) {

	BufferAttribute.call( this, new Float64Array( array ), itemSize, normalized );

}

Float64BufferAttribute.prototype = Object.create( BufferAttribute.prototype );
Float64BufferAttribute.prototype.constructor = Float64BufferAttribute;

//

export {
	Float64BufferAttribute,
	Float32BufferAttribute,
	Uint32BufferAttribute,
	Int32BufferAttribute,
	Uint16BufferAttribute,
	Int16BufferAttribute,
	Uint8ClampedBufferAttribute,
	Uint8BufferAttribute,
	Int8BufferAttribute,
	BufferAttribute
};*/

import {Vector4} from '../Datum/Math/Vector4.js';
import {Vector3} from '../Datum/Math/Vector3.js';
import {Vector2} from '../Datum/Math/Vector2.js';
import {Color} from '../Datum/Math/Color.js';

/**
 * @author mrdoob / http://mrdoob.com/
 * @modified by gby
 * @modify date 2018-7-11
 * @modified DongYi 2018/7/19
 */

class BufferAttribute {
    constructor(array, itemSize, normalized) {
        if (Array.isArray(array)) {
            throw new TypeError('Speed3DEngine.BufferAttribute: array should be a Typed Array.');
        }
        this.array = array;
        this.itemSize = itemSize;
        this.normalized = normalized;
        this.name = '';
        this.count = array !== undefined ? array.length / itemSize : 0;
        this.dynamic = false;
        this.updateRange = {offset: 0, count: -1};
        this.version = 0;
        this.isBufferAttribute = true;
        this.needsUpdate;
    }

    set needsUpdate(value) {
        if (value === true) this.version++;
    }

    onUploadCallback() {
    }

    setArray(array) {
        if (Array.isArray(array)) {
            throw new TypeError('Speed3DEngine.BufferAttribute: array should be a Typed Array.');
        }
        this.count = array !== undefined ? array.length / this.itemSize : 0;
        this.array = array;
        return this;
    }

    setDynamic(value) {
        this.dynamic = value;
        return this;
    }

    copy(source) {
        this.name = source.name;
        this.array = new source.array.constructor(source.array);
        this.itemSize = source.itemSize;
        this.count = source.count;
        this.normalized = source.normalized;
        this.dynamic = source.dynamic;
        return this;
    }

    copyAt(index1, attribute, index2) {
        index1 *= this.itemSize;
        index2 *= attribute.itemSize;
        for (let i = 0, l = this.itemSize; i < l; i++) {
            this.array[index1 + i] = attribute.array[index2 + i];
        }
        return this;
    }

    copyArray(array) {
        this.array.set(array);
        return this;
    }

    copyColorsArray(colors) {
        let array = this.array, offset = 0;
        for (let i = 0, l = colors.length; i < l; i++) {
            let color = colors[i];
            if (color === undefined) {
                console.warn('Speed3DEngine.BufferAttribute.copyColorsArray(): color is undefined', i);
                color = new Color();
            }
            array[offset++] = color.r;
            array[offset++] = color.g;
            array[offset++] = color.b;
        }
        return this;
    }

    copyVector2sArray(vectors) {
        let array = this.array, offset = 0;
        for (let i = 0, l = vectors.length; i < l; i++) {
            let vector = vectors[i];
            if (vector === undefined) {
                console.warn('Speed3DEngine.BufferAttribute.copyVector2sArray(): vector is undefined', i);
                vector = new Vector2();
            }
            array[offset++] = vector.x;
            array[offset++] = vector.y;
        }
        return this;
    }

    copyVector3sArray(vectors) {
        let array = this.array, offset = 0;
        for (let i = 0, l = vectors.length; i < l; i++) {
            let vector = vectors[i];
            if (vector === undefined) {
                console.warn('Speed3DEngine.BufferAttribute.copyVector3sArray(): vector is undefined', i);
                vector = new Vector3();
            }
            array[offset++] = vector.x;
            array[offset++] = vector.y;
            array[offset++] = vector.z;
        }
        return this;
    }

    copyVector4sArray(vectors) {
        let array = this.array, offset = 0;
        for (let i = 0, l = vectors.length; i < l; i++) {
            let vector = vectors[i];
            if (vector === undefined) {
                console.warn('Speed3DEngine.BufferAttribute.copyVector4sArray(): vector is undefined', i);
                vector = new Vector4();
            }
            array[offset++] = vector.x;
            array[offset++] = vector.y;
            array[offset++] = vector.z;
            array[offset++] = vector.w;

        }
        return this;
    }

    set(value, offset = 0) {
        this.array.set(value, offset);
        return this;
    }

    getX(index) {
        return this.array[index * this.itemSize];
    }

    setX(index, x) {
        this.array[index * this.itemSize] = x;
        return this;
    }

    getY(index) {
        return this.array[index * this.itemSize + 1];
    }

    setY(index, y) {
        this.array[index * this.itemSize + 1] = y;
        return this;
    }

    getZ(index) {
        return this.array[index * this.itemSize + 2];
    }

    setZ(index, z) {
        this.array[index * this.itemSize + 2] = z;
        return this;
    }

    getW(index) {
        return this.array[index * this.itemSize + 3];
    }

    setW(index, w) {
        this.array[index * this.itemSize + 3] = w;
        return this;
    }

    setXY(index, x, y) {
        index *= this.itemSize;
        this.array[index + 0] = x;
        this.array[index + 1] = y;
        return this;
    }

    setXYZ(index, x, y, z) {
        index *= this.itemSize;
        this.array[index + 0] = x;
        this.array[index + 1] = y;
        this.array[index + 2] = z;
        return this;
    }

    setXYZW(index, x, y, z, w) {
        index *= this.itemSize;
        this.array[index + 0] = x;
        this.array[index + 1] = y;
        this.array[index + 2] = z;
        this.array[index + 3] = w;
        return this;
    }

    onUpload(callback) {
        this.onUploadCallback = callback;
        return this;
    }

    clone() {
        return new this.constructor(this.array, this.itemSize).copy(this);
    }

}

class Int8BufferAttribute extends BufferAttribute {
    constructor(array, itemSize, normalized) {
        super(new Int8Array(array), itemSize, normalized);
    }
}

class Uint8BufferAttribute extends BufferAttribute {
    constructor(array, itemSize, normalized) {
        super(new Uint8Array(array), itemSize, normalized)
    }
}

class Uint8ClampedBufferAttribute extends BufferAttribute {
    constructor(array, itemSize, normalized) {
        super(new Uint8ClampedArray(array), itemSize, normalized)
    }
}

class Int16BufferAttribute extends BufferAttribute {
    constructor(array, itemSize, normalized) {
        super(new Int16Array(array), itemSize, normalized)
    }
}

class Uint16BufferAttribute extends BufferAttribute {
    constructor(array, itemSize, normalized) {
        super(new Uint16Array(array), itemSize, normalized)
    }
}

class Int32BufferAttribute extends BufferAttribute {
    constructor(array, itemSize, normalized) {
        super(new Int32Array(array), itemSize, normalized)
    }
}

class Uint32BufferAttribute extends BufferAttribute {
    constructor(array, itemSize, normalized) {
        super(new Uint32Array(array), itemSize, normalized)
    }
}

class Float32BufferAttribute extends BufferAttribute {
    constructor(array, itemSize, normalized) {
        super(new Float32Array(array), itemSize, normalized)
    }
}

class Float64BufferAttribute extends BufferAttribute {
    constructor(array, itemSize, normalized) {
        super(new Float64Array(array), itemSize, normalized)
    }
}

export {
    Float64BufferAttribute,
    Float32BufferAttribute,
    Uint32BufferAttribute,
    Int32BufferAttribute,
    Uint16BufferAttribute,
    Int16BufferAttribute,
    Uint8ClampedBufferAttribute,
    Uint8BufferAttribute,
    Int8BufferAttribute,
    BufferAttribute
};
