import {
    REVISION,
    RGBAFormat,
    HalfFloatType,
    FloatType,
    UnsignedByteType,
    TriangleFanDrawMode,
    TriangleStripDrawMode,
    TrianglesDrawMode,
    NoColors,
    LinearToneMapping,
    BackSide
} from '../Core/Constants.js';
import {_Math} from '../Datum/Math/Math.js';
import {DataTexture} from '../Assets/DataTexture.js';
import {Frustum} from '../Datum/Math/Frustum.js';
import {Matrix4} from '../Datum/Math/Matrix4.js';
import {ShaderLib} from './Shaders/ShaderLib.js';
import {UniformsLib} from './Shaders/UniformsLib.js';
import {UniformsUtils} from './Shaders/UniformsUtils.js';
import {Vector3} from '../Datum/Math/Vector3.js';
import {Vector4} from '../Datum/Math/Vector4.js';
import {WebGLAnimation} from './webgl/WebGLAnimation.js';
import {WebGLAttributes} from './webgl/WebGLAttributes.js';
import {WebGLBackground} from './webgl/WebGLBackground.js';
import {WebGLBufferRenderer} from './webgl/WebGLBufferRenderer.js';
import {WebGLCapabilities} from './webgl/WebGLCapabilities.js';
import {WebGLClipping} from './webgl/WebGLClipping.js';
import {WebGLExtensions} from './webgl/WebGLExtensions.js';
import {WebGLGeometries} from './webgl/WebGLGeometries.js';
import {WebGLIndexedBufferRenderer} from './webgl/WebGLIndexedBufferRenderer.js';
import {WebGLInfo} from './webgl/WebGLInfo.js';
import {WebGLMorphtargets} from './webgl/WebGLMorphtargets.js';
import {WebGLObjects} from './webgl/WebGLObjects.js';
import {WebGLPrograms} from './webgl/WebGLPrograms.js';
import {WebGLProperties} from './webgl/WebGLProperties.js';
import {WebGLRenderLists} from './webgl/WebGLRenderLists.js';
import {WebGLRenderStates} from './webgl/WebGLRenderStates.js';
import {WebGLShadowMap} from './webgl/WebGLShadowMap.js';
import {WebGLSpriteRenderer} from './webgl/WebGLSpriteRenderer.js';
import {WebGLState} from './webgl/WebGLState.js';
import {WebGLTextures} from './webgl/WebGLTextures.js';
import {WebGLUniforms} from './webgl/WebGLUniforms.js';
import {WebGLUtils} from './webgl/WebGLUtils.js';
import {WebVRManager} from './webvr/WebVRManager.js';
import {WebXRManager} from './webvr/WebXRManager.js';


/**
 * @author wangzhidong
 * @modified DongYi 2018/07/17
 */

