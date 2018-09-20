import {Vector3} from "../src/Datum/Math/Vector3.js";
import {Coordinate} from "./Coordinate.js";
import {Check} from "../Check/Check.js";

/**
 * @Author DongYi
 */

class Ellipsoid {
    /**
     * EPSG:4326 椭球体常量
     * @param x
     * @param y
     * @param z
     * @constructor
     */
    constructor(x, y, z) {
        x = Check.number(x,'Speed3D.Ellipsoid:传入x不为数字');
        if(Check.undefine(x)) return;
        y = Check.number(y,'Speed3D.Ellipsoid:传入y不为数字');
        if(Check.undefine(y)) return;
        z = Check.number(z,'Speed3D.Ellipsoid:传入z不为数字');
        if(Check.undefine(z)) return;
        this.rayon_1 = x;
        this.rayon_2 = y;
        this.rayon_3 = z;
        this.size = new Vector3(x, y, z);
        this._radiiSquared = new Vector3(x * x, y * y, z * z);
        this._oneOverRadiiSquared = new Vector3(x === 0.0 ? 0.0 : 1.0 / (x * x),
            y === 0.0 ? 0.0 : 1.0 / (y * y),
            z === 0.0 ? 0.0 : 1.0 / (z * z));
        this._maxRadius = Math.max(x,y,z);
        this._minRadius = Math.min(x,y,z);
    }

    geodeticSurfaceNormal(x, y, z) {
        let result = new Vector3(
            x * this._oneOverRadiiSquared.x,
            y * this._oneOverRadiiSquared.y,
            z * this._oneOverRadiiSquared.z);
        return result.normalize();
    }

    static geodeticSurfaceNormalCartographic(longitude, latitude) {
        latitude = Check.number(latitude, 'Speed3D.Ellipsoid.geodeticSurfaceNormalCartographic:请输入一个有效纬度');
        if (Check.undefine(latitude)) return;
        longitude = Check.number(longitude, 'Speed3D.Ellipsoid.geodeticSurfaceNormalCartographic:请输入一个有效经度');
        if (Check.undefine(longitude)) return;
        longitude = Coordinate.angleToRadian(longitude);
        latitude = Coordinate.angleToRadian(latitude);
        let cosLatitude = Math.cos(latitude);
        return {
            x: cosLatitude * Math.cos(longitude),
            z: -cosLatitude * Math.sin(longitude),
            y: Math.sin(latitude)
        }
    }

    setSize(x, y, z) {
        this.rayon_1 = x;
        this.rayon_2 = y;
        this.rayon_3 = z;
        this._radiiSquared = new Vector3(x * x, y * y, z * z);
    }

    cartographicToCartesian(longitude, latitude, altitude, target = new Vector3()) {
        let n = this.computeGeodesicNormal(longitude, latitude);
        if (!(n instanceof Vector3)) {
            n = new Vector3(n.x, n.y, n.z);
        }
        target.multiplyVectors(this._radiiSquared, n);
        let gamma = Math.sqrt(n.dot(target));
        target.divideScalar(gamma);
        n.multiplyScalar(altitude);
        return target.add(n);
    }

    computeGeodesicNormal(longitude, latitude) {
        if (this.rayon_3 === 6356752.3142451793) {
            return Ellipsoid.geodeticSurfaceNormalCartographic(longitude, latitude);
        }
        if (this.rayon_3 === 'EPSG4978') {
            return this.geodeticSurfaceNormal(this.rayon_1, this.rayon_2, this.rayon_3);
        }
        return new Vector3(0, 0, 1);
    }

