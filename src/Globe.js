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
import {SphereGeometry} from "./Geometries/SphereGeometry.js";
import {MeshPhongMaterial} from "./Materials/MeshPhongMaterial.js";
import {ImageUtils} from "./Speed3DEngine.js";
import {Color} from "./Datum/Math/Color.js";
import {MeshBasicMaterial} from "./Materials/MeshBasicMaterial.js";
import {BackSide} from "./Core/Constants.js";
import {TrackballControls} from "./TrackballControls.js";

import {Vector3} from "./Datum/Math/Vector3.js";
// import {TrackballControls} from "./TrackballControls";

import{Geometry} from "./Core/Geometry.js";

import{LineBasicMaterial} from "./Materials/LineBasicMaterial.js";
// import {BackSide, EarthRadius} from "./Core/Constants.js";
import {TextureLoader} from "./Loaders/TextureLoader.js"
import {PlaneGeometry} from "./Geometries/PlaneGeometry.js"
import {BoxGeometry} from "./Geometries/BoxGeometry.js"
import {Raycaster} from "./Core/Raycaster.js"
import {Coordinate} from "../Math/Coordinate.js"
import {Object3D} from "./Core/Object3D.js"
import {MeshLambertMaterial} from "../Materials/MeshLambertMaterial.js"

import {Scale} from "../Math/Scale.js"


import {Layer} from "../LayerManager/layer.js";
import {LayerCollection} from "../LayerManager/layercollection.js";

// import {CLine} from "../Draw/Line1.js";




import {PointsMaterial} from "./Materials/PointsMaterial.js";
import {Points} from "./Geometry/Points.js";
import {Face3} from "./Core/Face3.js";
import {Lonlat} from "../Draw/LonLat.js";
import {CPonit} from "../Draw/point.js";
import {CLine} from "../Draw/line.js";
import {CSphere} from "../Draw/sphere.js";
import  {CPlane} from "../Draw/plane.js";

import {CylinderGeometry} from "./Geometries/CylinderGeometry.js";
import {CPolygon} from "../Draw/polygon.js";
import {LoadView} from "../tileService/loadView.js";
import {TileUtil} from "../tileService/tileutil.js";
import {Picker} from "../Pick/Picker.js";
import {Plane} from "./Datum/Math/Plane.js";
import {Vector2} from "./Datum/Math/Vector2.js";
import {Line} from "./Geometry/Line.js";

