import {Object3D} from '../Core/Object3D.js';

/**
 * @author wangzhidong
 * @modified DongYi 2018/07/11
 */

/*
function Group() {

	Object3D.call( this );

	this.type = 'Group';

}

Group.prototype = Object.assign( Object.create( Object3D.prototype ), {

	constructor: Group,

	isGroup: true

} );
*/

class Group extends Object3D {
    constructor() {
        super();
        this.isGroup = true;
        this.type = 'Group';
    }
}

export {Group};
