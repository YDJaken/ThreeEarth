/**
 * @author wangzhidong
 * @modified DongYi 2018/06/27
 */

/*function WebGLInfo( gl ) {

	var memory = {
		geometries: 0,
		textures: 0
	};

	var render = {
		frame: 0,
		calls: 0,
		triangles: 0,
		points: 0,
		lines: 0
	};

	function update( count, mode, instanceCount ) {

		instanceCount = instanceCount || 1;

		render.calls ++;

		switch ( mode ) {

			case gl.TRIANGLES:
				render.triangles += instanceCount * ( count / 3 );
				break;

			case gl.TRIANGLE_STRIP:
			case gl.TRIANGLE_FAN:
				render.triangles += instanceCount * ( count - 2 );
				break;

			case gl.LINES:
				render.lines += instanceCount * ( count / 2 );
				break;

			case gl.LINE_STRIP:
				render.lines += instanceCount * ( count - 1 );
				break;

			case gl.LINE_LOOP:
				render.lines += instanceCount * count;
				break;

			case gl.POINTS:
				render.points += instanceCount * count;
				break;

			default:
				console.error( 'Speed3DEngine.WebGLInfo: Unknown draw mode:', mode );
				break;

		}

	}

	function reset() {

		render.frame ++;
		render.calls = 0;
		render.triangles = 0;
		render.points = 0;
		render.lines = 0;

	}

	return {
		memory: memory,
		render: render,
		programs: null,
		autoReset: true,
		reset: reset,
		update: update
	};

}*/

class WebGLInfo {

    constructor(gl) {
        this.gl = gl;
        this.memory = {
            geometries: 0,
            textures: 0
        };
        this.render = {
            frame: 0,
            calls: 0,
            triangles: 0,
            points: 0,
            lines: 0
        };
        this.programs = null;
        this.autoReset = true;
    }

    update(count, mode, instanceCount) {
        instanceCount = instanceCount || 1;
        this.render.calls++;
        switch (mode) {
            case this.gl.TRIANGLES:
                this.render.triangles += instanceCount * (count / 3);
                break;
            case this.gl.TRIANGLE_STRIP:
            case this.gl.TRIANGLE_FAN:
                this.render.triangles += instanceCount * (count - 2);
                break;
            case this.gl.LINES:
                this.render.lines += instanceCount * (count / 2);
                break;
            case this.gl.LINE_STRIP:
                this.render.lines += instanceCount * (count - 1);
                break;
            case this.gl.LINE_LOOP:
                this.render.lines += instanceCount * count;
                break;
            case this.gl.POINTS:
                this.render.points += instanceCount * count;
                break;
            default:
                console.error('Speed3DEngine.WebGLInfo: Unknown draw mode:', mode);
                break;
        }
    }

    reset() {
        this.render.frame++;
        this.render.calls = 0;
        this.render.triangles = 0;
        this.render.points = 0;
        this.render.lines = 0;
    }
}

export {WebGLInfo};