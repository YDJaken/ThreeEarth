/**
 * @Created By WangZhiDong
 */
import {Scene} from "./Scene/Scene.js";
import {PerspectiveCamera} from "./Camera/PerspectiveCamera.js";
import {WebGLRenderer} from "./Renderer/WebGLRenderer.js";
import {Detector} from "./Detector.js";
import {AmbientLight} from "./Scene/Lights/AmbientLight.js";
import {DirectionalLight} from "./Scene/Lights/DirectionalLight.js";
import {Mesh} from "./Geometry/Mesh.js";
import {SphereGeometry,SphereBufferGeometry} from "./Geometries/SphereGeometry.js";
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
import {LoadView} from "../tileService/loadView.js";
import {CSphere} from "../Draw/sphere.js"


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

    let camera = new PerspectiveCamera(30, width / height, 0.00000001, 50000000);
    camera.position.set(radius*2, radius*2, radius*2);

    let renderer = new WebGLRenderer({
        antialias: true,//抗锯齿
        precision: 'highp',
        logarithmicDepthBuffer: true
    });


    renderer.setPixelRatio(window.devicePixelRatio);
    scene.add(new AmbientLight('#FFFFFF'));


    let sphere = createSphere(radius, segments);
    sphere.rotation.y = rotation;
    scene.add(sphere);

    let clouds = createClouds(radius + 500000, segments);
    clouds.rotation.y = rotation;
    //scene.add(clouds);

    let stars = createStars(radius * 30, segments);
    stars.rotation.y = -0.2;
    scene.add(stars);

    //监控摄像头,完成瓦片服务
    
   let l = new LayerWatch(camera,scene,sphere).watch()
   
    // l.addLayer({
    //  url:"https://a.tile.openstreetmap.org/",
    // })
   l.addLayer({
    url:"http://mt2.google.cn/vt/lyrs=m@167000000&hl=zh-CN&gl=cn",
   })
