import { Light } from "./Light.js";

/**
 * @author wangzhidong
 */
class AmbientLight extends Light{
	constructor(color,intensity){
		super(color,intensity);
        this.type = 'AmbientLight';
        this.castShadow = undefined;
        this.isAmbientLight = true
	}
}

export { AmbientLight };
