/**
 * 经纬度长方形包裹区域
 * @Author DongYi
 */
import {Coordinate} from "./Coordinate.js";
import {Check} from "../Check/Check.js";
import {Ellipsoid} from "./Ellipsoid.js";

class Rectangle {
    /**
     * 用经纬度确定的长方形区域
     * @param west 最西边的经度点 取值弧度,范围[-PI,PI]
     * @param south 最南边的纬度点 取值弧度,范围[-PI/2,PI/2]
     * @param east 最东边的经度点 取值弧度,范围[-PI,PI]
     * @param north 最北边的纬度点 取值弧度,范围[-PI/2,PI/2]
     * @param degree 是否使用角度制
     */
    constructor(west = 0, south = 0, east = 0, north = 0, degree = false) {
        if (degree === true) {
            west = Coordinate.angleToRadian(west);
            south = Coordinate.angleToRadian(south);
            east = Coordinate.angleToRadian(east);
            north = Coordinate.angleToRadian(north);
        }
        this.west = west;
        this.south = south;
        this.east = east;
        this.north = north;
        this.width = Rectangle.computeWidth(this);
        this.height = Rectangle.computeHeight(this);
        this.packedLength = 4;
    }

    /**
     * 将一个长方形的数据放入数组
     * @param value
     * @param array
     * @param startingIndex
     * @return {*}
     */
    static pack(value, array = [], startingIndex = 0) {
        value = Check.object(value);
        if (Check.undefine(value) || Check.undefine(array)) return;
        array[startingIndex++] = value.west;
        array[startingIndex++] = value.south;
        array[startingIndex++] = value.east;
        array[startingIndex] = value.north;
        return array
    }

    /**
     * 从数组的数据导入一个长方形
     * @param array
     * @param startingIndex
     * @param result
     * @return {*}
     */
    static unpack(array, startingIndex = 0, result = new Rectangle()) {
        if (Check.undefine(array)) return;
        result.west = array[startingIndex++];
        result.south = array[startingIndex++];
        result.east = array[startingIndex++];
        result.north = array[startingIndex];
        return result;
    }

    /**
     * 计算某个长方形的宽
     * @param rectangle
     * @return {number}
     */
    static computeWidth(rectangle) {
        rectangle = Check.object(rectangle);
        if (Check.undefine(rectangle)) return;
        let east = rectangle.east;
        let west = rectangle.west;
        if (east < west) {
            east += Math.PI * 2;
        }
        return east - west;
    }

    /**
     * 计算某个长方形的高
     * @param rectangle
     * @return {number}
     */
    static computeHeight(rectangle) {
        rectangle = Check.object(rectangle);
        if (Check.undefine(rectangle)) return;
        return rectangle.north - rectangle.south;
    }

    /**
     * 将角度制的各个顶点放入长方形中
     * @param west
     * @param south
     * @param east
     * @param north
     * @param result
     * @return {Rectangle}
     */
    static fromDegrees(west = 0, south = 0, east = 0, north = 0, result = new Rectangle()) {
        west = Coordinate.angleToRadian(west);
        south = Coordinate.angleToRadian(south);
        east = Coordinate.angleToRadian(east);
        north = Coordinate.angleToRadian(north);
        result.west = west;
        result.south = south;
        result.east = east;
        result.north = north;
        return result;
    }

    /**
     * 将弧度制的各个顶点放入长方形中
     * @param west
     * @param south
     * @param east
     * @param north
     * @param result
     * @return {Rectangle}
     */
    static fromRadians(west = 0, south = 0, east = 0, north = 0, result = new Rectangle()) {
        result.west = west;
        result.south = south;
        result.east = east;
        result.north = north;
        return result;
    }

