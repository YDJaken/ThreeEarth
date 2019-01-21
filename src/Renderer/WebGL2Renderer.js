/**
 * @author wangzhidong
 * @modified DongYi 2018/07/11
 */

import {REVISION} from "../Core/Constants";
import {WebGLExtensions} from './webgl/WebGLExtensions.js';
import {WebGLState} from './webgl/WebGLState.js';
import {Color} from '../Datum/Math/Color.js';
import {Vector4} from '../Datum/Math/Vector4.js';

/*function WebGL2Renderer( parameters ) {

	console.log( 'Speed3DEngine.WebGL2Renderer', REVISION );

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

	// initialize

	var gl;

	try {

		var attributes = {
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
		_canvas.addEventListener( 'webglcontextrestored', function () { } );

		gl = _context || _canvas.getContext( 'webgl2', attributes );

		if ( gl === null ) {

			if ( _canvas.getContext( 'webgl2' ) !== null ) {

				throw new Error( 'Error creating WebGL2 context with your selected attributes.' );

			} else {

				throw new Error( 'Error creating WebGL2 context.' );

			}

		}

	} catch ( error ) {

		console.error( 'Speed3DEngine.WebGL2Renderer: ' + error.message );

	}

	//

	var _autoClear = true,
		_autoClearColor = true,
		_autoClearDepth = true,
		_autoClearStencil = true,

		_clearColor = new Color( 0x000000 ),
		_clearAlpha = 0,

		_width = _canvas.width,
		_height = _canvas.height,

		_pixelRatio = 1,

		_viewport = new Vector4( 0, 0, _width, _height );

	var extensions = new WebGLExtensions( gl );
	var state = new WebGLState( gl, extensions, function () {} );

	//

	function clear( color, depth, stencil ) {

		var bits = 0;

		if ( color === undefined || color ) bits |= gl.COLOR_BUFFER_BIT;
		if ( depth === undefined || depth ) bits |= gl.DEPTH_BUFFER_BIT;
		if ( stencil === undefined || stencil ) bits |= gl.STENCIL_BUFFER_BIT;

		gl.clear( bits );

	}

	function setPixelRatio( value ) {

		if ( value === undefined ) return;

		_pixelRatio = value;

		setSize( _viewport.z, _viewport.w, false );

	}

	function setSize( width, height, updateStyle ) {

		_width = width;
		_height = height;

		_canvas.width = width * _pixelRatio;
		_canvas.height = height * _pixelRatio;

		if ( updateStyle !== false ) {

			_canvas.style.width = width + 'px';
			_canvas.style.height = height + 'px';

		}

		setViewport( 0, 0, width, height );

	}

	function setViewport( x, y, width, height ) {

		state.viewport( _viewport.set( x, y, width, height ) );

	}

	function render( scene, camera ) {

		if ( camera !== undefined && camera.isCamera !== true ) {

			console.error( 'Speed3DEngine.WebGL2Renderer.render: camera is not an instance of Speed3DEngine.Camera.' );
			return;

		}

		var background = scene.background;
		var forceClear = false;

		if ( background === null ) {

			state.buffers.color.setClear( _clearColor.r, _clearColor.g, _clearColor.b, _clearAlpha, _premultipliedAlpha );

		} else if ( background && background.isColor ) {

			state.buffers.color.setClear( background.r, background.g, background.b, 1, _premultipliedAlpha );
			forceClear = true;

		}

		if ( _autoClear || forceClear ) {

			this.clear( _autoClearColor, _autoClearDepth, _autoClearStencil );

		}

	}

	function onContextLost( event ) {

		event.preventDefault();

	}

	return {
		domElement: _canvas,

		clear: clear,
		setPixelRatio: setPixelRatio,
		setSize: setSize,
		render: render
	};

}*/

