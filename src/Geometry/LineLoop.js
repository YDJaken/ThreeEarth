import {Line} from './Line.js';

/**
 * @author wangzhidong
 * @modified DongYi 2018/07/11
 */

/*function LineLoop( geometry, material ) {

	Line.call( this, geometry, material );

	this.type = 'LineLoop';

}

LineLoop.prototype = Object.assign( Object.create( Line.prototype ), {

	constructor: LineLoop,

	isLineLoop: true,

} );*/

class LineLoop extends Line {
    constructor(geometry, material) {
        super();
        this.type = 'LineLoop';
        this.isLineLoop = true;
    }
}

export {LineLoop};
