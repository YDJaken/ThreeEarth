/**
 * @Author DongYi
 */

import {EarthRadius} from "../src/Core/Constants.js";
import {Check} from "../Check/Check.js";
import {Ellipsoid} from "./Ellipsoid.js";

 
/**
 * 默认配置
 * @type {{x: number, y: number, EPSG4326: number, CGCS2000: number, WGS84: number}}
 */
const projection = {
    x: EarthRadius,
    y: EarthRadius,

    EPSG4326: 6356752.3142451793,
    //EPSG4978: , 待实现
    CGCS2000: 6379101.1561,
    WGS84: 6356752.3142451793
};

class Coordinate {

    constructor(type = 'EPSG4326',option = {}) {
        this.type = type;

        option = Check.checkInput(option,projection);
        this.Ellipsoid = new Ellipsoid(option.x, option.y, option[type]);
    }



    /**
     * 转换到speed3D经纬度体系
     * @param longitude 经度
     * @param latitude 纬度
     * @param r
     */
    static speed3DConverter(longitude, latitude, r = EarthRadius) {
        return Coordinate._speed3DConverter(latitude, longitude, r);
    }

    static _speed3DConverter(latitude, longitude, r = EarthRadius) {
        r = Check.number(r, 'Speed3D.Coordinate.speed3DConverter:请输入一个有效半径数字');

        if (Check.undefine(r)) return;
        latitude = Check.number(latitude, 'Speed3D.Coordinate.speed3DConverter:请输入一个有效纬度');
        if (Check.undefine(latitude)) return;
        longitude = Check.number(longitude, 'Speed3D.Coordinate.speed3DConverter:请输入一个有效经度');
        if (Check.undefine(longitude)) return;

        if (-90 > latitude) latitude = -90;
        if (latitude > 90) latitude = 90;
        if (-180 >= longitude) longitude = -179.999;
        if (longitude > 180) longitude = 180;
        if (latitude <= 0) {
            latitude = 90 + Math.abs(latitude);
        }
        else if (latitude > 0) {
            latitude = 90 - latitude;
        }
        if (longitude < 0) {
            longitude = Math.abs(Math.PI + longitude);
        } else {
            longitude = longitude + 180;
        }
        return {
            latitude: Coordinate.angleToRadian(latitude),
            longitude: Coordinate.angleToRadian(longitude)
        }
    }

    /**
     * 转换球面坐标到平面坐标
     * @param r 球的半径 默认 6371393
     * @param latitude θ 纬度 输入[-π/2,π/2] 取值 [0,π] 输入角度制
     * @param longitude φ 经度 输入 [-π,π] 取值 (0 ,2π ]
     */
    static sphericalToCartesian(longitude, latitude, r = EarthRadius) {
        return Coordinate._sphericalToCartesian(latitude, longitude, r);
    }

    static _sphericalToCartesian(latitude, longitude, r = EarthRadius) {
        r = Check.number(r, 'Speed3D.Coordinate.sphericalToCartesian:请输入一个有效半径数字');

        if (Check.undefine(r)) return;
        latitude = Check.number(latitude, 'Speed3D.Coordinate.sphericalToCartesian:请输入一个有效纬度');
        if (Check.undefine(latitude)) return;
        longitude = Check.number(longitude, 'Speed3D.Coordinate.sphericalToCartesian:请输入一个有效经度');
        if (Check.undefine(longitude)) return;

        if (r <= 0) {
            r = 0;
        }
        let pi = Math.PI;
        latitude = Coordinate.angleToRadian(latitude);
        if (-pi / 2 > latitude) latitude = -pi / 2;
        if (latitude > pi / 2) latitude = pi / 2;
        if (-180 >= longitude) longitude = -179.999;
        if (longitude > 180) longitude = 180;
        longitude = Coordinate.angleToRadian(longitude);
        return {
            x: -r * (Math.cos(latitude) * Math.sin(pi / 2) - Math.cos(pi / 2) * Math.sin(latitude)) * (Math.cos(longitude) * Math.cos(pi) - Math.sin(pi) * Math.sin(longitude)),
            z: r * (Math.cos(latitude) * Math.sin(pi / 2) - Math.cos(pi / 2) * Math.sin(latitude)) * (Math.cos(longitude) * Math.sin(pi) + Math.cos(pi) * Math.sin(longitude)),
            y: r * (Math.cos(latitude) * Math.cos(pi / 2) + Math.sin(pi / 2) * Math.sin(latitude))
        }
    }