class WebGL2Renderer {
    constructor(parameters = {}) {
        console.log('Speed3DEngine.WebGL2Renderer', REVISION);
        this.parameters = parameters;
        this._canvas = parameters.canvas !== undefined ? parameters.canvas : document.createElementNS('http://www.w3.org/1999/xhtml', 'canvas');
        this._context = parameters.context !== undefined ? parameters.context : null;
        this._alpha = parameters.alpha !== undefined ? parameters.alpha : false;
        this._depth = parameters.depth !== undefined ? parameters.depth : true;
        this._stencil = parameters.stencil !== undefined ? parameters.stencil : true;
        this._antialias = parameters.antialias !== undefined ? parameters.antialias : false;
        this._premultipliedAlpha = parameters.premultipliedAlpha !== undefined ? parameters.premultipliedAlpha : true;
        this._preserveDrawingBuffer = parameters.preserveDrawingBuffer !== undefined ? parameters.preserveDrawingBuffer : false;
        this._powerPreference = parameters.powerPreference !== undefined ? parameters.powerPreference : 'default';
        this.gl;
        this._init();
        this._autoClear = true;
        this._autoClearColor = true;
        this._autoClearDepth = true;
        this._autoClearStencil = true;
        this._clearColor = new Color(0x000000);
        this._clearAlpha = 0;
        this._width = this._canvas.width;
        this._height = this._canvas.height;
        this._pixelRatio = 1;
        this._viewport = new Vector4(0, 0, this._width, this._height);
        this.extensions = new WebGLExtensions(this.gl);
        this.state = new WebGLState(this.gl, this.extensions, function () {
        });
        this.domElement=this._canvas;
    }

    _init() {
        try {
            let _canvas = this._canvas;
            let attributes = {
                alpha: this._alpha,
                depth: this._depth,
                stencil: this._stencil,
                antialias: this._antialias,
                premultipliedAlpha: this._premultipliedAlpha,
                preserveDrawingBuffer: this._preserveDrawingBuffer,
                powerPreference: this._powerPreference
            };
            // event listeners must be registered before WebGL context is created, see #12753
            _canvas.addEventListener('webglcontextlost', WebGL2Renderer._onContextLost, false);
            _canvas.addEventListener('webglcontextrestored', function () {
            });
            this.gl = this._context || _canvas.getContext('webgl2', attributes);
            if (this.gl === null) {
                if (_canvas.getContext('webgl2') !== null) {
                    throw new Error('Error creating WebGL2 context with your selected attributes.');
                } else {
                    throw new Error('Error creating WebGL2 context.');
                }
            }
        } catch (error) {
            console.error('Speed3DEngine.WebGL2Renderer: ' + error.message);
        }
    }

    static _onContextLost(event){
        event.preventDefault();
    }

    clear( color, depth, stencil ) {
        let bits = 0;
        let gl = this.gl;
        if ( color === undefined || color ) bits |= gl.COLOR_BUFFER_BIT;
        if ( depth === undefined || depth ) bits |= gl.DEPTH_BUFFER_BIT;
        if ( stencil === undefined || stencil ) bits |= gl.STENCIL_BUFFER_BIT;
        gl.clear( bits );
    }

    setPixelRatio( value ) {
        if ( value === undefined ) return;
        this._pixelRatio = value;
        this.setSize( this._viewport.z, this._viewport.w, false );
    }

    setSize( width, height, updateStyle ) {
        this._width = width;
        this._height = height;
        this._canvas.width = width * this._pixelRatio;
        this._canvas.height = height * this._pixelRatio;
        if ( updateStyle !== false ) {
            this._canvas.style.width = width + 'px';
            this._canvas.style.height = height + 'px';
        }
        this._setViewport( 0, 0, width, height );
    }

    _setViewport( x, y, width, height ) {
        this.state.viewport( this._viewport.set( x, y, width, height ) );
    }

    render( scene, camera ) {
        if ( camera !== undefined && camera.isCamera !== true ) {
            console.error( 'Speed3DEngine.WebGL2Renderer.render: camera is not an instance of Speed3DEngine.Camera.' );
            return;
        }
        let background = scene.background;
        let forceClear = false;
        if ( background === null ) {
            this.state.buffers.color.setClear( this._clearColor.r, this._clearColor.g, this._clearColor.b, this._clearAlpha, this._premultipliedAlpha );
        } else if ( background && background.isColor ) {
            this.state.buffers.color.setClear( background.r, background.g, background.b, 1, this._premultipliedAlpha );
            forceClear = true;
        }
        if ( this._autoClear || forceClear ) {
            this.clear(this._autoClearColor, this._autoClearDepth, this._autoClearStencil );
        }
    }
}

export {WebGL2Renderer};
