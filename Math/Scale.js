import {Vector3} from "../src/Datum/Math/Vector3.js";
import {Raycaster} from "../src/Core/Raycaster.js";
import {Coordinate} from "./Coordinate.js";
import {EarthRadius} from "../src/Core/Constants.js";
import {Vector2} from "../src/Datum/Math/Vector2.js";

class Scale {
    static GetCurentScale(event, outcamera, outsphere) {
        let y1 = window.screen.height / 2;
        let _y = 0.001;
        let _screnobj = Scale.Screnn2Lonlat(y1, outsphere, outcamera);
        let _viewobj = Scale.Screnn2Lonlat(y1 + _y, outsphere, outcamera);
        if (_screnobj && _viewobj) {
            let dpi = Scale.getDPI();
            let cm = _y / dpi / 2.54;
            let e = new Coordinate().Ellipsoid;
            let dis1 = Scale.Distance(_screnobj.lon, _screnobj.lat, _viewobj.lon, _viewobj.lat);
            let scale1 = dis1 / cm;
            let level1 = Scale.scale2zoom(scale1);
            return {
                scale: scale1,
                level: level1
            };
        }
    }

    /**
     *获取比例尺
     * 地图的缩放等级
     */
    static Screnn2Lonlat(y, sphere, camera) {
        let vector = new Vector3();//三维坐标对象
        vector.set(
            0,
            -(y / window.innerHeight) * 2 + 1,
            0);
        vector.unproject(camera);
        let raycaster = new Raycaster(camera.position, vector.sub(camera.position).normalize());
        let sphere1 = [sphere];
        let intersects = raycaster.intersectObjects(sphere1);
        if (intersects.length > 0) {
            let selected = intersects[0];//取第一个物体
            if (!selected) return;
            let position = Coordinate.cartesianToSpherical(selected.point.x, selected.point.y, selected.point.z);
            return {
                lon: position.longitude,
                lat: position.latitude
            };
        }
    }
    static Screnn2lonlat(x,y, sphere, camera) {
        var coor=new Coordinate();
        let pX=(x/window.innerWidth)*2-1;
        let pY=-(y/window.innerHeight)*2+1;
        let p=new Vector3(pX,pY,-1).unproject(camera);
        let panxy= new Vector2(p.x,p.y);
        let lonlat=coor.ellipsoidMercatorUnprojection(panxy.x,panxy.y)
        return lonlat;
        // return  new Vector2(p.x,p.y);
        // let vector = new Vector3();//三维坐标对象
        // vector.set(
        //     (x / window.innerHeight) * 2 - 1,
        //     -(y / window.innerHeight) * 2 + 1,
        //     0);
        // vector.unproject(camera);
        // let raycaster = new Raycaster(camera.position, vector.sub(camera.position).normalize());
        // let sphere1 = [sphere];
        // let intersects = raycaster.intersectObjects(sphere1);
        // if (intersects.length > 0) {
        //     let selected = intersects[0];//取第一个物体
        //     if (!selected) return;
        //     let position = Coordinate.cartesianToSpherical(selected.point.x, selected.point.y, selected.point.z);
        //     return {
        //         lon: position.longitude,
        //         lat: position.latitude
        //     };
        // }
    }

    //获取当前level
    static scale2zoom(scale) {
        if (scale < 2.665912) return 21;
        else if (scale <= 5.331823) return 20;
        else if (scale <= 10.663648) return 19;
        else if (scale <= 21.327296) return 18;
        else if (scale <= 42.654592) return 17;
        else if (scale <= 85.309183) return 16;
        else if (scale <= 170.618367) return 15;
        else if (scale <= 341.236733) return 14;
        else if (scale <= 682.473467) return 13;
        else if (scale <= 1364.946933) return 12;
        else if (scale <= 2729.893867) return 11;
        else if (scale <= 5459.787734) return 10;
        else if (scale <= 10919.575468) return 9;
        else if (scale <= 21839.150936) return 8;
        else if (scale <= 43678.301871) return 7;
        else if (scale <= 87356.603742) return 6;
        else if (scale <= 174713.207485) return 5;
        else if (scale <= 349426.414969) return 4;
        else if (scale <= 698852.829939) return 3;
        else if (scale <= 1397705.659877) return 2;
        else if (scale <= 2795411.319754) return 1;
        else return 0;
    }

    /*
    * 根據球上兩點的經緯度計算距離
    * */
    static Distance(lat11, lon11, lat22, lon22) {
        const R = EarthRadius;
        const rad = Math.PI / 180,
            lat1 = lat11 * rad,
            lat2 = lat22 * rad,
            a = Math.sin(lat1) * Math.sin(lat2) +
                Math.cos(lat1) * Math.cos(lat2) * Math.cos((lon22 - lon11) * rad);

        return R * Math.acos(Math.min(a, 1));
    }

    static getDPI() {
        let arrDPI;
        if (window.screen.deviceXDPI != undefined) {
            arrDPI = window.screen.deviceXDPI;
        }
        else {
            let tmpNode = document.createElement("DIV");
            tmpNode.style.cssText = "width:1in;height:1in;position:absolute;left:0px;top:0px;z-index:99;visibility:hidden";
            document.body.appendChild(tmpNode);
            arrDPI = parseInt(tmpNode.offsetWidth);
            tmpNode.parentNode.removeChild(tmpNode);
        }
        return arrDPI;
    }


}
export {Scale}