/* function WebGLRenderer( parameters ) {

    console.log( 'Speed3D.WebGLRenderer', REVISION );

    parameters = parameters || {};

    var _canvas = parameters.canvas !== undefined ? parameters.canvas : document.createElementNS( 'http://www.w3.org/1999/xhtml', 'canvas' ),
        _context = parameters.context !== undefined ? parameters.context : null,

        _alpha = parameters.alpha !== undefined ? parameters.alpha : false,
        _depth = parameters.depth !== undefined ? parameters.depth : true,
        _stencil = parameters.stencil !== undefined ? parameters.stencil : true,
        _antialias = parameters.antialias !== undefined ? parameters.antialias : false,
        _premultipliedAlpha = parameters.premultipliedAlpha !== undefined ? parameters.premultipliedAlpha : true,
        _preserveDrawingBuffer = parameters.preserveDrawingBuffer !== undefined ? parameters.preserveDrawingBuffer : false,
        _powerPreference = parameters.powerPreference !== undefined ? parameters.powerPreference : 'default';

    var currentRenderList = null;
    var currentRenderState = null;

    // public properties

    this.domElement = _canvas;
    this.context = null;

    // clearing

    this.autoClear = true;
    this.autoClearColor = true;
    this.autoClearDepth = true;
    this.autoClearStencil = true;

    // scene graph

    this.sortObjects = true;

    // user-defined clipping

    this.clippingPlanes = [];
    this.localClippingEnabled = false;

    // physically based shading

    this.gammaFactor = 2.0;	// for backwards compatibility
    this.gammaInput = false;
    this.gammaOutput = false;

    // physical lights

    this.physicallyCorrectLights = false;

    // tone mapping

    this.toneMapping = LinearToneMapping;
    this.toneMappingExposure = 1.0;
    this.toneMappingWhitePoint = 1.0;

    // morphs

    this.maxMorphTargets = 8;
    this.maxMorphNormals = 4;

    // internal properties

    var _this = this,

        _isContextLost = false,

        // internal state cache

        _framebuffer = null,

        _currentRenderTarget = null,
        _currentFramebuffer = null,
        _currentMaterialId = - 1,
        _currentGeometryProgram = '',

        _currentCamera = null,
        _currentArrayCamera = null,

        _currentViewport = new Vector4(),
        _currentScissor = new Vector4(),
        _currentScissorTest = null,

        //

        _usedTextureUnits = 0,

        //

        _width = _canvas.width,
        _height = _canvas.height,

        _pixelRatio = 1,

        _viewport = new Vector4( 0, 0, _width, _height ),
        _scissor = new Vector4( 0, 0, _width, _height ),
        _scissorTest = false,

        // frustum

        _frustum = new Frustum(),

        // clipping

        _clipping = new WebGLClipping(),
        _clippingEnabled = false,
        _localClippingEnabled = false,

        // camera matrices cache

        _projScreenMatrix = new Matrix4(),

        _vector3 = new Vector3();

    function getTargetPixelRatio() {

        return _currentRenderTarget === null ? _pixelRatio : 1;

    }

    // initialize

    var _gl;

    try {

        var contextAttributes = {
            alpha: _alpha,
            depth: _depth,
            stencil: _stencil,
            antialias: _antialias,
            premultipliedAlpha: _premultipliedAlpha,
            preserveDrawingBuffer: _preserveDrawingBuffer,
            powerPreference: _powerPreference
        };

        // event listeners must be registered before WebGL context is created, see #12753

        _canvas.addEventListener( 'webglcontextlost', onContextLost, false );
        _canvas.addEventListener( 'webglcontextrestored', onContextRestore, false );

        _gl = _context || _canvas.getContext( 'webgl', contextAttributes ) || _canvas.getContext( 'experimental-webgl', contextAttributes );

        if ( _gl === null ) {

            if ( _canvas.getContext( 'webgl' ) !== null ) {

                throw new Error( 'Error creating WebGL context with your selected attributes.' );

            } else {

                throw new Error( 'Error creating WebGL context.' );

            }

        }

        // Some experimental-webgl implementations do not have getShaderPrecisionFormat

        if ( _gl.getShaderPrecisionFormat === undefined ) {

            _gl.getShaderPrecisionFormat = function () {

                return { 'rangeMin': 1, 'rangeMax': 1, 'precision': 1 };

            };

        }

    } catch ( error ) {

        console.error( 'Speed3D.WebGLRenderer: ' + error.message );

    }

    var extensions, capabilities, state, info;
    var properties, textures, attributes, geometries, objects;
    var programCache, renderLists, renderStates;

    var background, morphtargets, bufferRenderer, indexedBufferRenderer;
    var spriteRenderer;

    var utils;

    function initGLContext() {

        extensions = new WebGLExtensions( _gl );
        extensions.get( 'WEBGL_depth_texture' );
        extensions.get( 'OES_texture_float' );
        extensions.get( 'OES_texture_float_linear' );
        extensions.get( 'OES_texture_half_float' );
        extensions.get( 'OES_texture_half_float_linear' );
        extensions.get( 'OES_standard_derivatives' );
        extensions.get( 'OES_element_index_uint' );
        extensions.get( 'ANGLE_instanced_arrays' );

        utils = new WebGLUtils( _gl, extensions );

        capabilities = new WebGLCapabilities( _gl, extensions, parameters );

        state = new WebGLState( _gl, extensions, utils );
        state.scissor( _currentScissor.copy( _scissor ).multiplyScalar( _pixelRatio ) );
        state.viewport( _currentViewport.copy( _viewport ).multiplyScalar( _pixelRatio ) );

        info = new WebGLInfo( _gl );
        properties = new WebGLProperties();
        textures = new WebGLTextures( _gl, extensions, state, properties, capabilities, utils, info );
        attributes = new WebGLAttributes( _gl );
        geometries = new WebGLGeometries( _gl, attributes, info );
        objects = new WebGLObjects( geometries, info );
        morphtargets = new WebGLMorphtargets( _gl );
        programCache = new WebGLPrograms( _this, extensions, capabilities );
        renderLists = new WebGLRenderLists();
        renderStates = new WebGLRenderStates();

        background = new WebGLBackground( _this, state, objects, _premultipliedAlpha );

        bufferRenderer = new WebGLBufferRenderer( _gl, extensions, info );
        indexedBufferRenderer = new WebGLIndexedBufferRenderer( _gl, extensions, info );

        spriteRenderer = new WebGLSpriteRenderer( _this, _gl, state, textures, capabilities );

        info.programs = programCache.programs;

        _this.context = _gl;
        _this.capabilities = capabilities;
        _this.extensions = extensions;
        _this.properties = properties;
        _this.renderLists = renderLists;
        _this.state = state;
        _this.info = info;

    }

    initGLContext();

    // vr

    var vr = ( 'xr' in navigator ) ? new WebXRManager( _this ) : new WebVRManager( _this );

    this.vr = vr;

    // shadow map

    var shadowMap = new WebGLShadowMap( _this, objects, capabilities.maxTextureSize );

    this.shadowMap = shadowMap;

    // API

    this.getContext = function () {

        return _gl;

    };

    this.getContextAttributes = function () {

        return _gl.getContextAttributes();

    };

    this.forceContextLoss = function () {

        var extension = extensions.get( 'WEBGL_lose_context' );
        if ( extension ) extension.loseContext();

    };

    this.forceContextRestore = function () {

        var extension = extensions.get( 'WEBGL_lose_context' );
        if ( extension ) extension.restoreContext();

    };

    this.getPixelRatio = function () {

        return _pixelRatio;

    };

    this.setPixelRatio = function ( value ) {

        if ( value === undefined ) return;

        _pixelRatio = value;

        this.setSize( _width, _height, false );

    };

    this.getSize = function () {

        return {
            width: _width,
            height: _height
        };

    };

    this.setSize = function ( width, height, updateStyle ) {

        if ( vr.isPresenting() ) {

            console.warn( 'Speed3D.WebGLRenderer: Can\'t change size while VR device is presenting.' );
            return;

        }

        _width = width;
        _height = height;

        _canvas.width = width * _pixelRatio;
        _canvas.height = height * _pixelRatio;

        if ( updateStyle !== false ) {

            _canvas.style.width = width + 'px';
            _canvas.style.height = height + 'px';

        }

        this.setViewport( 0, 0, width, height );

    };

    this.getDrawingBufferSize = function () {

        return {
            width: _width * _pixelRatio,
            height: _height * _pixelRatio
        };

    };

    this.setDrawingBufferSize = function ( width, height, pixelRatio ) {

        _width = width;
        _height = height;

        _pixelRatio = pixelRatio;

        _canvas.width = width * pixelRatio;
        _canvas.height = height * pixelRatio;

        this.setViewport( 0, 0, width, height );

    };

    this.getCurrentViewport = function () {

        return _currentViewport;

    };

    this.setViewport = function ( x, y, width, height ) {

        _viewport.set( x, _height - y - height, width, height );
        state.viewport( _currentViewport.copy( _viewport ).multiplyScalar( _pixelRatio ) );

    };

    this.setScissor = function ( x, y, width, height ) {

        _scissor.set( x, _height - y - height, width, height );
        state.scissor( _currentScissor.copy( _scissor ).multiplyScalar( _pixelRatio ) );

    };

    this.setScissorTest = function ( boolean ) {

        state.setScissorTest( _scissorTest = boolean );

    };

    // Clearing

    this.getClearColor = function () {

        return background.getClearColor();

    };

    this.setClearColor = function () {

        background.setClearColor.apply( background, arguments );

    };

    this.getClearAlpha = function () {

        return background.getClearAlpha();

    };

    this.setClearAlpha = function () {

        background.setClearAlpha.apply( background, arguments );

    };

    this.clear = function ( color, depth, stencil ) {

        var bits = 0;

        if ( color === undefined || color ) bits |= _gl.COLOR_BUFFER_BIT;
        if ( depth === undefined || depth ) bits |= _gl.DEPTH_BUFFER_BIT;
        if ( stencil === undefined || stencil ) bits |= _gl.STENCIL_BUFFER_BIT;

        _gl.clear( bits );

    };

    this.clearColor = function () {

        this.clear( true, false, false );

    };

    this.clearDepth = function () {

        this.clear( false, true, false );

    };

    this.clearStencil = function () {

        this.clear( false, false, true );

    };

    this.clearTarget = function ( renderTarget, color, depth, stencil ) {

        this.setRenderTarget( renderTarget );
        this.clear( color, depth, stencil );

    };

    //

    this.dispose = function () {

        _canvas.removeEventListener( 'webglcontextlost', onContextLost, false );
        _canvas.removeEventListener( 'webglcontextrestored', onContextRestore, false );

        renderLists.dispose();
        renderStates.dispose();
        properties.dispose();
        objects.dispose();

        vr.dispose();

        animation.stop();

    };

    // Events

    function onContextLost( event ) {

        event.preventDefault();

        console.log( 'Speed3D.WebGLRenderer: Context Lost.' );

        _isContextLost = true;

    }

    function onContextRestore( /!* event *!/ ) {

    console.log( 'Speed3D.WebGLRenderer: Context Restored.' );

    _isContextLost = false;

    initGLContext();

}

function onMaterialDispose( event ) {

    var material = event.target;

    material.removeEventListener( 'dispose', onMaterialDispose );

    deallocateMaterial( material );

}

// Buffer deallocation

function deallocateMaterial( material ) {

    releaseMaterialProgramReference( material );

    properties.remove( material );

}


function releaseMaterialProgramReference( material ) {

    var programInfo = properties.get( material ).program;

    material.program = undefined;

    if ( programInfo !== undefined ) {

        programCache.releaseProgram( programInfo );

    }

}

// Buffer rendering

function renderObjectImmediate( object, program, material ) {

    object.render( function ( object ) {

        _this.renderBufferImmediate( object, program, material );

    } );

}

this.renderBufferImmediate = function ( object, program, material ) {

    state.initAttributes();

    var buffers = properties.get( object );

    if ( object.hasPositions && ! buffers.position ) buffers.position = _gl.createBuffer();
    if ( object.hasNormals && ! buffers.normal ) buffers.normal = _gl.createBuffer();
    if ( object.hasUvs && ! buffers.uv ) buffers.uv = _gl.createBuffer();
    if ( object.hasColors && ! buffers.color ) buffers.color = _gl.createBuffer();

    var programAttributes = program.getAttributes();

    if ( object.hasPositions ) {

        _gl.bindBuffer( _gl.ARRAY_BUFFER, buffers.position );
        _gl.bufferData( _gl.ARRAY_BUFFER, object.positionArray, _gl.DYNAMIC_DRAW );

        state.enableAttribute( programAttributes.position );
        _gl.vertexAttribPointer( programAttributes.position, 3, _gl.FLOAT, false, 0, 0 );

    }

    if ( object.hasNormals ) {

        _gl.bindBuffer( _gl.ARRAY_BUFFER, buffers.normal );

        if ( ! material.isMeshPhongMaterial &&
            ! material.isMeshStandardMaterial &&
            ! material.isMeshNormalMaterial &&
            material.flatShading === true ) {

            for ( var i = 0, l = object.count * 3; i < l; i += 9 ) {

                var array = object.normalArray;

                var nx = ( array[ i + 0 ] + array[ i + 3 ] + array[ i + 6 ] ) / 3;
                var ny = ( array[ i + 1 ] + array[ i + 4 ] + array[ i + 7 ] ) / 3;
                var nz = ( array[ i + 2 ] + array[ i + 5 ] + array[ i + 8 ] ) / 3;

                array[ i + 0 ] = nx;
                array[ i + 1 ] = ny;
                array[ i + 2 ] = nz;

                array[ i + 3 ] = nx;
                array[ i + 4 ] = ny;
                array[ i + 5 ] = nz;

                array[ i + 6 ] = nx;
                array[ i + 7 ] = ny;
                array[ i + 8 ] = nz;

            }

        }

        _gl.bufferData( _gl.ARRAY_BUFFER, object.normalArray, _gl.DYNAMIC_DRAW );

        state.enableAttribute( programAttributes.normal );

        _gl.vertexAttribPointer( programAttributes.normal, 3, _gl.FLOAT, false, 0, 0 );

    }

    if ( object.hasUvs && material.map ) {

        _gl.bindBuffer( _gl.ARRAY_BUFFER, buffers.uv );
        _gl.bufferData( _gl.ARRAY_BUFFER, object.uvArray, _gl.DYNAMIC_DRAW );

        state.enableAttribute( programAttributes.uv );

        _gl.vertexAttribPointer( programAttributes.uv, 2, _gl.FLOAT, false, 0, 0 );

    }

    if ( object.hasColors && material.vertexColors !== NoColors ) {

        _gl.bindBuffer( _gl.ARRAY_BUFFER, buffers.color );
        _gl.bufferData( _gl.ARRAY_BUFFER, object.colorArray, _gl.DYNAMIC_DRAW );

        state.enableAttribute( programAttributes.color );

        _gl.vertexAttribPointer( programAttributes.color, 3, _gl.FLOAT, false, 0, 0 );

    }

    state.disableUnusedAttributes();

    _gl.drawArrays( _gl.TRIANGLES, 0, object.count );

    object.count = 0;

};

this.renderBufferDirect = function ( camera, fog, geometry, material, object, group ) {

    var frontFaceCW = ( object.isMesh && object.matrixWorld.determinant() < 0 );

    state.setMaterial( material, frontFaceCW );

    var program = setProgram( camera, fog, material, object );
    var geometryProgram = geometry.id + '_' + program.id + '_' + ( material.wireframe === true );

    var updateBuffers = false;

    if ( geometryProgram !== _currentGeometryProgram ) {

        _currentGeometryProgram = geometryProgram;
        updateBuffers = true;

    }

    if ( object.morphTargetInfluences ) {

        morphtargets.update( object, geometry, material, program );

        updateBuffers = true;

    }

    //

    var index = geometry.index;
    var position = geometry.attributes.position;
    var rangeFactor = 1;

    if ( material.wireframe === true ) {

        index = geometries.getWireframeAttribute( geometry );
        rangeFactor = 2;

    }

    var attribute;
    var renderer = bufferRenderer;

    if ( index !== null ) {

        attribute = attributes.get( index );

        renderer = indexedBufferRenderer;
        renderer.setIndex( attribute );

    }

    if ( updateBuffers ) {

        setupVertexAttributes( material, program, geometry );

        if ( index !== null ) {

            _gl.bindBuffer( _gl.ELEMENT_ARRAY_BUFFER, attribute.buffer );

        }

    }

    //

    var dataCount = Infinity;

    if ( index !== null ) {

        dataCount = index.count;

    } else if ( position !== undefined ) {

        dataCount = position.count;

    }

    var rangeStart = geometry.drawRange.start * rangeFactor;
    var rangeCount = geometry.drawRange.count * rangeFactor;

    var groupStart = group !== null ? group.start * rangeFactor : 0;
    var groupCount = group !== null ? group.count * rangeFactor : Infinity;

    var drawStart = Math.max( rangeStart, groupStart );
    var drawEnd = Math.min( dataCount, rangeStart + rangeCount, groupStart + groupCount ) - 1;

    var drawCount = Math.max( 0, drawEnd - drawStart + 1 );

    if ( drawCount === 0 ) return;

    //

    if ( object.isMesh ) {

        if ( material.wireframe === true ) {

            state.setLineWidth( material.wireframeLinewidth * getTargetPixelRatio() );
            renderer.setMode( _gl.LINES );

        } else {

            switch ( object.drawMode ) {

                case TrianglesDrawMode:
                    renderer.setMode( _gl.TRIANGLES );
                    break;

                case TriangleStripDrawMode:
                    renderer.setMode( _gl.TRIANGLE_STRIP );
                    break;

                case TriangleFanDrawMode:
                    renderer.setMode( _gl.TRIANGLE_FAN );
                    break;

            }

        }


    } else if ( object.isLine ) {

        var lineWidth = material.linewidth;

        if ( lineWidth === undefined ) lineWidth = 1; // Not using Line*Material

        state.setLineWidth( lineWidth * getTargetPixelRatio() );

        if ( object.isLineSegments ) {

            renderer.setMode( _gl.LINES );

        } else if ( object.isLineLoop ) {

            renderer.setMode( _gl.LINE_LOOP );

        } else {

            renderer.setMode( _gl.LINE_STRIP );

        }

    } else if ( object.isPoints ) {

        renderer.setMode( _gl.POINTS );

    }

    if ( geometry && geometry.isInstancedBufferGeometry ) {

        if ( geometry.maxInstancedCount > 0 ) {

            renderer.renderInstances( geometry, drawStart, drawCount );

        }

    } else {

        renderer.render( drawStart, drawCount );

    }

};

function setupVertexAttributes( material, program, geometry ) {

    if ( geometry && geometry.isInstancedBufferGeometry ) {

        if ( extensions.get( 'ANGLE_instanced_arrays' ) === null ) {

            console.error( 'Speed3D.WebGLRenderer.setupVertexAttributes: using Speed3D.InstancedBufferGeometry but hardware does not support extension ANGLE_instanced_arrays.' );
            return;

        }

    }

    state.initAttributes();

    var geometryAttributes = geometry.attributes;

    var programAttributes = program.getAttributes();

    var materialDefaultAttributeValues = material.defaultAttributeValues;

    for ( var name in programAttributes ) {

        var programAttribute = programAttributes[ name ];

        if ( programAttribute >= 0 ) {

            var geometryAttribute = geometryAttributes[ name ];

            if ( geometryAttribute !== undefined ) {

                var normalized = geometryAttribute.normalized;
                var size = geometryAttribute.itemSize;

                var attribute = attributes.get( geometryAttribute );

                // TODO Attribute may not be available on context restore

                if ( attribute === undefined ) continue;

                var buffer = attribute.buffer;
                var type = attribute.type;
                var bytesPerElement = attribute.bytesPerElement;

                if ( geometryAttribute.isInterleavedBufferAttribute ) {

                    var data = geometryAttribute.data;
                    var stride = data.stride;
                    var offset = geometryAttribute.offset;

                    if ( data && data.isInstancedInterleavedBuffer ) {

                        state.enableAttributeAndDivisor( programAttribute, data.meshPerAttribute );

                        if ( geometry.maxInstancedCount === undefined ) {

                            geometry.maxInstancedCount = data.meshPerAttribute * data.count;

                        }

                    } else {

                        state.enableAttribute( programAttribute );

                    }

                    _gl.bindBuffer( _gl.ARRAY_BUFFER, buffer );
                    _gl.vertexAttribPointer( programAttribute, size, type, normalized, stride * bytesPerElement, offset * bytesPerElement );

                } else {

                    if ( geometryAttribute.isInstancedBufferAttribute ) {

                        state.enableAttributeAndDivisor( programAttribute, geometryAttribute.meshPerAttribute );

                        if ( geometry.maxInstancedCount === undefined ) {

                            geometry.maxInstancedCount = geometryAttribute.meshPerAttribute * geometryAttribute.count;

                        }

                    } else {

                        state.enableAttribute( programAttribute );

                    }

                    _gl.bindBuffer( _gl.ARRAY_BUFFER, buffer );
                    _gl.vertexAttribPointer( programAttribute, size, type, normalized, 0, 0 );

                }

            } else if ( materialDefaultAttributeValues !== undefined ) {

                var value = materialDefaultAttributeValues[ name ];

                if ( value !== undefined ) {

                    switch ( value.length ) {

                        case 2:
                            _gl.vertexAttrib2fv( programAttribute, value );
                            break;

                        case 3:
                            _gl.vertexAttrib3fv( programAttribute, value );
                            break;

                        case 4:
                            _gl.vertexAttrib4fv( programAttribute, value );
                            break;

                        default:
                            _gl.vertexAttrib1fv( programAttribute, value );

                    }

                }

            }

        }

    }

    state.disableUnusedAttributes();

}

// Compile

this.compile = function ( scene, camera ) {

    currentRenderState = renderStates.get( scene, camera );
    currentRenderState.init();

    scene.traverse( function ( object ) {

        if ( object.isLight ) {

            currentRenderState.pushLight( object );

            if ( object.castShadow ) {

                currentRenderState.pushShadow( object );

            }

        }

    } );

    currentRenderState.setupLights( camera );

    scene.traverse( function ( object ) {

        if ( object.material ) {

            if ( Array.isArray( object.material ) ) {

                for ( var i = 0; i < object.material.length; i ++ ) {

                    initMaterial( object.material[ i ], scene.fog, object );

                }

            } else {

                initMaterial( object.material, scene.fog, object );

            }

        }

    } );

};

// Animation Loop

var onAnimationFrameCallback = null;

function onAnimationFrame( time ) {

    if ( vr.isPresenting() ) return;
    if ( onAnimationFrameCallback ) onAnimationFrameCallback( time );

}

var animation = new WebGLAnimation();
animation.setAnimationLoop( onAnimationFrame );

if ( typeof window !== 'undefined' ) animation.setContext( window );

this.setAnimationLoop = function ( callback ) {

    onAnimationFrameCallback = callback;
    vr.setAnimationLoop( callback );

    animation.start();

};

// Rendering

this.render = function ( scene, camera, renderTarget, forceClear ) {

    if ( ! ( camera && camera.isCamera ) ) {

        console.error( 'Speed3D.WebGLRenderer.render: camera is not an instance of Speed3D.Camera.' );
        return;

    }

    if ( _isContextLost ) return;

    // reset caching for this frame

    _currentGeometryProgram = '';
    _currentMaterialId = - 1;
    _currentCamera = null;

    // update scene graph

    if ( scene.autoUpdate === true ) scene.updateMatrixWorld();

    // update camera matrices and frustum

    if ( camera.parent === null ) camera.updateMatrixWorld();

    if ( vr.enabled ) {

        camera = vr.getCamera( camera );

    }

    //

    currentRenderState = renderStates.get( scene, camera );
    currentRenderState.init();

    scene.onBeforeRender( _this, scene, camera, renderTarget );

    _projScreenMatrix.multiplyMatrices( camera.projectionMatrix, camera.matrixWorldInverse );
    _frustum.setFromMatrix( _projScreenMatrix );

    _localClippingEnabled = this.localClippingEnabled;
    _clippingEnabled = _clipping.init( this.clippingPlanes, _localClippingEnabled, camera );

    currentRenderList = renderLists.get( scene, camera );
    currentRenderList.init();

    projectObject( scene, camera, _this.sortObjects );

    if ( _this.sortObjects === true ) {

        currentRenderList.sort();

    }

    //

    if ( _clippingEnabled ) _clipping.beginShadows();

    var shadowsArray = currentRenderState.state.shadowsArray;

    shadowMap.render( shadowsArray, scene, camera );

    currentRenderState.setupLights( camera );

    if ( _clippingEnabled ) _clipping.endShadows();

    //

    if ( this.info.autoReset ) this.info.reset();

    if ( renderTarget === undefined ) {

        renderTarget = null;

    }

    this.setRenderTarget( renderTarget );

    //

    background.render( currentRenderList, scene, camera, forceClear );

    // render scene

    var opaqueObjects = currentRenderList.opaque;
    var transparentObjects = currentRenderList.transparent;

    if ( scene.overrideMaterial ) {

        var overrideMaterial = scene.overrideMaterial;

        if ( opaqueObjects.length ) renderObjects( opaqueObjects, scene, camera, overrideMaterial );
        if ( transparentObjects.length ) renderObjects( transparentObjects, scene, camera, overrideMaterial );

    } else {

        // opaque pass (front-to-back order)

        if ( opaqueObjects.length ) renderObjects( opaqueObjects, scene, camera );

        // transparent pass (back-to-front order)

        if ( transparentObjects.length ) renderObjects( transparentObjects, scene, camera );

    }

    // custom renderers

    var spritesArray = currentRenderState.state.spritesArray;

    spriteRenderer.render( spritesArray, scene, camera );

    // Generate mipmap if we're using any kind of mipmap filtering

    if ( renderTarget ) {

        textures.updateRenderTargetMipmap( renderTarget );

    }

    // Ensure depth buffer writing is enabled so it can be cleared on next render

    state.buffers.depth.setTest( true );
    state.buffers.depth.setMask( true );
    state.buffers.color.setMask( true );

    state.setPolygonOffset( false );

    scene.onAfterRender( _this, scene, camera );

    if ( vr.enabled ) {

        vr.submitFrame();

    }

    // _gl.finish();

    currentRenderList = null;
    currentRenderState = null;

};

/!*
// TODO Duplicated code (Frustum)

var _sphere = new Sphere();

function isObjectViewable( object ) {

    var geometry = object.geometry;

    if ( geometry.boundingSphere === null )
        geometry.computeBoundingSphere();

    _sphere.copy( geometry.boundingSphere ).
    applyMatrix4( object.matrixWorld );

    return isSphereViewable( _sphere );

}

function isSpriteViewable( sprite ) {

    _sphere.center.set( 0, 0, 0 );
    _sphere.radius = 0.7071067811865476;
    _sphere.applyMatrix4( sprite.matrixWorld );

    return isSphereViewable( _sphere );

}

function isSphereViewable( sphere ) {

    if ( ! _frustum.intersectsSphere( sphere ) ) return false;

    var numPlanes = _clipping.numPlanes;

    if ( numPlanes === 0 ) return true;

    var planes = _this.clippingPlanes,

        center = sphere.center,
        negRad = - sphere.radius,
        i = 0;

    do {

        // out when deeper than radius in the negative halfspace
        if ( planes[ i ].distanceToPoint( center ) < negRad ) return false;

    } while ( ++ i !== numPlanes );

    return true;

}
*!/

function projectObject( object, camera, sortObjects ) {

    if ( object.visible === false ) return;

    var visible = object.layers.test( camera.layers );

    if ( visible ) {

        if ( object.isLight ) {

            currentRenderState.pushLight( object );

            if ( object.castShadow ) {

                currentRenderState.pushShadow( object );

            }

        } else if ( object.isSprite ) {

            if ( ! object.frustumCulled || _frustum.intersectsSprite( object ) ) {

                currentRenderState.pushSprite( object );

            }

        } else if ( object.isImmediateRenderObject ) {

            if ( sortObjects ) {

                _vector3.setFromMatrixPosition( object.matrixWorld )
                    .applyMatrix4( _projScreenMatrix );

            }

            currentRenderList.push( object, null, object.material, _vector3.z, null );

        } else if ( object.isMesh || object.isLine || object.isPoints ) {

            if ( object.isSkinnedMesh ) {

                object.skeleton.update();

            }

            if ( ! object.frustumCulled || _frustum.intersectsObject( object ) ) {

                if ( sortObjects ) {

                    _vector3.setFromMatrixPosition( object.matrixWorld )
                        .applyMatrix4( _projScreenMatrix );

                }

                var geometry = objects.update( object );
                var material = object.material;

                if ( Array.isArray( material ) ) {

                    var groups = geometry.groups;

                    for ( var i = 0, l = groups.length; i < l; i ++ ) {

                        var group = groups[ i ];
                        var groupMaterial = material[ group.materialIndex ];

                        if ( groupMaterial && groupMaterial.visible ) {

                            currentRenderList.push( object, geometry, groupMaterial, _vector3.z, group );

                        }

                    }

                } else if ( material.visible ) {

                    currentRenderList.push( object, geometry, material, _vector3.z, null );

                }

            }

        }

    }

    var children = object.children;

    for ( var i = 0, l = children.length; i < l; i ++ ) {

        projectObject( children[ i ], camera, sortObjects );

    }

}

function renderObjects( renderList, scene, camera, overrideMaterial ) {

    for ( var i = 0, l = renderList.length; i < l; i ++ ) {

        var renderItem = renderList[ i ];

        var object = renderItem.object;
        var geometry = renderItem.geometry;
        var material = overrideMaterial === undefined ? renderItem.material : overrideMaterial;
        var group = renderItem.group;

        if ( camera.isArrayCamera ) {

            _currentArrayCamera = camera;

            var cameras = camera.cameras;

            for ( var j = 0, jl = cameras.length; j < jl; j ++ ) {

                var camera2 = cameras[ j ];

                if ( object.layers.test( camera2.layers ) ) {

                    if ( 'viewport' in camera2 ) { // XR

                        state.viewport( _currentViewport.copy( camera2.viewport ) );

                    } else {

                        var bounds = camera2.bounds;

                        var x = bounds.x * _width;
                        var y = bounds.y * _height;
                        var width = bounds.z * _width;
                        var height = bounds.w * _height;

                        state.viewport( _currentViewport.set( x, y, width, height ).multiplyScalar( _pixelRatio ) );

                    }

                    renderObject( object, scene, camera2, geometry, material, group );

                }

            }

        } else {

            _currentArrayCamera = null;

            renderObject( object, scene, camera, geometry, material, group );

        }

    }

}

function renderObject( object, scene, camera, geometry, material, group ) {

    object.onBeforeRender( _this, scene, camera, geometry, material, group );
    currentRenderState = renderStates.get( scene, _currentArrayCamera || camera );

    object.modelViewMatrix.multiplyMatrices( camera.matrixWorldInverse, object.matrixWorld );
    object.normalMatrix.getNormalMatrix( object.modelViewMatrix );

    if ( object.isImmediateRenderObject ) {

        var frontFaceCW = ( object.isMesh && object.matrixWorld.determinant() < 0 );

        state.setMaterial( material, frontFaceCW );

        var program = setProgram( camera, scene.fog, material, object );

        _currentGeometryProgram = '';

        renderObjectImmediate( object, program, material );

    } else {

        _this.renderBufferDirect( camera, scene.fog, geometry, material, object, group );

    }

    object.onAfterRender( _this, scene, camera, geometry, material, group );
    currentRenderState = renderStates.get( scene, _currentArrayCamera || camera );

}

function initMaterial( material, fog, object ) {

    var materialProperties = properties.get( material );

    var lights = currentRenderState.state.lights;
    var shadowsArray = currentRenderState.state.shadowsArray;

    var parameters = programCache.getParameters(
        material, lights.state, shadowsArray, fog, _clipping.numPlanes, _clipping.numIntersection, object );

    var code = programCache.getProgramCode( material, parameters );

    var program = materialProperties.program;
    var programChange = true;

    if ( program === undefined ) {

        // new material
        material.addEventListener( 'dispose', onMaterialDispose );

    } else if ( program.code !== code ) {

        // changed glsl or parameters
        releaseMaterialProgramReference( material );

    } else if ( materialProperties.lightsHash !== lights.state.hash ) {

        properties.update( material, 'lightsHash', lights.state.hash );
        programChange = false;

    } else if ( parameters.shaderID !== undefined ) {

        // same glsl and uniform list
        return;

    } else {

        // only rebuild uniform list
        programChange = false;

    }

    if ( programChange ) {

        if ( parameters.shaderID ) {

            var shader = ShaderLib[ parameters.shaderID ];

            materialProperties.shader = {
                name: material.type,
                uniforms: UniformsUtils.clone( shader.uniforms ),
                vertexShader: shader.vertexShader,
                fragmentShader: shader.fragmentShader
            };

        } else {

            materialProperties.shader = {
                name: material.type,
                uniforms: material.uniforms,
                vertexShader: material.vertexShader,
                fragmentShader: material.fragmentShader
            };

        }

        material.onBeforeCompile( materialProperties.shader, _this );

        program = programCache.acquireProgram( material, materialProperties.shader, parameters, code );

        materialProperties.program = program;
        material.program = program;

    }

    var programAttributes = program.getAttributes();

    if ( material.morphTargets ) {

        material.numSupportedMorphTargets = 0;

        for ( var i = 0; i < _this.maxMorphTargets; i ++ ) {

            if ( programAttributes[ 'morphTarget' + i ] >= 0 ) {

                material.numSupportedMorphTargets ++;

            }

        }

    }

    if ( material.morphNormals ) {

        material.numSupportedMorphNormals = 0;

        for ( var i = 0; i < _this.maxMorphNormals; i ++ ) {

            if ( programAttributes[ 'morphNormal' + i ] >= 0 ) {

                material.numSupportedMorphNormals ++;

            }

        }

    }

    var uniforms = materialProperties.shader.uniforms;

    if ( ! material.isShaderMaterial &&
        ! material.isRawShaderMaterial ||
        material.clipping === true ) {

        materialProperties.numClippingPlanes = _clipping.numPlanes;
        materialProperties.numIntersection = _clipping.numIntersection;
        uniforms.clippingPlanes = _clipping.uniform;

    }

    materialProperties.fog = fog;

    // store the light setup it was created for

    materialProperties.lightsHash = lights.state.hash;

    if ( material.lights ) {

        // wire up the material to this renderer's lighting state

        uniforms.ambientLightColor.value = lights.state.ambient;
        uniforms.directionalLights.value = lights.state.directional;
        uniforms.spotLights.value = lights.state.spot;
        uniforms.rectAreaLights.value = lights.state.rectArea;
        uniforms.pointLights.value = lights.state.point;
        uniforms.hemisphereLights.value = lights.state.hemi;

        uniforms.directionalShadowMap.value = lights.state.directionalShadowMap;
        uniforms.directionalShadowMatrix.value = lights.state.directionalShadowMatrix;
        uniforms.spotShadowMap.value = lights.state.spotShadowMap;
        uniforms.spotShadowMatrix.value = lights.state.spotShadowMatrix;
        uniforms.pointShadowMap.value = lights.state.pointShadowMap;
        uniforms.pointShadowMatrix.value = lights.state.pointShadowMatrix;
        // TODO (abelnation): add area lights shadow info to uniforms

    }

    var progUniforms = materialProperties.program.getUniforms(),
        uniformsList =
            WebGLUniforms.seqWithValue( progUniforms.seq, uniforms );

    materialProperties.uniformsList = uniformsList;

}

function setProgram( camera, fog, material, object ) {

    _usedTextureUnits = 0;

    var materialProperties = properties.get( material );
    var lights = currentRenderState.state.lights;

    if ( _clippingEnabled ) {

        if ( _localClippingEnabled || camera !== _currentCamera ) {

            var useCache =
                camera === _currentCamera &&
                material.id === _currentMaterialId;

            // we might want to call this function with some ClippingGroup
            // object instead of the material, once it becomes feasible
            // (#8465, #8379)
            _clipping.setState(
                material.clippingPlanes, material.clipIntersection, material.clipShadows,
                camera, materialProperties, useCache );

        }

    }

    if ( material.needsUpdate === false ) {

        if ( materialProperties.program === undefined ) {

            material.needsUpdate = true;

        } else if ( material.fog && materialProperties.fog !== fog ) {

            material.needsUpdate = true;

        } else if ( material.lights && materialProperties.lightsHash !== lights.state.hash ) {

            material.needsUpdate = true;

        } else if ( materialProperties.numClippingPlanes !== undefined &&
            ( materialProperties.numClippingPlanes !== _clipping.numPlanes ||
                materialProperties.numIntersection !== _clipping.numIntersection ) ) {

            material.needsUpdate = true;

        }

    }

    if ( material.needsUpdate ) {

        initMaterial( material, fog, object );
        material.needsUpdate = false;

    }

    var refreshProgram = false;
    var refreshMaterial = false;
    var refreshLights = false;

    var program = materialProperties.program,
        p_uniforms = program.getUniforms(),
        m_uniforms = materialProperties.shader.uniforms;

    if ( state.useProgram( program.program ) ) {

        refreshProgram = true;
        refreshMaterial = true;
        refreshLights = true;

    }

    if ( material.id !== _currentMaterialId ) {

        _currentMaterialId = material.id;

        refreshMaterial = true;

    }

    if ( refreshProgram || camera !== _currentCamera ) {

        p_uniforms.setValue( _gl, 'projectionMatrix', camera.projectionMatrix );

        if ( capabilities.logarithmicDepthBuffer ) {

            p_uniforms.setValue( _gl, 'logDepthBufFC',
                2.0 / ( Math.log( camera.far + 1.0 ) / Math.LN2 ) );

        }

        // Avoid unneeded uniform updates per ArrayCamera's sub-camera

        if ( _currentCamera !== ( _currentArrayCamera || camera ) ) {

            _currentCamera = ( _currentArrayCamera || camera );

            // lighting uniforms depend on the camera so enforce an update
            // now, in case this material supports lights - or later, when
            // the next material that does gets activated:

            refreshMaterial = true;		// set to true on material change
            refreshLights = true;		// remains set until update done

        }

        // load material specific uniforms
        // (shader material also gets them for the sake of genericity)

        if ( material.isShaderMaterial ||
            material.isMeshPhongMaterial ||
            material.isMeshStandardMaterial ||
            material.envMap ) {

            var uCamPos = p_uniforms.map.cameraPosition;

            if ( uCamPos !== undefined ) {

                uCamPos.setValue( _gl,
                    _vector3.setFromMatrixPosition( camera.matrixWorld ) );

            }

        }

        if ( material.isMeshPhongMaterial ||
            material.isMeshLambertMaterial ||
            material.isMeshBasicMaterial ||
            material.isMeshStandardMaterial ||
            material.isShaderMaterial ||
            material.skinning ) {

            p_uniforms.setValue( _gl, 'viewMatrix', camera.matrixWorldInverse );

        }

    }

    // skinning uniforms must be set even if material didn't change
    // auto-setting of texture unit for bone texture must go before other textures
    // not sure why, but otherwise weird things happen

    if ( material.skinning ) {

        p_uniforms.setOptional( _gl, object, 'bindMatrix' );
        p_uniforms.setOptional( _gl, object, 'bindMatrixInverse' );

        var skeleton = object.skeleton;

        if ( skeleton ) {

            var bones = skeleton.bones;

            if ( capabilities.floatVertexTextures ) {

                if ( skeleton.boneTexture === undefined ) {

                    // layout (1 matrix = 4 pixels)
                    //      RGBA RGBA RGBA RGBA (=> column1, column2, column3, column4)
                    //  with  8x8  pixel texture max   16 bones * 4 pixels =  (8 * 8)
                    //       16x16 pixel texture max   64 bones * 4 pixels = (16 * 16)
                    //       32x32 pixel texture max  256 bones * 4 pixels = (32 * 32)
                    //       64x64 pixel texture max 1024 bones * 4 pixels = (64 * 64)


                    var size = Math.sqrt( bones.length * 4 ); // 4 pixels needed for 1 matrix
                    size = _Math.ceilPowerOfTwo( size );
                    size = Math.max( size, 4 );

                    var boneMatrices = new Float32Array( size * size * 4 ); // 4 floats per RGBA pixel
                    boneMatrices.set( skeleton.boneMatrices ); // copy current values

                    var boneTexture = new DataTexture( boneMatrices, size, size, RGBAFormat, FloatType );
                    boneTexture.needsUpdate = true;

                    skeleton.boneMatrices = boneMatrices;
                    skeleton.boneTexture = boneTexture;
                    skeleton.boneTextureSize = size;

                }

                p_uniforms.setValue( _gl, 'boneTexture', skeleton.boneTexture );
                p_uniforms.setValue( _gl, 'boneTextureSize', skeleton.boneTextureSize );

            } else {

                p_uniforms.setOptional( _gl, skeleton, 'boneMatrices' );

            }

        }

    }

    if ( refreshMaterial ) {

        p_uniforms.setValue( _gl, 'toneMappingExposure', _this.toneMappingExposure );
        p_uniforms.setValue( _gl, 'toneMappingWhitePoint', _this.toneMappingWhitePoint );

        if ( material.lights ) {

            // the current material requires lighting info

            // note: all lighting uniforms are always set correctly
            // they simply reference the renderer's state for their
            // values
            //
            // use the current material's .needsUpdate flags to set
            // the GL state when required

            markUniformsLightsNeedsUpdate( m_uniforms, refreshLights );

        }

        // refresh uniforms common to several materials

        if ( fog && material.fog ) {

            refreshUniformsFog( m_uniforms, fog );

        }

        if ( material.isMeshBasicMaterial ) {

            refreshUniformsCommon( m_uniforms, material );

        } else if ( material.isMeshLambertMaterial ) {

            refreshUniformsCommon( m_uniforms, material );
            refreshUniformsLambert( m_uniforms, material );

        } else if ( material.isMeshPhongMaterial ) {

            refreshUniformsCommon( m_uniforms, material );

            if ( material.isMeshToonMaterial ) {

                refreshUniformsToon( m_uniforms, material );

            } else {

                refreshUniformsPhong( m_uniforms, material );

            }

        } else if ( material.isMeshStandardMaterial ) {

            refreshUniformsCommon( m_uniforms, material );

            if ( material.isMeshPhysicalMaterial ) {

                refreshUniformsPhysical( m_uniforms, material );

            } else {

                refreshUniformsStandard( m_uniforms, material );

            }

        } else if ( material.isMeshDepthMaterial ) {

            refreshUniformsCommon( m_uniforms, material );
            refreshUniformsDepth( m_uniforms, material );

        } else if ( material.isMeshDistanceMaterial ) {

            refreshUniformsCommon( m_uniforms, material );
            refreshUniformsDistance( m_uniforms, material );

        } else if ( material.isMeshNormalMaterial ) {

            refreshUniformsCommon( m_uniforms, material );
            refreshUniformsNormal( m_uniforms, material );

        } else if ( material.isLineBasicMaterial ) {

            refreshUniformsLine( m_uniforms, material );

            if ( material.isLineDashedMaterial ) {

                refreshUniformsDash( m_uniforms, material );

            }

        } else if ( material.isPointsMaterial ) {

            refreshUniformsPoints( m_uniforms, material );

        } else if ( material.isShadowMaterial ) {

            m_uniforms.color.value = material.color;
            m_uniforms.opacity.value = material.opacity;

        }

        // RectAreaLight Texture
        // TODO (mrdoob): Find a nicer implementation

        if ( m_uniforms.ltc_1 !== undefined ) m_uniforms.ltc_1.value = UniformsLib.LTC_1;
        if ( m_uniforms.ltc_2 !== undefined ) m_uniforms.ltc_2.value = UniformsLib.LTC_2;

        WebGLUniforms.upload( _gl, materialProperties.uniformsList, m_uniforms, _this );

    }

    if ( material.isShaderMaterial && material.uniformsNeedUpdate === true ) {

        WebGLUniforms.upload( _gl, materialProperties.uniformsList, m_uniforms, _this );
        material.uniformsNeedUpdate = false;

    }

    // common matrices

    p_uniforms.setValue( _gl, 'modelViewMatrix', object.modelViewMatrix );
    p_uniforms.setValue( _gl, 'normalMatrix', object.normalMatrix );
    p_uniforms.setValue( _gl, 'modelMatrix', object.matrixWorld );

    return program;

}

// Uniforms (refresh uniforms objects)

function refreshUniformsCommon( uniforms, material ) {

    uniforms.opacity.value = material.opacity;

    if ( material.color ) {

        uniforms.diffuse.value = material.color;

    }

    if ( material.emissive ) {

        uniforms.emissive.value.copy( material.emissive ).multiplyScalar( material.emissiveIntensity );

    }

    if ( material.map ) {

        uniforms.map.value = material.map;

    }

    if ( material.alphaMap ) {

        uniforms.alphaMap.value = material.alphaMap;

    }

    if ( material.specularMap ) {

        uniforms.specularMap.value = material.specularMap;

    }

    if ( material.envMap ) {

        uniforms.envMap.value = material.envMap;

        // don't flip CubeTexture envMaps, flip everything else:
        //  WebGLRenderTargetCube will be flipped for backwards compatibility
        //  WebGLRenderTargetCube.texture will be flipped because it's a Texture and NOT a CubeTexture
        // this check must be handled differently, or removed entirely, if WebGLRenderTargetCube uses a CubeTexture in the future
        uniforms.flipEnvMap.value = ( ! ( material.envMap && material.envMap.isCubeTexture ) ) ? 1 : - 1;

        uniforms.reflectivity.value = material.reflectivity;
        uniforms.refractionRatio.value = material.refractionRatio;

        uniforms.maxMipLevel.value = properties.get( material.envMap ).__maxMipLevel;

    }

    if ( material.lightMap ) {

        uniforms.lightMap.value = material.lightMap;
        uniforms.lightMapIntensity.value = material.lightMapIntensity;

    }

    if ( material.aoMap ) {

        uniforms.aoMap.value = material.aoMap;
        uniforms.aoMapIntensity.value = material.aoMapIntensity;

    }

    // uv repeat and offset setting priorities
    // 1. color map
    // 2. specular map
    // 3. normal map
    // 4. bump map
    // 5. alpha map
    // 6. emissive map

    var uvScaleMap;

    if ( material.map ) {

        uvScaleMap = material.map;

    } else if ( material.specularMap ) {

        uvScaleMap = material.specularMap;

    } else if ( material.displacementMap ) {

        uvScaleMap = material.displacementMap;

    } else if ( material.normalMap ) {

        uvScaleMap = material.normalMap;

    } else if ( material.bumpMap ) {

        uvScaleMap = material.bumpMap;

    } else if ( material.roughnessMap ) {

        uvScaleMap = material.roughnessMap;

    } else if ( material.metalnessMap ) {

        uvScaleMap = material.metalnessMap;

    } else if ( material.alphaMap ) {

        uvScaleMap = material.alphaMap;

    } else if ( material.emissiveMap ) {

        uvScaleMap = material.emissiveMap;

    }

    if ( uvScaleMap !== undefined ) {

        // backwards compatibility
        if ( uvScaleMap.isWebGLRenderTarget ) {

            uvScaleMap = uvScaleMap.texture;

        }

        if ( uvScaleMap.matrixAutoUpdate === true ) {

            uvScaleMap.updateMatrix();

        }

        uniforms.uvTransform.value.copy( uvScaleMap.matrix );

    }

}

function refreshUniformsLine( uniforms, material ) {

    uniforms.diffuse.value = material.color;
    uniforms.opacity.value = material.opacity;

}

function refreshUniformsDash( uniforms, material ) {

    uniforms.dashSize.value = material.dashSize;
    uniforms.totalSize.value = material.dashSize + material.gapSize;
    uniforms.scale.value = material.scale;

}

function refreshUniformsPoints( uniforms, material ) {

    uniforms.diffuse.value = material.color;
    uniforms.opacity.value = material.opacity;
    uniforms.size.value = material.size * _pixelRatio;
    uniforms.scale.value = _height * 0.5;

    uniforms.map.value = material.map;

    if ( material.map !== null ) {

        if ( material.map.matrixAutoUpdate === true ) {

            material.map.updateMatrix();

        }

        uniforms.uvTransform.value.copy( material.map.matrix );

    }

}

function refreshUniformsFog( uniforms, fog ) {

    uniforms.fogColor.value = fog.color;

    if ( fog.isFog ) {

        uniforms.fogNear.value = fog.near;
        uniforms.fogFar.value = fog.far;

    } else if ( fog.isFogExp2 ) {

        uniforms.fogDensity.value = fog.density;

    }

}

function refreshUniformsLambert( uniforms, material ) {

    if ( material.emissiveMap ) {

        uniforms.emissiveMap.value = material.emissiveMap;

    }

}

function refreshUniformsPhong( uniforms, material ) {

    uniforms.specular.value = material.specular;
    uniforms.shininess.value = Math.max( material.shininess, 1e-4 ); // to prevent pow( 0.0, 0.0 )

    if ( material.emissiveMap ) {

        uniforms.emissiveMap.value = material.emissiveMap;

    }

    if ( material.bumpMap ) {

        uniforms.bumpMap.value = material.bumpMap;
        uniforms.bumpScale.value = material.bumpScale;
        if ( material.side === BackSide ) uniforms.bumpScale.value *= - 1;

    }

    if ( material.normalMap ) {

        uniforms.normalMap.value = material.normalMap;
        uniforms.normalScale.value.copy( material.normalScale );
        if ( material.side === BackSide ) uniforms.normalScale.value.negate();

    }

    if ( material.displacementMap ) {

        uniforms.displacementMap.value = material.displacementMap;
        uniforms.displacementScale.value = material.displacementScale;
        uniforms.displacementBias.value = material.displacementBias;

    }

}

function refreshUniformsToon( uniforms, material ) {

    refreshUniformsPhong( uniforms, material );

    if ( material.gradientMap ) {

        uniforms.gradientMap.value = material.gradientMap;

    }

}

function refreshUniformsStandard( uniforms, material ) {

    uniforms.roughness.value = material.roughness;
    uniforms.metalness.value = material.metalness;

    if ( material.roughnessMap ) {

        uniforms.roughnessMap.value = material.roughnessMap;

    }

    if ( material.metalnessMap ) {

        uniforms.metalnessMap.value = material.metalnessMap;

    }

    if ( material.emissiveMap ) {

        uniforms.emissiveMap.value = material.emissiveMap;

    }

    if ( material.bumpMap ) {

        uniforms.bumpMap.value = material.bumpMap;
        uniforms.bumpScale.value = material.bumpScale;
        if ( material.side === BackSide ) uniforms.bumpScale.value *= - 1;

    }

    if ( material.normalMap ) {

        uniforms.normalMap.value = material.normalMap;
        uniforms.normalScale.value.copy( material.normalScale );
        if ( material.side === BackSide ) uniforms.normalScale.value.negate();

    }

    if ( material.displacementMap ) {

        uniforms.displacementMap.value = material.displacementMap;
        uniforms.displacementScale.value = material.displacementScale;
        uniforms.displacementBias.value = material.displacementBias;

    }

    if ( material.envMap ) {

        //uniforms.envMap.value = material.envMap; // part of uniforms common
        uniforms.envMapIntensity.value = material.envMapIntensity;

    }

}

function refreshUniformsPhysical( uniforms, material ) {

    refreshUniformsStandard( uniforms, material );

    uniforms.reflectivity.value = material.reflectivity; // also part of uniforms common

    uniforms.clearCoat.value = material.clearCoat;
    uniforms.clearCoatRoughness.value = material.clearCoatRoughness;

}

function refreshUniformsDepth( uniforms, material ) {

    if ( material.displacementMap ) {

        uniforms.displacementMap.value = material.displacementMap;
        uniforms.displacementScale.value = material.displacementScale;
        uniforms.displacementBias.value = material.displacementBias;

    }

}

function refreshUniformsDistance( uniforms, material ) {

    if ( material.displacementMap ) {

        uniforms.displacementMap.value = material.displacementMap;
        uniforms.displacementScale.value = material.displacementScale;
        uniforms.displacementBias.value = material.displacementBias;

    }

    uniforms.referencePosition.value.copy( material.referencePosition );
    uniforms.nearDistance.value = material.nearDistance;
    uniforms.farDistance.value = material.farDistance;

}

function refreshUniformsNormal( uniforms, material ) {

    if ( material.bumpMap ) {

        uniforms.bumpMap.value = material.bumpMap;
        uniforms.bumpScale.value = material.bumpScale;
        if ( material.side === BackSide ) uniforms.bumpScale.value *= - 1;

    }

    if ( material.normalMap ) {

        uniforms.normalMap.value = material.normalMap;
        uniforms.normalScale.value.copy( material.normalScale );
        if ( material.side === BackSide ) uniforms.normalScale.value.negate();

    }

    if ( material.displacementMap ) {

        uniforms.displacementMap.value = material.displacementMap;
        uniforms.displacementScale.value = material.displacementScale;
        uniforms.displacementBias.value = material.displacementBias;

    }

}

// If uniforms are marked as clean, they don't need to be loaded to the GPU.

function markUniformsLightsNeedsUpdate( uniforms, value ) {

    uniforms.ambientLightColor.needsUpdate = value;

    uniforms.directionalLights.needsUpdate = value;
    uniforms.pointLights.needsUpdate = value;
    uniforms.spotLights.needsUpdate = value;
    uniforms.rectAreaLights.needsUpdate = value;
    uniforms.hemisphereLights.needsUpdate = value;

}

// Textures

function allocTextureUnit() {

    var textureUnit = _usedTextureUnits;

    if ( textureUnit >= capabilities.maxTextures ) {

        console.warn( 'Speed3D.WebGLRenderer: Trying to use ' + textureUnit + ' texture units while this GPU supports only ' + capabilities.maxTextures );

    }

    _usedTextureUnits += 1;

    return textureUnit;

}

this.allocTextureUnit = allocTextureUnit;

// this.setTexture2D = setTexture2D;
this.setTexture2D = ( function () {

    var warned = false;

    // backwards compatibility: peel texture.texture
    return function setTexture2D( texture, slot ) {

        if ( texture && texture.isWebGLRenderTarget ) {

            if ( ! warned ) {

                console.warn( "Speed3D.WebGLRenderer.setTexture2D: don't use render targets as textures. Use their .texture property instead." );
                warned = true;

            }

            texture = texture.texture;

        }

        textures.setTexture2D( texture, slot );

    };

}() );

this.setTexture = ( function () {

    var warned = false;

    return function setTexture( texture, slot ) {

        if ( ! warned ) {

            console.warn( "Speed3D.WebGLRenderer: .setTexture is deprecated, use setTexture2D instead." );
            warned = true;

        }

        textures.setTexture2D( texture, slot );

    };

}() );

this.setTextureCube = ( function () {

    var warned = false;

    return function setTextureCube( texture, slot ) {

        // backwards compatibility: peel texture.texture
        if ( texture && texture.isWebGLRenderTargetCube ) {

            if ( ! warned ) {

                console.warn( "Speed3D.WebGLRenderer.setTextureCube: don't use cube render targets as textures. Use their .texture property instead." );
                warned = true;

            }

            texture = texture.texture;

        }

        // currently relying on the fact that WebGLRenderTargetCube.texture is a Texture and NOT a CubeTexture
        // TODO: unify these code paths
        if ( ( texture && texture.isCubeTexture ) ||
            ( Array.isArray( texture.image ) && texture.image.length === 6 ) ) {

            // CompressedTexture can have Array in image :/

            // this function alone should take care of cube textures
            textures.setTextureCube( texture, slot );

        } else {

            // assumed: texture property of Speed3D.WebGLRenderTargetCube

            textures.setTextureCubeDynamic( texture, slot );

        }

    };

}() );

//

this.setFramebuffer = function ( value ) {

    _framebuffer = value;

};

this.getRenderTarget = function () {

    return _currentRenderTarget;

};

this.setRenderTarget = function ( renderTarget ) {

    _currentRenderTarget = renderTarget;

    if ( renderTarget && properties.get( renderTarget ).__webglFramebuffer === undefined ) {

        textures.setupRenderTarget( renderTarget );

    }

    var framebuffer = _framebuffer;
    var isCube = false;

    if ( renderTarget ) {

        var __webglFramebuffer = properties.get( renderTarget ).__webglFramebuffer;

        if ( renderTarget.isWebGLRenderTargetCube ) {

            framebuffer = __webglFramebuffer[ renderTarget.activeCubeFace ];
            isCube = true;

        } else {

            framebuffer = __webglFramebuffer;

        }

        _currentViewport.copy( renderTarget.viewport );
        _currentScissor.copy( renderTarget.scissor );
        _currentScissorTest = renderTarget.scissorTest;

    } else {

        _currentViewport.copy( _viewport ).multiplyScalar( _pixelRatio );
        _currentScissor.copy( _scissor ).multiplyScalar( _pixelRatio );
        _currentScissorTest = _scissorTest;

    }

    if ( _currentFramebuffer !== framebuffer ) {

        _gl.bindFramebuffer( _gl.FRAMEBUFFER, framebuffer );
        _currentFramebuffer = framebuffer;

    }

    state.viewport( _currentViewport );
    state.scissor( _currentScissor );
    state.setScissorTest( _currentScissorTest );

    if ( isCube ) {

        var textureProperties = properties.get( renderTarget.texture );
        _gl.framebufferTexture2D( _gl.FRAMEBUFFER, _gl.COLOR_ATTACHMENT0, _gl.TEXTURE_CUBE_MAP_POSITIVE_X + renderTarget.activeCubeFace, textureProperties.__webglTexture, renderTarget.activeMipMapLevel );

    }

};

this.readRenderTargetPixels = function ( renderTarget, x, y, width, height, buffer ) {

    if ( ! ( renderTarget && renderTarget.isWebGLRenderTarget ) ) {

        console.error( 'Speed3D.WebGLRenderer.readRenderTargetPixels: renderTarget is not Speed3D.WebGLRenderTarget.' );
        return;

    }

    var framebuffer = properties.get( renderTarget ).__webglFramebuffer;

    if ( framebuffer ) {

        var restore = false;

        if ( framebuffer !== _currentFramebuffer ) {

            _gl.bindFramebuffer( _gl.FRAMEBUFFER, framebuffer );

            restore = true;

        }

        try {

            var texture = renderTarget.texture;
            var textureFormat = texture.format;
            var textureType = texture.type;

            if ( textureFormat !== RGBAFormat && utils.convert( textureFormat ) !== _gl.getParameter( _gl.IMPLEMENTATION_COLOR_READ_FORMAT ) ) {

                console.error( 'Speed3D.WebGLRenderer.readRenderTargetPixels: renderTarget is not in RGBA or implementation defined format.' );
                return;

            }

            if ( textureType !== UnsignedByteType && utils.convert( textureType ) !== _gl.getParameter( _gl.IMPLEMENTATION_COLOR_READ_TYPE ) && // IE11, Edge and Chrome Mac < 52 (#9513)
                ! ( textureType === FloatType && ( extensions.get( 'OES_texture_float' ) || extensions.get( 'WEBGL_color_buffer_float' ) ) ) && // Chrome Mac >= 52 and Firefox
                ! ( textureType === HalfFloatType && extensions.get( 'EXT_color_buffer_half_float' ) ) ) {

                console.error( 'Speed3D.WebGLRenderer.readRenderTargetPixels: renderTarget is not in UnsignedByteType or implementation defined type.' );
                return;

            }

            if ( _gl.checkFramebufferStatus( _gl.FRAMEBUFFER ) === _gl.FRAMEBUFFER_COMPLETE ) {

                // the following if statement ensures valid read requests (no out-of-bounds pixels, see #8604)

                if ( ( x >= 0 && x <= ( renderTarget.width - width ) ) && ( y >= 0 && y <= ( renderTarget.height - height ) ) ) {

                    _gl.readPixels( x, y, width, height, utils.convert( textureFormat ), utils.convert( textureType ), buffer );

                }

            } else {

                console.error( 'Speed3D.WebGLRenderer.readRenderTargetPixels: readPixels from renderTarget failed. Framebuffer not complete.' );

            }

        } finally {

            if ( restore ) {

                _gl.bindFramebuffer( _gl.FRAMEBUFFER, _currentFramebuffer );

            }

        }

    }

};

this.copyFramebufferToTexture = function ( position, texture, level ) {

    var width = texture.image.width;
    var height = texture.image.height;
    var glFormat = utils.convert( texture.format );

    this.setTexture2D( texture, 0 );

    _gl.copyTexImage2D( _gl.TEXTURE_2D, level || 0, glFormat, position.x, position.y, width, height, 0 );

};

this.copyTextureToTexture = function ( position, srcTexture, dstTexture, level ) {

    var width = srcTexture.image.width;
    var height = srcTexture.image.height;
    var glFormat = utils.convert( dstTexture.format );
    var glType = utils.convert( dstTexture.type );

    this.setTexture2D( dstTexture, 0 );

    if ( srcTexture.isDataTexture ) {

        _gl.texSubImage2D( _gl.TEXTURE_2D, level || 0, position.x, position.y, width, height, glFormat, glType, srcTexture.image.data );

    } else {

        _gl.texSubImage2D( _gl.TEXTURE_2D, level || 0, position.x, position.y, glFormat, glType, srcTexture.image );

    }

};

}*/

