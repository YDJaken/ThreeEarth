/**
 * @author wangzhidong
 * @modified DongYi 2018/06/27
 */

import {CubeTexture} from "../../Assets/CubeTexture.js";
import {Texture} from "../../Assets/Texture.js";

/*// --- Base for inner nodes (including the root) ---

function UniformContainer() {

    this.seq = [];
    this.map = {};

}

// --- Utilities ---

// Array Caches (provide typed arrays for temporary by size)

var arrayCacheF32 = [];
var arrayCacheI32 = [];

// Float32Array caches used for uploading Matrix uniforms

var mat4array = new Float32Array( 16 );
var mat3array = new Float32Array( 9 );
var mat2array = new Float32Array( 4 );

// Flattening for arrays of vectors and matrices

function flatten( array, nBlocks, blockSize ) {

    var firstElem = array[ 0 ];

    if ( firstElem <= 0 || firstElem > 0 ) return array;
    // unoptimized: ! isNaN( firstElem )
    // see http://jacksondunstan.com/articles/983

    var n = nBlocks * blockSize,
        r = arrayCacheF32[ n ];

    if ( r === undefined ) {

        r = new Float32Array( n );
        arrayCacheF32[ n ] = r;

    }

    if ( nBlocks !== 0 ) {

        firstElem.toArray( r, 0 );

        for ( var i = 1, offset = 0; i !== nBlocks; ++ i ) {

            offset += blockSize;
            array[ i ].toArray( r, offset );

        }

    }

    return r;

}

function arraysEqual( a, b ) {

    if ( a.length !== b.length ) return false;

    for ( var i = 0, l = a.length; i < l; i ++ ) {

        if ( a[ i ] !== b[ i ] ) return false;

    }

    return true;

}

function copyArray( a, b ) {

    for ( var i = 0, l = b.length; i < l; i ++ ) {

        a[ i ] = b[ i ];

    }

}

// Texture unit allocation

function allocTexUnits( renderer, n ) {

    var r = arrayCacheI32[ n ];

    if ( r === undefined ) {

        r = new Int32Array( n );
        arrayCacheI32[ n ] = r;

    }

    for ( var i = 0; i !== n; ++ i )
        r[ i ] = renderer.allocTextureUnit();

    return r;

}

// --- Setters ---

// Note: Defining these methods externally, because they come in a bunch
// and this way their names minify.

// Single scalar

function setValue1f( gl, v ) {

    var cache = this.cache;

    if ( cache[ 0 ] === v ) return;

    gl.uniform1f( this.addr, v );

    cache[ 0 ] = v;

}

function setValue1i( gl, v ) {

    var cache = this.cache;

    if ( cache[ 0 ] === v ) return;

    gl.uniform1i( this.addr, v );

    cache[ 0 ] = v;

}

// Single float vector (from flat array or Speed3D.VectorN)

function setValue2fv( gl, v ) {

    var cache = this.cache;

    if ( v.x !== undefined ) {

        if ( cache[ 0 ] !== v.x || cache[ 1 ] !== v.y ) {

            gl.uniform2f( this.addr, v.x, v.y );

            cache[ 0 ] = v.x;
            cache[ 1 ] = v.y;

        }

    } else {

        if ( arraysEqual( cache, v ) ) return;

        gl.uniform2fv( this.addr, v );

        copyArray( cache, v );

    }

}

function setValue3fv( gl, v ) {

    var cache = this.cache;

    if ( v.x !== undefined ) {

        if ( cache[ 0 ] !== v.x || cache[ 1 ] !== v.y || cache[ 2 ] !== v.z ) {

            gl.uniform3f( this.addr, v.x, v.y, v.z );

            cache[ 0 ] = v.x;
            cache[ 1 ] = v.y;
            cache[ 2 ] = v.z;

        }

    } else if ( v.r !== undefined ) {

        if ( cache[ 0 ] !== v.r || cache[ 1 ] !== v.g || cache[ 2 ] !== v.b ) {

            gl.uniform3f( this.addr, v.r, v.g, v.b );

            cache[ 0 ] = v.r;
            cache[ 1 ] = v.g;
            cache[ 2 ] = v.b;

        }

    } else {

        if ( arraysEqual( cache, v ) ) return;

        gl.uniform3fv( this.addr, v );

        copyArray( cache, v );

    }

}

function setValue4fv( gl, v ) {

    var cache = this.cache;

    if ( v.x !== undefined ) {

        if ( cache[ 0 ] !== v.x || cache[ 1 ] !== v.y || cache[ 2 ] !== v.z || cache[ 3 ] !== v.w ) {

            gl.uniform4f( this.addr, v.x, v.y, v.z, v.w );

            cache[ 0 ] = v.x;
            cache[ 1 ] = v.y;
            cache[ 2 ] = v.z;
            cache[ 3 ] = v.w;

        }

    } else {

        if ( arraysEqual( cache, v ) ) return;

        gl.uniform4fv( this.addr, v );

        copyArray( cache, v );

    }

}

// Single matrix (from flat array or MatrixN)

function setValue2fm( gl, v ) {

    var cache = this.cache;
    var elements = v.elements;

    if ( elements === undefined ) {

        if ( arraysEqual( cache, v ) ) return;

        gl.uniformMatrix2fv( this.addr, false, v );

        copyArray( cache, v );

    } else {

        if ( arraysEqual( cache, elements ) ) return;

        mat2array.set( elements );

        gl.uniformMatrix2fv( this.addr, false, mat2array );

        copyArray( cache, elements );

    }

}

function setValue3fm( gl, v ) {

    var cache = this.cache;
    var elements = v.elements;

    if ( elements === undefined ) {

        if ( arraysEqual( cache, v ) ) return;

        gl.uniformMatrix3fv( this.addr, false, v );

        copyArray( cache, v );

    } else {

        if ( arraysEqual( cache, elements ) ) return;

        mat3array.set( elements );

        gl.uniformMatrix3fv( this.addr, false, mat3array );

        copyArray( cache, elements );

    }

}

function setValue4fm( gl, v ) {

    var cache = this.cache;
    var elements = v.elements;

    if ( elements === undefined ) {

        if ( arraysEqual( cache, v ) ) return;

        gl.uniformMatrix4fv( this.addr, false, v );

        copyArray( cache, v );

    } else {

        if ( arraysEqual( cache, elements ) ) return;

        mat4array.set( elements );

        gl.uniformMatrix4fv( this.addr, false, mat4array );

        copyArray( cache, elements );

    }

}

// Single texture (2D / Cube)

function setValueT1( gl, v, renderer ) {

    var cache = this.cache;
    var unit = renderer.allocTextureUnit();

    if ( cache[ 0 ] !== unit ) {

        gl.uniform1i( this.addr, unit );
        cache[ 0 ] = unit;

    }

    renderer.setTexture2D( v || emptyTexture, unit );

}

function setValueT6( gl, v, renderer ) {

    var cache = this.cache;
    var unit = renderer.allocTextureUnit();

    if ( cache[ 0 ] !== unit ) {

        gl.uniform1i( this.addr, unit );
        cache[ 0 ] = unit;

    }

    renderer.setTextureCube( v || emptyCubeTexture, unit );

}

// Integer / Boolean vectors or arrays thereof (always flat arrays)

function setValue2iv( gl, v ) {

    var cache = this.cache;

    if ( arraysEqual( cache, v ) ) return;

    gl.uniform2iv( this.addr, v );

    copyArray( cache, v );

}

function setValue3iv( gl, v ) {

    var cache = this.cache;

    if ( arraysEqual( cache, v ) ) return;

    gl.uniform3iv( this.addr, v );

    copyArray( cache, v );

}

function setValue4iv( gl, v ) {

    var cache = this.cache;

    if ( arraysEqual( cache, v ) ) return;

    gl.uniform4iv( this.addr, v );

    copyArray( cache, v );

}

// Helper to pick the right setter for the singular case

function getSingularSetter( type ) {

    switch ( type ) {

        case 0x1406: return setValue1f; // FLOAT
        case 0x8b50: return setValue2fv; // _VEC2
        case 0x8b51: return setValue3fv; // _VEC3
        case 0x8b52: return setValue4fv; // _VEC4

        case 0x8b5a: return setValue2fm; // _MAT2
        case 0x8b5b: return setValue3fm; // _MAT3
        case 0x8b5c: return setValue4fm; // _MAT4

        case 0x8b5e: case 0x8d66: return setValueT1; // SAMPLER_2D, SAMPLER_EXTERNAL_OES
        case 0x8b60: return setValueT6; // SAMPLER_CUBE

        case 0x1404: case 0x8b56: return setValue1i; // INT, BOOL
        case 0x8b53: case 0x8b57: return setValue2iv; // _VEC2
        case 0x8b54: case 0x8b58: return setValue3iv; // _VEC3
        case 0x8b55: case 0x8b59: return setValue4iv; // _VEC4

    }

}

// Array of scalars

function setValue1fv( gl, v ) {

    var cache = this.cache;

    if ( arraysEqual( cache, v ) ) return;

    gl.uniform1fv( this.addr, v );

    copyArray( cache, v );

}
function setValue1iv( gl, v ) {

    var cache = this.cache;

    if ( arraysEqual( cache, v ) ) return;

    gl.uniform1iv( this.addr, v );

    copyArray( cache, v );

}

// Array of vectors (flat or from Speed3D classes)

function setValueV2a( gl, v ) {

    var cache = this.cache;
    var data = flatten( v, this.size, 2 );

    if ( arraysEqual( cache, data ) ) return;

    gl.uniform2fv( this.addr, data );

    this.updateCache( data );

}

function setValueV3a( gl, v ) {

    var cache = this.cache;
    var data = flatten( v, this.size, 3 );

    if ( arraysEqual( cache, data ) ) return;

    gl.uniform3fv( this.addr, data );

    this.updateCache( data );

}

function setValueV4a( gl, v ) {

    var cache = this.cache;
    var data = flatten( v, this.size, 4 );

    if ( arraysEqual( cache, data ) ) return;

    gl.uniform4fv( this.addr, data );

    this.updateCache( data );

}

// Array of matrices (flat or from Speed3D clases)

function setValueM2a( gl, v ) {

    var cache = this.cache;
    var data = flatten( v, this.size, 4 );

    if ( arraysEqual( cache, data ) ) return;

    gl.uniformMatrix2fv( this.addr, false, data );

    this.updateCache( data );

}

function setValueM3a( gl, v ) {

    var cache = this.cache;
    var data = flatten( v, this.size, 9 );

    if ( arraysEqual( cache, data ) ) return;

    gl.uniformMatrix3fv( this.addr, false, data );

    this.updateCache( data );

}

function setValueM4a( gl, v ) {

    var cache = this.cache;
    var data = flatten( v, this.size, 16 );

    if ( arraysEqual( cache, data ) ) return;

    gl.uniformMatrix4fv( this.addr, false, data );

    this.updateCache( data );

}

// Array of textures (2D / Cube)

function setValueT1a( gl, v, renderer ) {

    var cache = this.cache;
    var n = v.length;

    var units = allocTexUnits( renderer, n );

    if ( arraysEqual( cache, units ) === false ) {

        gl.uniform1iv( this.addr, units );
        copyArray( cache, units );

    }

    for ( var i = 0; i !== n; ++ i ) {

        renderer.setTexture2D( v[ i ] || emptyTexture, units[ i ] );

    }

}

function setValueT6a( gl, v, renderer ) {

    var cache = this.cache;
    var n = v.length;

    var units = allocTexUnits( renderer, n );

    if ( arraysEqual( cache, units ) === false ) {

        gl.uniform1iv( this.addr, units );
        copyArray( cache, units );

    }

    for ( var i = 0; i !== n; ++ i ) {

        renderer.setTextureCube( v[ i ] || emptyCubeTexture, units[ i ] );

    }

}

// Helper to pick the right setter for a pure (bottom-level) array

function getPureArraySetter( type ) {

    switch ( type ) {

        case 0x1406: return setValue1fv; // FLOAT
        case 0x8b50: return setValueV2a; // _VEC2
        case 0x8b51: return setValueV3a; // _VEC3
        case 0x8b52: return setValueV4a; // _VEC4

        case 0x8b5a: return setValueM2a; // _MAT2
        case 0x8b5b: return setValueM3a; // _MAT3
        case 0x8b5c: return setValueM4a; // _MAT4

        case 0x8b5e: return setValueT1a; // SAMPLER_2D
        case 0x8b60: return setValueT6a; // SAMPLER_CUBE

        case 0x1404: case 0x8b56: return setValue1iv; // INT, BOOL
        case 0x8b53: case 0x8b57: return setValue2iv; // _VEC2
        case 0x8b54: case 0x8b58: return setValue3iv; // _VEC3
        case 0x8b55: case 0x8b59: return setValue4iv; // _VEC4

    }

}

// --- Uniform Classes ---

function SingleUniform( id, activeInfo, addr ) {

    this.id = id;
    this.addr = addr;
    this.cache = [];
    this.setValue = getSingularSetter( activeInfo.type );

    // this.path = activeInfo.name; // DEBUG

}

function PureArrayUniform( id, activeInfo, addr ) {

    this.id = id;
    this.addr = addr;
    this.cache = [];
    this.size = activeInfo.size;
    this.setValue = getPureArraySetter( activeInfo.type );

    // this.path = activeInfo.name; // DEBUG

}

PureArrayUniform.prototype.updateCache = function ( data ) {

    var cache = this.cache;

    if ( data instanceof Float32Array && cache.length !== data.length ) {

        this.cache = new Float32Array( data.length );

    }

    copyArray( cache, data );

};

function StructuredUniform( id ) {

    this.id = id;

    UniformContainer.call( this ); // mix-in

}

StructuredUniform.prototype.setValue = function ( gl, value ) {

    // Note: Don't need an extra 'renderer' parameter, since samplers
    // are not allowed in structured uniforms.

    var seq = this.seq;

    for ( var i = 0, n = seq.length; i !== n; ++ i ) {

        var u = seq[ i ];
        u.setValue( gl, value[ u.id ] );

    }

};

// --- Top-level ---

// Parser - builds up the property tree from the path strings

var RePathPart = /([\w\d_]+)(\])?(\[|\.)?/g;

// extracts
// 	- the identifier (member name or array index)
//  - followed by an optional right bracket (found when array index)
//  - followed by an optional left bracket or dot (type of subscript)
//
// Note: These portions can be read in a non-overlapping fashion and
// allow straightforward parsing of the hierarchy that WebGL encodes
// in the uniform names.

function addUniform( container, uniformObject ) {

    container.seq.push( uniformObject );
    container.map[ uniformObject.id ] = uniformObject;

}

function parseUniform( activeInfo, addr, container ) {

    var path = activeInfo.name,
        pathLength = path.length;

    // reset RegExp object, because of the early exit of a previous run
    RePathPart.lastIndex = 0;

    while ( true ) {

        var match = RePathPart.exec( path ),
            matchEnd = RePathPart.lastIndex,

            id = match[ 1 ],
            idIsIndex = match[ 2 ] === ']',
            subscript = match[ 3 ];

        if ( idIsIndex ) id = id | 0; // convert to integer

        if ( subscript === undefined || subscript === '[' && matchEnd + 2 === pathLength ) {

            // bare name or "pure" bottom-level array "[0]" suffix

            addUniform( container, subscript === undefined ?
                new SingleUniform( id, activeInfo, addr ) :
                new PureArrayUniform( id, activeInfo, addr ) );

            break;

        } else {

            // step into inner node / create it in case it doesn't exist

            var map = container.map, next = map[ id ];

            if ( next === undefined ) {

                next = new StructuredUniform( id );
                addUniform( container, next );

            }

            container = next;

        }

    }

}

// Root Container

function WebGLUniforms( gl, program, renderer ) {

    UniformContainer.call( this );

    this.renderer = renderer;

    var n = gl.getProgramParameter( program, gl.ACTIVE_UNIFORMS );

    for ( var i = 0; i < n; ++ i ) {

        var info = gl.getActiveUniform( program, i ),
            addr = gl.getUniformLocation( program, info.name );

        parseUniform( info, addr, this );

    }

}

WebGLUniforms.prototype.setValue = function ( gl, name, value ) {

    var u = this.map[ name ];

    if ( u !== undefined ) u.setValue( gl, value, this.renderer );

};

WebGLUniforms.prototype.setOptional = function ( gl, object, name ) {

    var v = object[ name ];

    if ( v !== undefined ) this.setValue( gl, name, v );

};


// Static interface

WebGLUniforms.upload = function ( gl, seq, values, renderer ) {

    for ( var i = 0, n = seq.length; i !== n; ++ i ) {

        var u = seq[ i ],
            v = values[ u.id ];

        if ( v.needsUpdate !== false ) {

            // note: always updating when .needsUpdate is undefined
            u.setValue( gl, v.value, renderer );

        }

    }

};

WebGLUniforms.seqWithValue = function ( seq, values ) {

    var r = [];

    for ( var i = 0, n = seq.length; i !== n; ++ i ) {

        var u = seq[ i ];
        if ( u.id in values ) r.push( u );

    }

    return r;

};*/