    /**
     * 平面坐标转换球面坐标
     * 返回角度
     * @param x
     * @param y
     * @param z
     * @constructor
     */
    static cartesianToSpherical(x, y, z) {
        x = Check.number(x, 'Speed3D.Coordinate.cartesianToSpherical:请输入一个有效x坐标');

        if (Check.undefine(x)) return;
        y = Check.number(y, 'Speed3D.Coordinate.cartesianToSpherical:请输入一个有效y坐标');
        if (Check.undefine(y)) return;
        z = Check.number(z, 'Speed3D.Coordinate.cartesianToSpherical:请输入一个有效z坐标');
        if (Check.undefine(z)) return;

        let long = Coordinate.radianToAngle(-Math.atan2(z, x));
        let r = Math.sqrt(x * x + y * y + z * z);
        return {
            r: r,
            latitude: 90 - Coordinate.radianToAngle(Math.acos(y / r)),
            longitude: long
        }
    }

    /**
     * 经纬度转墨卡托
     * @param latitude 维度 [-85.05112877980659，85.05112877980659]
     * @param longitude 经度 (-180,180]
     * @param r 地球半径 默认 6371393

     * @return {x,y}

     */
    static spherToMercator(longitude, latitude, r = EarthRadius) {
        return Coordinate._spherToMercator(latitude, longitude, r);
    }

    static _spherToMercator(latitude, longitude, r = EarthRadius) {
        latitude = Check.number(latitude, 'Speed3D.Coordinate.spherToMercator:请输入一个有效纬度');

        if (Check.undefine(latitude)) return;
        longitude = Check.number(longitude, 'Speed3D.Coordinate.spherToMercator:请输入一个有效经度');
        if (Check.undefine(longitude)) return;

        if (-180 > longitude) longitude = -179.999;
        if (longitude > 180) longitude = 180;
        if (-85.05112877980659 > latitude) latitude = -85.05112877980659;
        if (latitude > 85.05112877980659) latitude = 85.05112877980659;
        let sin = Math.sin(Coordinate.angleToRadian(latitude));
        return {
            x: longitude * 20037508.3427892 / 180,
            y: r * Math.log((1 + sin) / (1 - sin)) / 2
        }
    }


    /**
     * 椭球体墨卡托投影
     * @param longitude
     * @param latitude
     * @param r
     * @return {{x: number, y: number, z: number}}
     */
    ellipsoidMercatorProjection(longitude, latitude, r) {
        if (Check.undefine(r)) r = this.Ellipsoid._maxRadius;
        latitude = Check.number(latitude, 'Speed3D.Coordinate.ellipsoidMercatorProjection:请输入一个有效纬度');
        if (Check.undefine(latitude)) return;
        longitude = Check.number(longitude, 'Speed3D.Coordinate.ellipsoidMercatorProjection:请输入一个有效经度');
        if (Check.undefine(longitude)) return;

        longitude = Coordinate.angleToRadian(longitude);
        latitude = Coordinate.angleToRadian(latitude);
        let x = longitude * r;
        let y = Coordinate.MercatorLatitude(latitude) * r;
        let z = r-EarthRadius;
        return {x: x, y: y, z: z};
    }

    static MercatorAngleToGeodeticLatitude(mercatorAngle) {

        mercatorAngle = Check.number(mercatorAngle, 'Speed3D.Coordinate.MercatorLatitude:请输入一个有效弧度角');
        if (Check.undefine(mercatorAngle)) return;

        return (Math.PI / 2.0) - (2.0 * Math.atan(Math.exp(-mercatorAngle)));
    }

    static MercatorLatitude(latitude) {

        latitude = Check.number(latitude, 'Speed3D.Coordinate.MercatorLatitude:请输入一个有效纬度');
        if (Check.undefine(latitude)) return;

        let max = Coordinate.MercatorAngleToGeodeticLatitude(Math.PI);
        if (latitude > max) {
            latitude = max;
        } else if (latitude < -max) {
            latitude = -max;
        }
        let sinLatitude = Math.sin(latitude);
        return 0.5 * Math.log((1.0 + sinLatitude) / (1.0 - sinLatitude));
    }