class WebGLRenderer {
    constructor(parameters = {}) {
        console.log('Speed3DEngine.WebGLRenderer', REVISION);
        this.parameters = parameters;
        this.parameterSet = {
            _canvas: parameters.canvas !== undefined ? parameters.canvas : document.createElementNS('http://www.w3.org/1999/xhtml', 'canvas'),
            _context: parameters.context !== undefined ? parameters.context : null,
            _alpha: parameters.alpha !== undefined ? parameters.alpha : false,
            _depth: parameters.depth !== undefined ? parameters.depth : true,
            _stencil: parameters.stencil !== undefined ? parameters.stencil : true,
            _antialias: parameters.antialias !== undefined ? parameters.antialias : false,
            _premultipliedAlpha: parameters.premultipliedAlpha !== undefined ? parameters.premultipliedAlpha : true,
            _preserveDrawingBuffer: parameters.preserveDrawingBuffer !== undefined ? parameters.preserveDrawingBuffer : false,
            _powerPreference: parameters.powerPreference !== undefined ? parameters.powerPreference : 'default',
            // internal properties
            _isContextLost: false,
            // internal state cache
            _framebuffer: null,
            _currentRenderTarget: null,
            _currentFramebuffer: null,
            _currentMaterialId: -1,
            _currentGeometryProgram: '',
            _currentCamera: null,
            _currentArrayCamera: null,
            _currentViewport: new Vector4(),
            _currentScissor: new Vector4(),
            _currentScissorTest: null,
            //
            _usedTextureUnits: 0,
            //
            _width: parameters.canvas!== undefined ? parameters.canvas.width:300,
            _height:  parameters.canvas!== undefined ? parameters.canvas.height:150,
            _pixelRatio: 1,
            _viewport: new Vector4(0, 0, parameters.canvas!== undefined ? parameters.canvas.width:300, parameters.canvas!== undefined ? parameters.canvas.height:150),
            _scissor: new Vector4(0, 0, parameters.canvas!== undefined ? parameters.canvas.width:300, parameters.canvas!== undefined ? parameters.canvas.height:150),
            _scissorTest: false,
            // frustum
            _frustum: new Frustum(),
            // clipping
            _clipping: new WebGLClipping(),
            _clippingEnabled: false,
            _localClippingEnabled: false,
            // camera matrices cache
            _projScreenMatrix: new Matrix4(),
            _vector3: new Vector3()
        };
        this.currentRenderList= null;
        this.currentRenderState= null;
        // pulic属性
        this.domElement = this.parameterSet._canvas;
        this.context = null;
        // 清除
        this.autoClear = true;
        this.autoClearColor = true;
        this.autoClearDepth = true;
        this.autoClearStencil = true;
        // scene graph
        this.sortObjects = true;
        // user-defined clipping
        this.clippingPlanes = [];
        this.localClippingEnabled = false;
        // physically based shading
        this.gammaFactor = 2.0;	// for backwards compatibility
        this.gammaInput = false;
        this.gammaOutput = false;
        // physical lights
        this.physicallyCorrectLights = false;
        // tone mapping
        this.toneMapping = LinearToneMapping;
        this.toneMappingExposure = 1.0;
        this.toneMappingWhitePoint = 1.0;
        // morphs
        this.maxMorphTargets = 8;
        this.maxMorphNormals = 4;
        this.gl;
        this.renderLists;
        this.morphtargets;
        this.bufferRenderer;
        this.renderStates;
        this.background;
        this.indexedBufferRenderer;
        this.spriteRenderer;
        this.objects;
        this.capabilities;
        this.properties;
        this.state;
        this.info;
        this.programCache;
        this.geometries;
        this.attributes;
        this.textures;
        this.utils;
        // 初始化
        this._init();
        this.initGLContext();
        // vr
        this.vr = ('xr' in navigator) ? new WebXRManager(this) : new WebVRManager(this);
        // shadow map
        this.shadowMap = new WebGLShadowMap(this, this.objects, this.capabilities.maxTextureSize);
        //动画
        this.animation = new WebGLAnimation();
        this.animation.setAnimationLoop(this.onAnimationFrame);
        if (typeof window !== 'undefined') this.animation.setContext(window);
        //动画循环回调
        this.onAnimationFrameCallback = null;
    }