var emptyTexture = new Texture();
var emptyCubeTexture = new CubeTexture();
var arrayCacheF32 = [];
var arrayCacheI32 = [];
var mat4array = new Float32Array(16);
var mat3array = new Float32Array(9);
var mat2array = new Float32Array(4);

class UniformContainer {
    constructor() {
        this.seq = [];
        this.map = {};
    }
}

class StructuredUniform extends UniformContainer {
    constructor(id) {
        super();
        this.id = id;
    }

    setValue(gl, value) {
        let seq = this.seq;
        for (let i = 0, n = seq.length; i !== n; ++i) {
            let u = seq[i];
            u.setValue(gl, value[u.id]);
        }
    }
}

class SingleUniform {
    constructor(id, activeInfo, addr) {
        this.id = id;
        this.addr = addr;
        this.cache = [];
        this.setValue = this.getSingularSetter(activeInfo.type);
        this.path = activeInfo.name;
    }

    setValue1f(gl, v) {
        let cache = this.cache;
        if (cache[0] === v) return;
        gl.uniform1f(this.addr, v);
        cache[0] = v;
    }

    setValue1i(gl, v) {
        let cache = this.cache;
        if (cache[0] === v) return;
        gl.uniform1i(this.addr, v);
        cache[0] = v;
    }

