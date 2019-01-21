/**
 * 屏幕拾取类
 * @Author DongYi
 */
import {Raycaster} from "../src/Core/Raycaster.js";
import {Vector2} from "../src/Datum/Math/Vector2.js";
import {Check} from "../Check/Check.js";
import {TinyQueue} from "../DataStructure/priorityQueue/TinyQueue.js";

class Picker {

    constructor() {
        this.raycaster = new Raycaster();
        this.reactObject = [];
    }

    findIntersection(event) {
        let mouse = new Vector2();
        mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
        this.raycaster.setFromCamera(mouse, window.top.Speed3D.camera);
        return this.raycaster.intersectObjects(this.reactObject);
    }

    /**
     * 利用二分查找查询现有array
     * @param arr
     * @param id
     * @return {number}
     * @private
     */
    static _binarySearch(arr, id) {
        let low = 0;
        let heigh = arr.length - 1;
        if (low === heigh) {
            return arr[low].id === id ? low : -1;
        }
        while (low <= heigh) {
            let m = Math.floor((low + heigh) / 2);
            if (arr[m].id < id) {
                low = m + 1;
            } else if (arr[m].id > id) {
                heigh = m - 1;
            } else {
                return m;
            }
        }

        return -1;
    }

    /**
     *  利用优先队列排序
     * @param arr
     * @return {Array}
     * @private
     */
    static _sort(arr) {
        return new TinyQueue(arr, function (c, d) {
            let a, b;
            if (c === undefined) {
                a = c;
            } else {
                a = c.id;
            }
            if (d === undefined) {
                b = d;
            } else {
                b = d.id;
            }
            return a < b ? -1 : a > b ? 1 : 0;
        }).data;
    }

    /**
     * 添加一个3D物体
     * @param obj
     */
    addObject(obj) {
        obj = Check.object(obj);
        if (obj === undefined) return;
        if (obj.isObject3D === undefined || obj.isObject3D === false) {
            return;
        }
        if (Picker._binarySearch(this.reactObject, obj.id) !== -1) {
            return;
        }
        this.reactObject.push(obj);
        if (this.reactObject.length > 5)
            this.reactObject = Picker._sort(this.reactObject)
    }


    /**
     * 添加一个3D物体数组
     * @param arr
     */
    addObjects(arr) {
        for (let i = 0; i < arr.length; i++) {
            this.addObject(arr[i]);
        }
    }

    /**
     * 删除一个3D物体
     * @param obj
     */
    removeObject(obj) {
        obj = Check.object(obj);
        if (obj === undefined) return;
        let index = Picker._binarySearch(this.reactObject, obj.id);
        if (index === -1) {
            return;
        }
        if (index === 0) {
            this.reactObject.shift();
            return;
        }
        if (index === this.reactObject.length - 1) {
            this.reactObject.pop();
            return;
        }
        let a = this.reactObject.splice(index + 1);
        this.reactObject = this.reactObject.splice(0, index);
        this.reactObject.push(...a);
    }

    /**
     * 删除一个3D物体数组
     * @param arr
     */
    removeObjects(arr) {
        for (let i = 0; i < arr.length; i++) {
            this.removeObject(arr[i]);
        }
    }

    /**
     * 删除所有的3D物体
     */
    removeAll() {
        this.reactObject = [];
    }
}

export {Picker}