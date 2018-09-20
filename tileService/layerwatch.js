/**
 * 监控相机，执行渲染算法，总图层控制器
 */
import {TileProvider} from "../tileService/tileprovider.js";
import {LoadView} from "../tileService/loadView.js";
import {TileUtil} from "../tileService/tileutil.js";
import {Vector3} from "../src/Datum/Math/Vector3.js";
import {EarthRadius} from "../src/Core/Constants.js";
import {Object3D} from "../src/Core/Object3D.js";
class LayerWatch{
    constructor(camera,scene,sphere){
        this.camera = camera
        this.scene = scene
        this.sphere = sphere
        //3D场景中瓦片图层总容器
        this.group = new Object3D();
        this.group.renderOrder = 0
        this.scene.add(this.group);
        this.url = []
        this.count = 0
        //层数计数器
        this.i = 0
        this.Level = new Object()
        this.Level.level = new Object()
        
        //总容器-->用户图层-->具体业务图层(绑定在用户图层下的TileProvider)-->mesh
        //TileProvider就是具体业务图层
    }
    //系统注册某个层级图层元素内的某个瓦片层级
    _addLayer(num,level){  
        this.Level.level['level'+(num)]['l'+level] = new TileProvider(this.camera,this.scene,document,level,this.url[num],this.group.children[num],this.Level.level['level'+(num)].order,this.Level.level['level'+(num)].isBase)
    }
    //用户注册某个层级图层元素
    addLayer(obj){
        //用户图层
        let group = new Object3D()
        group.renderOrder = this.i
        group.isBase = obj.type=='base'?true:false
        this.group.add(group)
        this.Level.level['level'+(this.i)] = {}
        //在用户图层层面控制order和区别路网信息
        this.Level.level['level'+(this.i)].order = this.i
        this.Level.level['level'+(this.i)].isBase = obj.type=='base'?true:false
        this.url[this.i] = obj.url
        //具体业务图层
        this.Level.level['level'+(this.i)]['l3'] = new TileProvider(this.camera,this.scene,document,3,obj.url,group,group.renderOrder,group.isBase)
        this.i++
    }
    //删除某个层级图层元素
    deleteAll(num,level){
        if(this.Level.level[num]['l'+level]){
            this.Level.level[num]['l'+level].deleteAll()
            this.Level.level[num]['l'+level] = null
            Cache.clear()
        }
    }
    //检测某个图层是否存在
    detectLayer(num,level){
        return this.Level.level['level'+(num)]['l'+level] instanceof TileProvider
    }
    //执行加载某层符合要求的瓦片
    loadTile(num,level){
        let promise = []
        return new Promise((resolve)=>{
            if(level){
                new LoadView(this.sphere,this.camera,this.scene,level).init().then((resolve)=>{
                    let t = this
                    if(resolve && resolve.length>0){
                        //加载瓦片
                        for(let i=0;i<=resolve.length-1;i++){
                           promise.push(t.Level.level['level'+(num)]['l'+level].loadTile(resolve[i].x,resolve[i].y,resolve[i].r))
                    } 
                 }
             })   
          }
          Promise.all(promise).then((result)=>{
            resolve(result)
        })
     })
   }
   //图层控制，合并对象，帧率控制
   controlLayer(ifexist,num,level,action){
        let layerno = action === 'zoomin'?-1:1
        //缩进时如果存在，则加载瓦片，隐藏上级图层
        //缩进如果不存在，则先添加图层，再加载瓦片隐藏上层
        //回退时如果存在，则加载瓦片，隐藏下级图层
        //回退如果不存在，则先添加图层，再加载瓦片隐藏下层图层
        if(action==='zoomin'){
            ifexist?this.Level.level['level'+(num)]['l'+level].showTile():this._addLayer(num,level)
            this.loadTile(num,level).then(()=>{
                //路网信息需要，基础图层不需要
                !this.Level.level['level'+(num)].isBase?(this.detectLayer(num,level+layerno)?this.Level.level['level'+(num)]['l'+(level+layerno)].hideTile():''):''
                
            })
        }else if(action==='zoomout'){
            ifexist?this.Level.level['level'+(num)]['l'+level].showTile():this._addLayer(num,level)
            this.loadTile(num,level).then(()=>{
                this.detectLayer(num,level+layerno)?this.Level.level['level'+(num)]['l'+(level+layerno)].hideTile():''
            })
        }
   }
    watch(){
      let olddistance = this.camera.distance
      let that = this
       Object.defineProperty(this.camera,'distance',{ 
          get: function () {   
              return olddistance
          },
          set: function(newvalue){
              that.count++ 
              if(newvalue!==olddistance && that.count%3==0){
                this.count = 0
                //用距离求level，带入视图中
                if(that.camera.distance>0){
                let level = TileUtil.distance2Level(that.camera.distance) 
                let keys = Object.keys(that.Level.level)
                //回退操作,执行回退控制,控制所有图层 
                if(newvalue>olddistance){
                    
                    for(let i=0;i<=keys.length-1;i++){
                        let ifexist = that.detectLayer(Number(keys[i].substring(5)) ,level)
                        that.controlLayer(ifexist,keys[i].substring(5),level,'zoomout')
                    }
                }
                //缩进操作,执行缩进控制,控制所有图层 
                else if(newvalue<olddistance){
                    for(let i=0;i<=keys.length-1;i++){
                        let ifexist = that.detectLayer(Number(keys[i].substring(5)) ,level)
                        that.controlLayer(ifexist,keys[i].substring(5),level,'zoomin')
                    }
                }
            }
        }
          olddistance = newvalue
        }
    })
    return this
}  
    unwatch(){
        // let keys = Object.keys(this)
        // keys.forEach((item)=>{
        //     try{this[item].deleteAll()}
        //     catch{}
        //     item = null   
        // })
        // this.scene.remove(this.group);
        // let oldx = this.camera.position.x
        // Object.defineProperty(this.camera.position,'x',{ 
        //     get: function () {
        //       return oldx
        //     },
        //     set:  function(newvalue){
        //       oldx = newvalue
        //   }
        // })  
    }
    //相机到地面的距离
    camera2Ground(){
        let distance = TileUtil.twoPointsDistance(this.camera.position,new Vector3(0,0)) - EarthRadius 
        this.distance.distance = distance
        return this.distance.distance
    }

  
}

export {LayerWatch}