/**
 * KD-Tree 可以以点的形式存储信息,加速搜索速度 但是创建后无法修改
 * @Author DongYi
 */
//let Support = require('./Support.js');

import {Support} from "./Support.js";

class KDBush {
    constructor(points, getX, getY, nodeSize, ArrayType) {
        getX = getX || KDBush.defaultGetX;
        getY = getY || KDBush.defaultGetY;
        ArrayType = ArrayType || Array;
        this.nodeSize = nodeSize || 64;
        this.points = points;
        this.ids = new ArrayType(points.length);
        this.coords = new ArrayType(points.length * 2);
        for (var i = 0; i < points.length; i++) {
            this.ids[i] = i;
            this.coords[2 * i] = getX(points[i]);
            this.coords[2 * i + 1] = getY(points[i]);
        }
        Support.sortKD(this.ids, this.coords, this.nodeSize, 0, this.ids.length - 1, 0);
    }

    range(minX, minY, maxX, maxY) {
        return Support.range(this.ids, this.coords, minX, minY, maxX, maxY, this.nodeSize);
    }

    within(x, y, r) {
        return Support.within(this.ids, this.coords, x, y, r, this.nodeSize);
    }

    static defaultGetX(p) {
        return p[0];
    }

    static defaultGetY(p) {
        return p[1];
    }
}

/*function kdbush(points, getX, getY, nodeSize, ArrayType) {
    return new KDBush(points, getX, getY, nodeSize, ArrayType);
}

module.exports = kdbush;*/

export {KDBush}
