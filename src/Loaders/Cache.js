/**
 * @author wangzhidong
 * @modified  YanKai 2018/7/11
 * @modified by DongYi 2018-07-19
 */
/*
var Cache = {

	enabled: false,

	files: {},

	add: function ( key, file ) {

		if ( this.enabled === false ) return;

		// console.log( 'Speed3DEngine.Cache', 'Adding key:', key );

		this.files[ key ] = file;

	},

	get: function ( key ) {

		if ( this.enabled === false ) return;

		// console.log( 'Speed3DEngine.Cache', 'Checking key:', key );

		return this.files[ key ];

	},

	remove: function ( key ) {

		delete this.files[ key ];

	},

	clear: function () {

		this.files = {};

	}

};


export { Cache };
*/

class cache{
	constructor(){
		this.enabled=false;
		this.files={};
	}
	add( key, file ){
		if ( this.enabled === false ) return;
		this.files[ key ] = file;
	}
	get( key ) {
		if ( this.enabled === false ) return;
		return this.files[ key ];
	}
	remove ( key ) {
		delete this.files[ key ];
	}
	clear(){
		this.files = {};
	}
}
const  Cache = new cache();
Cache.enabled = true;
export{Cache};