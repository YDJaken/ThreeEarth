/**
 * @author wangzhidong
 * @modified DongYi 2018/06/27
 */

/*function addLineNumbers( string ) {

	var lines = string.split( '\n' );

	for ( var i = 0; i < lines.length; i ++ ) {

		lines[ i ] = ( i + 1 ) + ': ' + lines[ i ];

	}

	return lines.join( '\n' );

}

function WebGLShader( gl, type, string ) {

	var shader = gl.createShader( type );

	gl.shaderSource( shader, string );
	gl.compileShader( shader );

	if ( gl.getShaderParameter( shader, gl.COMPILE_STATUS ) === false ) {

		console.error( 'Speed3DEngine.WebGLShader: Shader couldn\'t compile.' );

	}

	if ( gl.getShaderInfoLog( shader ) !== '' ) {

		console.warn( 'Speed3DEngine.WebGLShader: gl.getShaderInfoLog()', type === gl.VERTEX_SHADER ? 'vertex' : 'fragment', gl.getShaderInfoLog( shader ), addLineNumbers( string ) );

	}

	// --enable-privileged-webgl-extension
	// console.log( type, gl.getExtension( 'WEBGL_debug_shaders' ).getTranslatedShaderSource( shader ) );

	return shader;

}*/

class WebGLShader {

    constructor(gl, type, string) {
        let shader = gl.createShader(type);
        gl.shaderSource(shader, string);
        gl.compileShader(shader);
        if (gl.getShaderParameter(shader, gl.COMPILE_STATUS) === false) {
            console.error('Speed3DEngine.WebGLShader: Shader couldn\'t compile.');
        }
        if (gl.getShaderInfoLog(shader) !== '') {
            console.warn('Speed3DEngine.WebGLShader: gl.getShaderInfoLog()', type === gl.VERTEX_SHADER ? 'vertex' : 'fragment', gl.getShaderInfoLog(shader), WebGLShader._addLineNumbers(string));
        }
        // --enable-privileged-webgl-extension
        // console.log( type, gl.getExtension( 'WEBGL_debug_shaders' ).getTranslatedShaderSource( shader ) );
        return shader;
    }

    static _addLineNumbers(string) {
        let lines = string.split('\n');
        for (let i = 0; i < lines.length; i++) {
            lines[i] = (i + 1) + ': ' + lines[i];
        }
        return lines.join('\n');
    }
}

export {WebGLShader};