    setValue2fv(gl, v) {
        let cache = this.cache;
        if (v.x !== undefined) {
            if (cache[0] !== v.x || cache[1] !== v.y) {
                gl.uniform2f(this.addr, v.x, v.y);
                cache[0] = v.x;
                cache[1] = v.y;
            }
        } else {
            if (WebGLUniforms.arraysEqual(cache, v)) return;
            gl.uniform2fv(this.addr, v);
            WebGLUniforms.copyArray(cache, v);
        }
    }

    setValue3fv(gl, v) {
        let cache = this.cache;
        if (v.x !== undefined) {
            if (cache[0] !== v.x || cache[1] !== v.y || cache[2] !== v.z) {
                gl.uniform3f(this.addr, v.x, v.y, v.z);
                cache[0] = v.x;
                cache[1] = v.y;
                cache[2] = v.z;
            }
        } else if (v.r !== undefined) {
            if (cache[0] !== v.r || cache[1] !== v.g || cache[2] !== v.b) {
                gl.uniform3f(this.addr, v.r, v.g, v.b);
                cache[0] = v.r;
                cache[1] = v.g;
                cache[2] = v.b;
            }
        } else {

            if (WebGLUniforms.arraysEqual(cache, v)) return;
            gl.uniform3fv(this.addr, v);
            WebGLUniforms.copyArray(cache, v);
        }
    }

