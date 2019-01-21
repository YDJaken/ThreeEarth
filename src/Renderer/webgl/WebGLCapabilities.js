/**
 * @author wangzhidong
 * @modified DongYi 2018/06/27
 */

/*function WebGLCapabilities( gl, extensions, parameters ) {

	var maxAnisotropy;

	function getMaxAnisotropy() {

		if ( maxAnisotropy !== undefined ) return maxAnisotropy;

		var extension = extensions.get( 'EXT_texture_filter_anisotropic' );

		if ( extension !== null ) {

			maxAnisotropy = gl.getParameter( extension.MAX_TEXTURE_MAX_ANISOTROPY_EXT );

		} else {

			maxAnisotropy = 0;

		}

		return maxAnisotropy;

	}

	function getMaxPrecision( precision ) {

		if ( precision === 'highp' ) {

			if ( gl.getShaderPrecisionFormat( gl.VERTEX_SHADER, gl.HIGH_FLOAT ).precision > 0 &&
			     gl.getShaderPrecisionFormat( gl.FRAGMENT_SHADER, gl.HIGH_FLOAT ).precision > 0 ) {

				return 'highp';

			}

			precision = 'mediump';

		}

		if ( precision === 'mediump' ) {

			if ( gl.getShaderPrecisionFormat( gl.VERTEX_SHADER, gl.MEDIUM_FLOAT ).precision > 0 &&
			     gl.getShaderPrecisionFormat( gl.FRAGMENT_SHADER, gl.MEDIUM_FLOAT ).precision > 0 ) {

				return 'mediump';

			}

		}

		return 'lowp';

	}

	var precision = parameters.precision !== undefined ? parameters.precision : 'highp';
	var maxPrecision = getMaxPrecision( precision );

	if ( maxPrecision !== precision ) {

		console.warn( 'Speed3DEngine.WebGLRenderer:', precision, 'not supported, using', maxPrecision, 'instead.' );
		precision = maxPrecision;

	}

	var logarithmicDepthBuffer = parameters.logarithmicDepthBuffer === true;

	var maxTextures = gl.getParameter( gl.MAX_TEXTURE_IMAGE_UNITS );
	var maxVertexTextures = gl.getParameter( gl.MAX_VERTEX_TEXTURE_IMAGE_UNITS );
	var maxTextureSize = gl.getParameter( gl.MAX_TEXTURE_SIZE );
	var maxCubemapSize = gl.getParameter( gl.MAX_CUBE_MAP_TEXTURE_SIZE );

	var maxAttributes = gl.getParameter( gl.MAX_VERTEX_ATTRIBS );
	var maxVertexUniforms = gl.getParameter( gl.MAX_VERTEX_UNIFORM_VECTORS );
	var maxVaryings = gl.getParameter( gl.MAX_VARYING_VECTORS );
	var maxFragmentUniforms = gl.getParameter( gl.MAX_FRAGMENT_UNIFORM_VECTORS );

	var vertexTextures = maxVertexTextures > 0;
	var floatFragmentTextures = !! extensions.get( 'OES_texture_float' );
	var floatVertexTextures = vertexTextures && floatFragmentTextures;

	return {

		getMaxAnisotropy: getMaxAnisotropy,
		getMaxPrecision: getMaxPrecision,

		precision: precision,
		logarithmicDepthBuffer: logarithmicDepthBuffer,

		maxTextures: maxTextures,
		maxVertexTextures: maxVertexTextures,
		maxTextureSize: maxTextureSize,
		maxCubemapSize: maxCubemapSize,

		maxAttributes: maxAttributes,
		maxVertexUniforms: maxVertexUniforms,
		maxVaryings: maxVaryings,
		maxFragmentUniforms: maxFragmentUniforms,

		vertexTextures: vertexTextures,
		floatFragmentTextures: floatFragmentTextures,
		floatVertexTextures: floatVertexTextures

	};

}*/

class WebGLCapabilities {

    constructor(gl, extensions, parameters) {
        this.maxAnisotropy;
        this.gl = gl;
        this.extensions = extensions;
        this.parameters = parameters;
        this.precision = undefined;
        this.logarithmicDepthBuffer;
        this.maxTextures;
        this.maxVertexTextures;
        this.maxTextureSize;
        this.maxCubemapSize;
        this.maxAttributes;
        this.maxVertexUniforms;
        this.maxVaryings;
        this.maxFragmentUniforms;
        this.vertexTextures;
        this.floatFragmentTextures;
        this.floatVertexTextures;
        this._init();
    }

    _init() {
        let parameters = this.parameters;
        let gl = this.gl;
        let extensions = this.extensions;
        let precision = parameters.precision !== undefined ? parameters.precision : 'highp';
        let maxPrecision = this.getMaxPrecision(precision);
        if (maxPrecision !== precision) {
            console.warn('Speed3DEngine.WebGLRenderer:', precision, 'not supported, using', maxPrecision, 'instead.');
            precision = maxPrecision;
        }
        this.precision = precision;
        this.logarithmicDepthBuffer = parameters.logarithmicDepthBuffer === true;
        this.maxTextures = gl.getParameter(gl.MAX_TEXTURE_IMAGE_UNITS);
        this.maxVertexTextures = gl.getParameter(gl.MAX_VERTEX_TEXTURE_IMAGE_UNITS);
        this.maxTextureSize = gl.getParameter(gl.MAX_TEXTURE_SIZE);
        this.maxCubemapSize = gl.getParameter(gl.MAX_CUBE_MAP_TEXTURE_SIZE);
        this.maxAttributes = gl.getParameter(gl.MAX_VERTEX_ATTRIBS);
        this.maxVertexUniforms = gl.getParameter(gl.MAX_VERTEX_UNIFORM_VECTORS);
        this.maxVaryings = gl.getParameter(gl.MAX_VARYING_VECTORS);
        this.maxFragmentUniforms = gl.getParameter(gl.MAX_FRAGMENT_UNIFORM_VECTORS);
        this.vertexTextures = this.maxVertexTextures > 0;
        this.floatFragmentTextures = !!extensions.get('OES_texture_float');
        this.floatVertexTextures = this.vertexTextures && this.floatFragmentTextures;
    }

    getMaxAnisotropy() {
        if (this.maxAnisotropy !== undefined) return this.maxAnisotropy;
        let extension = this.extensions.get('EXT_texture_filter_anisotropic');
        if (extension !== null) {
            this.maxAnisotropy = this.gl.getParameter(extension.MAX_TEXTURE_MAX_ANISOTROPY_EXT);
        } else {
            this.maxAnisotropy = 0;
        }
        return this.maxAnisotropy;
    }

    getMaxPrecision(precision) {
        let gl = this.gl;
        if (precision === 'highp') {
            if (gl.getShaderPrecisionFormat(gl.VERTEX_SHADER, gl.HIGH_FLOAT).precision > 0 &&
                gl.getShaderPrecisionFormat(gl.FRAGMENT_SHADER, gl.HIGH_FLOAT).precision > 0) {
                return 'highp';
            }
            precision = 'mediump';
        }
        if (precision === 'mediump') {
            if (gl.getShaderPrecisionFormat(gl.VERTEX_SHADER, gl.MEDIUM_FLOAT).precision > 0 &&
                gl.getShaderPrecisionFormat(gl.FRAGMENT_SHADER, gl.MEDIUM_FLOAT).precision > 0) {
                return 'mediump';
            }
        }
        return 'lowp';
    }
}

export {WebGLCapabilities};
