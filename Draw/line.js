/*
* Line
*
* */
import {baseGeometric} from "./basegeometric.js";
import {Coordinate} from "../Math/Coordinate.js";
import {Vector3} from "../src/Datum/Math/Vector3.js";
import {Geometry} from "../src/Core/Geometry.js";
import {LineBasicMaterial} from "../src/Materials/LineBasicMaterial.js";
import {Line} from "../src/Geometry/Line.js";

class CLine extends baseGeometric{
    constructor(scene,obj){
        super(scene,obj);
        this.PointList=[];
    }
    draw(pArray){
        if(pArray.length<1){
            return;
        }
        let Array=[];
        for(let i=0;i<pArray.length;i++){
            let position =  Coordinate.sphericalToCartesian(pArray[i].lon,pArray[i].lat);
            let p1 = new Vector3( position.x,position.y,position.z);
            Array.push(p1);
        }
        let geometry=new Geometry();
        geometry.vertices=Array;
        let material=new LineBasicMaterial({
            color: this.color
        });
        let mesh=new  Line(geometry,material)
        this.id=mesh.id;
        this.scene.add(mesh)
    }
    moveto(lon,lat){
        let position =  Coordinate.sphericalToCartesian(lon,lat);
        let p1 = new Vector3( position.x,position.y,position.z);
        this.PointList.push(p1);
    }
    lineto(lon,lat){
        let position =  Coordinate.sphericalToCartesian(lon,lat);
        let p1 = new Vector3( position.x,position.y,position.z);
        this.PointList.push(p1);
    }
    activeline(){
        let geometry=new Geometry();
        geometry.vertices=this.PointList;
        let material=new LineBasicMaterial({
            color: this.color
        });
        let mesh=new  Line(geometry,material)
        this.id=mesh.id;
        this.scene.add(mesh)
    }
    setcolor(color){
        super.setcolor(color);
    }
    rotate(angle){
        super.rotate(angle);
    }
    setopacity(opacity){
        super.setopacity=opacity;
    }
    delete(){
        super.delete();
    }
}
export {CLine}