    setValue4fv(gl, v) {
        let cache = this.cache;
        if (v.x !== undefined) {
            if (cache[0] !== v.x || cache[1] !== v.y || cache[2] !== v.z || cache[3] !== v.w) {
                gl.uniform4f(this.addr, v.x, v.y, v.z, v.w);
                cache[0] = v.x;
                cache[1] = v.y;
                cache[2] = v.z;
                cache[3] = v.w;
            }
        } else {
            if (WebGLUniforms.arraysEqual(cache, v)) return;
            gl.uniform4fv(this.addr, v);
            WebGLUniforms.copyArray(cache, v);
        }
    }

    setValue2fm(gl, v) {
        let cache = this.cache;
        let elements = v.elements;
        if (elements === undefined) {
            if (WebGLUniforms.arraysEqual(cache, v)) return;
            gl.uniformMatrix2fv(this.addr, false, v);
            WebGLUniforms.copyArray(cache, v);
        } else {
            if (WebGLUniforms.arraysEqual(cache, elements)) return;
            mat2array.set(elements);
            gl.uniformMatrix2fv(this.addr, false, mat2array);
            WebGLUniforms.copyArray(cache, elements);
        }
    }

    setValue3fm(gl, v) {
        let cache = this.cache;
        let elements = v.elements;
        if (elements === undefined) {
            if (WebGLUniforms.arraysEqual(cache, v)) return;
            gl.uniformMatrix3fv(this.addr, false, v);
            WebGLUniforms.copyArray(cache, v);
        } else {
            if (WebGLUniforms.arraysEqual(cache, elements)) return;
            mat3array.set(elements);
            gl.uniformMatrix3fv(this.addr, false, mat3array);
            WebGLUniforms.copyArray(cache, elements);
        }
    }

