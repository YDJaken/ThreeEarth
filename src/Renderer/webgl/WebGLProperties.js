/**
 * @author wangzhidong
 * @modified DongYi 2018/06/27
 */

/*function WebGLProperties() {

	var properties = new WeakMap();

	function get( object ) {

		var map = properties.get( object );

		if ( map === undefined ) {

			map = {};
			properties.set( object, map );

		}

		return map;

	}

	function remove( object ) {

		properties.delete( object );

	}

	function update( object, key, value ) {

		properties.get( object )[ key ] = value;

	}

	function dispose() {

		properties = new WeakMap();

	}

	return {
		get: get,
		remove: remove,
		update: update,
		dispose: dispose
	};

}*/

class WebGLProperties {
    constructor() {
        this.properties = new WeakMap();
    }

    get(object) {
        let map = this.properties.get(object);
        if (map === undefined) {
            map = {};
            this.properties.set(object, map);
        }
        return map;
    }

    remove(object) {
        this.properties.delete(object);
    }

    update(object, key, value) {
        this.properties.get(object)[key] = value;
    }

    dispose() {
        this.properties = new WeakMap();
    }
}

export {WebGLProperties};