    /**
     * 从一连串的地理坐标中确定一个长方形
     * @param cartographics
     * @param result
     * @return {*}
     */
    static fromCartographicArray(cartographics, result = new Rectangle()) {
        if (Check.undefine(cartographics)) return;
        let west = Number.MAX_VALUE;
        let east = -Number.MAX_VALUE;
        let westOverIDL = Number.MAX_VALUE;
        let eastOverIDL = -Number.MAX_VALUE;
        let south = Number.MAX_VALUE;
        let north = -Number.MAX_VALUE;
        let PI = Math.PI;
        let TWO_PI = 2 * PI;

        for (let i = 0, len = cartographics.length; i < len; i++) {
            let position = cartographics[i];
            west = Math.min(west, position.longitude);
            east = Math.max(east, position.longitude);
            south = Math.min(south, position.latitude);
            north = Math.max(north, position.latitude);
            let lonAdjusted = position.longitude >= 0 ? position.longitude : position.longitude + TWO_PI;
            westOverIDL = Math.min(westOverIDL, lonAdjusted);
            eastOverIDL = Math.max(eastOverIDL, lonAdjusted);
        }
        if (east - west > eastOverIDL - westOverIDL) {
            west = westOverIDL;
            east = eastOverIDL;
            if (east > PI) {
                east = east - TWO_PI;
            }
            if (west > PI) {
                west = west - TWO_PI;
            }
        }
        result.west = west;
        result.south = south;
        result.east = east;
        result.north = north;
        return result;
    }

    /**
     * 复制当前长方形
     * @param rectangle
     * @param result
     * @return {*}
     */
    static clone(rectangle, result) {
        if (Check.undefine(rectangle)) {
            return undefined;
        }
        if (Check.undefine(result)) {
            return new Rectangle(rectangle.west, rectangle.south, rectangle.east, rectangle.north);
        }
        result.west = rectangle.west;
        result.south = rectangle.south;
        result.east = rectangle.east;
        result.north = rectangle.north;
        return result;
    }

    /**
     * 检查两个长方形是否在一个范围内相等
     * @param left 第一个长方形
     * @param right 第二个长方形
     * @param absoluteEpsilon 相对差值范围
     * @return {boolean}
     */
    static equalsEpsilon(left, right, absoluteEpsilon) {
        absoluteEpsilon = Check.number(absoluteEpsilon);
        if (Check.undefine(absoluteEpsilon) || Check.undefine(left) || Check.undefine(right)) return;
        return (left === right) || ((Math.abs(left.west - right.west) <= absoluteEpsilon) &&
            (Math.abs(left.south - right.south) <= absoluteEpsilon) &&
            (Math.abs(left.east - right.east) <= absoluteEpsilon) &&
            (Math.abs(left.north - right.north) <= absoluteEpsilon));
    }

    /**
     * 检查两个长方形是否相等
     * @param left 第一个长方形
     * @param right 第二个长方形
     * @return {boolean}
     */
    static equals(left, right) {
        if (Check.undefine(left) || Check.undefine(right)) return;
        return (left === right) || ((left.west === right.west) &&
            (left.south === right.south) &&
            (left.east === right.east) &&
            (left.north === right.north));
    }

    /**
     * 返回西南角经纬度 弧度制
     * @param rectangle
     * @return {{longitude: (*|number), latitude: (*|number), height: number}}
     */
    static southwest(rectangle) {
        rectangle = Check.object(rectangle);
        if (Check.undefine(rectangle)) return;
        return {
            longitude: rectangle.west,
            latitude: rectangle.south,
            height: 0
        };
    }

    /**
     * 返回西北角经纬度 弧度制
     * @param rectangle
     * @return {{longitude: (*|number), latitude: (*|number), height: number}}
     */
    static northwest(rectangle) {
        rectangle = Check.object(rectangle);
        if (Check.undefine(rectangle)) return;
        return {
            longitude: rectangle.west,
            latitude: rectangle.north,
            height: 0
        };
    }

    /**
     * 返回东北角经纬度 弧度制
     * @param rectangle
     * @return {{longitude: (*|number), latitude: (*|number), height: number}}
     */
    static northeast(rectangle) {
        rectangle = Check.object(rectangle);
        if (Check.undefine(rectangle)) return;
        return {
            longitude: rectangle.east,
            latitude: rectangle.north,
            height: 0
        };
    }

    /**
     * 返回东南角经纬度 弧度制
     * @param rectangle
     * @return {{longitude: (*|number), latitude: (*|number), height: number}}
     */
    static southeast(rectangle) {
        rectangle = Check.object(rectangle);
        if (Check.undefine(rectangle)) return;
        return {
            longitude: rectangle.east,
            latitude: rectangle.south,
            height: 0
        };
    }

