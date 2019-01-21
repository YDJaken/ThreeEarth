/**
 * @author wangzhidong
 * @modified DongYi 2018/06/27
 */

/*import { BackSide } from "../../Core/Constants";
import { OrthographicCamera } from "../../Camera/OrthographicCamera";
import { BoxBufferGeometry } from '../../geometries/BoxGeometry.js';
import { PlaneBufferGeometry } from '../../geometries/PlaneGeometry.js';
import { MeshBasicMaterial } from '../../materials/MeshBasicMaterial.js';
import { ShaderMaterial } from '../../materials/ShaderMaterial.js';
import { Color } from "../../Datum/Math/Color";
import { Mesh } from '../../objects/Mesh.js';
import { ShaderLib } from '../shaders/ShaderLib.js';*/

import {BackSide} from "../../Core/Constants.js";
import {OrthographicCamera} from "../../Camera/OrthographicCamera.js";
import {BoxBufferGeometry} from "../../Geometries/BoxGeometry.js";
import {PlaneBufferGeometry} from '../../Geometries/PlaneGeometry.js';
import {MeshBasicMaterial} from '../../Materials/MeshBasicMaterial.js';
import {ShaderMaterial} from '../../Materials/ShaderMaterial.js';
import {Color} from "../../Datum/Math/Color.js";
import {Mesh} from "../../Geometry/Mesh.js";
import {ShaderLib} from '../Shaders/ShaderLib.js';

class WebGLBackground {

    constructor(renderer, state, objects, premultipliedAlpha) {
        this.clearColor = new Color(0x000000);
        this.clearAlpha = 0;
        this.renderer = renderer;
        this.state = state;
        this.objects = objects;
        this.premultipliedAlpha = premultipliedAlpha;
    }

    render(renderList, scene, camera, forceClear) {
        let background = scene.background;
        if (background === null) {
            this.setClear(this.clearColor, this.clearAlpha);
        } else if (background && background.isColor) {
            this.setClear(background, 1);
            forceClear = true;
        }
        if (this.renderer.autoClear || forceClear) {
            this.renderer.clear(this.renderer.autoClearColor, this.renderer.autoClearDepth, this.renderer.autoClearStencil);
        }
        if (background && background.isCubeTexture) {
            //boxMesh可能未正确定义
            if (this.boxMesh === undefined) {
                this.boxMesh = new Mesh(
                    new BoxBufferGeometry(1, 1, 1),
                    new ShaderMaterial({
                        uniforms: ShaderLib.cube.uniforms,
                        vertexShader: ShaderLib.cube.vertexShader,
                        fragmentShader: ShaderLib.cube.fragmentShader,
                        side: BackSide,
                        depthTest: true,
                        depthWrite: false,
                        fog: false
                    })
                );
                this.boxMesh.geometry.removeAttribute('normal');
                this.boxMesh.geometry.removeAttribute('uv');
                this.boxMesh.onBeforeRender = (renderer, scene, camera) => {
                    //matrixWorld可能未正确定义
                    this.matrixWorld.copyPosition(camera.matrixWorld);
                };
                this.objects.update(boxMesh);
            }
            this.boxMesh.material.uniforms.tCube.value = background;
            renderList.push(boxMesh, boxMesh.geometry, boxMesh.material, 0, null);
        } else if (background && background.isTexture) {
            //planeCamera,planeMesh可能未正确定义
            if (planeCamera === undefined) {
                planeCamera = new OrthographicCamera(-1, 1, 1, -1, 0, 1);
                planeMesh = new Mesh(
                    new PlaneBufferGeometry(2, 2),
                    new MeshBasicMaterial({depthTest: false, depthWrite: false, fog: false})
                );
                this.objects.update(planeMesh);
            }
            planeMesh.material.map = background;
            // TODO Push this to renderList
            this.renderer.renderBufferDirect(planeCamera, null, planeMesh.geometry, planeMesh.material, planeMesh, null);
        }
    }

    setClear(color, alpha) {
        this.state.buffers.color.setClear(color.r, color.g, color.b, alpha, this.premultipliedAlpha);
    }

    getClearColor() {
        return this.clearColor;
    }

    setClearColor(color, alpha) {
        this.clearColor.set(color);
        this.clearAlpha = alpha !== undefined ? alpha : 1;
        this.setClear(this.clearColor, this.clearAlpha);
    }

    getClearAlpha() {
        return this.clearAlpha;
    }

    setClearAlpha(alpha) {
        this.clearAlpha = alpha;
        this.setClear(this.clearColor, this.clearAlpha);
    }
}

export {WebGLBackground};