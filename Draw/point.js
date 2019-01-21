/*
* point
* */
import {baseGeometric} from "./basegeometric.js";
import {Coordinate} from "../Math/Coordinate.js";
import {Vector3} from "../src/Datum/Math/Vector3.js";
import {Geometry} from "../src/Core/Geometry.js";
import {PointsMaterial} from "../src/Materials/PointsMaterial.js";
import {Points} from "../src/Geometry/Points.js";
import {Color} from "../src/Datum/Math/Color.js";
import {BufferGeometry} from "../src/Core/BufferGeometry.js";

class CPonit extends baseGeometric {
    constructor(scene, obj) {
        super(scene, obj);
    }

    draw(lon, lat, r) {
        var position = Coordinate.sphericalToCartesian(lon, lat, r);
        var p1 = new Vector3(position.x, position.y, position.z);
        var geometry = new Geometry();
        geometry.vertices.push(p1);
        var material = new PointsMaterial({
            color: 'red'
        });//材质对象
        var point = new Points(geometry, material);//点模型对象
        this.id = point.id;
        this.scene.add(point);
    }
}

export {CPonit}