    setValue4fm(gl, v) {
        let cache = this.cache;
        let elements = v.elements;
        if (elements === undefined) {
            if (WebGLUniforms.arraysEqual(cache, v)) return;
            gl.uniformMatrix4fv(this.addr, false, v);
            WebGLUniforms.copyArray(cache, v);
        } else {
            if (WebGLUniforms.arraysEqual(cache, elements)) return;
            mat4array.set(elements);
            gl.uniformMatrix4fv(this.addr, false, mat4array);
            WebGLUniforms.copyArray(cache, elements);
        }
    }

    setValueT1(gl, v, renderer) {
        let cache = this.cache;
        let unit = renderer.allocTextureUnit();
        if (cache[0] !== unit) {
            gl.uniform1i(this.addr, unit);
            cache[0] = unit;
        }
        renderer.setTexture2D(v || emptyTexture, unit);
    }

    setValueT6(gl, v, renderer) {
        let cache = this.cache;
        let unit = renderer.allocTextureUnit();
        if (cache[0] !== unit) {
            gl.uniform1i(this.addr, unit);
            cache[0] = unit;
        }
        renderer.setTextureCube(v || emptyCubeTexture, unit);
    }

    setValue2iv(gl, v) {
        let cache = this.cache;
        if (WebGLUniforms.arraysEqual(cache, v)) return;
        gl.uniform2iv(this.addr, v);
        WebGLUniforms.copyArray(cache, v);
    }

