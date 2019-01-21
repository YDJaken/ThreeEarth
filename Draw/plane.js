/*
* 三角面
* */

import {baseGeometric} from "./basegeometric.js";
import {Coordinate} from "../Math/Coordinate.js";
import {Geometry} from "../src/Core/Geometry.js";
import {Vector3} from "../src/Datum/Math/Vector3.js";
import {Face3} from "../src/Core/Face3.js";
import {MeshLambertMaterial} from "../Materials/MeshLambertMaterial.js";
import {Mesh} from "../src/Geometry/Mesh.js";

class CPlane extends  baseGeometric{
    constructor(scene,obj){
        super(scene,obj)
    }
    /*
  * 根据顶点绘制面
  *params [(lon,lat),(lon,lat)]
  * */
    draw(pArray){
        let Array=[];
        for(let i=0;i<pArray.length;i++){
            let position =  Coordinate.sphericalToCartesian(pArray[i].lon,pArray[i].lat);
            let p1 = new Vector3( position.x,position.y,position.z);
            Array.push(p1);
        }
        var geometry= new Geometry(); //声明一个空几何体对象
        geometry.vertices=Array;
        var normal = new Vector3( 0, 0, 1 ); //三角面法向量
        var face = new Face3( 0, 1,2, normal); //创建三角面
        geometry.faces.push( face ); //三角面添加到几何体
        var material=new MeshLambertMaterial({
            color:this.color
        });//材质对象
        var mesh=new Mesh(geometry,material);//网格模型对象
        this.id=mesh.id;
        this.scene.add(mesh);//网格模型添加到场景中
    }
    setcolor(color){
        super.setcolor(color);
    }
}
export {CPlane}