/**
 * @author wangzhidong
 * @modified DongYi 2018/06/27
 */

/*
function WebGLExtensions( gl ) {

	var extensions = {};

	return {

		get: function ( name ) {

			if ( extensions[ name ] !== undefined ) {

				return extensions[ name ];

			}

			var extension;

			switch ( name ) {

				case 'WEBGL_depth_texture':
					extension = gl.getExtension( 'WEBGL_depth_texture' ) || gl.getExtension( 'MOZ_WEBGL_depth_texture' ) || gl.getExtension( 'WEBKIT_WEBGL_depth_texture' );
					break;

				case 'EXT_texture_filter_anisotropic':
					extension = gl.getExtension( 'EXT_texture_filter_anisotropic' ) || gl.getExtension( 'MOZ_EXT_texture_filter_anisotropic' ) || gl.getExtension( 'WEBKIT_EXT_texture_filter_anisotropic' );
					break;

				case 'WEBGL_compressed_texture_s3tc':
					extension = gl.getExtension( 'WEBGL_compressed_texture_s3tc' ) || gl.getExtension( 'MOZ_WEBGL_compressed_texture_s3tc' ) || gl.getExtension( 'WEBKIT_WEBGL_compressed_texture_s3tc' );
					break;

				case 'WEBGL_compressed_texture_pvrtc':
					extension = gl.getExtension( 'WEBGL_compressed_texture_pvrtc' ) || gl.getExtension( 'WEBKIT_WEBGL_compressed_texture_pvrtc' );
					break;

				default:
					extension = gl.getExtension( name );

			}

			if ( extension === null ) {

				console.warn( 'Speed3DEngine.WebGLRenderer: ' + name + ' extension not supported.' );

			}

			extensions[ name ] = extension;

			return extension;

		}

	};

}
*/

class WebGLExtensions {

    constructor(gl) {
        this.gl = gl;
        this.extensions = {};
    }

    get(name) {
        if (this.extensions[name] !== undefined) {
            return this.extensions[name];
        }
        let extension;
        switch (name) {
            case 'WEBGL_depth_texture':
                extension = this.gl.getExtension('WEBGL_depth_texture') || this.gl.getExtension('MOZ_WEBGL_depth_texture') || this.gl.getExtension('WEBKIT_WEBGL_depth_texture');
                break;
            case 'EXT_texture_filter_anisotropic':
                extension = this.gl.getExtension('EXT_texture_filter_anisotropic') || this.gl.getExtension('MOZ_EXT_texture_filter_anisotropic') || this.gl.getExtension('WEBKIT_EXT_texture_filter_anisotropic');
                break;
            case 'WEBGL_compressed_texture_s3tc':
                extension = this.gl.getExtension('WEBGL_compressed_texture_s3tc') || this.gl.getExtension('MOZ_WEBGL_compressed_texture_s3tc') || this.gl.getExtension('WEBKIT_WEBGL_compressed_texture_s3tc');
                break;
            case 'WEBGL_compressed_texture_pvrtc':
                extension = this.gl.getExtension('WEBGL_compressed_texture_pvrtc') || this.gl.getExtension('WEBKIT_WEBGL_compressed_texture_pvrtc');
                break;
            default:
                extension = this.gl.getExtension(name);
        }
        if (extension === null) {
            console.warn(`Speed3DEngine.WebGLRenderer: ${name} extension not supported.`);
        }
        this.extensions[name] = extension;
        return extension;
    }
}

export {WebGLExtensions};