    _init() {
        let gl;
        try {
            let contextAttributes = {
                alpha: this.parameterSet._alpha,
                depth: this.parameterSet._depth,
                stencil: this.parameterSet._stencil,
                antialias: this.parameterSet._antialias,
                premultipliedAlpha: this.parameterSet._premultipliedAlpha,
                preserveDrawingBuffer: this.parameterSet._preserveDrawingBuffer,
                powerPreference: this.parameterSet._powerPreference
            };
            // event listeners must be registered before WebGL context is created, see #12753
            this.parameterSet._canvas.addEventListener('webglcontextlost', this.onContextLost, false);
            this.parameterSet._canvas.addEventListener('webglcontextrestored', this.onContextRestore, false);
            gl = this.parameterSet._context || this.parameterSet._canvas.getContext('webgl', contextAttributes) || this.parameterSet._canvas.getContext('experimental-webgl', contextAttributes);
            if (gl === null) {
                if (this.parameterSet._canvas.getContext('webgl') !== null) {
                    throw new Error('Error creating WebGL context with your selected attributes.');
                } else {
                    throw new Error('Error creating WebGL context.');
                }
            }
            // Some experimental-webgl implementations do not have getShaderPrecisionFormat
            if (gl.getShaderPrecisionFormat === undefined) {
                gl.getShaderPrecisionFormat = function () {
                    return {'rangeMin': 1, 'rangeMax': 1, 'precision': 1};
                };
            }
        } catch (error) {
            console.error('Speed3DEngine.WebGLRenderer: ' + error.message);
        }
        this.gl = gl;
    }

