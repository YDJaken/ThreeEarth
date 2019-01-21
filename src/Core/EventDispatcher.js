/**
 * Author : WangZhiDong
 */

// function EventDispatcher() {}

// Object.assign( EventDispatcher.prototype, {

// 	addEventListener: function ( type, listener ) {

// 		if ( this._listeners === undefined ) this._listeners = {};

// 		var listeners = this._listeners;

// 		if ( listeners[ type ] === undefined ) {

// 			listeners[ type ] = [];

// 		}

// 		if ( listeners[ type ].indexOf( listener ) === - 1 ) {

// 			listeners[ type ].push( listener );

// 		}

// 	},

// 	hasEventListener: function ( type, listener ) {

// 		if ( this._listeners === undefined ) return false;

// 		var listeners = this._listeners;

// 		return listeners[ type ] !== undefined && listeners[ type ].indexOf( listener ) !== - 1;

// 	},

// 	removeEventListener: function ( type, listener ) {

// 		if ( this._listeners === undefined ) return;

// 		var listeners = this._listeners;
// 		var listenerArray = listeners[ type ];

// 		if ( listenerArray !== undefined ) {

// 			var index = listenerArray.indexOf( listener );

// 			if ( index !== - 1 ) {

// 				listenerArray.splice( index, 1 );

// 			}

// 		}

// 	},

// 	dispatchEvent: function ( event ) {

// 		if ( this._listeners === undefined ) return;

// 		var listeners = this._listeners;
// 		var listenerArray = listeners[ event.type ];

// 		if ( listenerArray !== undefined ) {

// 			event.target = this;

// 			var array = listenerArray.slice( 0 );

// 			for ( var i = 0, l = array.length; i < l; i ++ ) {

// 				array[ i ].call( this, event );

// 			}

// 		}

// 	}

// } );
//export { EventDispatcher };



/* @modified by gby
* @modify date 2018-7-11
*/
class EventDispatcher{
	constructor(){
	}
	addEventListener(type, listener) {
		if ( this._listeners === undefined ) this._listeners = {};

		let listeners = this._listeners;

		if ( listeners[ type ] === undefined ) {

			listeners[ type ] = [];

		}

		if ( listeners[ type ].indexOf( listener ) === - 1 ) {

			listeners[ type ].push( listener );
		}
	}
	hasEventListener(type,listener) {

		if ( this._listeners === undefined ) return false;

		let listeners = this._listeners;

		return listeners[ type ] !== undefined && listeners[ type ].indexOf( listener ) !== - 1;

	}
	removeEventListener(type,listener) {

		if ( this._listeners === undefined ) return;

		let listeners = this._listeners;
		let listenerArray = listeners[ type ];

		if ( listenerArray !== undefined ) {

			let index = listenerArray.indexOf( listener );

			if ( index !== - 1 ) {

				listenerArray.splice( index, 1 );

			}

		}
	}
	dispatchEvent(event) {

		if ( this._listeners === undefined ) return;

		let listeners = this._listeners;
		let listenerArray = listeners[ event.type ];

		if ( listenerArray !== undefined ) {

			event.target = this;

			let array = listenerArray.slice( 0 );

			for ( let i = 0, l = array.length; i < l; i ++ ) {

				array[ i ].call( this, event );

			}

		}

	}
}
export { EventDispatcher };
