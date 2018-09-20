import {Raycaster} from "../Core/Raycaster.js";

/**
 * @Author DongYi
 * 碰撞检测模块
 * 依赖collidableMeshList(用于存储全局内需要进行碰撞检测的物体)
 * 如果被检测物内包含检测物或者反之，检测会失效。
 */
class collisionDetection {
    static collisionDetection(target) {
        if (!window.top.Speed3D) {
            alert('Speed3D引擎未启动');
        }
        if(!target){
            return ;
        }
        if(!Speed3D.collidableMeshList||Speed3D.collidableMeshList.length<=0){
            return ;
        }
        let originPoint = target.position.clone();
        for (let vertexIndex = 0; vertexIndex < target.geometry.vertices.length; vertexIndex++) {
            let localVertex = target.geometry.vertices[vertexIndex].clone();
            let globalVertex = localVertex.applyMatrix4(target.matrix);
            let directionVector = globalVertex.sub(target.position);
            let ray = new Raycaster(originPoint, directionVector.clone().normalize());
            let collisionResults = ray.intersectObjects(Speed3D.collidableMeshList);
            if (collisionResults.length > 0 && collisionResults[0].distance < directionVector.length()){
                return true;
            }
        }
        return false;
    }
}

export {collisionDetection}