    getTargetPixelRatio() {
        return this.parameterSet._currentRenderTarget === null ? this.parameterSet._pixelRatio : 1;
    }

    initGLContext() {
        let gl = this.gl;
        let extensions, capabilities, state, info;
        let properties;
        let renderLists;
        extensions = new WebGLExtensions(gl);
        extensions.get('WEBGL_depth_texture');
        extensions.get('OES_texture_float');
        extensions.get('OES_texture_float_linear');
        extensions.get('OES_texture_half_float');
        extensions.get('OES_texture_half_float_linear');
        extensions.get('OES_standard_derivatives');
        extensions.get('OES_element_index_uint');
        extensions.get('ANGLE_instanced_arrays');
        this.utils = new WebGLUtils(gl, extensions);
        capabilities = new WebGLCapabilities(gl, extensions, this.parameters);
        state = new WebGLState(gl, extensions, this.utils);
        state.scissor(this.parameterSet._currentScissor.copy(this.parameterSet._scissor).multiplyScalar(this.parameterSet._pixelRatio));
        state.viewport(this.parameterSet._currentViewport.copy(this.parameterSet._viewport).multiplyScalar(this.parameterSet._pixelRatio));
        info = new WebGLInfo(gl);
        properties = new WebGLProperties();
        this.textures = new WebGLTextures(gl, extensions, state, properties, capabilities, this.utils, info);
        this.attributes = new WebGLAttributes(gl);
        this.geometries = new WebGLGeometries(gl, this.attributes, info);
        this.objects = new WebGLObjects(this.geometries, info);
        this.morphtargets = new WebGLMorphtargets(gl);
        this.programCache = new WebGLPrograms(this, extensions, capabilities);
        renderLists = new WebGLRenderLists();
        this.renderStates = new WebGLRenderStates();
        this.background = new WebGLBackground(this, state, this.objects, this.parameterSet._premultipliedAlpha);
        this.bufferRenderer = new WebGLBufferRenderer(gl, extensions, info);
        this.indexedBufferRenderer = new WebGLIndexedBufferRenderer(gl, extensions, info);
        this.spriteRenderer = new WebGLSpriteRenderer(this, gl, state, this.textures, capabilities);
        info.programs = this.programCache.programs;
        this.context = gl;
        this.capabilities = capabilities;
        this.extensions = extensions;
        this.properties = properties;
        this.renderLists = renderLists;
        this.state = state;
        this.info = info;
    }

    // API
    getContext() {
        return this.gl;
    }

    getContextAttributes() {
        return this.gl.getContextAttributes();
    }

    forceContextLoss() {
        let extension = this.extensions.get('WEBGL_lose_context');
        if (extension) extension.loseContext();
    }

    forceContextRestore() {
        let extension = this.extensions.get('WEBGL_lose_context');
        if (extension) extension.restoreContext();
    }

    getPixelRatio() {
        return this.parameterSet._pixelRatio;
    }

    setPixelRatio(value) {
        if (value === undefined) return;
        this.parameterSet._pixelRatio = value;
        this.setSize(this.parameterSet._width, this.parameterSet._height, false);
    }

    getSize() {
        return {
            width: this.parameterSet._width,
            height: this.parameterSet._height
        };
    }

    setSize(width, height, updateStyle) {
        if (this.vr.isPresenting()) {
            console.warn('Speed3DEngine.WebGLRenderer: VR设备正在运行中，更改尺寸失败！.');
            return;
        }
        this.parameterSet._width = width;
        this.parameterSet._height = height;
        this.parameterSet._canvas.width = width * this.parameterSet._pixelRatio;
        this.parameterSet._canvas.height = height * this.parameterSet._pixelRatio;
        if (updateStyle !== false) {
            this.parameterSet._canvas.style.width = width + 'px';
            this.parameterSet._canvas.style.height = height + 'px';
        }
        this.setViewport(0, 0, width, height);
    }

    getDrawingBufferSize() {
        return {
            width: this.parameterSet._width * this.parameterSet._pixelRatio,
            height: this.parameterSet._height * this.parameterSet._pixelRatio
        };
    }

    setDrawingBufferSize(width, height, pixelRatio) {
        this.parameterSet._width = width;
        this.parameterSet._height = height;
        this.parameterSet._pixelRatio = pixelRatio;
        this.parameterSet._canvas.width = width * pixelRatio;
        this.parameterSet._canvas.height = height * pixelRatio;
        this.setViewport(0, 0, width, height);
    }

    getCurrentViewport() {
        return this.parameterSet._currentViewport;
    }

    setViewport(x, y, width, height) {
        this.parameterSet._viewport.set(x, this.parameterSet._height - y - height, width, height);
        this.state.viewport(this.parameterSet._currentViewport.copy(this.parameterSet._viewport).multiplyScalar(this.parameterSet._pixelRatio));
    }

    setScissor(x, y, width, height) {
        this.parameterSet._scissor.set(x, this.parameterSet._height - y - height, width, height);
        this.state.scissor(this.parameterSet._currentScissor.copy(this.parameterSet._scissor).multiplyScalar(this.parameterSet._pixelRatio));
    }

    setScissorTest(boolean) {
        this.state.setScissorTest(this.parameterSet._scissorTest = boolean);
    }

    // Clearing
    getClearColor() {
        return this.background.getClearColor();
    }

    setClearColor(...arg) {
        this.background.setClearColor.apply(this.background, ...arg);
    }

    getClearAlpha() {
        return this.background.getClearAlpha();
    }

    setClearAlpha(...arg) {
        this.background.setClearAlpha.apply(this.background, ...arg);
    }

    clear(color, depth, stencil) {
        let gl = this.gl;
        let bits = 0;
        if (color === undefined || color) bits |= gl.COLOR_BUFFER_BIT;
        if (depth === undefined || depth) bits |= gl.DEPTH_BUFFER_BIT;
        if (stencil === undefined || stencil) bits |= gl.STENCIL_BUFFER_BIT;
        gl.clear(bits);
    }

    clearColor() {
        this.clear(true, false, false);
    }

    clearDepth() {
        this.clear(false, true, false);
    }

    clearStencil() {
        this.clear(false, false, true);
    }

    clearTarget(renderTarget, color, depth, stencil) {
        this.setRenderTarget(renderTarget);
        this.clear(color, depth, stencil);
    }

    dispose() {
        this.parameterSet._canvas.removeEventListener('webglcontextlost', this.onContextLost, false);
        this.parameterSet._canvas.removeEventListener('webglcontextrestored', this.onContextRestore, false);
        this.renderLists.dispose();
        this.renderStates.dispose();
        this.properties.dispose();
        this.objects.dispose();
        this.vr.dispose();
        this.animation.stop();
    }

    // 事件
    onContextLost(event) {
        event.preventDefault();
        console.log('Speed3DEngine.WebGLRenderer: Context Lost.');
        this.parameterSet._isContextLost = true;
    }

    onContextRestore() {
        console.log('Speed3DEngine.WebGLRenderer: Context Restored.');
        this.parameterSet._isContextLost = false;
        this.initGLContext();
    }

    onMaterialDispose(event) {
        let material = event.target;
        material.removeEventListener('dispose', this.onMaterialDispose);
        this.deallocateMaterial(material);
    }

    // Buffer deallocation
    deallocateMaterial(material) {
        this.releaseMaterialProgramReference(material);
        this.properties.remove(material);
    }

    releaseMaterialProgramReference(material) {
        let programInfo = this.properties.get(material).program;
        material.program = undefined;
        if (programInfo !== undefined) {
            this.programCache.releaseProgram(programInfo);
        }
    }

    // Buffer rendering
    renderObjectImmediate(object, program, material) {
        let that = this;
        object.render(object => {
            that.renderBufferImmediate(object, program, material);
        });
    }