(function () {

    let webglEl = document.getElementById('webgl');

    if (!Detector.webgl) {
        Detector.addGetWebGLMessage(webglEl);
        return;
    }

    let width = window.innerWidth,
        height = window.innerHeight;

    // 地球参数
    let radius = 6378137,
        segments = 32,
        rotation = 6;

    let scene = new Scene();

    let camera = new PerspectiveCamera(45, width / height, 0.01, 1000000000);
    camera.position.set(radius * 2, radius * 2, radius * 2);


    let renderer = new WebGLRenderer();
    renderer.setSize(width, height);

    scene.add(new AmbientLight(0x333333));

    let light = new DirectionalLight(0xffffff, 1);
    light.position.set(5, 3, 5);
    // scene.add(light);   //光源
    var name1="光源"


    let sphere = createSphere(radius, segments);
    scene.add(sphere);   //球皮
    var name2="球皮"

    let clouds = createClouds(radius + 500000, segments);
    clouds.rotation.y = rotation;

    // scene.add(clouds);   //云层
    var name3="云层";

   //  var layer1=new Layer(name1,"WMS",light);
   //  LayerCollection.AddLayer(layer1);
   //  var layer2=new Layer(name2,"WMS",sphere);
   //  LayerCollection.AddLayer(layer2);
   //  var layer3=new Layer(name3,"WMS",clouds);
   //  LayerCollection.AddLayer(layer3);
   //  /*
   // *
   // * 图层管理相关
   // * */
   //  var setting = {
   //      check: {
   //          enable: true
   //      },
   //      data: {
   //          simpleData: {
   //              enable: true
   //          }
   //      },
   //      callback: {
   //          onCheck: zTreeOnCheck
   //      }
   //  };
   //
   //
   //  function zTreeOnCheck(event, treeId, treeNode) {
   //      LayerCollection.SetIndexLayerVisible(treeNode.id,treeNode.checked);
   //      // LayerCollection.DeleteLayerById((treeNode.id+1));
   //  };
   //
   //  //删除图层
   //  $('#btn_remove').click(function() {
   //      var treeObj = $.fn.zTree.getZTreeObj("treeDemo");
   //      //选中节点
   //      var nodes = treeObj.getSelectedNodes();
   //      for (var i=0, l=nodes.length; i < l; i++)
   //      {
   //          //删除选中的节点
   //          treeObj.removeNode(nodes[i]);
   //          var layer=LayerCollection.GetLayerById(nodes[i].id);
   //          scene.remove(layer);
   //          LayerCollection.DeleteLayerById(nodes[i].id);
   //
   //      }
   //      var tmp=LayerCollection.GetAllLayers();
   //      console.log(tmp);
   //  })
   //
   //  //添加图层
   //  $('#btn_search').click(function () {
   //      var treeObj = $.fn.zTree.getZTreeObj("treeDemo");
   //      var nodes = treeObj.getSelectedNodes();
   //      for (var i=0, l=nodes.length; i < l; i++)
   //      {
   //          var name=nodes[i].name;
   //          var layer=LayerCollection.GetLayerByName(name);
   //          console.log(layer);
   //          return layer;
   //      }
   //  })
   //
   //
   //
   //  $(document).ready(function(){
   //      var AllLayers=LayerCollection.GetAllLayers();
   //      var zNodes=[];
   //      for(let i=0;i<AllLayers.length;i++){
   //          var temp={
   //              id:AllLayers[i].id,
   //              name:AllLayers[i].name,
   //              checked:true
   //          }
   //          zNodes.push(temp);
   //      }
   //      // console.log(zNodes);
   //      $.fn.zTree.init($("#treeDemo"), setting, zNodes);
   //
   //  });


    // let controls = new TrackballControls(camera);
    webglEl.appendChild(renderer.domElement);
    if (!window.top.Speed3D) {
        window.top.Speed3D = {
            sphere: sphere,
            scene: scene,
            Vector3: Vector3,
            clouds_dy: clouds,
            MeshPhongMaterial: MeshPhongMaterial,
            ImageUtils: ImageUtils,
            adjustPosition: adjustPosition,
            changeCloud: changeCloud,
            camera: camera
        };
    }

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


        controls.update();
        if(clouds.rotation.y>600){
            clouds.rotation.y = rotation;
        }
        clouds.rotation.y += 0.0001;
        requestAnimationFrame(render);
        renderer.render(scene, camera);
    }


    function createSphere(radius, segments) {
        return new Mesh(
            new SphereGeometry(radius, segments, segments),
            new MeshPhongMaterial({
                map: ImageUtils.loadTexture('./Assets/images/2_no_clouds_4k.jpg'),
                bumpMap: ImageUtils.loadTexture('./Assets/images/elev_bump_4k.jpg'),
                bumpScale: 1,
                specularMap: ImageUtils.loadTexture('./Assets/images/water_4k.png'),
                specular: new Color('grey')
            })
        );
    }

    function createClouds(radius, segments) {
        return new Mesh(
            new SphereGeometry(radius, segments, segments),
            new MeshPhongMaterial({
                map: ImageUtils.loadTexture('./Assets/images/fair_clouds_4k.png'),
                transparent: true
            })
        );
    }
    function setScale(evet){
        let a =  Scale.GetCurentScale(evet,camera,sphere);
        $("#Scale").html(`比例尺：${a.scale}`);
        $("#Level").html(`等级：${a.level}`);
    }
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
    controls.keys = [ 65, 83, 68 ];
    /*
    * 测试线
    * */
    var line =new CLine(scene);
    var parray=[];
    var  p1=new Lonlat(110,36);
    var  p2=new Lonlat(110,40);
    var  p3=new Lonlat(100,40);
    var  p4=new Lonlat(120,40);
    var  p5=new Lonlat(110,36);
    parray.push(p1);
    parray.push(p2);
    parray.push(p3);
    parray.push(p4);
    line.draw(parray);
     /**
      * 测试点
      * */
     var pt=new CPonit(scene);
     pt.draw(117,30);
     pt.setcolor("#99FF00");

     // pt.delete();

    /*
    * 测试球
    * */
     // var csphere=new CSphere(scene);
     // csphere.draw(100000,110,60);
     // csphere.setradius(1000000000);
     // csphere.setcolor("#000000")
    /*
    * 测试面
    * */
 // var polygon=new CPolygon(scene);
 //    var parray=[];
 //    var  pp1=new Lonlat(102.0136,30.1208);
 //    var  pp2=new Lonlat(99.65463,29.1729);
 //    var  pp3=new Lonlat(98.9812,25.0908);
 //    var  pp4=new Lonlat(101.3567,23.6659);
 //    var  pp5=new Lonlat(105.1906,21.9665);
 //    var  pp6=new Lonlat(109.0804,21.1992);
 //    var  pp7=new Lonlat(111.4988,25.0413);
 //    var  pp8=new Lonlat(110.9262,30.5308);
 //    parray.push(pp1);
 //    parray.push(pp2);
 //    parray.push(pp3);
 //    parray.push(pp4);
 //    parray.push(pp5);
 //    parray.push(pp6);
 //    parray.push(pp7);
 //    parray.push(pp8);
 //    polygon.draw(parray);
 //    polygon.setcolor("black")
    // line.draw(parray);

    // var panel=new CPlane(scene);
    // let pp=[];
    // var  p11=new Lonlat(110,36);
    // var  p22=new Lonlat(110,40);
    // var  p33=new Lonlat(100,40);
    // pp.push(p11);
    // pp.push(p22);
    // pp.push(p33);
    // panel.draw(pp);
     /*
     * 测试圆柱体
     * */
    // var cylinderGeo = new CylinderGeometry(15000, 15000 ,4000000000 ,400 ,400);
    // var cylinderMat = new MeshLambertMaterial({//创建材料
    //     color:0xFF6600,
    //     wireframe:false
    //
    // });
    //创建圆柱体网格模型
    // var cylinderMesh = new Mesh(cylinderGeo, cylinderMat);
    // cylinderMesh.position.set(63781307, 63781307, 63781370);//设置圆柱坐标
    // cylinderMesh.position.set(0, 200000000000000,4000000000000000);//设置圆柱坐标
    // scene.add(cylinderMesh);//向场景添加圆柱体
    console.log(scene);
    //捕获三维物体坐标
    function onDocumentMouseDown(event) {
        let picker = new Picker();
        picker.addObject(sphere);
        let intersects = picker.findIntersection(event);
        if (intersects.length > 0) {
            let selected = intersects[0];//取第一个物体
            if (!selected) return;
            let c = new Coordinate();
            let e = c.Ellipsoid;
            let position1 = e.cartesianToCartographic(selected.point.x, selected.point.z, selected.point.y);
            let position = Coordinate.cartesianToSpherical(selected.point.x, selected.point.y, selected.point.z);
            let position3 = c.ellipsoidMercatorProjection(position.longitude, position.latitude, position.r);
            $("#mocaterxC").html(`墨卡托Elliposidx：${position3.x}`);
            $("#mocateryC").html(`墨卡托Elliposidy：${position3.y}`);
            position3 = c.ellipsoidMercatorUnprojection(position3.x, position3.y, position3.z);
            $("#mocaterlongC").html(`墨卡托经度Elliposid：${position3.longitude.toFixed(4)}`);
            $("#mocaterlatC").html(`墨卡托纬度Elliposid：${position3.latitude.toFixed(4)}`);
            $('#scale').html(`椭球体经度:${position1.longitude}`);
            $('#scale1').html(`椭球体纬度:${position1.latitude}`);
            position1 = e.cartographicToCartesian(position1.longitude, position1.latitude, position1.altitude);
            $('#level').html(`椭球体x:${position1.x.toFixed(4)},椭球体y:${position1.y.toFixed(4)},椭球体z:${position1.z.toFixed(4)}`);
            $('#level2').html(`x:${selected.point.x.toFixed(4)}, y:${selected.point.y.toFixed(4)}, z:${selected.point.z.toFixed(4)}`);
            position1 = Coordinate._sphericalToCartesian(position.latitude, position.longitude, position.r);
            $('#level1').html(`球体x:${position1.x.toFixed(4)},球体y:${position1.y.toFixed(4)},球体z:${position1.z.toFixed(4)}`);
            $("#lang").html(`经度：${position.longitude}`);
            $("#lat").html(`纬度：${position.latitude}`);
            position = Coordinate._spherToMercator(position.latitude, position.longitude);
            $("#mocaterx").html(`墨卡托x：${position.x}`);
            $("#mocatery").html(`墨卡托y：${position.y}`);
            position = Coordinate.mercatorToSpher(position.x, position.y);
            $("#mocaterlong").html(`墨卡托经度：${position.longitude.toFixed(4)}`);
            $("#mocaterlat").html(`墨卡托纬度：${position.latitude.toFixed(4)}`);
        }
    }
    function GetMouseLonLat(event) {
            let picker = new Picker();
            picker.addObject(sphere);
            let intersects = picker.findIntersection(event);
            if (intersects.length > 0) {
                let selected = intersects[0];//取第一个物体
                let position = Coordinate.cartesianToSpherical(selected.point.x, selected.point.y, selected.point.z);
                if(position){
                    return {
                        lon:position.longitude,
                        lat:position.latitude
                    }
                }
            }
    }


    /********************/
    //绘制点
    // function drawPoint(event){
    //     let picker = new Picker();
    //     picker.addObject(sphere);
    //     let intersects = picker.findIntersection(event);
    //     if (intersects.length > 0) {
    //         let selected = intersects[0];//取第一个物体
    //         let position = Coordinate.cartesianToSpherical(selected.point.x, selected.point.y, selected.point.z);
    //         var pt =new CPonit(scene);
    //         pt.draw(position.longitude,position.latitude);
    //         console.log(position);
    //     }
    // }

    /********************************/
    //绘制面
    // var dragging = false;
    // var canvas = document.getElementById('webgl');
    // var pt_start,pt_sec;
    // var pArray=[];
    // var tmppolygon=new CPolygon(scene);
    // canvas.onmousedown = function (e){
    //     if(e.button===0){
    //         var pos=GetMouseLonLat(e);
    //         e.preventDefault();
    //         pt_start=new Lonlat(pos.lon,pos.lat);
    //         pt_sec=new Lonlat(pos.lon,pos.lat);
    //         pArray.push(pt_start);
    //         pArray.push(pt_sec);
    //         dragging = true;
    //     }
    //     else if(e.button===2){
    //         tmppolygon=new CPolygon(scene);
    //         dragging =false;
    //         pt_start=null;
    //         pt_sec=null;
    //         pArray=[];
    //     }
    //
    //
    // }
    // canvas.onmousemove = function (e){
    //     if(dragging){
    //         e.preventDefault();
    //         var pos=GetMouseLonLat(e);
    //         pt_sec=new Lonlat(pos.lon,pos.lat);
    //         pArray.push(pt_sec);
    //         tmppolygon.draw(pArray);
    //         // pt_end=new Lonlat(pos.lon,pos.lat);
    //     }
    // }
    // canvas.onmouseup = function (e){
    //     dragging = false;
    //     e.preventDefault();
    // }
    /********************/

    /********************/
    // 绘制线
    // var dragging = false;
    // var canvas = document.getElementById('webgl');
    // var pt_start;
    // var tmpline=new CLine(scene);
    // var pArray=[];
    // canvas.onmousedown = function (e){
    //     if(e.button===0){
    //             var pos=GetMouseLonLat(e);
    //             e.preventDefault();
    //             pt_start=new Lonlat(pos.lon,pos.lat);
    //             pArray.push(pt_start);
    //             if(pArray.length>=2){
    //                 tmpline.draw(pArray);
    //             }
    //             dragging = true;
    //     }
    //     else if(e.button===2){
    //         tmpline=new CLine(scene);
    //         dragging =false;
    //         pArray=[];
    //     }
    //
    //
    // }
    // canvas.onmousemove = function (e){
    //     if(dragging){
    //         /* 鼠标左键未点击时线段的移动状态 */
    //         if (scene.getObjectByName('line_move')) {
    //             scene.remove(scene.getObjectByName('line_move'));
    //         }
    //         /* 创建线段 */
    //         let lineGeometry = new Geometry();
    //         let lineMaterial = new  LineBasicMaterial({color: 0x990000});
    //         if (pArray.length > 0){
    //             var pos=GetMouseLonLat(e);
    //             if(pos){
    //                 var pt=new Lonlat(pos.lon,pos.lat);
    //                 let position =  Coordinate.sphericalToCartesian(pt.lon,pt.lat);
    //                 let p1 = new Vector3( position.x,position.y,position.z);
    //                 let position1=  Coordinate.sphericalToCartesian(pt_start.lon,pt_start.lat);
    //                 let p2 = new Vector3( position1.x,position1.y,position1.z);
    //                 lineGeometry.vertices.push(p2);
    //                 lineGeometry.vertices.push(p1);
    //                 let line = new Line(lineGeometry, lineMaterial);
    //                 line.name = 'line_move';
    //                 scene.add(line);
    //             }
    //
    //         }
    //     }
    // }


    /*****************************/
    //绘制面
    var dragging = false;
    var canvas = document.getElementById('webgl');
    // var drawline=true;
    var pt_start;
    var tmpline=new CLine(scene);
    var tmppolygon=new CPolygon(scene);
    var pArray=[];
    var polypArray=[];
    canvas.onmousedown = function (e){
        if(e.button===0){
            var pos=GetMouseLonLat(e);
            e.preventDefault();
            pt_start=new Lonlat(pos.lon,pos.lat);

            polypArray.push(pt_start);
            if(pArray.length<2){
                pArray.push(pt_start);
                tmpline.draw(pArray);
            }
            if(polypArray.length>=3){
                tmppolygon.draw(polypArray);
                // drawline=false;
            }
            dragging = true;
        }
        else if(e.button===2){
            tmpline=new CLine(scene);
            dragging =false;
            pArray=[];
            tmppolygon=new CPolygon(scene);
            pt_start=null;
            polypArray=[];
        }


    }
    canvas.onmousemove = function (e){
        if(dragging){
            /* 鼠标左键未点击时线段的移动状态 */
            // e.preventDefault();
            if (scene.getObjectByName('line_move')) {
                scene.remove(scene.getObjectByName('line_move'));
            }
            if (scene.getObjectByName('polygon_move')) {
                scene.remove(scene.getObjectByName('polygon_move'));
            }
            /* 创建线段 */

            let polygonGeometry = new Geometry();
            let polygonMaterial = new  MeshLambertMaterial({color: "#990000",side:2});
            if (pArray.length > 0){
                var pos=GetMouseLonLat(e);
                if(pos){
                    if(pArray.length<2){
                        let lineGeometry = new Geometry();
                        let lineMaterial = new  LineBasicMaterial({color: 0x990000, transparent: true});
                        var pt=new Lonlat(pos.lon,pos.lat); //鼠标的当前点
                        let position =  Coordinate.sphericalToCartesian(pt.lon,pt.lat);
                        let p1 = new Vector3( position.x,position.y,position.z);
                        let position1=  Coordinate.sphericalToCartesian(pt_start.lon,pt_start.lat); //
                        let p2 = new Vector3( position1.x,position1.y,position1.z);
                        lineGeometry.vertices.push(p2);
                        lineGeometry.vertices.push(p1);
                        let line = new Line(lineGeometry, lineMaterial);
                        line.name = 'line_move';
                        scene.add(line);
                    }else{

                        polygonGeometry.computeFaceNormals();
                        //最后一个点
                        var pt=new Lonlat(pos.lon,pos.lat);
                        let position =  Coordinate.sphericalToCartesian(pt.lon,pt.lat);
                        let p3 = new Vector3( position.x,position.y,position.z);
                        //上一个点
                        var len=polypArray.length;
                        let position1=  Coordinate.sphericalToCartesian(polypArray[len-1].lon,polypArray[len-1].lat);
                        let p2 = new Vector3( position1.x,position1.y,position1.z);
                        //第一个点
                        let position2=  Coordinate.sphericalToCartesian(polypArray[0].lon,polypArray[0].lat);
                        let p1 = new Vector3( position2.x,position2.y,position2.z);
                        polygonGeometry.vertices.push(p1);
                        polygonGeometry.vertices.push(p2);
                        polygonGeometry.vertices.push(p3);
                        polygonGeometry.faces.push(new Face3(0,1,2));
                        var mesh = new Mesh(polygonGeometry, polygonMaterial);// 这个方法支持多种材质组合
                        mesh.name = 'polygon_move';
                        scene.add(mesh);
                    }
                }

            }
        }
    }

    // let polygonGeometry = new Geometry();
    // let polygonMaterial = new  MeshLambertMaterial({color: 0x990000});
    // let ppp1 = new Vector3( 3228584.544069745,3714116.78770723,4057364.898531347);
    // let ppp2 = new Vector3( 2812910.681908341,4238075.091761917,3847971.4919632887);
    // let ppp3 = new Vector3(  2310717.8937825733,3528842.431727358,4784191.206271189);
    // polygonGeometry.vertices.push(ppp1);
    // polygonGeometry.vertices.push(ppp2);
    // polygonGeometry.vertices.push(ppp3);
    // polygonGeometry.faces.push(new Face3(0,1,2));
    // polygonGeometry.computeFaceNormals();
    // var mesh = new Mesh(polygonGeometry, polygonMaterial);// 这个方法支持多种材质组合
    // scene.add(mesh);

    render();
    document.addEventListener("mousemove", setScale);
    // document.addEventListener("mousedown",drawPoint);
    // document.addEventListener("mousedown", Buttondown);
    // document.addEventListener("mouseup",LButtonup);
    // document.addEventListener("mousemove",LButtonmove);
    document.addEventListener("mousemove", onDocumentMouseDown);

}());




