import {baseGeometric} from "./basegeometric.js";
import {Coordinate} from "../Math/Coordinate.js";
import {Vector3} from "../src/Datum/Math/Vector3.js";
import {SphereGeometry} from "../src/Geometries/SphereGeometry.js";
import {MeshLambertMaterial} from "../Materials/MeshLambertMaterial.js";
import {Mesh} from "../src/Geometry/Mesh.js";


/*
* 球
* */

class CSphere extends baseGeometric{
    constructor(scene,obj){
        super(scene,obj);
    }
    draw(radius,lon,lat,r){
        var position =  Coordinate.sphericalToCartesian(lon,lat,r);
        var p1 = new Vector3( position.x,position.y,position.z);
        var sphereGeo = new SphereGeometry(radius,60,60);//创建球体
        var sphereMat = new MeshLambertMaterial({//创建材料
            color: this.color
        });
        var sphereMesh = new Mesh(sphereGeo, sphereMat);//创建球体网格模型
        sphereMesh.position.set(p1.x,p1.y,p1.z);//设置球的坐标
        this.id=sphereMesh.id;
        this.scene.add(sphereMesh);//将球体添加到场景
    }
    setcolor(color){
        super.setcolor(color);
    }
    setradius(radius){
        // sphereMesh
        let geometry =Model.getObjectById(this.id).geometry;
        // console.log(geometry);
        geometry.parameters.radius=radius;
    }

}
export {CSphere}