    renderBufferImmediate(object, program, material) {
        this.state.initAttributes();
        let buffers = this.properties.get(object);
        let gl = this.gl;
        if (object.hasPositions && !buffers.position) buffers.position = gl.createBuffer();
        if (object.hasNormals && !buffers.normal) buffers.normal = gl.createBuffer();
        if (object.hasUvs && !buffers.uv) buffers.uv = gl.createBuffer();
        if (object.hasColors && !buffers.color) buffers.color = gl.createBuffer();
        let programAttributes = program.getAttributes();
        if (object.hasPositions) {
            gl.bindBuffer(gl.ARRAY_BUFFER, buffers.position);
            gl.bufferData(gl.ARRAY_BUFFER, object.positionArray, gl.DYNAMIC_DRAW);
            this.state.enableAttribute(programAttributes.position);
            gl.vertexAttribPointer(programAttributes.position, 3, gl.FLOAT, false, 0, 0);
        }
        if (object.hasNormals) {
            gl.bindBuffer(gl.ARRAY_BUFFER, buffers.normal);
            if (!material.isMeshPhongMaterial &&
                !material.isMeshStandardMaterial &&
                !material.isMeshNormalMaterial &&
                material.flatShading === true) {
                for (let i = 0, l = object.count * 3; i < l; i += 9) {
                    let array = object.normalArray;
                    let nx = (array[i + 0] + array[i + 3] + array[i + 6]) / 3;
                    let ny = (array[i + 1] + array[i + 4] + array[i + 7]) / 3;
                    let nz = (array[i + 2] + array[i + 5] + array[i + 8]) / 3;
                    array[i + 0] = nx;
                    array[i + 1] = ny;
                    array[i + 2] = nz;
                    array[i + 3] = nx;
                    array[i + 4] = ny;
                    array[i + 5] = nz;
                    array[i + 6] = nx;
                    array[i + 7] = ny;
                    array[i + 8] = nz;
                }
            }
            gl.bufferData(gl.ARRAY_BUFFER, object.normalArray, gl.DYNAMIC_DRAW);
            this.state.enableAttribute(programAttributes.normal);
            gl.vertexAttribPointer(programAttributes.normal, 3, gl.FLOAT, false, 0, 0);
        }
        if (object.hasUvs && material.map) {
            gl.bindBuffer(gl.ARRAY_BUFFER, buffers.uv);
            gl.bufferData(gl.ARRAY_BUFFER, object.uvArray, gl.DYNAMIC_DRAW);
            this.state.enableAttribute(programAttributes.uv);
            gl.vertexAttribPointer(programAttributes.uv, 2, gl.FLOAT, false, 0, 0);
        }
        if (object.hasColors && material.vertexColors !== NoColors) {
            gl.bindBuffer(gl.ARRAY_BUFFER, buffers.color);
            gl.bufferData(gl.ARRAY_BUFFER, object.colorArray, gl.DYNAMIC_DRAW);
            this.state.enableAttribute(programAttributes.color);
            gl.vertexAttribPointer(programAttributes.color, 3, gl.FLOAT, false, 0, 0);
        }
        this.state.disableUnusedAttributes();
        gl.drawArrays(gl.TRIANGLES, 0, object.count);
        object.count = 0;
    }

