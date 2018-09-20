/**
 * 根据当前视图类别使用不同加载策略处理瓦片，地球级或地区级
 */
import {TileUtil} from "../tileService/tileutil.js"
import {LOD} from "../tileService/LOD.js"
import {Ellipsoid} from "../Math/Ellipsoid.js"
import {Coordinate} from "../Math/Coordinate.js"
class LoadView{
    constructor(sphere,camera,scene,level){
       this.sphere = sphere
       this.camera = camera
       this.scene = scene
       this.level = level
       this.center 
       this.lefttop
       this.rightbottom
       this.WGS84 = Ellipsoid.WGS84()
       this.tileSize = 256
       this.gaps
       this.flag = true
    }
    async init(){
        let R = TileUtil.globeOrArea(this.sphere,this.camera,this.scene)
        this.center = R.result.center
        if(R.location==="Globe" && this.flag){
            this.flag = false
            return this.handleGlobe()
        }else if(R.location==="Area"){
           return this.handleArea()
        }  
    }
    //计算当前level下最小纬度跨度和固定经度跨度
    caculateLngAndLatStep(){
        let lngstep = LOD.levelToStep(this.level).lngstep
        let latstep = LOD.caculateSize(Coordinate.angleToRadian(4.94),this.level)
        return {
            lngstep:lngstep,
            latstep:latstep
        }
    }
    //地球层级算法,返回坐标集
    handleGlobe(){
       let cor = [] 
       let s = this.caculateLngAndLatStep() 
       //全球加载
       let lngstart = Coordinate.radianToAngle(-Math.PI*0.99)
       let lngend = Coordinate.radianToAngle(Math.PI)

       let latstart = Coordinate.radianToAngle(-1/2*Math.PI)
       let latend = Coordinate.radianToAngle(1/2*Math.PI)
    
       let lngstep = Coordinate.radianToAngle(s.lngstep)
       let latstep = Coordinate.radianToAngle(s.latstep)

       for(let i=lngstart;i<=lngend;i+=lngstep){
           for(let j=latstart;j<=latend;j+=latstep){
               let coor = {"x":i,"y":j}
               cor.push(coor)
           }
       }
       let arr = []
       cor.forEach((item)=>{
        item.x = Number(Number(item.x).toFixed(0))
        item.y = Number(Number(item.y).toFixed(0))
          if(Math.abs(item.y)<=85.1){
            arr.push(item) 
          }       
       })
       return arr
    }
    //地区层级算法
    handleArea(){
        //将每个像素点点坐标，以各跨度转换为地理经纬坐标，如果超出地球范围则舍弃
        return this.shortestDistanceOrder(this.pixGap())
    }
    //根据经纬度坐标计算距离中心点this.center的距离，并返回一个新的排序数组
    shortestDistanceOrder(arr){
        let center = {}
        center.lat = Number(Number(this.center.lat))
        center.lon = Number(Number(this.center.lon))
        arr.map((item) => {
            let distance = this.WGS84.computeDistance(center.lon,center.lat,item.x,item.y)
            item.distance = distance
            item.center = center
            return item
        });
        
        arr.sort((a,b)=>{return a.distance -b.distance})
        arr.map((item)=>{
            item.x = Number(Number(item.x))
            item.y = Number(Number(item.y))
              if(Math.abs(item.y)<=85.1){
                return item   
              }  
           })
        return arr
    }
    //全球初始化，加载第三层图层
    initGlobe(provider){
        let arr = this.handleGlobe()
        for(let i=0;i<=arr.length-1;i++){
          provider.loadTile(arr[i].x,arr[i].y)
        }
        return this
     }
    //初始化计算像素间隔,仅屏幕
    pixGap(){
        let cor = []
        //按照1920*1080屏幕的标准，以256像素瓦片为跨度进行屏幕切分自适应，以保证各种分辨率下的瓦片加载成功
        let totallnglength = 1920/this.tileSize
        let totallatlength = 1080/this.tileSize
        //准备从左上角向右，向下遍历，算出以像素为单位的跨度
        let singlelnglength = Math.floor(document.documentElement.clientWidth/totallnglength)*3/4
        let singlelatlength = Math.floor(document.documentElement.clientHeight/totallatlength)*3/4

        for(let i=0;i<=document.body.clientWidth;i+=singlelnglength){
             for(let j=0;j<=document.body.clientHeight;j+=singlelatlength){
                let coor = {"x":i,"y":j}
                cor.push(coor)
             }
        }
        //屏幕坐标转地理坐标
        let narr = []
        for(let i = 0;i<=cor.length-1;i++){
            narr.push(this.pix2gro(cor[i]))
        }
        return narr
    }
    //屏幕坐标转为地理坐标
    pix2gro(cor){
        let obj = {}
        //当前中心地理坐标
        let geo_center_ = TileUtil.scanTile(this.sphere,this.camera).center
        //当前中心屏幕坐标
        let see_center_ = TileUtil.scanTile(this.sphere,this.camera).windowcenter
        //当前输入的屏幕坐标
        let ptWnd = cor
        //当前层级比例尺
        let resolution_ = TileUtil.level2resolution(this.level)
        obj.x = geo_center_.lon + (( ptWnd.x - see_center_.x ) * resolution_)*0.00001141;
        obj.y = geo_center_.lat - (( ptWnd.y - see_center_.y ) * resolution_)*0.00000899;
        return obj
    }

}
export {LoadView}
    
    


