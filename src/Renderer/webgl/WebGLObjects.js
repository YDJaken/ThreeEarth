/**
 * @author wangzhidong
 * @modified DongYi 2018/06/27
 */

/*function WebGLObjects( geometries, info ) {

	var updateList = {};

	function update( object ) {

		var frame = info.render.frame;

		var geometry = object.geometry;
		var buffergeometry = geometries.get( object, geometry );

		// Update once per frame

		if ( updateList[ buffergeometry.id ] !== frame ) {

			if ( geometry.isGeometry ) {

				buffergeometry.updateFromObject( object );

			}

			geometries.update( buffergeometry );

			updateList[ buffergeometry.id ] = frame;

		}

		return buffergeometry;

	}

	function dispose() {

		updateList = {};

	}

	return {

		update: update,
		dispose: dispose

	};

}*/

class WebGLObjects {

    constructor(geometries, info) {
        this.geometries = geometries;
        this.info = info;
        this.updateList = {};
    }

    update(object) {
        let frame = this.info.render.frame;
        let geometry = object.geometry;
        let buffergeometry = this.geometries.get(object, geometry);
        // Update once per frame
        if (this.updateList[buffergeometry.id] !== frame) {
            if (geometry.isGeometry) {
                buffergeometry.updateFromObject(object);
            }
            this.geometries.update(buffergeometry);
            this.updateList[buffergeometry.id] = frame;
        }
        return buffergeometry;
    }

    dispose() {
        this.updateList = {};
    }
}

export {WebGLObjects};