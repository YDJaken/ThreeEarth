/*function Layers() {

	this.mask = 1 | 0;

}

Object.assign( Layers.prototype, {

	set: function ( channel ) {

		this.mask = 1 << channel | 0;

	},

	enable: function ( channel ) {

		this.mask |= 1 << channel | 0;

	},

	toggle: function ( channel ) {

		this.mask ^= 1 << channel | 0;

	},

	disable: function ( channel ) {

		this.mask &= ~ ( 1 << channel | 0 );

	},

	test: function ( layers ) {

		return ( this.mask & layers.mask ) !== 0;

	}

} );*/


// export { Layers };
/**
 * @author wangzhidong
 * @modified by gby
 * @modify date 2018-7-11
 */
class Layers{
  constructor(){
	this.mask = 1 | 0;
  }
  set( channel ) {
	this.mask = 1 << channel | 0;
 }
  enable(channel) {
	this.mask |= 1 << channel | 0;
}
  toggle(channel) {
	this.mask ^= 1 << channel | 0;
}
  disable(channel) {
	this.mask &= ~ ( 1 << channel | 0 );
}
  test(layers) {
	return ( this.mask & layers.mask ) !== 0;

}
}

export { Layers };