    /**
     * 计算此长方形的中心点
     * @param rectangle
     * @param result
     * @return {{longitude: *, latitude: number, height: number}}
     */
    static center(rectangle, result) {
        rectangle = Check.object(rectangle);
        if (Check.undefine(rectangle)) return;
        let east = rectangle.east;
        let west = rectangle.west;
        if (east < west) {
            east += Math.PI * 2;
        }
        let longitude = Coordinate.negativePIToPI((west + east) * 0.5);
        let latitude = (rectangle.south + rectangle.north) * 0.5;
        return {
            longitude: longitude,
            latitude: latitude,
            height: 0
        };
    }

    /**
     * 检查两个长方形是否相交 并返回相交的长方形
     * @param rectangle
     * @param otherRectangle
     * @param result
     * @return {*}
     */
    static intersection(rectangle, otherRectangle, result = new Rectangle()) {
        rectangle = Check.object(rectangle);
        if (Check.undefine(rectangle)) return;
        otherRectangle = Check.object(otherRectangle);
        if (Check.undefine(otherRectangle)) return;
        let rectangleEast = rectangle.east;
        let rectangleWest = rectangle.west;
        let TWO_PI = Math.PI * 2;
        let otherRectangleEast = otherRectangle.east;
        let otherRectangleWest = otherRectangle.west;
        if (rectangleEast < rectangleWest && otherRectangleEast > 0) {
            rectangleEast += TWO_PI;
        } else if (otherRectangleEast < otherRectangleWest && rectangleEast > 0) {
            otherRectangleEast += TWO_PI;
        }
        if (rectangleEast < rectangleWest && otherRectangleWest < 0) {
            otherRectangleWest += TWO_PI;
        } else if (otherRectangleEast < otherRectangleWest && rectangleWest < 0) {
            rectangleWest += TWO_PI;
        }
        let west = Coordinate.negativePIToPI(Math.max(rectangleWest, otherRectangleWest));
        let east = Coordinate.negativePIToPI(Math.min(rectangleEast, otherRectangleEast));
        if ((rectangle.west < rectangle.east || otherRectangle.west < otherRectangle.east) && east <= west) {
            return undefined;
        }
        let south = Math.max(rectangle.south, otherRectangle.south);
        let north = Math.min(rectangle.north, otherRectangle.north);
        if (south >= north) {
            return undefined;
        }
        result.west = west;
        result.south = south;
        result.east = east;
        result.north = north;
        return result;
    }

    /**
     * 不考虑经纬度可能反应的角的多样性，适用于非经纬度坐标系的长方形
     * @param rectangle
     * @param otherRectangle
     * @param result
     * @return {*}
     */
    static simpleIntersection(rectangle, otherRectangle, result = new Rectangle()) {
        rectangle = Check.object(rectangle);
        if (Check.undefine(rectangle)) return;
        otherRectangle = Check.object(otherRectangle);
        if (Check.undefine(otherRectangle)) return;
        let west = Math.max(rectangle.west, otherRectangle.west);
        let south = Math.max(rectangle.south, otherRectangle.south);
        let east = Math.min(rectangle.east, otherRectangle.east);
        let north = Math.min(rectangle.north, otherRectangle.north);
        if (south >= north || west >= east) {
            return undefined;
        }
        result.west = west;
        result.south = south;
        result.east = east;
        result.north = north;
        return result;
    }

    /**
     * 合并两个长方形
     * @param rectangle
     * @param otherRectangle
     * @param result
     * @return {*}
     */
    static union(rectangle, otherRectangle, result = new Rectangle()) {
        rectangle = Check.object(rectangle);
        if (Check.undefine(rectangle)) return;
        otherRectangle = Check.object(otherRectangle);
        if (Check.undefine(otherRectangle)) return;
        let TWO_PI = Math.PI * 2;
        let rectangleEast = rectangle.east;
        let rectangleWest = rectangle.west;
        let otherRectangleEast = otherRectangle.east;
        let otherRectangleWest = otherRectangle.west;
        if (rectangleEast < rectangleWest && otherRectangleEast > 0) {
            rectangleEast += TWO_PI;
        } else if (otherRectangleEast < otherRectangleWest && rectangleEast > 0) {
            otherRectangleEast += TWO_PI;
        }
        if (rectangleEast < rectangleWest && otherRectangleWest < 0) {
            otherRectangleWest += TWO_PI;
        } else if (otherRectangleEast < otherRectangleWest && rectangleWest < 0) {
            rectangleWest += TWO_PI;
        }
        let west = Coordinate.convertLongitudeRange(Math.min(rectangleWest, otherRectangleWest));
        let east = Coordinate.convertLongitudeRange(Math.max(rectangleEast, otherRectangleEast));
        result.west = west;
        result.south = Math.min(rectangle.south, otherRectangle.south);
        result.east = east;
        result.north = Math.max(rectangle.north, otherRectangle.north);
        return result;
    }

