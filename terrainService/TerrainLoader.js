/**
 * @author Bjorn Sandvik / http://thematicmapping.org/
 */

let TerrainLoader = function ( manager ) {

	this.manager = ( manager !== undefined ) ? manager : THREE.DefaultLoadingManager;

};

TerrainLoader.prototype = {

	constructor: THREE.TerrainLoader,

	load: function ( url, onLoad, onProgress, onError ) {

		var scope = this;
		var request = new XMLHttpRequest();

		if ( onLoad !== undefined ) {

			request.addEventListener( 'load', function ( event ) {

				onLoad( new Uint16Array( event.target.response ) );
				scope.manager.itemEnd( url );

			}, false );

		}

		if ( onProgress !== undefined ) {

			request.addEventListener( 'progress', function ( event ) {

				onProgress( event );

			}, false );

		}

		if ( onError !== undefined ) {

			request.addEventListener( 'error', function ( event ) {

				onError( event );

			}, false );

		}

		if ( this.crossOrigin !== undefined ) request.crossOrigin = this.crossOrigin;

		request.open( 'GET', url, true );

		request.responseType = 'arraybuffer';

		request.send( null );

		scope.manager.itemStart( url );

	},

	setCrossOrigin: function ( value ) {

		this.crossOrigin = value;

	}

};



var terrainLoader = new THREE.TerrainLoader();
terrainLoader.load('../assets/jotunheimen.bin', function(data) {

    var geometry = new THREE.PlaneGeometry(60, 60, 199, 199);

    for (var i = 0, l = geometry.vertices.length; i < l; i++) {
        geometry.vertices[i].z = data[i] / 65535 * 5;
    }

    var material = new THREE.MeshPhongMaterial({
        map: THREE.ImageUtils.loadTexture('../assets/jotunheimen-texture.jpg')
    });

    var plane = new THREE.Mesh(geometry, material);
    scene.add(plane);

});