    renderBufferDirect(camera, fog, geometry, material, object, group) {
        let frontFaceCW = (object.isMesh && object.matrixWorld.determinant() < 0);
        let gl = this.gl;
        let state = this.state;
        state.setMaterial(material, frontFaceCW);
        let program = this.setProgram(camera, fog, material, object);
        let geometryProgram = geometry.id + '_' + program.id + '_' + (material.wireframe === true);
        let updateBuffers = false;
        if (geometryProgram !== this.parameterSet._currentGeometryProgram) {
            this.parameterSet._currentGeometryProgram = geometryProgram;
            updateBuffers = true;
        }
        if (object.morphTargetInfluences) {
            this.morphtargets.update(object, geometry, material, program);
            updateBuffers = true;
        }
        let index = geometry.index;
        let position = geometry.attributes.position;
        let rangeFactor = 1;
        if (material.wireframe === true) {
            index = this.geometries.getWireframeAttribute(geometry);
            rangeFactor = 2;
        }
        let attribute;
        let renderer = this.bufferRenderer;
        if (index !== null) {
            attribute = this.attributes.get(index);
            renderer = this.indexedBufferRenderer;
            renderer.setIndex(attribute);
        }
        if (updateBuffers) {
            this.setupVertexAttributes(material, program, geometry);
            if (index !== null) {
                gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, attribute.buffer);
            }
        }
        let dataCount = Infinity;
        if (index !== null) {
            dataCount = index.count;
        } else if (position !== undefined) {
            dataCount = position.count;
        }
        let rangeStart = geometry.drawRange.start * rangeFactor;
        let rangeCount = geometry.drawRange.count * rangeFactor;
        let groupStart = group !== null ? group.start * rangeFactor : 0;
        let groupCount = group !== null ? group.count * rangeFactor : Infinity;
        let drawStart = Math.max(rangeStart, groupStart);
        let drawEnd = Math.min(dataCount, rangeStart + rangeCount, groupStart + groupCount) - 1;
        let drawCount = Math.max(0, drawEnd - drawStart + 1);
        if (drawCount === 0) return;
        if (object.isMesh) {
            if (material.wireframe === true) {
                state.setLineWidth(material.wireframeLinewidth * this.getTargetPixelRatio());
                renderer.setMode(gl.LINES);
            } else {
                switch (object.drawMode) {
                    case TrianglesDrawMode:
                        renderer.setMode(gl.TRIANGLES);
                        break;
                    case TriangleStripDrawMode:
                        renderer.setMode(gl.TRIANGLE_STRIP);
                        break;
                    case TriangleFanDrawMode:
                        renderer.setMode(gl.TRIANGLE_FAN);
                        break;
                }
            }
        } else if (object.isLine) {
            let lineWidth = material.linewidth;
            if (lineWidth === undefined) lineWidth = 1; // Not using Line*Material
            state.setLineWidth(lineWidth * this.getTargetPixelRatio());
            if (object.isLineSegments) {
                renderer.setMode(gl.LINES);
            } else if (object.isLineLoop) {
                renderer.setMode(gl.LINE_LOOP);
            } else {
                renderer.setMode(gl.LINE_STRIP);
            }
        } else if (object.isPoints) {
            renderer.setMode(gl.POINTS);
        }
        if (geometry && geometry.isInstancedBufferGeometry) {
            if (geometry.maxInstancedCount > 0) {
                renderer.renderInstances(geometry, drawStart, drawCount);
            }
        } else {
            renderer.render(drawStart, drawCount);
        }
    }

    setupVertexAttributes(material, program, geometry) {
        if (geometry && geometry.isInstancedBufferGeometry) {
            if (this.extensions.get('ANGLE_instanced_arrays') === null) {
                console.error('Speed3DEngine.WebGLRenderer.setupVertexAttributes: using Speed3DEngine.InstancedBufferGeometry but hardware does not support extension ANGLE_instanced_arrays.');
                return;
            }
        }
        let state = this.state;
        let gl = this.gl;
        state.initAttributes();
        let geometryAttributes = geometry.attributes;
        let programAttributes = program.getAttributes();
        let materialDefaultAttributeValues = material.defaultAttributeValues;
        for (let name in programAttributes) {
            let programAttribute = programAttributes[name];
            if (programAttribute >= 0) {
                let geometryAttribute = geometryAttributes[name];
                if (geometryAttribute !== undefined) {
                    let normalized = geometryAttribute.normalized;
                    let size = geometryAttribute.itemSize;
                    let attribute = this.attributes.get(geometryAttribute);
                    // TODO Attribute may not be available on context restore
                    if (attribute === undefined) continue;
                    let buffer = attribute.buffer;
                    let type = attribute.type;
                    let bytesPerElement = attribute.bytesPerElement;
                    if (geometryAttribute.isInterleavedBufferAttribute) {
                        let data = geometryAttribute.data;
                        let stride = data.stride;
                        let offset = geometryAttribute.offset;
                        if (data && data.isInstancedInterleavedBuffer) {
                            state.enableAttributeAndDivisor(programAttribute, data.meshPerAttribute);
                            if (geometry.maxInstancedCount === undefined) {
                                geometry.maxInstancedCount = data.meshPerAttribute * data.count;
                            }
                        } else {
                            state.enableAttribute(programAttribute);
                        }
                        gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
                        gl.vertexAttribPointer(programAttribute, size, type, normalized, stride * bytesPerElement, offset * bytesPerElement);
                    } else {
                        if (geometryAttribute.isInstancedBufferAttribute) {
                            state.enableAttributeAndDivisor(programAttribute, geometryAttribute.meshPerAttribute);
                            if (geometry.maxInstancedCount === undefined) {
                                geometry.maxInstancedCount = geometryAttribute.meshPerAttribute * geometryAttribute.count;
                            }
                        } else {
                            state.enableAttribute(programAttribute);
                        }
                        gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
                        gl.vertexAttribPointer(programAttribute, size, type, normalized, 0, 0);
                    }
                } else if (materialDefaultAttributeValues !== undefined) {
                    let value = materialDefaultAttributeValues[name];
                    if (value !== undefined) {
                        switch (value.length) {
                            case 2:
                                gl.vertexAttrib2fv(programAttribute, value);
                                break;
                            case 3:
                                gl.vertexAttrib3fv(programAttribute, value);
                                break;
                            case 4:
                                gl.vertexAttrib4fv(programAttribute, value);
                                break;
                            default:
                                gl.vertexAttrib1fv(programAttribute, value);
                        }
                    }
                }
            }
        }
        state.disableUnusedAttributes();
    }

    // Compile
    compile(scene, camera) {
        let currentRenderState = this.currentRenderState;
        let that = this;
        currentRenderState = this.renderStates.get(scene, camera);
        currentRenderState.init();
        scene.traverse(object => {
            if (object.isLight)
                currentRenderState.pushLight(object);
            if (object.castShadow) {
                currentRenderState.pushShadow(object);
            }
        });
        currentRenderState.setupLights(camera);
        scene.traverse(object => {
            if (object.material) {
                if (Array.isArray(object.material)) {
                    for (let i = 0; i < object.material.length; i++) {
                        that.initMaterial(object.material[i], scene.fog, object);
                    }
                } else {
                    that.initMaterial(object.material, scene.fog, object);
                }
            }
        });
    }

    // Animation Loop
    onAnimationFrame() {
        if (this.vr.isPresenting()) return;
        if (this.onAnimationFrameCallback) this.onAnimationFrameCallback();
    }

    setAnimationLoop(callback) {
        this.onAnimationFrameCallback = callback;
        this.vr.setAnimationLoop(callback);
        this.animation.start();
    }

    // Rendering
    render(scene, camera, renderTarget, forceClear) {
        if (!(camera && camera.isCamera)) {
            console.error('Speed3DEngine.WebGLRenderer.render: camera is not an instance of Speed3DEngine.Camera.');
            return;
        }
        if (this.parameterSet._isContextLost) return;
        let state = this.state;
        // reset caching for this frame
        this.parameterSet._currentGeometryProgram = '';
        this.parameterSet._currentMaterialId = -1;
        this.parameterSet._currentCamera = null;
        // update scene graph
        if (scene.autoUpdate === true) scene.updateMatrixWorld();
        // update camera matrices and frustum
        if (camera.parent === null) camera.updateMatrixWorld();
        if (this.vr.enabled) {
            camera = this.vr.getCamera(camera);
        }
        let currentRenderState = this.renderStates.get(scene, camera);
      currentRenderState.init();
        this.currentRenderState = currentRenderState;
        scene.onBeforeRender(this, scene, camera, renderTarget);
        this.parameterSet._projScreenMatrix.multiplyMatrices(camera.projectionMatrix, camera.matrixWorldInverse);
        this.parameterSet._frustum.setFromMatrix(this.parameterSet._projScreenMatrix);
        this.parameterSet._localClippingEnabled = this.localClippingEnabled;
        this.parameterSet._clippingEnabled = this.parameterSet._clipping.init(this.clippingPlanes, this.parameterSet._localClippingEnabled, camera);
        let currentRenderList = this.renderLists.get(scene, camera);
        currentRenderList.init();
        this.currentRenderList = currentRenderList;
        this.projectObject(scene, camera, this.sortObjects);
        if (this.sortObjects === true) {
            currentRenderList.sort();
        }
        if (this.parameterSet._clippingEnabled) this.parameterSet._clipping.beginShadows();
        let shadowsArray = currentRenderState.state.shadowsArray;
        this.shadowMap.render(shadowsArray, scene, camera);
        currentRenderState.setupLights(camera);
        if (this.parameterSet._clippingEnabled) this.parameterSet._clipping.endShadows();
        if (this.info.autoReset) this.info.reset();
        if (renderTarget === undefined) {
            renderTarget = null;
        }
        this.setRenderTarget(renderTarget);
        this.background.render(currentRenderList, scene, camera, forceClear);
        // render scene
        let opaqueObjects = currentRenderList.opaque;
        let transparentObjects = currentRenderList.transparent;
        if (scene.overrideMaterial) {
            let overrideMaterial = scene.overrideMaterial;
            if (opaqueObjects.length) this.renderObjects(opaqueObjects, scene, camera, overrideMaterial);
            if (transparentObjects.length) this.renderObjects(transparentObjects, scene, camera, overrideMaterial);
        } else {
            // opaque pass (front-to-back order)
            if (opaqueObjects.length) this.renderObjects(opaqueObjects, scene, camera);
            // transparent pass (back-to-front order)
            if (transparentObjects.length) this.renderObjects(transparentObjects, scene, camera);
        }
        // custom renderers
        let spritesArray = currentRenderState.state.spritesArray;
        this.spriteRenderer.render(spritesArray, scene, camera);
        // Generate mipmap if we're using any kind of mipmap filtering
        if (renderTarget) {
            this.textures.updateRenderTargetMipmap(renderTarget);
        }
        // Ensure depth buffer writing is enabled so it can be cleared on next render
        state.buffers.depth.setTest(true);
        state.buffers.depth.setMask(true);
        state.buffers.color.setMask(true);
        state.setPolygonOffset(false);
        this.state = state;
        scene.onAfterRender(this, scene, camera);
        if (this.vr.enabled) {
            this.vr.submitFrame();
        }
        currentRenderList = null;
        this.currentRenderList = currentRenderList;
        currentRenderState = null;
        this.currentRenderState = currentRenderState;
    }

    projectObject(object, camera, sortObjects) {
        if (object.visible === false) return;
        let currentRenderState = this.currentRenderState;
        let currentRenderList = this.currentRenderList;
        let visible = object.layers.test(camera.layers);
        if (visible) {
            if (object.isLight) {
                currentRenderState.pushLight(object);
                if (object.castShadow) {
                    currentRenderState.pushShadow(object);
                }
            } else if (object.isSprite) {
                if (!object.frustumCulled || this.parameterSet._frustum.intersectsSprite(object)) {
                    currentRenderState.pushSprite(object);
                }
            } else if (object.isImmediateRenderObject) {
                if (sortObjects) {
                    this.parameterSet._vector3.setFromMatrixPosition(object.matrixWorld)
                        .applyMatrix4(this.parameterSet._projScreenMatrix);
                }
                currentRenderList.push(object, null, object.material, this.parameterSet._vector3.z, null);
            } else if (object.isMesh || object.isLine || object.isPoints) {
                if (object.isSkinnedMesh) {
                    object.skeleton.update();
                }
                if (!object.frustumCulled || this.parameterSet._frustum.intersectsObject(object)) {
                    if (sortObjects) {
                        this.parameterSet._vector3.setFromMatrixPosition(object.matrixWorld).applyMatrix4(this.parameterSet._projScreenMatrix);
                    }
                    let geometry = this.objects.update(object);
                    let material = object.material;
                    if (Array.isArray(material)) {
                        let groups = geometry.groups;
                        for (let i = 0, l = groups.length; i < l; i++) {
                            let group = groups[i];
                            let groupMaterial = material[group.materialIndex];
                            if (groupMaterial && groupMaterial.visible) {
                                currentRenderList.push(object, geometry, groupMaterial, this.parameterSet._vector3.z, group);
                            }
                        }
                    } else if (material.visible) {
                        currentRenderList.push(object, geometry, material, this.parameterSet._vector3.z, null);
                    }
                }
            }
        }
        let children = object.children;
        for (let i = 0, l = children.length; i < l; i++) {
            this.projectObject(children[i], camera, sortObjects);
        }
    }

    renderObjects(renderList, scene, camera, overrideMaterial) {
        for (let i = 0, l = renderList.length; i < l; i++) {
            let renderItem = renderList[i];
            let object = renderItem.object;
            let geometry = renderItem.geometry;
            let material = overrideMaterial === undefined ? renderItem.material : overrideMaterial;
            let group = renderItem.group;
            if (camera.isArrayCamera) {
                this.parameterSet._currentArrayCamera = camera;
                let cameras = camera.cameras;
                for (let j = 0, jl = cameras.length; j < jl; j++) {
                    let camera2 = cameras[j];
                    if (object.layers.test(camera2.layers)) {
                        if ('viewport' in camera2) { // XR
                            this.state.viewport(this.parameterSet._currentViewport.copy(camera2.viewport));
                        } else {
                            let bounds = camera2.bounds;
                            let x = bounds.x * this.parameterSet._width;
                            let y = bounds.y * this.parameterSet._height;
                            let width = bounds.z * this.parameterSet._width;
                            let height = bounds.w * this.parameterSet._height;
                            this.state.viewport(this.parameterSet._currentViewport.set(x, y, width, height).multiplyScalar(this.parameterSet._pixelRatio));
                        }
                        this.renderObject(object, scene, camera2, geometry, material, group);
                    }
                }
            } else {
                this.parameterSet._currentArrayCamera = null;
                this.renderObject(object, scene, camera, geometry, material, group);
            }
        }
    }

    renderObject(object, scene, camera, geometry, material, group) {
        let currentRenderState = this.currentRenderState;
        object.onBeforeRender(this, scene, camera, geometry, material, group);
        currentRenderState = this.renderStates.get(scene, this.parameterSet._currentArrayCamera || camera);
        object.modelViewMatrix.multiplyMatrices(camera.matrixWorldInverse, object.matrixWorld);
        object.normalMatrix.getNormalMatrix(object.modelViewMatrix);
        if (object.isImmediateRenderObject) {
            let frontFaceCW = (object.isMesh && object.matrixWorld.determinant() < 0);
            this.state.setMaterial(material, frontFaceCW);
            let program = this.setProgram(camera, scene.fog, material, object);
            this.parameterSet._currentGeometryProgram = '';
            this.renderObjectImmediate(object, program, material);
        } else {
            this.renderBufferDirect(camera, scene.fog, geometry, material, object, group);
        }
        object.onAfterRender(this, scene, camera, geometry, material, group);
        currentRenderState = this.renderStates.get(scene, this.parameterSet._currentArrayCamera || camera);
    }

    initMaterial(material, fog, object) {
        let currentRenderState = this.currentRenderState;
        let materialProperties = this.properties.get(material);
        let lights = currentRenderState.state.lights;
        let shadowsArray = currentRenderState.state.shadowsArray;
        let parameters = this.programCache.getParameters(
            material, lights.state, shadowsArray, fog, this.parameterSet._clipping.numPlanes, this.parameterSet._clipping.numIntersection, object);
        let code = this.programCache.getProgramCode(material, parameters);
        let program = materialProperties.program;
        let programChange = true;
        if (program === undefined) {
            // new material
            material.addEventListener('dispose', this.onMaterialDispose);
        } else if (program.code !== code) {
            // changed glsl or parameters
            this.releaseMaterialProgramReference(material);
        } else if (materialProperties.lightsHash !== lights.state.hash) {
            this.properties.update(material, 'lightsHash', lights.state.hash);
            programChange = false;
        } else if (parameters.shaderID !== undefined) {
            // same glsl and uniform list
            return;
        } else {
            // only rebuild uniform list
            programChange = false;
        }
        if (programChange) {
            if (parameters.shaderID) {
                let shader = ShaderLib[parameters.shaderID];
                materialProperties.shader = {
                    name: material.type,
                    uniforms: UniformsUtils.clone(shader.uniforms),
                    vertexShader: shader.vertexShader,
                    fragmentShader: shader.fragmentShader
                };
            } else {
                materialProperties.shader = {
                    name: material.type,
                    uniforms: material.uniforms,
                    vertexShader: material.vertexShader,
                    fragmentShader: material.fragmentShader
                };
            }
            material.onBeforeCompile(materialProperties.shader, this);
            program = this.programCache.acquireProgram(material, materialProperties.shader, parameters, code);
            materialProperties.program = program;
            material.program = program;
        }
        let programAttributes = program.getAttributes();
        if (material.morphTargets) {
            material.numSupportedMorphTargets = 0;
            for (let i = 0; i < this.maxMorphTargets; i++) {
                if (programAttributes['morphTarget' + i] >= 0) {
                    material.numSupportedMorphTargets++;
                }
            }
        }
        if (material.morphNormals) {
            material.numSupportedMorphNormals = 0;
            for (let i = 0; i < this.maxMorphNormals; i++) {
                if (programAttributes['morphNormal' + i] >= 0) {
                    material.numSupportedMorphNormals++;
                }
            }
        }
        let uniforms = materialProperties.shader.uniforms;
        if (!material.isShaderMaterial &&
            !material.isRawShaderMaterial ||
            material.clipping === true) {
            materialProperties.numClippingPlanes = this.parameterSet._clipping.numPlanes;
            materialProperties.numIntersection = this.parameterSet._clipping.numIntersection;
            uniforms.clippingPlanes = this.parameterSet._clipping.uniform;
        }
        materialProperties.fog = fog;
        // store the light setup it was created for
        materialProperties.lightsHash = lights.state.hash;
        if (material.lights) {
            // wire up the material to this renderer's lighting state
            uniforms.ambientLightColor.value = lights.state.ambient;
            uniforms.directionalLights.value = lights.state.directional;
            uniforms.spotLights.value = lights.state.spot;
            uniforms.rectAreaLights.value = lights.state.rectArea;
            uniforms.pointLights.value = lights.state.point;
            uniforms.hemisphereLights.value = lights.state.hemi;
            uniforms.directionalShadowMap.value = lights.state.directionalShadowMap;
            uniforms.directionalShadowMatrix.value = lights.state.directionalShadowMatrix;
            uniforms.spotShadowMap.value = lights.state.spotShadowMap;
            uniforms.spotShadowMatrix.value = lights.state.spotShadowMatrix;
            uniforms.pointShadowMap.value = lights.state.pointShadowMap;
            uniforms.pointShadowMatrix.value = lights.state.pointShadowMatrix;
        }

        let progUniforms = materialProperties.program.getUniforms();
        materialProperties.uniformsList = WebGLUniforms.seqWithValue(progUniforms.seq, uniforms);
    }

    setProgram(camera, fog, material, object) {
        this.parameterSet._usedTextureUnits = 0;
        let currentRenderState = this.currentRenderState;
        let gl = this.gl;
        let materialProperties = this.properties.get(material);
        let lights = currentRenderState.state.lights;
        if (this.parameterSet._clippingEnabled) {
            if (this.parameterSet._localClippingEnabled || camera !== this.parameterSet._currentCamera) {
                let useCache = camera === this.parameterSet._currentCamera && material.id === this.parameterSet._currentMaterialId;
                // we might want to call this function with some ClippingGroup
                // object instead of the material, once it becomes feasible
                // (#8465, #8379)
                this.parameterSet._clipping.setState(material.clippingPlanes, material.clipIntersection, material.clipShadows, camera, materialProperties, useCache);
            }
        }
        if (material.needsUpdate === false) {
            if (materialProperties.program === undefined) {
                material.needsUpdate = true;
            } else if (material.fog && materialProperties.fog !== fog) {
                material.needsUpdate = true;
            } else if (material.lights && materialProperties.lightsHash !== lights.state.hash) {
                material.needsUpdate = true;
            } else if (materialProperties.numClippingPlanes !== undefined &&
                (materialProperties.numClippingPlanes !== this.parameterSet._clipping.numPlanes ||
                    materialProperties.numIntersection !== this.parameterSet._clipping.numIntersection)) {
                material.needsUpdate = true;
            }
        }
        if (material.needsUpdate) {
            this.initMaterial(material, fog, object);
            material.needsUpdate = false;
        }
        let refreshProgram = false;
        let refreshMaterial = false;
        let refreshLights = false;
        let program = materialProperties.program,
            p_uniforms = program.getUniforms(),
            m_uniforms = materialProperties.shader.uniforms;
        if (this.state.useProgram(program.program)) {
            refreshProgram = true;
            refreshMaterial = true;
            refreshLights = true;
        }
        if (material.id !== this.parameterSet._currentMaterialId) {
            this.parameterSet._currentMaterialId = material.id;
            refreshMaterial = true;
        }
        if (refreshProgram || camera !== this.parameterSet._currentCamera) {
            p_uniforms.setValue(gl, 'projectionMatrix', camera.projectionMatrix);
            if (this.capabilities.logarithmicDepthBuffer) {
                p_uniforms.setValue(gl, 'logDepthBufFC', 2.0 / (Math.log(camera.far + 1.0) / Math.LN2));
            }
            // Avoid unneeded uniform updates per ArrayCamera's sub-camera
            if (this.parameterSet._currentCamera !== (this.parameterSet._currentArrayCamera || camera)) {
                this.parameterSet._currentCamera = (this.parameterSet._currentArrayCamera || camera);
                // lighting uniforms depend on the camera so enforce an update
                // now, in case this material supports lights - or later, when
                // the next material that does gets activated:
                refreshMaterial = true;		// set to true on material change
                refreshLights = true;		// remains set until update done
            }
            // load material specific uniforms
            // (shader material also gets them for the sake of genericity)
            if (material.isShaderMaterial ||
                material.isMeshPhongMaterial ||
                material.isMeshStandardMaterial ||
                material.envMap) {
                let uCamPos = p_uniforms.map.cameraPosition;
                if (uCamPos !== undefined) {
                    uCamPos.setValue(this.gl, this.parameterSet._vector3.setFromMatrixPosition(camera.matrixWorld));
                }
            }
            if (material.isMeshPhongMaterial ||
                material.isMeshLambertMaterial ||
                material.isMeshBasicMaterial ||
                material.isMeshStandardMaterial ||
                material.isShaderMaterial ||
                material.skinning) {
                p_uniforms.setValue(gl, 'viewMatrix', camera.matrixWorldInverse);
            }
        }
        // skinning uniforms must be set even if material didn't change
        // auto-setting of texture unit for bone texture must go before other textures
        // not sure why, but otherwise weird things happen
        if (material.skinning) {
            p_uniforms.setOptional(gl, object, 'bindMatrix');
            p_uniforms.setOptional(gl, object, 'bindMatrixInverse');
            let skeleton = object.skeleton;
            if (skeleton) {
                let bones = skeleton.bones;
                if (this.capabilities.floatVertexTextures) {
                    if (skeleton.boneTexture === undefined) {
                        // layout (1 matrix = 4 pixels)
                        //      RGBA RGBA RGBA RGBA (=> column1, column2, column3, column4)
                        //  with  8x8  pixel texture max   16 bones * 4 pixels =  (8 * 8)
                        //       16x16 pixel texture max   64 bones * 4 pixels = (16 * 16)
                        //       32x32 pixel texture max  256 bones * 4 pixels = (32 * 32)
                        //       64x64 pixel texture max 1024 bones * 4 pixels = (64 * 64)
                        let size = Math.sqrt(bones.length * 4); // 4 pixels needed for 1 matrix
                        size = _Math.ceilPowerOfTwo(size);
                        size = Math.max(size, 4);
                        let boneMatrices = new Float32Array(size * size * 4); // 4 floats per RGBA pixel
                        boneMatrices.set(skeleton.boneMatrices); // copy current values
                        let boneTexture = new DataTexture(boneMatrices, size, size, RGBAFormat, FloatType);
                        boneTexture.needsUpdate = true;
                        skeleton.boneMatrices = boneMatrices;
                        skeleton.boneTexture = boneTexture;
                        skeleton.boneTextureSize = size;
                    }
                    p_uniforms.setValue(gl, 'boneTexture', skeleton.boneTexture);
                    p_uniforms.setValue(gl, 'boneTextureSize', skeleton.boneTextureSize);
                } else {
                    p_uniforms.setOptional(gl, skeleton, 'boneMatrices');
                }
            }
        }
        if (refreshMaterial) {
            p_uniforms.setValue(gl, 'toneMappingExposure', this.toneMappingExposure);
            p_uniforms.setValue(gl, 'toneMappingWhitePoint', this.toneMappingWhitePoint);
            if (material.lights) {
                // the current material requires lighting info
                // note: all lighting uniforms are always set correctly
                // they simply reference the renderer's state for their
                // values
                //
                // use the current material's .needsUpdate flags to set
                // the GL state when required
                WebGLRenderer.markUniformsLightsNeedsUpdate(m_uniforms, refreshLights);
            }
            // refresh uniforms common to several materials
            if (fog && material.fog) {
                WebGLRenderer.refreshUniformsFog(m_uniforms, fog);
            }
            if (material.isMeshBasicMaterial) {
                this.refreshUniformsCommon(m_uniforms, material);
            } else if (material.isMeshLambertMaterial) {
                this.refreshUniformsCommon(m_uniforms, material);
                WebGLRenderer.refreshUniformsLambert(m_uniforms, material);
            } else if (material.isMeshPhongMaterial) {
                this.refreshUniformsCommon(m_uniforms, material);
                if (material.isMeshToonMaterial) {
                    WebGLRenderer.refreshUniformsToon(m_uniforms, material);
                } else {
                    WebGLRenderer.refreshUniformsPhong(m_uniforms, material);
                }
            } else if (material.isMeshStandardMaterial) {
                this.refreshUniformsCommon(m_uniforms, material);
                if (material.isMeshPhysicalMaterial) {
                    WebGLRenderer.refreshUniformsPhysical(m_uniforms, material);
                } else {
                    WebGLRenderer.refreshUniformsStandard(m_uniforms, material);
                }
            } else if (material.isMeshDepthMaterial) {
                this.refreshUniformsCommon(m_uniforms, material);
                WebGLRenderer.refreshUniformsDepth(m_uniforms, material);
            } else if (material.isMeshDistanceMaterial) {
                this.refreshUniformsCommon(m_uniforms, material);
                WebGLRenderer.refreshUniformsDistance(m_uniforms, material);
            } else if (material.isMeshNormalMaterial) {
                this.refreshUniformsCommon(m_uniforms, material);
                WebGLRenderer.refreshUniformsNormal(m_uniforms, material);
            } else if (material.isLineBasicMaterial) {
                WebGLRenderer.refreshUniformsLine(m_uniforms, material);
                if (material.isLineDashedMaterial) {
                    WebGLRenderer.refreshUniformsDash(m_uniforms, material);
                }
            } else if (material.isPointsMaterial) {
                this.refreshUniformsPoints(m_uniforms, material);
            } else if (material.isShadowMaterial) {
                m_uniforms.color.value = material.color;
                m_uniforms.opacity.value = material.opacity;
            }
            // RectAreaLight Texture
            if (m_uniforms.ltc_1 !== undefined) m_uniforms.ltc_1.value = UniformsLib.LTC_1;
            if (m_uniforms.ltc_2 !== undefined) m_uniforms.ltc_2.value = UniformsLib.LTC_2;
            WebGLUniforms.upload(gl, materialProperties.uniformsList, m_uniforms, this);
        }
        if (material.isShaderMaterial && material.uniformsNeedUpdate === true) {
            WebGLUniforms.upload(gl, materialProperties.uniformsList, m_uniforms, this);
            material.uniformsNeedUpdate = false;
        }
        // common matrices
        p_uniforms.setValue(gl, 'modelViewMatrix', object.modelViewMatrix);
        p_uniforms.setValue(gl, 'normalMatrix', object.normalMatrix);
        p_uniforms.setValue(gl, 'modelMatrix', object.matrixWorld);
        return program;
    }

