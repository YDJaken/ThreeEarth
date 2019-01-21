import {Check} from "../Check/Check.js";
import {Color} from "../src/Datum/Math/Color.js";

/**
 *
 * basic geometric
 * color  颜色
 *clamping  贴地
 *
 */

const DefaultOption={
    color:"#990000",
    rotate:0,
    clamping:false
};
class baseGeometric{
    constructor(scene, obj = DefaultOption) {
        if (!scene) {
            console.warn(`scene未创建!`);
            return;
        }
        this.scene=scene;
        this.color=obj.color;
        this.id=undefined;
        if (obj !== DefaultOption) obj = Check.checkInput(obj,DefaultOption);
    }
    /*
    * 设置颜色
    * */
    setcolor(color){
        let material =Model.getObjectById(this.id).material;
        material.color = new Color(color);
    }
    /*
    * 旋转
    * */
    rotate(angle){
        let geometric =Model.getObjectById(this.id);
        geometric.rotation.x=angle*Math.PI/180;
        geometric.rotation.y=angle*Math.PI/180;
        geometric.rotation.z=angle*Math.PI/180;
    }
    /*
    * 设置大小
    * */
    setsize(size){
        var  material =Model.getObjectById(this.id).material;
        material.size = size;
    }
    /*
    * 透明度
    * */
    setopacity(opacity){
        let material =Model.getObjectById(this.id).material;
        material.opacity(opacity);
    }
    /*
    * 删除
    * */
    delete(){
        this.scene.remove(Model.getObjectById(this.id).remove());
    }
}
export {baseGeometric}