    setValue3iv(gl, v) {
        let cache = this.cache;
        if (WebGLUniforms.arraysEqual(cache, v)) return;
        gl.uniform3iv(this.addr, v);
        WebGLUniforms.copyArray(cache, v);
    }

    setValue4iv(gl, v) {
        let cache = this.cache;
        if (WebGLUniforms.arraysEqual(cache, v)) return;
        gl.uniform4iv(this.addr, v);
        WebGLUniforms.copyArray(cache, v);
    }

    getSingularSetter(type) {
        switch (type) {
            case 0x1406:
                return this.setValue1f; // FLOAT
            case 0x8b50:
                return this.setValue2fv; // _VEC2
            case 0x8b51:
                return this.setValue3fv; // _VEC3
            case 0x8b52:
                return this.setValue4fv; // _VEC4
            case 0x8b5a:
                return this.setValue2fm; // _MAT2
            case 0x8b5b:
                return this.setValue3fm; // _MAT3
            case 0x8b5c:
                return this.setValue4fm; // _MAT4
            case 0x8b5e:
            case 0x8d66:
                return this.setValueT1; // SAMPLER_2D, SAMPLER_EXTERNAL_OES
            case 0x8b60:
                return this.setValueT6; // SAMPLER_CUBE
            case 0x1404:
            case 0x8b56:
                return this.setValue1i; // INT, BOOL
            case 0x8b53:
            case 0x8b57:
                return this.setValue2iv; // _VEC2
            case 0x8b54:
            case 0x8b58:
                return this.setValue3iv; // _VEC3
            case 0x8b55:
            case 0x8b59:
                return this.setValue4iv; // _VEC4
        }
    }
}

class PureArrayUniform {
    constructor(id, activeInfo, addr) {
        this.id = id;
        this.addr = addr;
        this.cache = [];
        this.size = activeInfo.size;
        this.setValue = this.getPureArraySetter(activeInfo.type);
        this.path = activeInfo.name;
    }

    updateCache(data) {
        let cache = this.cache;
        if (data instanceof Float32Array && cache.length !== data.length) {
            this.cache = new Float32Array(data.length);
        }
        WebGLUniforms.copyArray(cache, data);
    }

    setValue1fv(gl, v) {
        let cache = this.cache;
        if (WebGLUniforms.arraysEqual(cache, v)) return;
        gl.uniform1fv(this.addr, v);
        WebGLUniforms.copyArray(cache, v);
    }

    setValue1iv(gl, v) {
        let cache = this.cache;
        if (WebGLUniforms.arraysEqual(cache, v)) return;
        gl.uniform1iv(this.addr, v);
        WebGLUniforms.copyArray(cache, v);
    }

