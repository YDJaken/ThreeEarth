
/**
 * 
 * 瓦片缓存类
 * 
 */

class CacheTile{
   
    constructor(){
       this.container = {}
    }
    
    add(key,file={}){
      this.container[key] = file
    }
    get(key){
      return this.container[key]
    }
    find(key){
      this.container[key]?true:false
    }
    clear(key){
      if(this.get(key)){  
      delete this.container[key]
      }else{
         new Error("缓存中本不存在此值") 
      }
    }
}

export {CacheTile}