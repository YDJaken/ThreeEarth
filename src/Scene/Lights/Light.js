import {Object3D} from "../../Core/Object3D.js";
import {Color} from "../../Datum/Math/Color.js";

/**
 * @author wangzhidong
 */

class Light extends Object3D {
    constructor(color, intensity) {
        super();
        this.type = 'Light';
        this.color = new Color(color);
        this.intensity = intensity !== undefined ? intensity : 1;
        this.receiveShadow = undefined;
        this.isLight = true;
    }

    copy(source) {
        Object3D.prototype.copy.call(this, source);
        this.color.copy(source.color);
        this.intensity = source.intensity;
        return this;
    }

    toJSON(meta) {
        let data = Object3D.prototype.toJSON.call(this, meta);
        data.object.color = this.color.getHex();
        data.object.intensity = this.intensity;
        if (this.groundColor !== undefined) data.object.groundColor = this.groundColor.getHex();
        if (this.distance !== undefined) data.object.distance = this.distance;
        if (this.angle !== undefined) data.object.angle = this.angle;
        if (this.decay !== undefined) data.object.decay = this.decay;
        if (this.penumbra !== undefined) data.object.penumbra = this.penumbra;
        if (this.shadow !== undefined) data.object.shadow = this.shadow.toJSON();
        return data;
    }
}

export {Light};