//    l.addLayer({
//     url:"http://t1.tianditu.com/cia_w/wmts?service=wmts&request=GetTile&version=1.0.0&LAYER=cia&tileMatrixSet=w&style=default.jpg",
//     type:"roadmessage"
//    })


    //OSM https://a.tile.openstreetmap.org/
    //高德地形 http://webst01.is.autonavi.com/appmaptile?style=6
    //谷歌地图 http://mt2.google.cn/vt/lyrs=m@167000000&hl=zh-CN&gl=cn
    //Arcgis https://services.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer?layer=undefined&style=undefined&tilematrixset=undefined&format=image%2Fjpeg&service=WMTS&version=1.0.0&request=GetTile
    //天地图 http://t0.tianditu.com/img_w/wmts?service=wmts&request=GetTile&version=1.0.0&LAYER=img&tileMatrixSet=w&style=default&format=tiles
    //天地图路网 http://t1.tianditu.com/cia_w/wmts?service=wmts&request=GetTile&version=1.0.0&LAYER=cia&tileMatrixSet=w&style=default.jpg
  

    //初始化加载地球
    let loader = new LoadView(sphere,camera,scene,3)
    loader.initGlobe(l.Level.level.level0.l3)
    //loader.initGlobe(l.Level.level.level1.l3)
    renderer.setSize(width, height);

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
            scene: scene,
        };
    }
    //传入层级系统
    let controls = new TrackballControls(camera);


    controls.rotateSpeed = 0.5;
    controls.zoomSpeed = 2.5;
    controls.panSpeed = 0.2;
    controls.noZoom = false;
    controls.noPan = true;
    controls.staticMoving = true;
    controls.dynamicDampingFactor = 0.8;
    controls.minDistance = 0;
    controls.maxDistance = Infinity;
    controls.keys = [65, 83, 68];

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

    var Rotation_value = -0.0002;

    function render() {
        let width = window.innerWidth,
            height = window.innerHeight;
        if (renderer.parameterSet._width !== width || renderer.parameterSet._height !== height) renderer.setSize(width, height);
        controls.update();
        stars.rotation.y += Rotation_value;
        if (stars.rotation.y <= -500 || stars.rotation.y >= 500) {
            Rotation_value = -Rotation_value;
        }
        stars.renderOrder = -2
        stats.update()
        requestAnimationFrame(render);
        
        renderer.render(scene, camera);
    }
    
   
    function createSphere(radius, segments) {
        return new Mesh(
            new SphereBufferGeometry(radius, segments, segments),
            new MeshBasicMaterial({
                color: "#E5E5E5"
            })
        );
    }

    function createClouds(radius, segments) {
        return new Mesh(
            new SphereBufferGeometry(radius + 0.03, segments, segments),
            new MeshPhongMaterial({
                map: ImageUtils.loadTexture('./Assets/images/fair_clouds_4k.png'),
                transparent: true
            })
        );
    }

    function createStars(radius, segments) {
        return new Mesh(
            new SphereBufferGeometry(radius+500000, segments, segments),
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
            $('#scale').html(`椭球体经度:${position1.longitude.toFixed(4)}`);
            $('#scale1').html(`椭球体纬度:${position1.latitude.toFixed(4)}`);
            position1 = e.cartographicToCartesian(position1.longitude, position1.latitude, position1.altitude);
            $('#level').html(`椭球体x:${position1.x.toFixed(4)},椭球体y:${position1.y.toFixed(4)},椭球体z:${position1.z.toFixed(4)}`);
            $('#level2').html(`x:${selected.point.x.toFixed(4)}, y:${selected.point.y.toFixed(4)}, z:${selected.point.z.toFixed(4)}`);
            position1 = Coordinate._sphericalToCartesian(position.latitude, position.longitude, position.r);
            $('#level1').html(`球体x:${position1.x.toFixed(4)},球体y:${position1.y.toFixed(4)},球体z:${position1.z.toFixed(4)}`);
            $("#lang").html(`经度：${position.longitude.toFixed(4)}`);
            $("#lat").html(`纬度：${position.latitude.toFixed(4)}`);
            position = Coordinate._spherToMercator(position.latitude, position.longitude);
            $("#mocaterx").html(`墨卡托x：${position.x.toFixed(4)}`);
            $("#mocatery").html(`墨卡托y：${position.y.toFixed(4)}`);
            position = Coordinate.mercatorToSpher(position.x, position.y);
            $("#mocaterlong").html(`墨卡托经度：${position.longitude.toFixed(4)}`);
            $("#mocaterlat").html(`墨卡托纬度：${position.latitude.toFixed(4)}`);
        }
    }

    var isOne = true;
    var towPoints = [];

    function addPoint(event) {
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
            if (towPoints.length > 2) {
                towPoints = [];
            }
            towPoints.push(position1);
            if (isOne) {
                $('#startPoint').html(`起点坐标:${position1.longitude.toFixed(4)},${position1.latitude.toFixed(4)},${position1.altitude.toFixed(4)}`);
                isOne = false;
            } else {
                $('#endPoint').html(`终点坐标:${position1.longitude.toFixed(4)},${position1.latitude.toFixed(4)},${position1.altitude.toFixed(4)}`);
                isOne = true;
            }
            if (towPoints.length === 2) return calculteDistance();
        }
    }

    function calculteDistance() {
        if (towPoints.length !== 2) return;
        let e = new Coordinate().Ellipsoid;
        let dis = e.computeDistance(towPoints[0].longitude, towPoints[0].latitude, towPoints[1].longitude, towPoints[1].latitude);
        $('#distance').html(`距离: ${(dis / 1000).toFixed(4)}km`);
        towPoints = [];
    }

    document.addEventListener("mousemove", onDocumentMouseDown);
    document.addEventListener('click', addPoint);


    //捕获三维物体坐标

    function onDocumentMouseDown(event) {
        let position = screenToSpherical(event)
        if (position) {
            $("#lang").html(`经度：${position.longitude.toFixed(4)}`)
            $("#lat").html(`纬度：${position.latitude.toFixed(4)}`)
        } else {
            $("#lang").html(`请将鼠标移至球面`)
            $("#lat").html(`请将鼠标移至球面`)
        }

    }

    //海南坐标
    // x坐标:-441513.04338330845
    // y坐标:2234502.8322085342
    // z坐标:-6468018.271254686
    // 经度110.35 纬度20.02

    //经纬度转xyz坐标系
    function lglt2xyz(lng, lat, alt, height) {
        var phi = (90 - lat) * (Math.PI / 180),
            theta = (lng + 180 - 17) * (Math.PI / 180),
            radius = alt + height,
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
        var position = lglt2xyz(longitude, latitude, radius, height)
        console.log(position)
        sphere.position.set(position.x, position.y, position.z);      //设置几何体的位置（x,y,z）
        scene.add(sphere);
    }

    //top.window.drawPoint(110.35,20.02)
    top.window.drawPoint = drawPoint
    // document.addEventListener("mousemove",onDocumentMouseDown)


    // let d = new TileProvider(camera,scene,document,18,"http://mt2.google.cn/vt/lyrs=m@167000000&hl=zh-CN&gl=cn")
    // top.window.dd = d
    //曲面多边形相关
    let groups = new Object3D()
    document.addEventListener("contextmenu", drawRec)

    function drawRec(event) {

        let position = screenToSpherical(event, 0)
        if (position) {
            console.log("经度" + position.longitude + "纬度" + position.latitude)
            d.loadTileTest(position.longitude, position.latitude, position.r)
            csphere.draw(100, position.longitude, position.latitude, position.r)
        }
    }

    function main2(lng, lat) {
        let a = Coordinate.speed3DConverter(lng - 5, lat + 5)
        let b = Coordinate.angleToRadian(10)
        let d = Coordinate.angleToRadian(10)
        let mesh = new Mesh(
            new SphereGeometry(radius, segments, segments, 0, b),
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
    function screenToSpherical(e, objectNum = 0) {
        //e.preventDefault();
        let vector = new Vector3();//三维坐标对象
        vector.set(
            (e.clientX / window.innerWidth) * 2 - 1,
            -(e.clientY / window.innerHeight) * 2 + 1,
            0.5);
        vector.unproject(camera);
        let raycaster = new Raycaster(camera.position, vector.sub(camera.position).normalize());
        let intersects = raycaster.intersectObject(sphere);
        if (intersects.length > 0) {
            let selected = intersects[objectNum];//取第一个物体
            let position = Coordinate.cartesianToSpherical(selected.point.x, selected.point.y, selected.point.z)
            return position
        }

        function setScale(evet) {
            let a = Scale.GetCurentScale(evet, camera, sphere);
            $("#Scale").html(`比例尺：${a.scale}`);
            $("#Level").html(`等级：${a.level}`);
        }

        //document.addEventListener("mousemove", setScale);

    }

    render();
}());