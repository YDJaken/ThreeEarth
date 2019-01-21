import {Camera} from "./Camera.js";
import {Object3D} from "../Core/Object3D.js";
import {_Math} from "../Datum/Math/Math.js";
import {EarthRadius} from "../Core/Constants.js";
import {TileUtil} from "../../tileService/tileutil.js"
import {Vector3} from "../Datum/Math/Vector3.js";

/**
 * @author wangzhidong
 * @modified WangSuJian 2018/07/11
 */

let numCountToRenderTiles = 0

class PerspectiveCamera extends Camera {
    constructor(fov, aspect, near, far) {
        super();
        this.type = 'PerspectiveCamera';
        this.fov = fov !== undefined ? fov : 50;
        this.zoom = 1;
        this.near = near !== undefined ? near : 0.1;
        this.far = far !== undefined ? far : 2000;
        this.focus = 10;
        this.aspect = aspect !== undefined ? aspect : 1;
        this.view = null;
        this.filmGauge = 35;	// width of the film (default in millimeters)
        this.filmOffset = 0;	// horizontal film offset (same unit as gauge)
        this.updateProjectionMatrix();
        this.isPerspectiveCamera = true;
        //距球面距离
        this.distance = 0
        this.f = 2
        this.calDistance()
    }
    calDistance(){
        let oldx = this.position.x
        let oldy = this.position.y
        let oldz = this.position.z
        let that = this
        Object.defineProperty(this.position,'x',{ 
            get: function () {   
                return oldx
            },
            set:  function(newvalue){
                if(newvalue!==oldx){
                //更新距离
                //控制更新频率    
                numCountToRenderTiles++
                if(numCountToRenderTiles%that.f==0){
                  that.distance = TileUtil.twoPointsDistance(that.position,new Vector3()) - EarthRadius 
                  oldx = newvalue
                  numCountToRenderTiles = 0
                }else{
                  oldx = newvalue
                }
        }
              
        }
      });
    //     Object.defineProperty(this.position,'y',{ 
    //         get: function () {   
    //             return oldy
    //         },
    //         set:  function(newvalue){
    //             if(newvalue!==oldy){
    //             //更新距离    
    //             numCountToRenderTiles++
    //             if(numCountToRenderTiles%that.f==0){
    //                 that.distance = TileUtil.twoPointsDistance(that.position,new Vector3()) - EarthRadius 
    //                 oldy = newvalue
    //                 numCountToRenderTiles = 0
    //             }else{
    //                 oldy = newvalue
    //             }
    //     }

    //     }
    //   });
    //     Object.defineProperty(this.position,'z',{ 
    //         get: function () {   
    //             return oldz
    //         },
    //         set:  function(newvalue){
    //             if(newvalue!==oldz){
    //             //更新距离    
    //             numCountToRenderTiles++
    //             if(numCountToRenderTiles%that.f==0){
    //                 that.distance = TileUtil.twoPointsDistance(that.position,new Vector3()) - EarthRadius 
    //                 oldz = newvalue
    //                 numCountToRenderTiles = 0
    //             }else{
    //                 oldz = newvalue
    //             }
    //     }
            
    //     }
    //   });
    }
    copy(source, recursive) {
        super.copy(source, recursive);
        this.fov = source.fov;
        this.zoom = source.zoom;
        this.near = source.near;
        this.far = source.far;
        this.focus = source.focus;
        this.aspect = source.aspect;
        this.view = source.view === null ? null : Object.assign({}, source.view);
        this.filmGauge = source.filmGauge;
        this.filmOffset = source.filmOffset;
        return this;
    }

    /**
     * Sets the FOV by focal length in respect to the current .filmGauge.
     *
     * The default film gauge is 35, so that the focal length can be specified for
     * a 35mm (full frame) camera.
     *
     * Values for focal length and film gauge must have the same unit.
     */
    setFocalLength(focalLength) {

        // see http://www.bobatkins.com/photography/technical/field_of_view.html
        let vExtentSlope = 0.5 * this.getFilmHeight() / focalLength;
        this.fov = _Math.RAD2DEG() * 2 * Math.atan(vExtentSlope);
        this.updateProjectionMatrix();
    }