    setValueV2a(gl, v) {
        let cache = this.cache;
        let data = WebGLUniforms.flatten(v, this.size, 2);
        if (WebGLUniforms.arraysEqual(cache, data)) return;
        gl.uniform2fv(this.addr, data);
        this.updateCache(data);
    }

    setValueV3a(gl, v) {
        let cache = this.cache;
        let data = WebGLUniforms.flatten(v, this.size, 3);
        if (WebGLUniforms.arraysEqual(cache, data)) return;
        gl.uniform3fv(this.addr, data);
        this.updateCache(data);
    }

    setValueV4a(gl, v) {
        let cache = this.cache;
        let data = WebGLUniforms.flatten(v, this.size, 4);
        if (WebGLUniforms.arraysEqual(cache, data)) return;
        gl.uniform4fv(this.addr, data);
        this.updateCache(data);
    }

    setValueM2a(gl, v) {
        let cache = this.cache;
        let data = WebGLUniforms.flatten(v, this.size, 4);
        if (WebGLUniforms.arraysEqual(cache, data)) return;
        gl.uniformMatrix2fv(this.addr, false, data);
        this.updateCache(data);
    }

    setValueM3a(gl, v) {
        let cache = this.cache;
        let data = WebGLUniforms.flatten(v, this.size, 9);
        if (WebGLUniforms.arraysEqual(cache, data)) return;
        gl.uniformMatrix3fv(this.addr, false, data);
        this.updateCache(data);
    }

    setValueM4a(gl, v) {
        let cache = this.cache;
        let data = WebGLUniforms.flatten(v, this.size, 16);
        if (WebGLUniforms.arraysEqual(cache, data)) return;
        gl.uniformMatrix4fv(this.addr, false, data);
        this.updateCache(data);
    }

    setValueT1a(gl, v, renderer) {
        let cache = this.cache;
        let n = v.length;
        let units = WebGLUniforms.allocTexUnits(renderer, n);
        if (WebGLUniforms.arraysEqual(cache, units) === false) {
            gl.uniform1iv(this.addr, units);
            WebGLUniforms.copyArray(cache, units);
        }
        for (let i = 0; i !== n; ++i) {
            renderer.setTexture2D(v[i] || emptyTexture, units[i]);
        }
    }

    setValueT6a(gl, v, renderer) {
        let cache = this.cache;
        let n = v.length;
        let units = WebGLUniforms.allocTexUnits(renderer, n);
        if (WebGLUniforms.arraysEqual(cache, units) === false) {
            gl.uniform1iv(this.addr, units);
            WebGLUniforms.copyArray(cache, units);
        }
        for (let i = 0; i !== n; ++i) {
            renderer.setTextureCube(v[i] || emptyCubeTexture, units[i]);
        }
    }

    setValue2iv(gl, v) {
        let cache = this.cache;
        if (WebGLUniforms.arraysEqual(cache, v)) return;
        gl.uniform2iv(this.addr, v);
        WebGLUniforms.copyArray(cache, v);
    }

    setValue3iv(gl, v) {
        let cache = this.cache;
        if (WebGLUniforms.arraysEqual(cache, v)) return;
        gl.uniform3iv(this.addr, v);
        WebGLUniforms.copyArray(cache, v);
    }

    setValue4iv(gl, v) {
        let cache = this.cache;
        if (WebGLUniforms.arraysEqual(cache, v)) return;
        gl.uniform4iv(this.addr, v);
        WebGLUniforms.copyArray(cache, v);
    }

    getPureArraySetter(type) {
        switch (type) {
            case 0x1406:
                return this.setValue1fv; // FLOAT
            case 0x8b50:
                return this.setValueV2a; // _VEC2
            case 0x8b51:
                return this.setValueV3a; // _VEC3
            case 0x8b52:
                return this.setValueV4a; // _VEC4
            case 0x8b5a:
                return this.setValueM2a; // _MAT2
            case 0x8b5b:
                return this.setValueM3a; // _MAT3
            case 0x8b5c:
                return this.setValueM4a; // _MAT4
            case 0x8b5e:
                return this.setValueT1a; // SAMPLER_2D
            case 0x8b60:
                return this.setValueT6a; // SAMPLER_CUBE
            case 0x1404:
            case 0x8b56:
                return this.setValue1iv; // INT, BOOL
            case 0x8b53:
            case 0x8b57:
                return this.setValue2iv; // _VEC2
            case 0x8b54:
            case 0x8b58:
                return this.setValue3iv; // _VEC3
            case 0x8b55:
            case 0x8b59:
                return this.setValue4iv; // _VEC4
        }
    }
}

