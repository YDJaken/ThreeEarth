import {Scene} from "./Scene/Scene.js";
import {PerspectiveCamera} from "./Camera/PerspectiveCamera.js";
import {WebGLRenderer} from "./Renderer/WebGLRenderer.js";
import {Detector} from "./Detector.js";
import {AmbientLight} from "./Scene/Lights/AmbientLight.js";
import {DirectionalLight} from "./Scene/Lights/DirectionalLight.js";
import {Mesh} from "./Geometry/Mesh.js";
import {SphereBufferGeometry} from "./Geometries/SphereGeometry.js";
import {ImageUtils} from "./Speed3DEngine.js";
import {BackSide, EarthRadius} from "./Core/Constants.js";
import {TrackballControls} from "./TrackballControls.js";
import {Vector3} from "./Datum/Math/Vector3.js";
import {Raycaster} from "./Core/Raycaster.js";
import {Coordinate} from "../Math/Coordinate.js";
import {FileLoader} from "../Loaders/FileLoader.js";
import {TileLoader} from "../3DTileset/3DTileLoader.js";
import {TileProcessor} from "../3DTileset/3DTileProcessor.js";
import {LayerWatch} from "../tileService/layerwatch.js";
import {LoadView} from "../tileService/loadView.js";
import {MeshBasicMaterial} from "./Materials/MeshBasicMaterial.js";
import {Picker} from "../Pick/Picker.js";
import {ModelLayer} from "../Models/ModelLayer.js";
import {Model} from "../Models/Model.js";
import {Speed3D} from "./Speed3D.js";
import {PointLight} from "./Scene/Lights/PointLight.js";

