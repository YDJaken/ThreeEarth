/**
 * @author wangzhidong
 * @modified DongYi 2018/06/27
 */

/*function WebGLBufferRenderer( gl, extensions, info ) {

	var mode;

	function setMode( value ) {

		mode = value;

	}

	function render( start, count ) {

		gl.drawArrays( mode, start, count );

		info.update( count, mode );

	}

	function renderInstances( geometry, start, count ) {

		var extension = extensions.get( 'ANGLE_instanced_arrays' );

		if ( extension === null ) {

			console.error( 'Speed3DEngine.WebGLBufferRenderer: using Speed3DEngine.InstancedBufferGeometry but hardware does not support extension ANGLE_instanced_arrays.' );
			return;

		}

		extension.drawArraysInstancedANGLE( mode, start, count, geometry.maxInstancedCount );

		info.update( count, mode, geometry.maxInstancedCount );

	}

	//

	this.setMode = setMode;
	this.render = render;
	this.renderInstances = renderInstances;

}*/

class WebGLBufferRenderer {
    constructor(gl, extensions, info) {
        this.mode;
        this.gl = gl;
        this.extensions = extensions;
        this.info = info;
    }

    setMode(value) {
        this.mode = value;
    }

    render(start, count) {
        this.gl.drawArrays(this.mode, start, count);
        this.info.update(count, this.mode);
    }

    renderInstances(geometry, start, count) {
        let extension = this.extensions.get('ANGLE_instanced_arrays');
        if (extension === null) {
            console.error('Speed3DEngine.WebGLBufferRenderer: using Speed3DEngine.InstancedBufferGeometry but hardware does not support extension ANGLE_instanced_arrays.');
            return;
        }
        extension.drawArraysInstancedANGLE(this.mode, start, count, geometry.maxInstancedCount);
        this.info.update(count, this.mode, geometry.maxInstancedCount);
    }
}

export {WebGLBufferRenderer};