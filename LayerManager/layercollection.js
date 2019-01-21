
/*
*
* @Created By YanKai
* suposed：图层的管理(增加、删除、移动)
* */
// import  {Layers} from "../src/Core/Layers";

import  {Layer} from "./layer.js";

// var innnerCurrentid=0;
var AllLayers=[];
class LayerCollection {
    constructor(){

    }

    /*
    * 添加图层
    * */
   static AddLayer(layer){
            AllLayers.push(layer);
    }
    /*
    * 删除指定标识的图层
    * */
    static DeleteLayerById(id){
        for(let i=0;i<AllLayers.length;i++){
            var tmpid=AllLayers[i].id;
            if(id===tmpid){
                AllLayers.splice(i,1);
                return;
            }
        }
    }
    /*
    * 删除所有图层
    * */
    static DeleteAllLayer(){
        var layer=new Layer();
        for(let i=0;i<AllLayers.length;i++){
            layer=AllLayers[i];
            layer.RemoveLayer();
        }
        AllLayers=[];
    }
    /*
    * 图层组中是否包含指定图层
    * */
    static Contains(layer){
        // if(layer instanceof  Layer){
            return AllLayers.indexOf(layer);
        // }
    }

    /*
    * 图层的索引
    *
    * */
    static GetLayerIndex(layer){
        if(!layer instanceof  Layer){
            return;
        }
        if (!defined(layer)) {
            throw new DeveloperError('layer is required.');
        }
        let index=AllLayers.indexOf(layer);
        if (index === -1) {
            throw new DeveloperError('layer is not in this collection.');
        }
        return index;
    }
    /*
   * 根据id获取图层的名字
   *
   * */
    // GetlayerNameById(id)
    /*
    * 将图层置顶
    * */
    static RaiseLayertoTop(layer){
        if(!layer instanceof  Layer){
            return ;
        }
        let  index=this.GetLayerIndex(layer);
        if(index===AllLayers.length-1){
            return;
        }
        AllLayers.splice(index,1);
        AllLayers.push(layer);

    }
    /*
    * 将图层置尾
    * */
    static LowerLayertoBottom(layer){
        if(!layer instanceof  Layer){
            return ;
        }
        let  index=this.GetLayerIndex(layer);
        if(index===0){
            return;
        }
        AllLayers.splice(index,1);
        AllLayers.splice(0,0,layer);
    }
    /*
    根据Id获取图层
    * */
    static GetLayerById(id){
         for(let i=0;i<AllLayers.length;i++){
             let layer=AllLayers[i];
             if(id===layer.id){
                 return layer.scene;
             }
             // else {
             //     throw new DeveloperError('layer is not found in this layers.');
             // }
         }
    }
    /*
    * 根据名字查询图层
    * */
        static GetLayerByName(name){
            for(let i=0;i<AllLayers.length;i++){
                var layer=AllLayers[i];
                if(name===layer.name){
                    return layer.scene;
                }
            }
        }


    /*
    * 设定某个索引下的图层可见
    * */

    static SetIndexLayerVisible(id,visible){

        for(let i=0;i<AllLayers.length;i++){
            let tmpid=AllLayers[i].id;
            if(tmpid===id){
                AllLayers[i].scene.visible=visible;
                return;
            }
        }

    }
    /*
    * 获取所有图层
    * */
    static GetAllLayers(){
        return AllLayers;
    }


}

export  {LayerCollection}