class WebGLUniforms extends UniformContainer {
    constructor(gl, program, renderer) {
        super();
        this.renderer = renderer;
        let n = gl.getProgramParameter(program, gl.ACTIVE_UNIFORMS);
        for (let i = 0; i < n; ++i) {
            let info = gl.getActiveUniform(program, i),
                addr = gl.getUniformLocation(program, info.name);
            WebGLUniforms.parseUniform(info, addr, this);
        }
    }

    setValue(gl, name, value) {
        let u = this.map[name];
        if (u !== undefined) u.setValue(gl, value, this.renderer);
    }

    setOptional(gl, object, name) {
        let v = object[name];
        if (v !== undefined) this.setValue(gl, name, v);
    }

    static seqWithValue(seq, values) {
        let r = [];
        for (let i = 0, n = seq.length; i !== n; ++i) {
            let u = seq[i];
            if (u.id in values) r.push(u);
        }
        return r;
    }

    static upload(gl, seq, values, renderer) {
        for (let i = 0, n = seq.length; i !== n; ++i) {
            let u = seq[i],
                v = values[u.id];
            if (v.needsUpdate !== false) {
                // note: always updating when .needsUpdate is undefined
                u.setValue(gl, v.value, renderer);
            }
        }
    }

    static flatten(array, nBlocks, blockSize) {
        let firstElem = array[0];
        if (firstElem <= 0 || firstElem > 0) return array;
        // unoptimized: ! isNaN( firstElem )
        // see http://jacksondunstan.com/articles/983
        let n = nBlocks * blockSize,
            r = arrayCacheF32[n];
        if (r === undefined) {
            r = new Float32Array(n);
            arrayCacheF32[n] = r;
        }
        if (nBlocks !== 0) {
            firstElem.toArray(r, 0);
            for (let i = 1, offset = 0; i !== nBlocks; ++i) {
                offset += blockSize;
                array[i].toArray(r, offset);
            }
        }
        return r;
    }

    static arraysEqual(a, b) {
        if (a.length !== b.length) return false;
        for (let i = 0, l = a.length; i < l; i++) {
            if (a[i] !== b[i]) return false;
        }
        return true;
    }

    static copyArray(a, b) {
        for (let i = 0, l = b.length; i < l; i++) {
            a[i] = b[i];
        }
    }

    static allocTexUnits(renderer, n) {
        let r = arrayCacheI32[n];
        if (r === undefined) {
            r = new Int32Array(n);
            arrayCacheI32[n] = r;
        }
        for (let i = 0; i !== n; ++i)
            r[i] = renderer.allocTextureUnit();
        return r;
    }

    static addUniform(container, uniformObject) {
        container.seq.push(uniformObject);
        container.map[uniformObject.id] = uniformObject;
    }

    static parseUniform(activeInfo, addr, container) {
        let RePathPart = /([\w\d_]+)(\])?(\[|\.)?/g;
        let path = activeInfo.name,
            pathLength = path.length;
        // reset RegExp object, because of the early exit of a previous run
        RePathPart.lastIndex = 0;
        while (true) {
            let match = RePathPart.exec(path),
                matchEnd = RePathPart.lastIndex,
                id = match[1],
                idIsIndex = match[2] === ']',
                subscript = match[3];
            if (idIsIndex) id = id | 0; // convert to integer
            if (subscript === undefined || subscript === '[' && matchEnd + 2 === pathLength) {
                // bare name or "pure" bottom-level array "[0]" suffix
                WebGLUniforms.addUniform(container, subscript === undefined ?
                    new SingleUniform(id, activeInfo, addr) :
                    new PureArrayUniform(id, activeInfo, addr));
                break;
            } else {
                // step into inner node / create it in case it doesn't exist
                let map = container.map, next = map[id];
                if (next === undefined) {
                    next = new StructuredUniform(id);
                    WebGLUniforms.addUniform(container, next);
                }
                container = next;
            }
        }
    }
}

export {WebGLUniforms};