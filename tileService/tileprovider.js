

/**
 * 
 * 每个层级创造一个tileprovider，最初的层级管理器
 * 
 */
import {LOD} from "../tileService/LOD.js"
import {MeshBasicMaterial} from "../src/Materials/MeshBasicMaterial.js";
import {Mesh} from "../src/Geometry/Mesh.js";
import {SphereGeometry,SphereBufferGeometry} from "../src/Geometries/SphereGeometry.js";
import {LoadTile} from "../tileService/loadtile.js"
import {Object3D} from "../src/Core/Object3D.js"
import {EarthRadius} from "../src/Core/Constants.js";
import {LayerBaseRenderOrder} from "../src/Core/Constants.js";
import {LayerNetRenderOrder1} from "../src/Core/Constants.js";

class TileProvider{
    constructor(camera,scene,document,level,url,group,order,base){
        //每层设置一个组
        this.group = new Object3D();
        this.fatergroup = group
        //加入父级组
        this.fatergroup.add(this.group)
        //传入的场景
        this.scene = scene
        this.document = document
        this.camera = camera
        this.pic = new LoadTile(camera,scene,document,level,0,url)
        this.level = level
        this.radius = EarthRadius
        this.group.renderOrder = order
        this.group.isBase = base
        this.order = order
    }
    loadTile(lng,lat,r){
        let main = this.pic.main(lng,lat,this.level)
        return new Promise((resolve)=>{
            main.promise.then((resolve)=>{
                let result =  resolve
                let rc = LOD.createTileByImage(lng,lat,this.level,r)
                let tile
                let R = this.radius
                if(result[0]){
                tile = new Mesh(
                     new SphereBufferGeometry(R, 32, 32,rc.lngstart,rc.lngstep,rc.latstart,rc.latstep),
                     new MeshBasicMaterial({
                          map:result[0],
                          transparent:this.group.isBase?false:true
                     })
                 );
                tile.renderOrder = this.order
                this.group.add(tile)
                }
             })
                resolve(true)
           })
    }
    //删除掉当前图层所有元素
    deleteTile(){
        this.group.children = []
    }     
    //隐藏当前图层所有元素
    hideTile(){
        this.group.visible = false
    }
    //显示当前图层所有元素
    showTile(){
        this.group.visible = true
    }
    //释放内存
    deleteAll(){
        let keys = Object.keys(this)
        keys.forEach((item)=>{
            try{this[item].deleteAll()}
            catch{}
            item = null   
        })
        this.fatergroup.remove(this.group)
        for(let i=0;i<=this.group.children.length-1;i++){
            this.group.remove(this.group.children[i])
        }
    }
    //根据渲染顺序渲染图层元素
    renderByOrder(){
       
    }
}
    

export {TileProvider}



