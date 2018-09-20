import {Coordinate} from "../Math/Coordinate.js"
import {TextureLoader} from "../src/Loaders/TextureLoader.js"
import {CacheTile} from "../tileService/cache.js"


/**
 * 
 * 加载瓦片方法，根据经纬度请求对应瓦片
 * 需要支持不同服务商
 */
class LoadTile{

   constructor(camera,scene,document,level,tileSize,url){
     this.camera = camera
     this.scene = scene
     this.Photoradius = 0;
     this.document = document
     this.level = level
     this.tileSize = tileSize
     this.arr = []
     this.textureResult = []
     this.cache = new CacheTile()
     //当前层级对应瓦片服务商
     this.tileServer = LoadTile.whichServer(url)
     this.Coordinate = new Coordinate()
     //地图切片服务地址
     this.serverURL = url
      
   }
    main(lng,lat,level) {   
    let tilePos = LoadTile.lonLat2TilePos(lng,lat,level)
    let result = {}
    result.promise = this.loadMap(tilePos.tileinfo.x, tilePos.tileinfo.y)
    result.tilePos =tilePos
    result.lat = lat
    result.lng = lng
    return result
    
  }
  /**
* 加载地图
* @param {Object} centerX 地图中间的切图编号
* @param {Object} centerY 地图中间的切图编号
*/
    loadMap(centerX, centerY) {
    let arr1 = []
    return new Promise((resolve)=>{
        //每次请求回来的
        for (let i = centerX - this.Photoradius; i <= centerX + this.Photoradius; i++) {
            for (let j = centerY - this.Photoradius; j <= centerY + this.Photoradius; j++) {
                //addTileToSceneHelper两个参数是决定瓦片几何体最终位置，但只是做了拼合成2D图形的工作
                arr1.push(this.loadImageTile(i, j));
            }
        }
        Promise.all(arr1).then((result)=>{
            resolve(result)
        })
      })
    }
    //Web墨卡托转成tile上的像素坐标，返回像素坐标，以及tile编号，在所在tile上的偏移
    static WebMercator2Tileimage(x, y,level) {
    //对于第18级地图, 对于我国而言
    let r = 20037508.3427892;
    y = r - y;
    x = r + x;
    let size = Math.pow(2, level) * 256;
    let imgx = x * size / (r * 2);
    let imgy = y * size / (r * 2);
    //当前位置在全球切片编号
    let col = Math.floor(imgx / 256);
    let row = Math.floor(imgy / 256);
    //当前位置对应于tile图像中的位置
    let imgdx = imgx % 256;
    let imgdy = imgy % 256;

    //像素坐标
    let position = {
        x: imgx,
        y: imgy
    };
    //tile编号
    let tileinfo = {
        x: col,
        y: row,
        level: level
    };
    //在所在tile上的偏移
    let offset = {
        x: imgdx,
        y: imgdy
    };

    let result = {
        position: position,
        tileinfo: tileinfo,
        offset: offset
    };
    return result;
   }
   static LonLat2WebMercator(lng, lat) {
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

    /**
    * 加载一个切图，根据行列号和缩放级别加载瓦片，组装渲染成PlaneGeometry后经回调函数处理
    * @param {Object} xno tile编号x
    * @param {Object} yno tile编号y
    */
    loadImageTile(xno, yno) {
        let id = this.level + '-' + xno + '-' +yno
        if(this.cache.get(id)){
            return false
        }else{
        this.cache.add(id)
        return new Promise((resolve)=>{
            let url = this.makeUrl(xno,yno,this.level,this.serverURL)
            let loader = new TextureLoader();
            //跨域加载图片
            loader.crossOrigin = true;
            loader.load(url, function(texture) {
                resolve(texture)
            });
        })
      }
    }
    //根据地图服务商拼装url
    makeUrl(xno,yno,level,serverURL){
        let servername = this.tileServer
        let server = serverURL
        if(servername==='osm'){
            return server + level + "/" + xno + "/" + yno + ".png";
        }else if(servername==='gaode'){
            return server + "&x="+xno+"&y="+yno+"&z="+level
        }else if(servername==='baidu'){
            return server + "&x="+xno+"&y="+yno+"&z="+level
        }else if(servername==='google'){
            return server + "&x="+xno+"&y="+yno+"&z="+level
        }else if(servername==='arcgis'){
            return server + "&tilerow="+yno+"&tilecol="+xno+"&tilematrix="+level
        }else if(servername==='tianditu'){
            return server + "&tilerow="+yno+"&tilecol="+xno+"&tileMatrix="+level
        }
    }
    //判断用户输入的url属于哪个服务商
    static whichServer(url){
       if(url.includes("openstreetmap" || "osm")){
          return "osm"
       }else if(url.includes("autonavi")){
          return "gaode"
       }else if(url.includes("bdimg")){
          return "baidu"
       }else if(url.includes("google")){
        return "google"
       }else if(url.includes("arcgis")){
        return "arcgis"
       }else if(url.includes("tianditu")){
        return "tianditu"
       }        
    }

    //经纬度转行列号
    static lonLat2TilePos(lng,lat,level){
        //计算输入经纬坐标的墨卡托坐标
        let webMercator = Coordinate.spherToMercator(lng,lat) //LoadTile.LonLat2WebMercator(lng,lat) //Coordinate.spherToMercator(lng,lat) 
        //根据该墨卡托坐标计算瓦片像素，瓦片行列号，瓦片偏移
        let tileInfo = LoadTile.WebMercator2Tileimage(webMercator.x, webMercator.y,level);
        return tileInfo
    }
    //TMS已知经纬度求瓦片行列号
   
    static tmsLonLatToPos(lng,lat,level){
        let X = (Math.floor((lng+180)/360*Math.pow(2,level)));
        let Y = ((1 << level)-(Math.floor((1-Math.log(Math.tan(lat*Math.PI/180) + 1/Math.cos(lat*Math.PI/180))/Math.PI)/2 *Math.pow(2,level)))-1); 
        return {
           x:X,
           y:Y
        }
    }
}

export {LoadTile}