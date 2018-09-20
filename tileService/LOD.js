import {Coordinate} from "../Math/Coordinate.js"

class LOD{
   constructor(){
   }
  /**
     * 输入两点经纬坐标，返回瓦片,接口函数
     * @param {第一个点}  lng
     * @param {第二个点}  lat
     * @param {当前缩放等级}  level
     * @param {瓦片列号}  tilePos
     */
    static createTileByImage(lng,lat,level){
            let mpoint = {
                x:Coordinate.spherToMercator(lng,lat).x,
                y:Coordinate.spherToMercator(lng,lat).y
            }
            //1级一个中心
            let center = {"x":0,"y":0}
            //1级象限
            let qnum = LOD.whichQuadrant(center,1,mpoint)
            let nextcenter,nextqnum
            for(let i=1;i<level;i++,qnum = nextqnum,center = nextcenter){
                //根据父节点中心坐标，父level,父象限号计算下一个中心坐标
                nextcenter = LOD.donextCenter(center,i,qnum)   
                //已知当前级别中心点,当前缩放级别，和方块内坐标，返回所在象限
                nextqnum = LOD.whichQuadrant(nextcenter,i+1,mpoint)                  
            }
            //至此center已经是当前level下给定point的中心点了，现在依据此中心点和象限值计算lngstart和latstart
            let cor = LOD.caculateTileLonAndLat(nextcenter,level,nextqnum)
            let c = Coordinate.mercatorToSpher(cor.longitude,cor.latitude)
            let lngstart
            let latstart
            try{
              lngstart = LOD.lngToSpeed3D(Coordinate.angleToRadian(c.longitude))
              latstart = LOD.latToSpeed3D(Coordinate.angleToRadian(c.latitude))
            }catch{}
             
            let lngstep = LOD.levelToStep(level).lngstep
            //latstart需要重新计算，然后才能计算出latstep
            //需要通过点击计算出的瓦片行列号反推经纬度
             
            let latstep = LOD.caculateSize(latstart,level)


            let tileInfo = {
                lngstart:lngstart,
                lngstep:lngstep,
                latstart:latstart,
                latstep:latstep
            }
            return tileInfo
    }
    
    //已知当前级别中心点,当前缩放级别，和方块内坐标，返回所在象限
    static whichQuadrant(center,level,point){
        let lngstep = LOD.levelToMStep(level).x
        let latstep = LOD.levelToMStep(level).y
        let topLat 
        //求出当前方块四边界和中线经纬度
        if(center){
        topLat = center.y + latstep
        }else {
            return false
        }
        let bottomLat = center.y - latstep
        let leftLng = center.x - lngstep
        let rightLng = center.x + lngstep
        let middleLng = center.x
        let middleLat = center.y

        //let value = LOD.geographyToWebgl(point)
        //第一象限
        if(point.x<middleLng && point.x>leftLng && point.y>middleLat && point.y<topLat){
            return Number(0)
        }else if(point.x>middleLng && point.x<rightLng && point.y>middleLat && point.y<topLat){
            return Number(1)
        }else if(point.x<middleLng && point.x>leftLng && point.y>bottomLat && point.y<middleLat){
            return Number(2)
        }else if(point.x>middleLng && point.x<rightLng && point.y<middleLat && point.y>bottomLat){
            return Number(3)
        }else{
            return undefined
        }
    }
    //已知level，求瓦片经纬度墨卡托长度
    static levelToMStep(level){
        let value = 20037508.3427892*2
        let x = Math.abs(value*(1/Math.pow(2,level)))
        let y = Math.abs(value*(1/Math.pow(2,level)))
        return {
            x:x,    
            y:y
        }
    }
    //已知level，求瓦片经度跨度
    static levelToStep(level){
        let value = Coordinate.speed3DConverter(180,-85.05113)
        let lngstep = Math.abs(value.longitude*(1/Math.pow(2,level)))
        return {
            lngstep:lngstep,    
        }
    }
    //经纬度转WebGl坐标系
    static geographyToWebgl(point){
        let value = {}
        point.x = Coordinate.angleToRadian(point.longitude)
        point.y = Coordinate.angleToRadian(point.latitude)
        return {
            longitude:point.x,
            latitude:point.y
        }  
    }
    //根据父节点中心坐标，父level,父象限号计算下一个中心坐标
    static donextCenter(center,level,quadrant){
        let lngstep = LOD.levelToMStep(level).x
        let latstep = LOD.levelToMStep(level).y
        if(quadrant===0){
            center.x -= 1/2*lngstep
            center.y += 1/2*latstep
        }else if(quadrant===1){
            center.x += 1/2*lngstep
            center.y += 1/2*latstep
        }else if(quadrant===2){
            center.x -= 1/2*lngstep
            center.y -= 1/2*latstep
        }else if(quadrant===3){
            center.x += 1/2*lngstep
            center.y -= 1/2*latstep
        }
        return center
    }
    //根据中心点，level和象限计算当前瓦片经起始点
    static caculateTileLonAndLat(center,level,qnum){
        let lng,lat
        let lngstep = LOD.levelToMStep(level).x
        let latstep = LOD.levelToMStep(level).y
        if(qnum===0){
           lng = center.x - lngstep
           lat = center.y + latstep
        }else if(qnum===1){
           lng = center.x
           lat = center.y + latstep
        }else if(qnum===2){
            lng = center.x -lngstep
            lat = center.y
         }else if(qnum===3){
            lng = center.x
            lat = center.y
         }
         return {
             longitude:lng,
             latitude:lat 
         }
    }
    static latToSpeed3D(latitude){
        if(latitude<=0){
            latitude = Math.PI/2 + Math.abs(latitude);
        }
        else if(latitude>0){
            latitude = Math.PI/2 - latitude;
        }
        return latitude
    }
    static lngToSpeed3D(longitude){
        if(longitude===-Math.PI){
            return 0
        }
        if(longitude<0){
            longitude = Math.abs(Math.PI+longitude);
            }else{
            longitude = longitude+Math.PI;
            }
        return longitude    
    }
    //固定墨卡托切分下，不同纬度start下，返回每块瓦片纬度跨度
    //(-20037508.3427892, -20037508.3427892 )  (20037508.3427892, 20037508.3427892)。
    //19971868.8804086  20102482.4102  
    static caculateSize(latstart,level){
        latstart = Coordinate.radianToAngle(latstart)
        //一块瓦片在当前级别的真实墨卡托距离
        let onetilelength = 20037508.3427892*2/Math.pow(2,level)
        //根据latstart算出当前墨卡托坐标
        let m = Coordinate.spherToMercator(0,90-latstart).y
        //当前墨卡托坐标-下一块瓦片的墨卡托坐标
        let r = m - onetilelength
        //结果值转换为纬度 - latstart即为结果
        let l = Coordinate.mercatorToSpher(0,r).latitude
        return Coordinate.angleToRadian(90-latstart-l)
        }
   //x行号和level转经度
    static tile2long(x,z) {
        return (x/Math.pow(2,z)*360-180);
    }
   //y行号和level转纬度
    static tile2lat(y,z) {
        let n=Math.PI-2*Math.PI*y/Math.pow(2,z);
        return (180/Math.PI*Math.atan(0.5*(Math.exp(n)-Math.exp(-n))));
   }
}

export {LOD}