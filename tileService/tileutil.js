/**
 * 辅助类，提供一些静态方法
 */
import {Scale} from "../Math/Scale.js"
import {Coordinate} from "../Math/Coordinate.js"
import {Vector3} from "../src/Datum/Math/Vector3.js";
import {Raycaster} from "../src/Core/Raycaster.js"



class TileUtil{
  constructor(){

  }
    //计算屏幕中心坐标地理位置和屏幕位置
    static scanTile(sphere,camera) {
        //获取屏幕中心点经纬坐标
        let winWidth = document.body.clientWidth||document.documentElement.clientWidth
        let winHeight = document.body.clientHeight||document.documentElement.clientHeight
        let c={x:winWidth/2,y:winHeight/2};
        let center = TileUtil.screenToSpherical(camera,c,sphere)
        return {
            center:center,
            windowcenter:c
        }
    }
    //计算中心坐标计和对角线坐标的地理位置并返回一个对象
    static scanCorner(sphere,camera) {
        //获取屏幕中心点经纬坐标
        let center = Scale.Screnn2Lonlat(window.screen.height / 2,sphere,camera)
        //获取对角线经纬坐标
        let lefttop = TileUtil.screenToSpherical(camera,{x:0,y:0},sphere)
        let leftbottom = TileUtil.screenToSpherical(camera,{x:0,y:document.body.clientHeight},sphere)
        let rightbottom = TileUtil.screenToSpherical(camera,{x:document.body.clientWidth,y:document.body.clientHeight},sphere)
        let righttop = TileUtil.screenToSpherical(camera,{x:document.body.clientWidth,y:0},sphere)
        return {
            center:center,
            lefttop:lefttop,
            rightbottom:rightbottom,
            leftbottom:leftbottom,
            righttop:righttop
        }
    }
     /**
    * 屏幕坐标转换为地理坐标
    * @param {待转换的屏幕坐标,对象，包含x和y属性} vector2
    * @param {可选参数，数字类型，标示取相交的第几个物体默认为0} objectNum 
    * 
    */
    static screenToSpherical(camera,vector2,sphere,objectNum=0){
        let vector = new Vector3();
        vector.set(
            ( vector2.x / window.innerWidth ) * 2 - 1,
            - ( vector2.y / window.innerHeight ) * 2 + 1,
        0.5 );
        vector.unproject( camera );
        let raycaster = new Raycaster(camera.position, vector.sub(camera.position).normalize());
        let intersects = raycaster.intersectObject(sphere);
        if (intersects.length > 0) {
        let selected = intersects[objectNum];//取第一个物体
        let position = Coordinate.cartesianToSpherical(selected.point.x,selected.point.y,selected.point.z)
        return {
            lon :position.longitude,
            lat :position.latitude,
            r:position.r
        }
        }
    }  
  
    //判断当前视图是在地球级还是地区级,并返回对应属性
    static globeOrArea(sphere,camera,scene){
        let location
        let result = TileUtil.scanCorner(sphere,camera,scene)
        //地区级
        if(result.center && result.lefttop && result.rightbottom){
            location = "Area" 
        }
        //地球级
        else if(result.center && !result.lefttop && !result.rightbottom){
            location = "Globe" 
        }
        return {
            result:result,
            location:location
        }
    }
    //求两个三维坐标点的距离
    static twoPointsDistance(p1,p2){
        return Math.sqrt(Math.pow(p1.x-p2.x,2)+Math.pow(p1.y-p2.y,2)+Math.pow(p1.z-p2.z,2))
    }
     //根据距离计算缩放级别，单位是米，精准度应该要再调整
     static distance2Level(distance){
        if (distance>0 && distance <= 100) return 21;
        else if (distance <= 200) return 20;
        else if (distance <= 300) return 19;
        else if (distance <= 500) return 18;
        else if (distance <= 800) return 17;
        else if (distance <= 1500) return 16;
        else if (distance <= 3500) return 15;
        else if (distance <= 6000) return 14;
        else if (distance <= 15000) return 13;
        else if (distance <= 48000) return 12;
        else if (distance <= 80000) return 11;
        else if (distance <= 150000) return 10;
        else if (distance <= 300000) return 9;
        else if (distance <= 520000) return 8;
        else if (distance <= 920000) return 7;
        else if (distance <= 1900000) return 6;
        else if (distance <= 3000000) return 5;
        else if (distance <= 12500000) return 4;
        else if (distance <= 14000000) return 3;
        else return 3;
    }
    //根据level返回比例尺resolution
    static level2resolution(level){
        if (level == 3) return 19567.8792410029;
        else if (level == 4) return 9783.93962050147;
        else if (level == 5) return 4891.96981025073;
        else if (level == 6) return 2445.98490512537;
        else if (level == 7) return 1222.99245256268;
        else if (level == 8) return 611.496226281342;
        else if (level == 9) return 305.748113140671;
        else if (level == 10) return 152.874056570335;
        else if (level == 11) return 76.4370282851677;
        else if (level == 12) return 38.2185141425838;
        else if (level == 13) return 19.1092570712919;
        else if (level == 14) return 9.55462853564596;
        else if (level == 15) return 4.77731426782298;
        else if (level == 16) return 2.38865713391149;
        else if (level == 17) return 1.19432856695575;
        else if (level == 18) return 0.597164283477873;
        else if (level == 19) return 0.258582141738936;
        else if (level == 20) return 0.128582141738936;
        else if (level == 21) return 0.050582141738936;
        else return 19.10925 
    }
}
export {TileUtil}