
import {Coordinate} from "../Math/Coordinate.js";


class position {
    constructor(object){
        this.object = object;
    }
    flyTo (lon,lat,distance) {
        let coordinate = Coordinate.sphericalToCartesian(lon,lat,distance); //球面坐标转笛卡尔坐标
        this.object.position.set(coordinate.x,coordinate.y, coordinate.z);
        this.object.up.x = 0;
        this.object.up.y = 1;
        this.object.up.z = 0;
        this.object.lookAt({
            x : 0,
            y : 1,
            z : 0
        });
    }

   
}

export { position }