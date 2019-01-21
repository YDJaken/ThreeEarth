/**
 * @author wangzhidong
 * @modified WangSuJian 2018/07/11
 */

/*import {PerspectiveCamera} from "../Camera/PerspectiveCamera";

function ArrayCamera( array ) {

	PerspectiveCamera.call( this );

	this.cameras = array || [];

}

ArrayCamera.prototype = Object.assign( Object.create( PerspectiveCamera.prototype ), {

	constructor: ArrayCamera,

	isArrayCamera: true

} );


export { ArrayCamera };*/

import {PerspectiveCamera} from "../Camera/PerspectiveCamera.js";

class ArrayCamera extends PerspectiveCamera{
    constructor(array) {
        super();
        this.type = 'ArrayCamera';
        this.cameras = array || [];
        this.array = array;
        this.isArrayCamera = true;
    }
}

export { ArrayCamera };