
/*
*
* @Created By YanKai
* suposed：图层的相关信息
*  attribute :name,type,id,scene
*  名字,类型，唯一标识,场景
* */
var innnerCurrentid=0;   //标识
    class  Layer {
        constructor(name, type,scene) {
            this.name = name;
            this.id = innnerCurrentid++;
            this.type = type;
            this.scene=scene;
        }

        RemoveLayer() {
            this.name = null;
            this.id = null;
            this.type = null;
            this.scene = null;
        }
    }
    export  {Layer}