    /**
     * Calculates the focal length from the current .fov and .filmGauge.
     */
    getFocalLength() {
        let vExtentSlope = Math.tan(_Math.DEG2RAD() * 0.5 * this.fov);
        return 0.5 * this.getFilmHeight() / vExtentSlope;
    }

    getEffectiveFOV() {
        return _Math.RAD2DEG() * 2 * Math.atan(
            Math.tan(_Math.DEG2RAD() * 0.5 * this.fov) / this.zoom);
    }

    getFilmWidth() {
        // film not completely covered in portrait format (aspect < 1)
        return this.filmGauge * Math.min(this.aspect, 1);
    }

    getFilmHeight() {
        // film not completely covered in landscape format (aspect > 1)
        return this.filmGauge / Math.max(this.aspect, 1);
    }

    /**
     * Sets an offset in a larger frustum. This is useful for multi-window or
     * multi-monitor/multi-machine setups.
     *
     * For example, if you have 3x2 monitors and each monitor is 1920x1080 and
     * the monitors are in grid like this
     *
     *   +---+---+---+
     *   | A | B | C |
     *   +---+---+---+
     *   | D | E | F |
     *   +---+---+---+
     *
     * then for each monitor you would call it like this
     *
     *   var w = 1920;
     *   var h = 1080;
     *   var fullWidth = w * 3;
     *   var fullHeight = h * 2;
     *
     *   --A--
     *   camera.setOffset( fullWidth, fullHeight, w * 0, h * 0, w, h );
     *   --B--
     *   camera.setOffset( fullWidth, fullHeight, w * 1, h * 0, w, h );
     *   --C--
     *   camera.setOffset( fullWidth, fullHeight, w * 2, h * 0, w, h );
     *   --D--
     *   camera.setOffset( fullWidth, fullHeight, w * 0, h * 1, w, h );
     *   --E--
     *   camera.setOffset( fullWidth, fullHeight, w * 1, h * 1, w, h );
     *   --F--
     *   camera.setOffset( fullWidth, fullHeight, w * 2, h * 1, w, h );
     *
     *   Note there is no reason monitors have to be the same size or in a grid.
     */
    setViewOffset(fullWidth, fullHeight, x, y, width, height) {
        this.aspect = fullWidth / fullHeight;
        if (this.view === null) {

            this.view = {
                enabled: true,
                fullWidth: 1,
                fullHeight: 1,
                offsetX: 0,
                offsetY: 0,
                width: 1,
                height: 1
            };
        }
        this.view.enabled = true;
        this.view.fullWidth = fullWidth;
        this.view.fullHeight = fullHeight;
        this.view.offsetX = x;
        this.view.offsetY = y;
        this.view.width = width;
        this.view.height = height;
        this.updateProjectionMatrix();
    }

    clearViewOffset() {
        if (this.view !== null) {
            this.view.enabled = false;
        }
        this.updateProjectionMatrix();
    }

    updateProjectionMatrix() {
        let near = this.near,
            top = near * Math.tan(
                _Math.DEG2RAD() * 0.5 * this.fov) / this.zoom,
            height = 2 * top,
            width = this.aspect * height,
            left = -0.5 * width,
            view = this.view;
        if (this.view !== null && this.view.enabled) {
            let fullWidth = view.fullWidth,
                fullHeight = view.fullHeight;
            left += view.offsetX * width / fullWidth;
            top -= view.offsetY * height / fullHeight;
            width *= view.width / fullWidth;
            height *= view.height / fullHeight;
        }
        let skew = this.filmOffset;
        if (skew !== 0) left += near * skew / this.getFilmWidth();
        this.projectionMatrix.makePerspective(left, left + width, top, top - height, near, this.far);
    }

    toJSON(meta) {
        let data = Object3D.prototype.toJSON.call(this, meta);
        data.object.fov = this.fov;
        data.object.zoom = this.zoom;
        data.object.near = this.near;
        data.object.far = this.far;
        data.object.focus = this.focus;
        data.object.aspect = this.aspect;
        if (this.view !== null) data.object.view = Object.assign({}, this.view);
        data.object.filmGauge = this.filmGauge;
        data.object.filmOffset = this.filmOffset;
        return data;
    }
}

export {PerspectiveCamera};
