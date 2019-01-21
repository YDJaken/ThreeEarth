/*
瓦片地圖服務
 */
import {Vector3} from "../src/Datum/Math/Vector3.js";
import {Raycaster} from "../src/Core/Raycaster.js";
import {Coordinate} from "../Math/Coordinate.js";
import {Object3D} from "../src/Core/Object3D.js"

import {TextureLoader} from "../src/Loaders/TextureLoader.js";
import {Mesh} from "../src/Geometry/Mesh.js";
import{SphereGeometry} from "../src/Geometries/SphereGeometry.js"
import {MeshPhongMaterial} from "../src/Materials/MeshPhongMaterial.js"
import {Color} from "../src/Datum/Math/Color.js";

var level=0,Lon=0,Lat=0;
var tileSize=1;
var scene;
var radius= 6371.393*1000;
var segments=0;
class TMSService{
    static AddWTMSTiles(lon,lat,outlevel,outscene,outsegments){
        level=outlevel;
        scene=outscene;
        segments=outsegments;
            // let group = new Object3D();
            let  position = Coordinate._sphericalToCartesian(lat,lon)   //经纬度转平面坐标
            var webMercator = TMSService.LonLat2WebMercator(lon, lat);
            var tilePos = TMSService.WebMercator2Tileimage(webMercator.x, webMercator.y);
            //以centerLng所在点tile中心点为中心，加载tile
            TMSService.loadMap(tilePos.tileinfo.x, tilePos.tileinfo.y);
        }
        //WGS84转Web墨卡托
        //参考：http://www.opengsc.com/archives/137
    static LonLat2WebMercator(lng, lat) {
            Lon=lng;
            Lat=lat
            var x = (lng / 180.0) * 20037508.3427892;
            var y;
            if (lat > 85.05112) {
                lat = 85.05112;
            }
            if (lat < -85.05112) {
                lat = -85.05112;
            }
            y = (Math.PI / 180.0) * lat;
            var tmp = Math.PI / 4.0 + y / 2.0;
            y = 20037508.3427892 * Math.log(Math.tan(tmp)) / Math.PI;
            var result = {
                x: x,
                y: y
            };
            return result;
        }
        //Web墨卡托转成tile上的像素坐标，返回像素坐标，以及tile编号，在所在tile上的偏移
    static  WebMercator2Tileimage(x, y) {
            var r = 20037508.3427892;
            y = r - y;
            x = r + x;
            var size = Math.pow(2, level) * 256;
            var imgx = x * size / (r * 2);
            var imgy = y * size / (r * 2);
            //当前位置在全球切片编号
            var col = Math.floor(imgx / 256);
            var row = Math.floor(imgy / 256);
            // console.log("col", col, "row", row);
            //当前位置对应于tile图像中的位置
            var imgdx = imgx % 256;
            var imgdy = imgy % 256;

            //像素坐标
            var position = {
                x: imgx,
                y: imgy
            };
            //tile编号
            var tileinfo = {
                x: col,
                y: row,
                level: level
            };
            //在所在tile上的偏移
            var offset = {
                x: imgdx,
                y: imgdy
            };

            var result = {
                position: position,
                tileinfo: tileinfo,
                offset: offset
            };
            return result;
        }
        /**
         * 加载地图
         * @param {Object} centerX 地图中间的切图编号
         * @param {Object} centerY 地图中间的切图编号
         */
        static loadMap(centerX, centerY) {
            var radius =0;
            //每次请求回来的
            for (var i = centerX - radius; i <= centerX + radius; i++) {
                for (var j = centerY - radius; j <= centerY + radius; j++) {
                    TMSService.loadImageTile(Lon,Lat,i, j, TMSService.addTileToSceneHelper(i - centerX, j - centerY));
                }
            }
        }
    /**
     * 加载一个切图
     * @TileRow 行编号
     * @TileCol 列编号
     * @TileMatrix 切片矩阵
     * @callback  回调
     */
    static loadImageTile(Lon,lat,TileRow,TileCol,callback) {
        return new Promise((resolve, reject)=>{
            // let url= "http://t1.tianditu.com/cia_w/wmts?service=wmts&request=GetTile&version=1.0.0&LAYER=cia&tileMatrixSet=w&TileMatrix=" +level+ "&TileRow=" +TileCol+ "&TileCol=" +TileRow+ "&style=default.jpg";
        let  url ="http://t0.tianditu.com/img_w/wmts?service=wmts&request=GetTile&version=1.0.0&LAYER=img&tileMatrixSet=w&TileMatrix=" +level+ "&TileRow=" +TileCol+ "&TileCol=" +TileRow+ "&style=default&format=tiles";
        var loader = new TextureLoader();
        //跨域加载图片
        loader.crossOrigin = true;
        loader.load(url, function(texture) {
            let a = Coordinate.speed3DConverter(Lon - 5, lat + 5)
            let b = Coordinate.angleToRadian(10)
            let d = Coordinate.angleToRadian(10);
            if(!scene){
                return;
            }
            scene.add( new Mesh(
                new SphereGeometry(radius, segments, segments, a.longitude, b, a.latitude, d),
                new MeshPhongMaterial({
                    map: texture,
                    overdraw: true,
                    specular: new Color('grey'),
                })
            ));
            resolve(true)
        });
    })
    }
    /**
     * 辅助函数，用于计算tile应该放在何处
     * @param {Object} dx  tile间相对位置，也就是编号差
     * @param {Object} dy
     */
    static addTileToSceneHelper(dx, dy) {
        var x = tileSize * dx;
        var y = -tileSize * dy;
        return function(mesh) {
            TMSService.addTileToScene(mesh, x, y)
        }

    }
    /**
     * 将加载的切图放到scene
     * @param {Object} mesh
     * @param {Object} x坐标  WebGL坐标
     * @param {Object} y坐标
     */
    static addTileToScene(mesh, x, y) {
        //mesh的中心位置
        mesh.position.x = x;
        mesh.position.y = y;
        scene.add(mesh);
    }

}
export {TMSService}