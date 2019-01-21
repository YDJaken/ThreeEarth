/**
 * @author wangzhidong
 * @modified WangSuJian 2018/07/11
*/


import { Matrix4 } from "../Datum/Math/Matrix4.js";
import { Quaternion } from "../Datum/Math/Quaternion.js";
import { Object3D } from "../Core/Object3D.js";
import { Vector3 } from "../Datum/Math/Vector3.js";

class Camera extends Object3D{
    constructor(){
        super();
        this.type = 'Camera';
        this.matrixWorldInverse = new Matrix4();
        this.projectionMatrix = new Matrix4();
        this.isCamera = true;
    }

    copy( source, recursive ) {
        Object3D.prototype.copy.call( this, source, recursive );
        this.matrixWorldInverse.copy( source.matrixWorldInverse );
        this.projectionMatrix.copy( source.projectionMatrix );
        return this;
    }

    getWorldDirection( target ) {
        let quaternion = new Quaternion();
        if ( target === undefined ) {
            console.warn( 'Speed3DEngine.Camera: .getWorldDirection() target is now required' );
            target = new Vector3();
        }
        this.getWorldQuaternion( quaternion );
        return target.set( 0, 0, - 1 ).applyQuaternion( quaternion );
    }

    updateMatrixWorld( force ) {
        Object3D.prototype.updateMatrixWorld.call( this, force );
        this.matrixWorldInverse.getInverse( this.matrixWorld );
    }

    clone(){
        return new this.constructor().copy( this );
    }

}

export { Camera };