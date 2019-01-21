import {Object3D} from '../Core/Object3D.js';

/**
 * @author wangzhidong
 * @modified DongYi 2018/07/11
 */

/*function Bone() {

	Object3D.call( this );

	this.type = 'Bone';

}

Bone.prototype = Object.assign( Object.create( Object3D.prototype ), {

	constructor: Bone,

	isBone: true

} );*/

class Bone extends Object3D {
    constructor() {
        super();
        this.isBone = true;
        this.type = 'Bone';
    }
}

export {Bone};