    /**
     * 椭球体墨卡托反投影
     * @param x
     * @param y
     * @param z
     * @return {{longitude: (*|number), latitude: *, height: number}}
     */
     ellipsoidMercatorUnprojection(x,y,z = EarthRadius){
        x = Check.number(x, 'Speed3D.Coordinate.ellipsoidMercatorUnprojection:请输入一个有效x坐标');
        if (Check.undefine(x)) return;
        y = Check.number(y, 'Speed3D.Coordinate.ellipsoidMercatorUnprojection:请输入一个有效y坐标');
        if (Check.undefine(y)) return;

        let oneOverEarthSemimajorAxis = 1.0/this.Ellipsoid._maxRadius;
        let longitude = x * oneOverEarthSemimajorAxis;
        let latitude = Coordinate.MercatorAngleToGeodeticLatitude(y * oneOverEarthSemimajorAxis);
        longitude = Coordinate.radianToAngle(longitude);
        latitude = Coordinate.radianToAngle(latitude);
        return {
            longitude: longitude,
            latitude: latitude,
            height:z
        };
    }
    /**
     * 墨卡托转经纬度
     * @param x 轴   [-20037508.3427892,20037508.3427892]
     * @param y 轴 [-20037508.3427892,20037508.3427892]
     * @param r 地球半径 默认 6371393
     * @return longitude,latitude
     */
    static mercatorToSpher(x, y, r = EarthRadius) {
        x = Check.number(x, 'Speed3D.Coordinate.mercatorToCartesian:请输入一个有效x坐标');

        if (Check.undefine(x)) return;
        y = Check.number(y, 'Speed3D.Coordinate.mercatorToCartesian:请输入一个有效y坐标');
        if (Check.undefine(y)) return;

        if (-20037508.3427892 > x) x = -20037508.3427892;
        if (x > 20037508.3427892) x = 20037508.3427892;
        if (-20037508.3427892 > y) y = -20037508.3427892;
        if (y > 20037508.3427892) y = 20037508.3427892;
        return {
            longitude: x / 20037508.3427892 * 180,
            latitude: (2 * Math.atan(Math.exp(y / r)) - (Math.PI / 2)) * 180/Math.PI
        }
    }

    /**
     * 角度转弧度
     * @param angle
     */
    static angleToRadian(angle) {
        angle = Check.number(angle, 'Speed3D.Coordinate.angleToRadian:请输入一个有效角度数字');

        if (Check.undefine(angle)) return;

        return angle * Math.PI / 180;
    }

    /**
     * 弧度转角度
     * @param radian
     */
    static radianToAngle(radian) {
        radian = Check.number(radian, `Speed3D.Coordinate.radianToAngle:请输入一个有效弧度数字,π=${Math.PI}`);

        if(Check.undefine(radian)) return;
        return radian * 180 / Math.PI;
    }

    /**
     * 在[0,2PI]内找出一个和输入x相同的角
     * @param x
     * @return {number}
     */
    static zeroToTwoPi(x) {
        if(Check.undefine(x)) return;
        let TWO_PI = Math.PI*2;
        let value = x % TWO_PI;
        return (value < 0.0) ? (value + TWO_PI) % TWO_PI : value;
    }
    /**
     * 在[-PI,PI]内找出一个和输入x相同的角
     * @param x
     * @return {number}
     */
    static negativePIToPI(x) {
        if(Check.undefine(x)) return;
        let epsilon10 = 0.0000000001;
        let pi = Math.PI;
        let two_pi = pi * 2;
        while (x < -(pi + epsilon10)) {
            x += two_pi;
        }
        if (x < -pi) {
            return -pi;
        }
        while (x > pi + epsilon10) {
            x -= two_pi;
        }
        return x > pi ? pi : x;
    }

    /**
     * 转换经度使其满足[-PI,PI]
     * @param angle
     * @return {number}
     */
    static convertLongitudeRange(angle) {
        if (Check.undefine(angle)) return;
        let twoPi = Math.PI * 2;
        let simplified = angle - Math.floor(angle / twoPi) * twoPi;
        if (simplified < -Math.PI) {
            return simplified + twoPi;
        }
        if (simplified >= Math.PI) {
            return simplified - twoPi;
        }
        return simplified;
    }
}

export {Coordinate}