// Uniforms (refresh uniforms objects)

    refreshUniformsCommon(uniforms, material) {
        uniforms.opacity.value = material.opacity;
        if (material.color) {
            uniforms.diffuse.value = material.color;
        }
        if (material.emissive) {
            uniforms.emissive.value.copy(material.emissive).multiplyScalar(material.emissiveIntensity);
        }
        if (material.map) {
            uniforms.map.value = material.map;
        }
        if (material.alphaMap) {
            uniforms.alphaMap.value = material.alphaMap;
        }
        if (material.specularMap) {
            uniforms.specularMap.value = material.specularMap;
        }
        if (material.envMap) {
            uniforms.envMap.value = material.envMap;
            // don't flip CubeTexture envMaps, flip everything else:
            //  WebGLRenderTargetCube will be flipped for backwards compatibility
            //  WebGLRenderTargetCube.texture will be flipped because it's a Texture and NOT a CubeTexture
            // this check must be handled differently, or removed entirely, if WebGLRenderTargetCube uses a CubeTexture in the future
            uniforms.flipEnvMap.value = (!(material.envMap && material.envMap.isCubeTexture)) ? 1 : -1;
            uniforms.reflectivity.value = material.reflectivity;
            uniforms.refractionRatio.value = material.refractionRatio;
            uniforms.maxMipLevel.value = this.properties.get(material.envMap).__maxMipLevel;
        }
        if (material.lightMap) {
            uniforms.lightMap.value = material.lightMap;
            uniforms.lightMapIntensity.value = material.lightMapIntensity;
        }
        if (material.aoMap) {
            uniforms.aoMap.value = material.aoMap;
            uniforms.aoMapIntensity.value = material.aoMapIntensity;
        }
        // uv repeat and offset setting priorities
        // 1. color map
        // 2. specular map
        // 3. normal map
        // 4. bump map
        // 5. alpha map
        // 6. emissive map
        let uvScaleMap;
        if (material.map) {
            uvScaleMap = material.map;
        } else if (material.specularMap) {
            uvScaleMap = material.specularMap;
        } else if (material.displacementMap) {
            uvScaleMap = material.displacementMap;
        } else if (material.normalMap) {
            uvScaleMap = material.normalMap;
        } else if (material.bumpMap) {
            uvScaleMap = material.bumpMap;
        } else if (material.roughnessMap) {
            uvScaleMap = material.roughnessMap;
        } else if (material.metalnessMap) {
            uvScaleMap = material.metalnessMap;
        } else if (material.alphaMap) {
            uvScaleMap = material.alphaMap;
        } else if (material.emissiveMap) {
            uvScaleMap = material.emissiveMap;
        }
        if (uvScaleMap !== undefined) {
            // backwards compatibility
            if (uvScaleMap.isWebGLRenderTarget) {
                uvScaleMap = uvScaleMap.texture;
            }
            if (uvScaleMap.matrixAutoUpdate === true) {
                uvScaleMap.updateMatrix();
            }
            uniforms.uvTransform.value.copy(uvScaleMap.matrix);
        }
    }

    static refreshUniformsLine(uniforms, material) {
        uniforms.diffuse.value = material.color;
        uniforms.opacity.value = material.opacity;
    }

    static refreshUniformsDash(uniforms, material) {
        uniforms.dashSize.value = material.dashSize;
        uniforms.totalSize.value = material.dashSize + material.gapSize;
        uniforms.scale.value = material.scale;
    }

    refreshUniformsPoints(uniforms, material) {
        uniforms.diffuse.value = material.color;
        uniforms.opacity.value = material.opacity;
        uniforms.size.value = material.size * this.parameterSet._pixelRatio;
        uniforms.scale.value = this.parameterSet._height * 0.5;
        uniforms.map.value = material.map;
        if (material.map !== null) {
            if (material.map.matrixAutoUpdate === true) {
                material.map.updateMatrix();
            }
            uniforms.uvTransform.value.copy(material.map.matrix);
        }
    }

    static refreshUniformsFog(uniforms, fog) {
        uniforms.fogColor.value = fog.color;
        if (fog.isFog) {
            uniforms.fogNear.value = fog.near;
            uniforms.fogFar.value = fog.far;
        } else if (fog.isFogExp2) {
            uniforms.fogDensity.value = fog.density;
        }
    }

    static refreshUniformsLambert(uniforms, material) {
        if (material.emissiveMap) {
            uniforms.emissiveMap.value = material.emissiveMap;
        }
    }

    static refreshUniformsPhong(uniforms, material) {
        uniforms.specular.value = material.specular;
        uniforms.shininess.value = Math.max(material.shininess, 1e-4); // to prevent pow( 0.0, 0.0 )
        if (material.emissiveMap) {
            uniforms.emissiveMap.value = material.emissiveMap;
        }
        if (material.bumpMap) {
            uniforms.bumpMap.value = material.bumpMap;
            uniforms.bumpScale.value = material.bumpScale;
            if (material.side === BackSide) uniforms.bumpScale.value *= -1;
        }
        if (material.normalMap) {
            uniforms.normalMap.value = material.normalMap;
            uniforms.normalScale.value.copy(material.normalScale);
            if (material.side === BackSide) uniforms.normalScale.value.negate();
        }
        if (material.displacementMap) {
            uniforms.displacementMap.value = material.displacementMap;
            uniforms.displacementScale.value = material.displacementScale;
            uniforms.displacementBias.value = material.displacementBias;
        }
    }

    static refreshUniformsToon(uniforms, material) {
        WebGLRenderer.refreshUniformsPhong(uniforms, material);
        if (material.gradientMap) {
            uniforms.gradientMap.value = material.gradientMap;
        }
    }

    static refreshUniformsStandard(uniforms, material) {
        uniforms.roughness.value = material.roughness;
        uniforms.metalness.value = material.metalness;
        if (material.roughnessMap) {
            uniforms.roughnessMap.value = material.roughnessMap;
        }
        if (material.metalnessMap) {
            uniforms.metalnessMap.value = material.metalnessMap;
        }
        if (material.emissiveMap) {
            uniforms.emissiveMap.value = material.emissiveMap;
        }
        if (material.bumpMap) {
            uniforms.bumpMap.value = material.bumpMap;
            uniforms.bumpScale.value = material.bumpScale;
            if (material.side === BackSide) uniforms.bumpScale.value *= -1;
        }
        if (material.normalMap) {
            uniforms.normalMap.value = material.normalMap;
            uniforms.normalScale.value.copy(material.normalScale);
            if (material.side === BackSide) uniforms.normalScale.value.negate();
        }
        if (material.displacementMap) {
            uniforms.displacementMap.value = material.displacementMap;
            uniforms.displacementScale.value = material.displacementScale;
            uniforms.displacementBias.value = material.displacementBias;
        }
        if (material.envMap) {
            //uniforms.envMap.value = material.envMap; // part of uniforms common
            uniforms.envMapIntensity.value = material.envMapIntensity;
        }

    }

    static refreshUniformsPhysical(uniforms, material) {
        uniforms.clearCoat.value = material.clearCoat;
        uniforms.clearCoatRoughness.value = material.clearCoatRoughness;
        WebGLRenderer.refreshUniformsStandard(uniforms, material);
    }

    static refreshUniformsDepth(uniforms, material) {
        if (material.displacementMap) {
            uniforms.displacementMap.value = material.displacementMap;
            uniforms.displacementScale.value = material.displacementScale;
            uniforms.displacementBias.value = material.displacementBias;
        }
    }

    static refreshUniformsDistance(uniforms, material) {
        if (material.displacementMap) {
            uniforms.displacementMap.value = material.displacementMap;
            uniforms.displacementScale.value = material.displacementScale;
            uniforms.displacementBias.value = material.displacementBias;
        }
        uniforms.referencePosition.value.copy(material.referencePosition);
        uniforms.nearDistance.value = material.nearDistance;
        uniforms.farDistance.value = material.farDistance;
    }

    static refreshUniformsNormal(uniforms, material) {
        if (material.bumpMap) {
            uniforms.bumpMap.value = material.bumpMap;
            uniforms.bumpScale.value = material.bumpScale;
            if (material.side === BackSide) uniforms.bumpScale.value *= -1;
        }
        if (material.normalMap) {
            uniforms.normalMap.value = material.normalMap;
            uniforms.normalScale.value.copy(material.normalScale);
            if (material.side === BackSide) uniforms.normalScale.value.negate();
        }
        if (material.displacementMap) {
            uniforms.displacementMap.value = material.displacementMap;
            uniforms.displacementScale.value = material.displacementScale;
            uniforms.displacementBias.value = material.displacementBias;
        }

    }
    // If uniforms are marked as clean, they don't need to be loaded to the GPU.
    static markUniformsLightsNeedsUpdate(uniforms, value) {
        uniforms.ambientLightColor.needsUpdate = value;
        uniforms.directionalLights.needsUpdate = value;
        uniforms.pointLights.needsUpdate = value;
        uniforms.spotLights.needsUpdate = value;
        uniforms.rectAreaLights.needsUpdate = value;
        uniforms.hemisphereLights.needsUpdate = value;
    }

    // 纹理
    allocTextureUnit() {
        let textureUnit = this.parameterSet._usedTextureUnits;
        if (textureUnit >= this.capabilities.maxTextures) {
            console.warn('Speed3DEngine.WebGLRenderer: Trying to use ' + textureUnit + ' texture units while this GPU supports only ' + this.capabilities.maxTextures);
        }
        this.parameterSet._usedTextureUnits += 1;
        return textureUnit;
    }
    // this.setTexture2D = setTexture2D;
    // backwards compatibility: peel texture.texture
    setTexture2D(texture, slot) {
        let warned = false;
        if (texture && texture.isWebGLRenderTarget) {
            if (!warned) {
                console.warn("Speed3DEngine.WebGLRenderer.setTexture2D: don't use render targets as textures. Use their .texture property instead.");
                warned = true;
            }
            texture = texture.texture;
        }
        this.textures.setTexture2D(texture, slot);
    }

    setTexture(texture, slot) {
        let warned = false;
        if (!warned) {
            console.warn("Speed3DEngine.WebGLRenderer: .setTexture is deprecated, use setTexture2D instead.");
            warned = true;
        }
        this.textures.setTexture2D(texture, slot);
    }

    setTextureCube(texture, slot) {
        let warned = false;
        // backwards compatibility: peel texture.texture
        if (texture && texture.isWebGLRenderTargetCube) {
            if (!warned) {
                console.warn("Speed3DEngine.WebGLRenderer.setTextureCube: don't use cube render targets as textures. Use their .texture property instead.");
                warned = true;
            }
            texture = texture.texture;
        }
        // currently relying on the fact that WebGLRenderTargetCube.texture is a Texture and NOT a CubeTexture
        // TODO: unify these code paths
        if ((texture && texture.isCubeTexture) ||
            (Array.isArray(texture.image) && texture.image.length === 6)) {
            // CompressedTexture can have Array in image :/
            // this function alone should take care of cube textures
            this.textures.setTextureCube(texture, slot);
        } else {
            // assumed: texture property of Speed3DEngine.WebGLRenderTargetCube
            this.textures.setTextureCubeDynamic(texture, slot);
        }
    }

    setFramebuffer(value) {
        this.parameterSet._framebuffer = value;
    }

    getRenderTarget() {
        return this.parameterSet._currentRenderTarget;
    }

    setRenderTarget(renderTarget) {
        this.parameterSet._currentRenderTarget = renderTarget;
        let gl = this.gl;
        let state = this.state;
        if (renderTarget && this.properties.get(renderTarget).__webglFramebuffer === undefined) {
            this.textures.setupRenderTarget(renderTarget);
        }
        let framebuffer = this.parameterSet._framebuffer;
        let isCube = false;
        if (renderTarget) {
            let __webglFramebuffer = this.properties.get(renderTarget).__webglFramebuffer;
            if (renderTarget.isWebGLRenderTargetCube) {
                framebuffer = __webglFramebuffer[renderTarget.activeCubeFace];
                isCube = true;
            } else {
                framebuffer = __webglFramebuffer;
            }
            this.parameterSet._currentViewport.copy(renderTarget.viewport);
            this.parameterSet._currentScissor.copy(renderTarget.scissor);
            this.parameterSet._currentScissorTest = renderTarget.scissorTest;
        } else {
            this.parameterSet._currentViewport.copy(this.parameterSet._viewport).multiplyScalar(this.parameterSet._pixelRatio);
            this.parameterSet._currentScissor.copy(this.parameterSet._scissor).multiplyScalar(this.parameterSet._pixelRatio);
            this.parameterSet._currentScissorTest = this.parameterSet._scissorTest;
        }
        if (this.parameterSet._currentFramebuffer !== framebuffer) {
            gl.bindFramebuffer(gl.FRAMEBUFFER, framebuffer);
            this.parameterSet._currentFramebuffer = framebuffer;
        }
        state.viewport(this.parameterSet._currentViewport);
        state.scissor(this.parameterSet._currentScissor);
        state.setScissorTest(this.parameterSet._currentScissorTest);
        if (isCube) {
            let textureProperties = this.properties.get(renderTarget.texture);
            gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_CUBE_MAP_POSITIVE_X + renderTarget.activeCubeFace, textureProperties.__webglTexture, renderTarget.activeMipMapLevel);
        }
    };

    readRenderTargetPixels(renderTarget, x, y, width, height, buffer) {
        if (!(renderTarget && renderTarget.isWebGLRenderTarget)) {
            console.error('Speed3DEngine.WebGLRenderer.readRenderTargetPixels: renderTarget is not Speed3DEngine.WebGLRenderTarget.');
            return;
        }
        let gl = this.gl;
        let framebuffer = this.properties.get(renderTarget).__webglFramebuffer;
        if (framebuffer) {
            let restore = false;
            if (framebuffer !== this.parameterSet._currentFramebuffer) {
                gl.bindFramebuffer(gl.FRAMEBUFFER, framebuffer);
                restore = true;
            }
            try {
                let texture = renderTarget.texture;
                let textureFormat = texture.format;
                let textureType = texture.type;
                if (textureFormat !== RGBAFormat && this.utils.convert(textureFormat) !== gl.getParameter(gl.IMPLEMENTATION_COLOR_READ_FORMAT)) {
                    console.error('Speed3DEngine.WebGLRenderer.readRenderTargetPixels: renderTarget is not in RGBA or implementation defined format.');
                    return;
                }
                let extensions = this.extensions;
                if (textureType !== UnsignedByteType && this.utils.convert(textureType) !== gl.getParameter(gl.IMPLEMENTATION_COLOR_READ_TYPE) && // IE11, Edge and Chrome Mac < 52 (#9513)
                    !(textureType === FloatType && (extensions.get('OES_texture_float') || extensions.get('WEBGL_color_buffer_float'))) && // Chrome Mac >= 52 and Firefox
                    !(textureType === HalfFloatType && extensions.get('EXT_color_buffer_half_float'))) {
                    console.error('Speed3DEngine.WebGLRenderer.readRenderTargetPixels: renderTarget is not in UnsignedByteType or implementation defined type.');
                    return;
                }
                if (gl.checkFramebufferStatus(gl.FRAMEBUFFER) === gl.FRAMEBUFFER_COMPLETE) {
                    // the following if statement ensures valid read requests (no out-of-bounds pixels, see #8604)
                    if ((x >= 0 && x <= (renderTarget.width - width)) && (y >= 0 && y <= (renderTarget.height - height))) {
                        gl.readPixels(x, y, width, height, this.utils.convert(textureFormat), this.utils.convert(textureType), buffer);
                    }
                } else {
                    console.error('Speed3DEngine.WebGLRenderer.readRenderTargetPixels: readPixels from renderTarget failed. Framebuffer not complete.');
                }
            } finally {
                if (restore) {
                    gl.bindFramebuffer(gl.FRAMEBUFFER, this.parameterSet._currentFramebuffer);
                }
            }
        }
    }

    copyFramebufferToTexture(position, texture, level) {
        let gl = this.gl;
        let width = texture.image.width;
        let height = texture.image.height;
        let glFormat = this.utils.convert(texture.format);
        this.setTexture2D(texture, 0);
        gl.copyTexImage2D(gl.TEXTURE_2D, level || 0, glFormat, position.x, position.y, width, height, 0);
    }

    copyTextureToTexture(position, srcTexture, dstTexture, level) {
        let gl =this.gl;
        let width = srcTexture.image.width;
        let height = srcTexture.image.height;
        let glFormat = this.utils.convert(dstTexture.format);
        let glType = this.utils.convert(dstTexture.type);
        this.setTexture2D(dstTexture, 0);
        if (srcTexture.isDataTexture) {
            gl.texSubImage2D(gl.TEXTURE_2D, level || 0, position.x, position.y, width, height, glFormat, glType, srcTexture.image.data);
        } else {
            gl.texSubImage2D(gl.TEXTURE_2D, level || 0, position.x, position.y, glFormat, glType, srcTexture.image);
        }
    }
}

export {WebGLRenderer};
