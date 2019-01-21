/**
 * @author wangzhidong
 * @modified DongYi 2018/06/27
 */

/*function WebGLIndexedBufferRenderer( gl, extensions, info ) {

	var mode;

	function setMode( value ) {

		mode = value;

	}

	var type, bytesPerElement;

	function setIndex( value ) {

		type = value.type;
		bytesPerElement = value.bytesPerElement;

	}

	function render( start, count ) {

		gl.drawElements( mode, count, type, start * bytesPerElement );

		info.update( count, mode );

	}

	function renderInstances( geometry, start, count ) {

		var extension = extensions.get( 'ANGLE_instanced_arrays' );

		if ( extension === null ) {

			console.error( 'Speed3DEngine.WebGLIndexedBufferRenderer: using Speed3DEngine.InstancedBufferGeometry but hardware does not support extension ANGLE_instanced_arrays.' );
			return;

		}

		extension.drawElementsInstancedANGLE( mode, count, type, start * bytesPerElement, geometry.maxInstancedCount );

		info.update( count, mode, geometry.maxInstancedCount );

	}

	//

	this.setMode = setMode;
	this.setIndex = setIndex;
	this.render = render;
	this.renderInstances = renderInstances;

}*/

class WebGLIndexedBufferRenderer {

    constructor(gl, extensions, info) {
        this.mode;
        this.type;
        this.bytesPerElement;
        this.gl = gl;
        this.extensions = extensions;
        this.info = info;
    }

    setMode(Value) {
        this.mode = Value;
    }

    setIndex(Value) {
        this.type = Value.type;
        this.bytesPerElement = Value.bytesPerElement;
    }

    render(start, count) {
        this.gl.drawElements(this.mode, count, this.type, start * this.bytesPerElement);
        this.info.update(count, this.mode);
    }

    renderInstances(geometry, start, count) {
        let extension = this.extensions.get('ANGLE_instanced_arrays');
        if (extension === null) {
            console.error('Speed3DEngine.WebGLIndexedBufferRenderer: using Speed3DEngine.InstancedBufferGeometry but hardware does not support extension ANGLE_instanced_arrays.');
            return;
        }
        extension.drawElementsInstancedANGLE(this.mode, count, type, start * this.bytesPerElement, geometry.maxInstancedCount);
        this.info.update(count, this.mode, geometry.maxInstancedCount);
    }
}

export {WebGLIndexedBufferRenderer};