    /**
     * Convert cartesian coordinates to geographic according to the current ellipsoid of revolution
     * @param {number} x
     * @param {number} y
     * @param {number} z
     * @returns {*} an object describing the coordinates on the reference ellipsoid, angles are in degree
     */
    cartesianToCartographic(x, y, z) {
        let position = {x: x, y: y, z: z};
        let R = Math.sqrt(position.x * position.x + position.y * position.y + position.z * position.z);
        let a = this.rayon_1;
        let b = this.rayon_3;
        let e = Math.abs((a * a - b * b) / (a * a));
        let f = 1 - Math.sqrt(1 - e);
        let rsqXY = Math.sqrt(position.x * position.x + position.y * position.y);

        let theta = -Math.atan2(position.y, position.x);
        let nu = Math.atan(position.z / rsqXY * ((1 - f) + e * a / R));

        let sinu = Math.sin(nu);
        let cosu = Math.cos(nu);

        let phi = Math.atan((position.z * (1 - f) + e * a * sinu * sinu * sinu) / ((1 - f) * (rsqXY - e * a * cosu * cosu * cosu)));

        let h = (rsqXY * Math.cos(phi)) + position.z * Math.sin(phi) - a * Math.sqrt(1 - e * Math.sin(phi) * Math.sin(phi));

        return {
            projection: 'EPSG4978',
            longitude: Coordinate.radianToAngle(theta),
            latitude: Coordinate.radianToAngle(phi),
            altitude: h
        };
    }

    cartographicToCartesianArray(coordCartoArray) {
        let cartesianArray = [];
        for (let i = 0; i < coordCartoArray.length; i++) {
            cartesianArray.push(this.cartographicToCartesian(coordCartoArray[i].longitude, coordCartoArray[i].latitude));
        }
        return cartesianArray;
    }

    intersection(ray) {
        let EPSILON = 0.0001;
        let O_C = ray.origin;
        let dir = ray.direction;
        let a = ((dir.x * dir.x) / (this.size.x * this.size.x)) + ((dir.y * dir.y) / (this.size.y * this.size.y)) + ((dir.z * dir.z) / (this.size.z * this.size.z));
        let b = ((2 * O_C.x * dir.x) / (this.size.x * this.size.x)) + ((2 * O_C.y * dir.y) / (this.size.y * this.size.y)) + ((2 * O_C.z * dir.z) / (this.size.z * this.size.z));
        let c = ((O_C.x * O_C.x) / (this.size.x * this.size.x)) + ((O_C.y * O_C.y) / (this.size.y * this.size.y)) + ((O_C.z * O_C.z) / (this.size.z * this.size.z)) - 1;
        let d = ((b * b) - (4 * a * c));
        if (d < 0 || a === 0 || b === 0 || c === 0) {
            return false;
        }
        d = Math.sqrt(d);
        let t1 = (-b + d) / (2 * a);
        let t2 = (-b - d) / (2 * a);
        if (t1 <= EPSILON && t2 <= EPSILON) return false;
        let t = 0;
        if (t1 <= EPSILON) {
            t = t2;
        }
        else if (t2 <= EPSILON) {
            t = t1;
        }
        else {
            t = (t1 < t2) ? t1 : t2;
        }
        if (t < EPSILON) return false; // Too close to intersection
        let inter = new Vector3();
        inter.addVectors(ray.origin, dir.clone().setLength(t));
        return inter;
    }

    computeDistance(longitude1, latitude1, longitude2, latitude2) {
        longitude1 = Coordinate.angleToRadian(longitude1);
        latitude1 = Coordinate.angleToRadian(latitude1);
        longitude2 = Coordinate.angleToRadian(longitude2);
        latitude2 = Coordinate.angleToRadian(latitude2);
        let distRad = Math.acos(Math.sin(latitude1) * Math.sin(latitude2) + Math.cos(latitude1) * Math.cos(latitude2) * Math.cos(longitude2 - longitude1));
        let a = this.rayon_1;
        let b = this.rayon_3;
        let e = Math.sqrt((a * a - b * b) / (a * a));
        let latMoy = (latitude1 + latitude2) / 2;
        let rho = (a * (1 - e * e)) / Math.sqrt(1 - e * e * Math.sin(latMoy) * Math.sin(latMoy));
        let N = a / Math.sqrt(1 - e * e * Math.sin(latMoy) * Math.sin(latMoy));
        return distRad * Math.sqrt(rho * N);
    }

    static WGS84(){
        return new Ellipsoid(6378137,6378137,6356752.3142451793)
    }
}


export {Ellipsoid};