(function () {

    let webglEl = document.getElementById('webgl');

    if (!Detector.webgl) {
        Detector.addGetWebGLMessage(webglEl);
        return;
    }
    let width = window.innerWidth,
        height = window.innerHeight;


    // 地球参数
    let radius = EarthRadius,
        segments = 32;

    let scene = new Scene();

    let camera = new PerspectiveCamera(30, width / height, 0.00000001, 500000000);
    camera.position.set(radius * 2, radius * 2, -radius * 2);


    let renderer = new WebGLRenderer({
        antialias: true,//抗锯齿
        precision: 'highp'
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(window.devicePixelRatio);
    scene.add(new AmbientLight(0x333333));

    var light = new PointLight(0xffffff);
    light.position.set(0, 250, 0);
    /*let light = new DirectionalLight(0xffffff, 1);
    light.position.set(5, 3, -15);*/
    scene.add(light);

    let stars = createStars(radius * 30, segments);
    scene.add(stars);


    let sphere = createSphere(radius, segments);
    scene.add(sphere);   //球皮

    let processor;
    let loader = new FileLoader();
    loader.setResponseType('json');
    var datas;
    /*loader.load('http://192.168.1.6:8081/tileset.json', function (data) {
        datas = TileLoader.load(data, 'http://192.168.1.6:8081/');
        window.top.Speed3D.ModelLayer.addProcessor(new TileProcessor(datas));
    });*/
    loader.load('../Test/NewYork/tileset.json', function (data) {
        datas = TileLoader.load(data, '../Test/NewYork/');
        ModelLayer.addProcessor(new TileProcessor(datas, 'NY'));
    });

    let c = new Coordinate();
    console.log(c.ellipsoidMercatorUnprojection(40338129.000000000, 3760451.7000000002));
    console.log(Coordinate.mercatorToSpher(40338129.000000000, 3760451.7000000002));
    //监控摄像头,完成瓦片服务
    let l = new LayerWatch(camera, scene, sphere).watch();
    l.addLayer({
        url: "http://mt2.google.cn/vt/lyrs=m@167000000&hl=zh-CN&gl=cn",
        type: "base"
    });
    //OSM https://a.tile.openstreetmap.org/
    //高德地形 http://webst01.is.autonavi.com/appmaptile?style=6
    //谷歌地图 http://mt2.google.cn/vt/lyrs=m@167000000&hl=zh-CN&gl=cn
    //Arcgis https://services.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer?layer=undefined&style=undefined&tilematrixset=undefined&format=image%2Fjpeg&service=WMTS&version=1.0.0&request=GetTile
    //天地图 http://t0.tianditu.com/img_w/wmts?service=wmts&request=GetTile&version=1.0.0&LAYER=img&tileMatrixSet=w&style=default&format=tiles
    //天地图路网 http://t1.tianditu.com/cia_w/wmts?service=wmts&request=GetTile&version=1.0.0&LAYER=cia&tileMatrixSet=w&style=default.jpg
    //初始化加载地球
    let ld = new LoadView(sphere, camera, scene, 3)
    ld.initGlobe(l.Level.level.level0.l3)
    renderer.setSize(width, height);
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

    webglEl.appendChild(renderer.domElement);
    let Speed3DR;
    if (!window.top.Speed3D) {
        Speed3DR = new Speed3D({
            sphere: sphere,
            stars: stars,
            scene: scene,
            ModelLayer: ModelLayer,
            camera: camera,
            renderer: renderer,
            controls: controls,
            atmosphere: false
        });
        window.top.Speed3D = Speed3DR;
    }

    function createStars(radius, segments) {
        return new Mesh(
            new SphereBufferGeometry(radius, segments, segments),
            new MeshBasicMaterial({
                map: ImageUtils.loadTexture('./Assets/images/galaxy_starfield.png'),
                side: BackSide
            })
        );
    }


    function createSphere(radius, segments) {
        return new Mesh(
            new SphereBufferGeometry(radius, segments, segments),
            new MeshBasicMaterial({color: 'gray'})
        );
    }

    Speed3D.render(Speed3DR);
}());


//捕获三维物体坐标
function onDocumentMouseDown(event) {
    let picker = new Picker();
    picker.addObject(window.top.Speed3D.sphere);
    let intersects = picker.findIntersection(event);
    if (intersects.length > 0) {
        let selected = intersects[0];//取第一个物体
        if (!selected) return;
        let c = new Coordinate();
        let e = c.Ellipsoid;
        let position1 = e.cartesianToCartographic(selected.point.x, selected.point.z, selected.point.y);
        let position = Coordinate.cartesianToSpherical(selected.point.x, selected.point.y, selected.point.z);
        let position3 = c.ellipsoidMercatorProjection(position.longitude, position.latitude, position.r);
        document.getElementById("mocaterxC").innerHTML = `墨卡托Elliposidx：${position3.x}`;
        document.getElementById("mocateryC").innerHTML = `墨卡托Elliposidy：${position3.y}`;
        position3 = c.ellipsoidMercatorUnprojection(position3.x, position3.y, position3.z);
        document.getElementById("mocaterlongC").innerHTML = `墨卡托经度Elliposid：${position3.longitude}`;
        document.getElementById("mocaterlatC").innerHTML = `墨卡托纬度Elliposid：${position3.latitude}`;
        position1 = e.cartographicToCartesian(position1.longitude, position1.latitude, position1.altitude);
        document.getElementById('startPoint').innerHTML = `椭球体x:${position1.x},椭球体y:${position1.y},椭球体z:${position1.z}`;
        document.getElementById('endPoint').innerHTML = `x:${selected.point.x}, y:${selected.point.y}, z:${selected.point.z}`;
        position1 = Coordinate._sphericalToCartesian(position.latitude, position.longitude, position.r);
        document.getElementById('distance').innerHTML = `球体x:${position1.x},球体y:${position1.y},球体z:${position1.z}`;
        document.getElementById("lang").innerHTML = `经度：${position.longitude}`;
        document.getElementById("lat").innerHTML = `纬度：${position.latitude}`;
        position = Coordinate._spherToMercator(position.latitude, position.longitude);
        document.getElementById("mocaterx").innerHTML = `墨卡托x：${position.x}`;
        document.getElementById("mocatery").innerHTML = `墨卡托y：${position.y}`;
        position = Coordinate.mercatorToSpher(position.x, position.y);
        document.getElementById("mocaterlong").innerHTML = `墨卡托经度：${position.longitude}`;
        document.getElementById("mocaterlat").innerHTML = `墨卡托纬度：${position.latitude}`;
    }
}

function load3DTiles() {
    if (window.top.Speed3D) {
        if (window.top.Speed3D.ModelLayer) {
            window.top.Speed3D.ModelLayer.loadProcessorByName('NY').active();
        }
    }
}

function onDocumentPickModel(e) {
    if (!window.top.Speed3D.ModelLayer) return;
    let nyprocessor = window.top.Speed3D.ModelLayer.loadProcessorGroupByName('NY');
    if (nyprocessor === undefined) return;
    let picker = new Picker();
    let arr = [];
    window.top.Speed3D.ModelLayer.loadProcessorGroupByName('NY').loadRootModel(arr);
    picker.addObjects(arr);
    let intersects = picker.findIntersection(e);
    if (intersects.length > 0) {
        if (intersects[0] === undefined) return;
        let obj = intersects[0].object;
        let ModelClass = Model.findModelClass(obj);
        let index = ModelClass.getIndexById(obj.id);
        let str = '';
        for (let as in ModelClass.exters) {
            str += `<font size="3" color="red">${as}:${ModelClass.exters[as][index]}</font><br/>`;
        }
        document.getElementById('Scale_div').innerHTML = str;
    }
}


document.addEventListener("mousemove", onDocumentMouseDown);
document.addEventListener("click", onDocumentPickModel);
document.addEventListener('click', load3DTiles);