    /**
     * 扩大一个长方形,使其可以容纳传入点
     * @param rectangle
     * @param cartographic
     * @param result
     * @return {*}
     */
    static expand(rectangle, cartographic, result = new Rectangle()) {
        rectangle = Check.object(rectangle);
        if (Check.undefine(rectangle)) return;
        cartographic = Check.object(cartographic);
        if (Check.undefine(cartographic)) return;
        result.west = Math.min(rectangle.west, cartographic.longitude);
        result.south = Math.min(rectangle.south, cartographic.latitude);
        result.east = Math.max(rectangle.east, cartographic.longitude);
        result.north = Math.max(rectangle.north, cartographic.latitude);
        return result;
    }

    /**
     * 判断一个点是否存在于此长方形
     * @param rectangle
     * @param cartographic
     * @return {boolean}
     */
    static contains(rectangle, cartographic) {
        rectangle = Check.object(rectangle);
        if (Check.undefine(rectangle)) return;
        cartographic = Check.object(cartographic);
        if (Check.undefine(cartographic)) return;
        let longitude = cartographic.longitude;
        let latitude = cartographic.latitude;
        let west = rectangle.west;
        let east = rectangle.east;
        if (east < west) {
            east += Math.PI * 2;
            if (longitude < 0.0) {
                longitude += Math.PI * 2;
            }
        }
        let EPSILON14 = 0.00000000000001;
        return (longitude > west || Math.abs(longitude - west) <= EPSILON14) &&
            (longitude < east || Math.abs(longitude - east) <= EPSILON14) &&
            latitude >= rectangle.south &&
            latitude <= rectangle.north;
    }

    /**
     * 将长方形成样为包围球可支持的笛卡尔点,在统计多少个长方形覆盖极点或者跨越赤道时需要取样。
     * @param rectangle
     * @param ellipsoid
     * @param surfaceHeight
     * @param result
     * @return {*}
     */
    static subsample(rectangle, ellipsoid = Ellipsoid.WGS84(), surfaceHeight = 0, result = []) {
        rectangle = Check.object(rectangle);
        if (Check.undefine(rectangle)) return;
        let length = 0;
        let north = rectangle.north;
        let south = rectangle.south;
        let east = rectangle.east;
        let west = rectangle.west;
        let lla = {
            longitude: 0,
            latitude: 0,
            height: 0
        };
        lla.height = surfaceHeight;
        lla.longitude = west;
        lla.latitude = north;
        result[length] = ellipsoid.cartographicToCartesian(lla.longitude, lla.latitude, lla.height, result[length]);
        length++;
        lla.longitude = east;
        result[length] = ellipsoid.cartographicToCartesian(lla.longitude, lla.latitude, lla.height, result[length]);
        length++;
        lla.latitude = south;
        result[length] = ellipsoid.cartographicToCartesian(lla.longitude, lla.latitude, lla.height, result[length]);
        length++;
        lla.longitude = west;
        result[length] = ellipsoid.cartographicToCartesian(lla.longitude, lla.latitude, lla.height, result[length]);
        length++;
        if (north < 0.0) {
            lla.latitude = north;
        } else if (south > 0.0) {
            lla.latitude = south;
        } else {
            lla.latitude = 0.0;
        }
        for (let i = 1; i < 8; ++i) {
            lla.longitude = -Math.PI + i * (Math.PI/2.0);
            if (Rectangle.contains(rectangle, lla)) {
                result[length] = ellipsoid.cartographicToCartesian(lla.longitude,lla.latitude,lla.height, result[length]);
                length++;
            }
        }
        if (lla.latitude === 0.0) {
            lla.longitude = west;
            result[length] = ellipsoid.cartographicToCartesian(lla.longitude,lla.latitude,lla.height, result[length]);
            length++;
            lla.longitude = east;
            result[length] = ellipsoid.cartographicToCartesian(lla.longitude,lla.latitude,lla.height, result[length]);
            length++;
        }
        result.length = length;
        return result;
    }
}

export {Rectangle}