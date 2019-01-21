/**
 * @author wangzhidong
 * @modified DongYi 2018/06/27
 */

/*function painterSortStable( a, b ) {

	if ( a.renderOrder !== b.renderOrder ) {

		return a.renderOrder - b.renderOrder;

	} else if ( a.program && b.program && a.program !== b.program ) {

		return a.program.id - b.program.id;

	} else if ( a.material.id !== b.material.id ) {

		return a.material.id - b.material.id;

	} else if ( a.z !== b.z ) {

		return a.z - b.z;

	} else {

		return a.id - b.id;

	}

}

function reversePainterSortStable( a, b ) {

	if ( a.renderOrder !== b.renderOrder ) {

		return a.renderOrder - b.renderOrder;

	} if ( a.z !== b.z ) {

		return b.z - a.z;

	} else {

		return a.id - b.id;

	}

}

function WebGLRenderList() {

	var renderItems = [];
	var renderItemsIndex = 0;

	var opaque = [];
	var transparent = [];

	function init() {

		renderItemsIndex = 0;

		opaque.length = 0;
		transparent.length = 0;

	}

	function push( object, geometry, material, z, group ) {

		var renderItem = renderItems[ renderItemsIndex ];

		if ( renderItem === undefined ) {

			renderItem = {
				id: object.id,
				object: object,
				geometry: geometry,
				material: material,
				program: material.program,
				renderOrder: object.renderOrder,
				z: z,
				group: group
			};

			renderItems[ renderItemsIndex ] = renderItem;

		} else {

			renderItem.id = object.id;
			renderItem.object = object;
			renderItem.geometry = geometry;
			renderItem.material = material;
			renderItem.program = material.program;
			renderItem.renderOrder = object.renderOrder;
			renderItem.z = z;
			renderItem.group = group;

		}

		( material.transparent === true ? transparent : opaque ).push( renderItem );

		renderItemsIndex ++;

	}

	function sort() {

		if ( opaque.length > 1 ) opaque.sort( painterSortStable );
		if ( transparent.length > 1 ) transparent.sort( reversePainterSortStable );

	}

	return {
		opaque: opaque,
		transparent: transparent,

		init: init,
		push: push,

		sort: sort
	};

}

function WebGLRenderLists() {

	var lists = {};

	function get( scene, camera ) {

		var hash = scene.id + ',' + camera.id;
		var list = lists[ hash ];

		if ( list === undefined ) {

			// console.log( 'Speed3DEngine.WebGLRenderLists:', hash );

			list = new WebGLRenderList();
			lists[ hash ] = list;

		}

		return list;

	}

	function dispose() {

		lists = {};

	}

	return {
		get: get,
		dispose: dispose
	};

}*/

class WebGLRenderList {

    constructor() {
        this.renderItems = [];
        this.renderItemsIndex = 0;
        this.opaque = [];
        this.transparent = [];
    }

    static _painterSortStable(a, b) {
        if (a.renderOrder !== b.renderOrder) {
            return a.renderOrder - b.renderOrder;
        } else if (a.program && b.program && a.program !== b.program) {
            return a.program.id - b.program.id;
        } else if (a.material.id !== b.material.id) {
            return a.material.id - b.material.id;
        } else if (a.z !== b.z) {
            return a.z - b.z;
        } else {
            return a.id - b.id;
        }
    }

    static _reversePainterSortStable(a, b) {
        if (a.renderOrder !== b.renderOrder) {
            return a.renderOrder - b.renderOrder;
        }
        if (a.z !== b.z) {
            return b.z - a.z;
        } else {
            return a.id - b.id;
        }
    }

    init() {
        this.renderItemsIndex = 0;
        this.opaque.length = 0;
        this.transparent.length = 0;
    }

    push(object, geometry, material, z, group) {
        let renderItem = this.renderItems[this.renderItemsIndex];
        if (renderItem === undefined) {
            renderItem = {
                id: object.id,
                object: object,
                geometry: geometry,
                material: material,
                program: material.program,
                renderOrder: object.renderOrder,
                z: z,
                group: group
            };
            this.renderItems[this.renderItemsIndex] = renderItem;
        } else {
            renderItem.id = object.id;
            renderItem.object = object;
            renderItem.geometry = geometry;
            renderItem.material = material;
            renderItem.program = material.program;
            renderItem.renderOrder = object.renderOrder;
            renderItem.z = z;
            renderItem.group = group;
        }
        (material.transparent === true ? this.transparent : this.opaque).push(renderItem);
        this.renderItemsIndex++;
    }

    sort() {
        if (this.opaque.length > 1) this.opaque.sort(WebGLRenderList._painterSortStable);
        if (this.transparent.length > 1) this.transparent.sort(WebGLRenderList._reversePainterSortStable);
    }
}

class WebGLRenderLists {

    constructor() {
        this.lists = {};
    }

    get(scene, camera) {
        let hash = scene.id + ',' + camera.id;
        let list = this.lists[hash];
        if (list === undefined) {
            // console.log( 'Speed3DEngine.WebGLRenderLists:', hash );
            list = new WebGLRenderList();
            this.lists[hash] = list;
        }
        return list;
    }

    dispose() {
        this.lists = {};
    }
}

export {WebGLRenderLists};
