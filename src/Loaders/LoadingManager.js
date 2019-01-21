/**
 * @author wangzhidong
 * @modified YanKai 2018/7/11
 */

 /*
function LoadingManager( onLoad, onProgress, onError ) {

	var scope = this;

	var isLoading = false;
	var itemsLoaded = 0;
	var itemsTotal = 0;
	var urlModifier = undefined;

	this.onStart = undefined;
	this.onLoad = onLoad;
	this.onProgress = onProgress;
	this.onError = onError;

	this.itemStart = function ( url ) {

		itemsTotal ++;

		if ( isLoading === false ) {

			if ( scope.onStart !== undefined ) {

				scope.onStart( url, itemsLoaded, itemsTotal );

			}

		}

		isLoading = true;

	};

	this.itemEnd = function ( url ) {

		itemsLoaded ++;

		if ( scope.onProgress !== undefined ) {

			scope.onProgress( url, itemsLoaded, itemsTotal );

		}

		if ( itemsLoaded === itemsTotal ) {

			isLoading = false;

			if ( scope.onLoad !== undefined ) {

				scope.onLoad();

			}

		}

	};

	this.itemError = function ( url ) {

		if ( scope.onError !== undefined ) {

			scope.onError( url );

		}

	};

	this.resolveURL = function ( url ) {

		if ( urlModifier ) {

			return urlModifier( url );

		}

		return url;

	};

	this.setURLModifier = function ( transform ) {

		urlModifier = transform;
		return this;

	};

}*/

class LoadingManager{
	constructor( onLoad, onProgress, onError){
		this.onLoad = onLoad;
		this.onProgress = onProgress;
		this.onError = onError;
		this.isLoading=false;
		this.itemsLoaded = 0;
		this.itemsTotal = 0;
		this.urlModifier = undefined;
		this.onStart = undefined;
	}
	itemStart(url){
		this.itemsTotal ++;
		if ( this.isLoading === false ) {
			if ( this.onStart !== undefined ) {
				this.onStart( url, this.itemsLoaded, this.itemsTotal );
			}
		}
		this.isLoading = true;
	}
	itemEnd(url){
		this.itemsLoaded ++;
		if ( this.onProgress !== undefined ) {
			this.onProgress( url, this.itemsLoaded, this.itemsTotal );
		}
		if ( this.itemsLoaded === this.itemsTotal ) {
			this.isLoading = false;
			if ( this.onLoad !== undefined ) {
				this.onLoad();
			}
		}
	}
	itemError(url){
		if ( this.onError !== undefined ) {
			this.onError( url );
		}
	}
	resolveURL(url){
		if ( this.urlModifier ) {
			return this.urlModifier( url );
		}
		return url;
	}
	setURLModifier(transform){
		this.urlModifier = transform;
		return this;
	}
}

var DefaultLoadingManager = new LoadingManager();
export { DefaultLoadingManager, LoadingManager };
