/*
Polygon
 */

import {baseGeometric} from "./basegeometric.js";
import {Shape} from "../Extras/core/Shape.js";
import {ShapeGeometry} from "../src/Geometries/ShapeGeometry.js";
import {MeshPhongMaterial} from "../src/Materials/MeshPhongMaterial.js";
import {Mesh} from "../src/Geometry/Mesh.js";
import {Vector2} from "../src/Datum/Math/Vector2.js";
import {Vector3} from "../src/Datum/Math/Vector3.js";
import {Coordinate} from "../Math/Coordinate.js";
import {Face3} from "../src/Core/Face3.js";
import {Geometry} from "../src/Core/Geometry.js";
import {MeshLambertMaterial} from "../Materials/MeshLambertMaterial.js";
import {MeshBasicMaterial} from "../src/Materials/MeshBasicMaterial.js";


class CPolygon extends  baseGeometric{
    constructor(scene,obj){
        super(scene,obj);
        this.id=undefined;
        this.PointList=[];
    }
    draw(pArray){
        if(pArray.length<2){
            return;
        }
        for(let i=0;i<pArray.length;i++){
            let position=Coordinate.sphericalToCartesian(pArray[i].lon,pArray[i].lat);
            let p1=new Vector3(position.x,position.y,position.z);
            this.PointList.push(p1);
        }
        let faces=[];
        for(let i=0;i<  this.PointList.length-2;i++){
            let face=new Face3(0,i+1,i+2);
            faces.push(face);
        }
        var geom =new Geometry();
        geom.vertices= this.PointList;
        geom.faces=faces;
        geom.computeFaceNormals();
        var materials = [
            new MeshLambertMaterial({color:this.color, transparent: true,side:2}),// 透明的绿色材质
        ];
        var mesh = new Mesh(geom, materials);// 这个方法支持多种材质组合
        this.id=mesh.id;
        this.scene.add(mesh);
    }
    setcolor(color){
        super.setcolor(color);
    }
    delete(){
        super.delete();
    }
}
export {CPolygon}