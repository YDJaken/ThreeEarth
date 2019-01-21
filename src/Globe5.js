/**
 * @Created By WangZhiDong
 */
import {Scene} from "./Scene/Scene.js";
import {PerspectiveCamera} from "./Camera/PerspectiveCamera.js";
import {WebGLRenderer} from "./Renderer/WebGLRenderer.js";
import {Detector} from "./Detector.js";
import {AmbientLight} from "./Scene/Lights/AmbientLight.js";
import {DirectionalLight} from "./Scene/Lights/DirectionalLight.js";
import {PointLight} from "./Scene/Lights/PointLight.js";
import {Mesh} from "./Geometry/Mesh.js";
import {SphereGeometry} from "./Geometries/SphereGeometry.js";
import {MeshPhongMaterial} from "./Materials/MeshPhongMaterial.js";
import {ImageUtils} from "./Speed3DEngine.js";
import {Color} from "./Datum/Math/Color.js";
import {MeshBasicMaterial} from "./Materials/MeshBasicMaterial.js";
import {BackSide, EarthRadius} from "./Core/Constants.js";
import {Vector3} from "./Datum/Math/Vector3.js";
import {Vector2} from "./Datum/Math/Vector2.js";
import {Raycaster} from "./Core/Raycaster.js"
import {CylinderGeometry} from "./Geometries/CylinderGeometry.js"
import {BoxGeometry} from "./Geometries/BoxGeometry.js"
import {Coordinate} from "../Math/Coordinate.js"
import {TextureLoader} from "./Loaders/TextureLoader.js"
import {PlaneGeometry} from "./Geometries/PlaneGeometry.js"
import {Object3D} from "./Core/Object3D.js"
import {ColorKeywords} from "./Datum/Math/Color.js"
import {LoadTile} from "../tileService/loadtile.js"
import {Scale} from "../Math/Scale.js"
import {TileProvider} from "../tileService/tileprovider.js"
import {LayerWatch} from "../tileService/layerwatch.js"
import {TrackballControls} from "./TrackballControls.js"
import {Line} from "../src/Geometry/Line.js";
import { LoadView } from "../tileService/loadView.js";
import {Geometry} from "../src/Core/Geometry.js";
import {LineBasicMaterial} from "../src/Materials/LineBasicMaterial.js"
import {CSphere} from "../Draw/sphere.js";
import {MeshLambertMaterial} from "../Materials/MeshLambertMaterial.js";
import {position} from "../position/position.js";
(function () {

    let webglEl = document.getElementById('webgl');

    if (!Detector.webgl) {
        Detector.addGetWebGLMessage(webglEl);
        return;
    }

    let width = window.innerWidth,
        height = window.innerHeight;

    // 地球参数

    //帧率
    let stats = initStats();
    function initStats() {
        var stats = new Stats();
        //设置统计模式
        stats.setMode(0); // 0: fps, 1: ms
        //统计信息显示在左上角
        stats.domElement.style.position = 'absolute';
        stats.domElement.style.left = '0px';
        stats.domElement.style.top = '0px';
        //将统计对象添加到对应的<div>元素中
        document.getElementById("Stats-output").appendChild(stats.domElement);
        return stats;
    }

    let radius = 6378137,
        segments = 32,
        rotation = 6;
    //以原点为中心的图片半径

    let scene = new Scene();

    let camera = new PerspectiveCamera(45, width / height, 0.000001, 1000000000);
    camera.position.set(radius + 10000000, radius + 10000000, radius + 10000000);
   
    

    let renderer = new WebGLRenderer({
        antialias: true,//抗锯齿
        precision: 'highp'
    });
    
    //添加坐标系
    let geometry = new Geometry();
    let material = new LineBasicMaterial( { vertexColors: true } );
    let color1 = new Color( 0x4444cc ), color2 = new Color( 0xFF00ee );
    let p1 = new Vector3( 0, 0, 0 );
    let p2 = new Vector3(  0, 100000000, 0 );
    geometry.vertices.push(p1);
    geometry.vertices.push(p2);
    geometry.colors.push( color1, color2 );
    
    var liney = new Line( geometry, material );
    scene.add(liney);

    let clouds = createClouds(radius + 500000, segments);
    clouds.rotation.y = rotation;

    // scene.add(clouds);

    renderer.setSize(width, height);
    renderer.setPixelRatio(window.devicePixelRatio);
    scene.add(new AmbientLight(0x333333));

    let light = new DirectionalLight(0xffffff, 1);
    light.position.set(0, 100000000, 5);
    // scene.add(light);
    let sphere = createSphere(radius, segments);
    sphere.rotation.y = rotation;
    scene.add(sphere);

    let stars = createStars(radius + 50000000, segments);
    stars.rotation.y = -0.2;
    scene.add(stars);

    //监控摄像头,完成瓦片服务
    
    let l = new LayerWatch(camera,scene,sphere,"http://mt2.google.cn/vt/lyrs=m@167000000&hl=zh-CN&gl=cn").watch()
    top.window.l = l

    //OSM https://a.tile.openstreetmap.org/
    //高德地形 http://webst01.is.autonavi.com/appmaptile?style=6
    //谷歌地图 http://mt2.google.cn/vt/lyrs=m@167000000&hl=zh-CN&gl=cn
    //Arcgis https://services.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer?layer=undefined&style=undefined&tilematrixset=undefined&format=image%2Fjpeg&service=WMTS&version=1.0.0&request=GetTile
    //天地图 http://t0.tianditu.com/img_w/wmts?service=wmts&request=GetTile&version=1.0.0&LAYER=img&tileMatrixSet=w&style=default&format=tiles

    //初始化加载地球
    let loader = new LoadView(sphere,camera,scene,3)
    loader.initGlobe(l.level['level3'])
    renderer.setSize(width, height);

    let csphere = new CSphere(scene)
    
    
    webglEl.appendChild(renderer.domElement);
    if (!window.top.Speed3D) {
        window.top.Speed3D = {
            sphere: sphere,
            Vector3: Vector3,
            clouds_dy: clouds,
            MeshPhongMaterial: MeshPhongMaterial,
            ImageUtils: ImageUtils,
            adjustPosition: adjustPosition,
            changeCloud: changeCloud,
            camera: camera,
            scene:scene,
        };
    }
    //根据经纬度，高度跳转到球面任意位置
    let position1 = new position(camera);
    let lon =116.3534733735,lat = 39.9173498913715,distance = radius + 10000000;
    position1.flyTo(lon,lat,distance);

    //传入层级系统
    let controls = new TrackballControls(camera,l.level);
    controls.rotateSpeed = 0.5;
    controls.zoomSpeed = 2.5;
    controls.panSpeed = 0.2;
    controls.noZoom = false;
    controls.noPan = true;
    controls.staticMoving = true;
    controls.dynamicDampingFactor = 0.8;
    controls.minDistance = 0;
    controls.maxDistance = Infinity;
    controls.keys = [ 65, 83, 68 ];
   // controls.addEventListener( 'change', render );
    /**
     * 位置接口
     * @param target 必须
     * @param x
     * @param y
     * @param z
     */
    function adjustPosition(target, x = 0, y = 0, z = 0) {
        if (!window.top.Speed3D) {
            alert('Speed3D引擎未启动');
            return;
        }
        if (!target) {
            return;
        }
        target.position = new Speed3D.Vector3(x, y, z);
    }

    /**
     * 切换云图片接口
     * @param src 必须
     * @param target
     */
    function changeCloud(src, target) {
        if (!window.top.Speed3D) {
            alert('Speed3D引擎未启动');
            return;
        }
        if (!src || src === '') {
            return;
        }
        if (!target) {
            target = Speed3D.clouds_dy;
        }
        target.material = new MeshPhongMaterial({
            map: ImageUtils.loadTexture(src),
            transparent: true
        });
    }

    function render() {
        stats.update()
        controls.update(); 
        stars.rotation.y -=0.0002
        stars.renderOrder = -2
        requestAnimationFrame(render);

        renderer.render(scene, camera);
    }
    
   
    function createSphere(radius, segments) {
        return new Mesh(
            new SphereGeometry(radius, segments, segments),
            new MeshBasicMaterial({
                color:"#E5E5E5"
            })
        );
    }
    function createClouds(radius, segments) {
        return new Mesh(
            new SphereGeometry(radius + 0.03, segments, segments),
            new MeshPhongMaterial({
                map: ImageUtils.loadTexture('./Assets/images/fair_clouds_4k.png'),
                transparent: true
            })
        );
    }
    function createStars(radius, segments) {
        return new Mesh(
            new SphereGeometry(radius+500000, segments, segments),
            new MeshBasicMaterial({
                map: ImageUtils.loadTexture('./Assets/images/galaxy_starfield.png'),
                side: BackSide
            })
        );
    }
//捕获三维物体坐标
    function onDocumentMouseDown(event) {
        var vector = new Vector3();//三维坐标对象
        vector.set(
            (event.clientX / window.innerWidth) * 2 - 1,
            -(event.clientY / window.innerHeight) * 2 + 1,
            0.5);
        vector.unproject(camera);
        var raycaster = new Raycaster(camera.position, vector.sub(camera.position).normalize());
        let earth = [sphere];
        var intersects = raycaster.intersectObjects(earth);
        if (intersects.length > 0) {
            let selected = intersects[0];//取第一个物体
            if (!selected) return;
            let e = new Coordinate().Ellipsoid;
            let position1 = e.cartesianToCartographic(selected.point.x, selected.point.z, selected.point.y);
            let position = Coordinate.cartesianToSpherical(selected.point.x, selected.point.y, selected.point.z);
            $('#scale').html(`椭球体经度:${position1.longitude}`);
            $('#scale1').html(`椭球体纬度:${position1.latitude}`);
            position1 = e.cartographicToCartesian(position1.longitude, position1.latitude, position1.altitude);
            $('#level').html(`椭球体x:${position1.x},椭球体y:${position1.y},椭球体z:${position1.z}`);
            $('#level2').html(`x:${selected.point.x}, y:${selected.point.y}, z:${selected.point.z}`);
            position1 = Coordinate._sphericalToCartesian(position.latitude, position.longitude, position.r);
            $('#level1').html(`球体x:${position1.x},球体y:${position1.y},球体z:${position1.z}`);
            $("#lang").html(`经度：${position.longitude}`);
            $("#lat").html(`纬度：${position.latitude}`);
            position = Coordinate._spherToMercator(position.latitude, position.longitude);
            $("#mocaterx").html(`墨卡托x：${position.x}`);
            $("#mocatery").html(`墨卡托y：${position.y}`);
            position = Coordinate.mercatorToSpher(position.x, position.y);
            $("#mocaterlong").html(`墨卡托经度：${position.longitude}`);
            $("#mocaterlat").html(`墨卡托纬度：${position.latitude}`);
        }
    }
    var isOne = true;
    var towPoints = [];
    function addPoint(event){
        let vector = new Vector3();//三维坐标对象
        vector.set(
            (event.clientX / window.innerWidth) * 2 - 1,
            -(event.clientY / window.innerHeight) * 2 + 1,
            0.5);
        vector.unproject(camera);
        let raycaster = new Raycaster(camera.position, vector.sub(camera.position).normalize());
        let earth = [sphere];
        let intersects = raycaster.intersectObjects(earth);
        if (intersects.length > 0) {
            let selected = intersects[0];//取第一个物体
            if (!selected) return;
            let e = new Coordinate().Ellipsoid;
            let position1 = e.cartesianToCartographic(selected.point.x, selected.point.z, selected.point.y);
            if(towPoints.length>2){
                towPoints=[];
            }
            towPoints.push(position1);
            if(isOne){
                $('#startPoint').html(`起点坐标:${position1.longitude.toFixed(4)},${position1.latitude.toFixed(4)},${position1.altitude.toFixed(4)}`);
                isOne = false;
            }else{
                $('#endPoint').html(`终点坐标:${position1.longitude.toFixed(4)},${position1.latitude.toFixed(4)},${position1.altitude.toFixed(4)}`);
                isOne = true;
            }
            if(towPoints.length===2) return calculteDistance();
        }
    }
    function calculteDistance(){
        if(towPoints.length!==2) return;
        let e = new Coordinate().Ellipsoid;
        let dis = e.computeDistance(towPoints[0].longitude,towPoints[0].latitude,towPoints[1].longitude,towPoints[1].latitude);
        $('#distance').html(`距离: ${(dis/1000).toFixed(4)}km`);
        towPoints = [];
    }
    document.addEventListener("mousemove", onDocumentMouseDown);
    // document.addEventListener('click',addPoint);



   
    //海南坐标
    // x坐标:-441513.04338330845
    // y坐标:2234502.8322085342
    // z坐标:-6468018.271254686
    // 经度110.35 纬度20.02

    //经纬度转xyz坐标系
    function lglt2xyz(lng, lat, alt,height){
        var phi = (90-lat)*(Math.PI/180),
            theta = (lng+180-17)*(Math.PI/180),
            radius = alt+height,
            x = -(radius * Math.sin(phi) * Math.cos(theta)),
            z = (radius * Math.sin(phi) * Math.sin(theta)),
            y = (radius * Math.cos(phi));
        return {x: x, y: y, z: z};
    }

    //根据经纬度绘制物体
    function drawPoint(longitude, latitude) {
        // 创建单个粒子
        var sphere = new Mesh(
            new SphereGeometry(radius / 100, segments, segments),
            new MeshPhongMaterial({
                map: ImageUtils.loadTexture('./Assets/images/2_no_clouds_4k.jpg'),
                bumpMap: ImageUtils.loadTexture('./Assets/images/elev_bump_4k.jpg'),
                bumpScale: 0.005,
                specularMap: ImageUtils.loadTexture('./Assets/images/water_4k.png'),
                specular: new Color('grey')
            })
        );
        //var position = Coordinate.sphericalToCartesian(radius,latitude,longitude)
        var position = lglt2xyz(longitude,latitude,radius,height)
        console.log(position)
        sphere.position.set(position.x,position.y,position.z);      //设置几何体的位置（x,y,z）
        scene.add(sphere);
    }

    //top.window.drawPoint(110.35,20.02)
    top.window.drawPoint = drawPoint
    // document.addEventListener("mousemove",onDocumentMouseDown)

    // let d = new TileProvider(camera,scene,document,18,"http://mt2.google.cn/vt/lyrs=m@167000000&hl=zh-CN&gl=cn")
    // top.window.dd = d
    //曲面多边形相关
    let groups = new Object3D()
    document.addEventListener("contextmenu",drawRec)
    function drawRec(event) {
        
        let position = screenToSpherical(event,0)
        if(position) {
            console.log("经度"+position.longitude+"纬度"+position.latitude)
            d.loadTileTest(position.longitude,position.latitude,position.r)
            csphere.draw(100,position.longitude,position.latitude,position.r)
        }
    }
    function main2(lng,lat) {
            let a = Coordinate.speed3DConverter(lng-5,lat+5)
            let b = Coordinate.angleToRadian(10)
            let d = Coordinate.angleToRadian(10)
            let mesh = new Mesh(
                new SphereGeometry(radius, segments, segments,0,b),
                new MeshBasicMaterial({
                    //map:         ImageUtils.loadTexture('./Assets/images/2_no_clouds_4k.jpg'),
                   // bumpMap:     ImageUtils.loadTexture('./Assets/images/elev_bump_4k.jpg'),
                    //bumpScale:   0.005,
                   // specularMap: ImageUtils.loadTexture('./Assets/images/water_4k.png'),
                   // specular:    new Color('grey'),
                   color: new Color('orange'),
                })
            )
            groups.add(mesh)
            scene.add(groups);
        }
        top.window.main2 = main2     


    /**
    * 屏幕坐标转换为地理坐标
    * @param {外层函数捕获的event事件} e
    * @param {可选参数，数字类型，标示取相交的第几个物体默认为0} objectNum 
    * 
    */
   function screenToSpherical(e,objectNum=0){
    //e.preventDefault();
    let vector = new Vector3();//三维坐标对象
    vector.set(
    ( e.clientX / window.innerWidth ) * 2 - 1,
    - ( e.clientY / window.innerHeight ) * 2 + 1,
    0.5 );
    vector.unproject( camera );
    let raycaster = new Raycaster(camera.position, vector.sub(camera.position).normalize());
    let intersects = raycaster.intersectObject(sphere);
    if (intersects.length > 0) {
    let selected = intersects[objectNum];//取第一个物体
    let position = Coordinate.cartesianToSpherical(selected.point.x,selected.point.y,selected.point.z)
    return position
   }
   function setScale(evet){
    let a =  Scale.GetCurentScale(evet,camera,sphere);
    $("#Scale").html(`比例尺：${a.scale}`);
    $("#Level").html(`等级：${a.level}`);
}
   //document.addEventListener("mousemove", setScale);

}

render();
}());