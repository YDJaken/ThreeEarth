import {EventDispatcher} from "./Core/EventDispatcher.js";
import {Vector3} from "./Datum/Math/Vector3.js";
import {Vector2} from "./Datum/Math/Vector2.js";
import {Quaternion} from "./Datum/Math/Quaternion.js";
import {TileUtil} from "../tileService/tileutil.js"
import {EarthRadius} from "./Core/Constants.js";


class TrackballControls extends EventDispatcher {
	constructor(object, layers, domElement) {
		super();
		this.type = 'TrackballControls';
		this.STATE = { NONE: - 1, ROTATE: 0, ZOOM: 1, PAN: 2, TOUCH_ROTATE: 3, TOUCH_ZOOM_PAN: 4 };

		this.object = object;
	
		//层级管理器
		this.layers = layers;
		// API函数

		this.enabled = true;

		this.screen = { left: 0, top: 0, width: 0, height: 0 };

		this.rotateSpeed = 0.2;
		this.rotateStart = 1.0;
		this.zoomSpeed = 10;
		this.panSpeed = 0.3;

		this.noRotate = false;
		this.noZoom = false;
		this.noPan = false;

		this.staticMoving = false;
		this.dynamicDampingFactor = 0.2;

		this.minDistance = 0;
		this.maxDistance = Infinity;
		this._eye = new Vector3();
		this.keys = [ 65 /*A*/, 83 /*S*/, 68 /*D*/ ];
		this._state = this.STATE.NONE;
		// 接口

		this.target = new Vector3();

		this.EPS = 0.001;

		this.lastPosition = new Vector3();

		
		this._prevState = this.STATE.NONE;

		

		this._movePrev = new Vector2();
		this._moveCurr = new Vector2();

		this._lastAxis = new Vector3();
		this._lastAngle = 0;

		this._zoomStart = new Vector2();
		this._zoomEnd = new Vector2();

		this._touchZoomDistanceStart = 0;
		this._touchZoomDistanceEnd = 0;

		this._panStart = new Vector2();
		this._panEnd = new Vector2();


		this.axis = new Vector3();
		this.quaternion = new Quaternion();
		this.eyeDirection = new Vector3();
		this.objectUpDirection = new Vector3();
		this.objectSidewaysDirection = new Vector3();
		this.moveDirection = new Vector3();
		this.angle;



		//重置设置

		this.target0 = this.target.clone();
		this.position0 = this.object.position.clone();
		this.up0 = this.object.up.clone();

		// 事件

		this.changeEvent = { type: 'change' };
		this.startEvent = { type: 'start' };
		this.endEvent = { type: 'end' };
		

		document.addEventListener( 'contextmenu', this.contextmenu.bind(this), false );
		document.addEventListener( 'mousedown', this.mousedown.bind(this), false );
		document.addEventListener( 'wheel', this.mousewheel.bind(this), false );

		document.addEventListener( 'touchstart', this.touchstart.bind(this), false );
		document.addEventListener( 'touchend', this.touchend.bind(this), false );
		document.addEventListener( 'touchmove', this.touchmove.bind(this), false );

		window.addEventListener( 'keydown', this.keydown.bind(this), false );
		window.addEventListener( 'keyup', this.keyup.bind(this), false );

		document.addEventListener( 'mousemove', this.mousemove.bind(this), false );
		document.addEventListener( 'mouseup', this.mouseup.bind(this), false );
		this.handleResize();

		// force an update at start
		this.update();

	}

	
	
	// 方法

	handleResize() {

		if ( document === document ) {

			this.screen.left = 0;
			this.screen.top = 0;
			this.screen.width = window.innerWidth;
			this.screen.height = window.innerHeight;

		} else {

			var box = document.getBoundingClientRect();
			// adjustments come from similar code in the jquery offset() function
			var d = document.ownerDocument.documentElement;
			this.screen.left = box.left + window.pageXOffset - d.clientLeft;
			this.screen.top = box.top + window.pageYOffset - d.clientTop;
			this.screen.width = box.width;
			this.screen.height = box.height;

		}

	};

	handleEvent( event ) {

		if ( typeof this[ event.type ] == 'function' ) {

			this[ event.type ]( event );

		}

	};

	getMouseOnScreen() {

		var vector = new Vector2();

		return function getMouseOnScreen( pageX, pageY ) {

			vector.set(
				( pageX - this.screen.left ) / this.screen.width,
				( pageY - this.screen.top ) / this.screen.height
			);

			return vector;

		};

	};

	getMouseOnCircle(pageX, pageY) {

		let vector = new Vector2();
        let that = this
			vector.set(
				( ( pageX - that.screen.width * 0.5 - that.screen.left ) / ( that.screen.width * 0.5 ) ),
				( ( that.screen.height + 2 * ( that.screen.top - pageY ) ) / that.screen.width ) // screen.width intentional
			);
			return vector;
		};

	
	rotateCube (){
		let  that = this;
		that.moveDirection.set( that._moveCurr.x - that._movePrev.x, that._moveCurr.y - that._movePrev.y, 0 );
		that.angle = that.moveDirection.length();
			if(that.angle){

			}
	}
	rotateCamera (){
          let  that = this;
		  that.moveDirection.set( that._moveCurr.x - that._movePrev.x, that._moveCurr.y - that._movePrev.y, 0 );
		  that.angle = that.moveDirection.length();
		
			if ( that.angle ) {
				that._eye.copy( that.object.position ).sub( that.target );
				that.eyeDirection.copy( that._eye ).normalize();
				that.objectUpDirection.copy( that.object.up ).normalize();
				that.objectSidewaysDirection.crossVectors( that.objectUpDirection, that.eyeDirection ).normalize();
				that.objectUpDirection.setLength( that._moveCurr.y - that._movePrev.y );
				that.objectSidewaysDirection.setLength( that._moveCurr.x - that._movePrev.x );
				that.moveDirection.copy( that.objectUpDirection.add( that.objectSidewaysDirection ) );
				that.axis.crossVectors( that.moveDirection, that._eye ).normalize();
				that.angle *= that.rotateSpeed;
				that.quaternion.setFromAxisAngle( that.axis, that.angle );
				that._eye.applyQuaternion( that.quaternion );
				that.object.up.applyQuaternion( that.quaternion );
				that._lastAxis.copy( that.axis );
				that._lastAngle = that.angle;

			} else if ( !that.staticMoving && that._lastAngle ) {
			
				that._lastAngle *= Math.sqrt( 1.0 - that.dynamicDampingFactor );
				that._eye.copy( that.object.position ).sub( that.target );
				that.quaternion.setFromAxisAngle( that._lastAxis, that._lastAngle );
				that._eye.applyQuaternion( that.quaternion );
				that.object.up.applyQuaternion( that.quaternion );

			}

			that._movePrev.copy( that._moveCurr );
	};


	zoomCamera() {  

		var factor;
		
		if ( this._state === this.STATE.TOUCH_ZOOM_PAN ) {

			factor = this._touchZoomDistanceStart / this._touchZoomDistanceEnd;
			this._touchZoomDistanceStart = this._touchZoomDistanceEnd;
			this._eye.multiplyScalar( factor );

		} else {

			factor = 1 + ( this._zoomEnd.y - this._zoomStart.y ) * this.zoomSpeed;

			if ( factor !== 1.0 && factor > 0.0 ) {
				
				this._eye.multiplyScalar( factor );

			}

			if ( this.staticMoving ) {

				this._zoomStart.copy( this._zoomEnd );

			} else {

				this._zoomStart.y += ( this._zoomEnd.y - this._zoomStart.y ) * this.dynamicDampingFactor;

			}

		}

	};

	panCamera () {

		var mouseChange = new Vector2(),
			objectUp = new Vector3(),
			pan = new Vector3();

		return function panCamera() {

			mouseChange.copy( _panEnd ).sub( _panStart );

			if ( mouseChange.lengthSq() ) {

				mouseChange.multiplyScalar( this._eye.length() * this.panSpeed );

				pan.copy( this._eye ).cross( this.object.up ).setLength( mouseChange.x );
				pan.add( objectUp.copy( this.object.up ).setLength( mouseChange.y ) );

				this.object.position.add( pan );
				this.target.add( pan );

				if ( this.staticMoving ) {

					_panStart.copy( _panEnd );

				} else {

					_panStart.add( mouseChange.subVectors( _panEnd, _panStart ).multiplyScalar( this.dynamicDampingFactor ) );

				}

			}

		};

	};

	checkDistances () {

		if ( ! this.noZoom || ! this.noPan ) {
			
			if ( this._eye.lengthSq() > this.maxDistance * this.maxDistance ) {
				console.log('checkDistances')
				this.object.position.addVectors( this.target, this._eye.setLength( this.maxDistance ) );
				this._zoomStart.copy( this._zoomEnd );

			}

			if ( this._eye.lengthSq() < this.minDistance * this.minDistance ) {
				console.log('checkDistances111')
				this.object.position.addVectors( this.target, this._eye.setLength( this.minDistance ) );
				this._zoomStart.copy( this._zoomEnd );

			}

		}

	};

	update () {

		this._eye.subVectors( this.object.position, this.target );

		if ( ! this.noRotate ) {

			this.rotateCamera();
			this.rotateCube();

		}

		if ( ! this.noZoom ) {

			this.zoomCamera();

		}

		if ( ! this.noPan ) {

			this.panCamera();

		}

		this.object.position.addVectors( this.target, this._eye );

		this.checkDistances();

		this.object.lookAt( this.target );

		if ( this.lastPosition.distanceToSquared( this.object.position ) > this.EPS ) {

			this.dispatchEvent( this.changeEvent );

			this.lastPosition.copy( this.object.position );

		}

	};

	reset() {

		this._state = this.STATE.NONE;
		this._prevState = this.STATE.NONE;

		this.target.copy( this.target0 );
		this.object.position.copy( this.position0 );
		this.object.up.copy( this.up0 );

		this._eye.subVectors( this.object.position, this.target );

		this.object.lookAt( this.target );

		this.dispatchEvent( this.changeEvent );

		lastPosition.copy( this.object.position );

	};

	// 监听

	 keydown( event ) {
		// console.log('keydown')
		if ( this.enabled === false ) return;

		window.removeEventListener( 'keydown', this.keydown );

		this._prevState = this._state;

		if ( this._state !== this.STATE.NONE ) {

			return;

		} else if ( event.keyCode === this.keys[ this.STATE.ROTATE ] && ! this.noRotate ) {

			this._state = this.STATE.ROTATE;

		} else if ( event.keyCode === this.keys[ this.STATE.ZOOM ] && ! this.noZoom ) {

			this._state = this.STATE.ZOOM;

		} else if ( event.keyCode === this.keys[ this.STATE.PAN ] && ! this.noPan ) {

			this._state = this.STATE.PAN;

		}

	}

	 keyup( event ) {

		if ( this.enabled === false ) return;

		this._state = this._prevState;

		window.addEventListener( 'keydown', this.keydown, false );

	}
	//初始位置记录
	 mousedown( event ) {

		if ( this.enabled === false ) return;

		event.preventDefault();
		event.stopPropagation();
		if ( this._state === this.STATE.NONE ) {

			this._state = event.button;

		}

		if ( this._state === this.STATE.ROTATE && ! this.noRotate ) {
			//console.log("鼠标左键按下触发")
			this._moveCurr.copy( this.getMouseOnCircle( event.pageX, event.pageY ) );
			this._movePrev.copy( this._moveCurr );
			

		} else if ( this._state === this.STATE.ZOOM && ! this.noZoom ) {
			// console.log("鼠标右键按下触发")
			this._zoomStart.copy( getMouseOnScreen( event.pageX, event.pageY ) );
			this._zoomEnd.copy( this._zoomStart );

		} else if ( this._state === this.STATE.PAN && ! this.noPan ) {
			// console.log("鼠标右键按下触发")
			this._panStart.copy( getMouseOnScreen( event.pageX, event.pageY ) );
			this._panEnd.copy( this._panStart );

		}


		this.dispatchEvent( this.startEvent );

	}
	//作为监听函数，监听鼠标移动
	 mousemove( event ) {

		if ( this.enabled === false ) return;

		event.preventDefault();
		event.stopPropagation();
		//先记录之前的move值，再读取新的move值
		if ( this._state === this.STATE.ROTATE && ! this.noRotate ) {
			this._movePrev.copy( this._moveCurr );
			this._moveCurr.copy( this.getMouseOnCircle( event.pageX, event.pageY ) );
			
		} else if ( this._state === this.STATE.ZOOM && ! this.noZoom ) {
			this._zoomEnd.copy( this.getMouseOnScreen( event.pageX, event.pageY ) );
		} else if ( this._state === this.STATE.PAN && ! this.noPan ) {
			this._panEnd.copy( this.getMouseOnScreen( event.pageX, event.pageY ) );

		}

	}
	//作为监听函数，监听鼠标事件结束
	 mouseup( event ) {

		if ( this.enabled === false ) return;

		event.preventDefault();
	    event.stopPropagation();

		this._state = this.STATE.NONE;
		this.dispatchEvent( this.endEvent );

	}
	
	 mousewheel( event ) {
		let that = this
		
		if ( this.enabled === false ) return;

		if ( this.noZoom === true ) return;

		event.preventDefault();
		event.stopPropagation();

		switch ( event.deltaMode ) {

			case 2:
				// Zoom in pages
				_zoomStart.y -= event.deltaY * 0.025;
				break;

			case 1:
				// Zoom in lines
				_zoomStart.y -= event.deltaY * 0.01;
				break;

			default:
			
				let distance = TileUtil.twoPointsDistance(that._eye,new Vector3(0,0,0)) - EarthRadius
				let n = event.deltaY * Math.abs(distance)*0.00000000005
		        let level = TileUtil.distance2Level(distance)

				//缩放速度优化
				if(distance>=5 && event.deltaY<0){
					//缩进动作，可插入执行函数
					that._zoomStart.y -= n;
					that.object.up.x = 0;
					that.object.up.y = 1;
					that.object.up.z = 0;
				}
				else if(distance<=40214962.88686301 && event.deltaY>0){
					//回退动作，可以插入执行函数
					that._zoomStart.y -= n;
					//需要根据回退操作隐藏比当前Level更深层级的图层
					that.object.up.x = 0;
					that.object.up.y = 1;
					that.object.up.z = 0;
				}
				//转动速度优化
				if (distance <= 100){
					that.rotateSpeed = that.rotateStart*distance*0.00000013;
					
				}else if (100 < distance && distance <= 200){
					that.rotateSpeed = that.rotateStart*distance*0.00000013;
					
				} //return 20;
				else if (200 < distance  && distance <= 300){
					that.rotateSpeed = that.rotateStart*distance*0.00000013;
					
				}// return 19;
				else if (300 < distance  && distance <= 500){
					that.rotateSpeed = that.rotateStart*distance*0.00000013;
					
				}// return 18;
				else if (500 < distance  && distance <= 800){
					that.rotateSpeed = that.rotateStart*distance*0.00000013;
					
				}// return 17;
				else if (800 <  distance  && distance <= 1500){
					that.rotateSpeed = that.rotateStart*distance*0.000000126;
					
				}// return 16;
				else if (1500 <  distance  && distance <= 3500){
					that.rotateSpeed = that.rotateStart*distance*0.000000126;
					
				} //return 15;
				else if (3500 <  distance  && distance <= 6000){
					that.rotateSpeed = that.rotateStart*distance*0.000000124;
					
				} //return 14;
				else if (6000 < distance  && distance <= 15000){
					that.rotateSpeed = that.rotateStart*distance*0.000000125;
					
				}// return 13;
				else if (15000 < distance  && distance <= 48000){
					that.rotateSpeed = that.rotateStart*distance*0.000000123;
					
				}// return 12;
				else if (48000 < distance  && distance <= 80000){
					that.rotateSpeed = that.rotateStart*distance*0.000000123;
					
				}
				else if (80000 < distance  && distance <= 150000){
					that.rotateSpeed = that.rotateStart*distance*0.000000123;
					
				}// return 10;
				else if (150000 < distance  && distance <= 300000){
					that.rotateSpeed = that.rotateStart*distance*0.000000125;
					
				}// return 9;
				else if (300000 < distance  && distance <= 520000){
					that.rotateSpeed = that.rotateStart*distance*0.000000124;
					
				}// return 8;
				else if (520000 < distance  && distance <= 920000){
					that.rotateSpeed = that.rotateStart*distance*0.000000131;
					
				}// return 7;
				else if (920000 < distance  && distance <= 1900000){
					that.rotateSpeed = that.rotateStart*distance*0.000000125;
					
				}// return 6;
				else if (1900000 < distance  && distance <= 3000000){
					that.rotateSpeed = that.rotateStart*distance*0.000000130;
					
				}// return 5;
				else if (3000000 < distance  && distance <= 12500000){
					that.rotateSpeed = that.rotateStart*distance*0.00000015;
					
				}// return 4;
				else if (12500000 < distance  && distance <= 14000000){
					that.rotateSpeed = that.rotateStart*distance*0.00000013;
					
				}// return 3;
				else return 3;
				// that.rotateSpeed = that.rotateStart*distance*0.00000013
		
				break;

		}

		this.dispatchEvent( this.startEvent );
		this.dispatchEvent( this.endEvent );

	}

	 touchstart( event ) {

		if ( this.enabled === false ) return;

		switch ( event.touches.length ) {

			case 1:
				_state = STATE.TOUCH_ROTATE;
				this._moveCurr.copy( this.getMouseOnCircle( event.touches[ 0 ].pageX, event.touches[ 0 ].pageY ) );
				this._movePrev.copy( this._moveCurr );
				break;

			default: // 2 or more
				_state = STATE.TOUCH_ZOOM_PAN;
				var dx = event.touches[ 0 ].pageX - event.touches[ 1 ].pageX;
				var dy = event.touches[ 0 ].pageY - event.touches[ 1 ].pageY;
				_touchZoomDistanceEnd = _touchZoomDistanceStart = Math.sqrt( dx * dx + dy * dy );

				var x = ( event.touches[ 0 ].pageX + event.touches[ 1 ].pageX ) / 2;
				var y = ( event.touches[ 0 ].pageY + event.touches[ 1 ].pageY ) / 2;
				_panStart.copy( this.getMouseOnScreen( x, y ) );
				_panEnd.copy( _panStart );
				break;

		}

		this.dispatchEvent( this.startEvent );

	}

	 touchmove( event ) {

		if ( this.enabled === false ) return;

		event.preventDefault();
		event.stopPropagation();

		switch ( event.touches.length ) {

			case 1:
			this._movePrev.copy( this._moveCurr );
			this._moveCurr.copy( getMouseOnCircle( event.touches[ 0 ].pageX, event.touches[ 0 ].pageY ) );
				break;

			default: // 2 or more
				var dx = event.touches[ 0 ].pageX - event.touches[ 1 ].pageX;
				var dy = event.touches[ 0 ].pageY - event.touches[ 1 ].pageY;
				_touchZoomDistanceEnd = Math.sqrt( dx * dx + dy * dy );

				var x = ( event.touches[ 0 ].pageX + event.touches[ 1 ].pageX ) / 2;
				var y = ( event.touches[ 0 ].pageY + event.touches[ 1 ].pageY ) / 2;
				_panEnd.copy( this.getMouseOnScreen( x, y ) );
				break;

		}

	}

	 touchend( event ) {

		if ( this.enabled === false ) return;

		switch ( event.touches.length ) {

			case 0:
			    this._state = this.STATE.NONE;
				break;

			case 1:
			    this._state = this.STATE.TOUCH_ROTATE;
				this._moveCurr.copy( this.getMouseOnCircle( event.touches[ 0 ].pageX, event.touches[ 0 ].pageY ) );
				this._movePrev.copy( this._moveCurr );
				break;

		}

		this.dispatchEvent( this.endEvent );

	}

	 contextmenu( event ) {

		if ( this.enabled === false ) return;

		event.preventDefault();

	}

	dispose() {

		document.removeEventListener( 'contextmenu', this.contextmenu.bind(this), false );
		document.removeEventListener( 'mousedown', this.mousedown.bind(this), false );
		document.removeEventListener( 'wheel', this.mousewheel.bind(this), false );

		document.removeEventListener( 'touchstart', this.touchstart.bind(this), false );
		document.removeEventListener( 'touchend', this.touchend.bind(this), false );
		document.removeEventListener( 'touchmove', this.touchmove.bind(this), false );

		document.removeEventListener( 'mousemove', this.mousemove.bind(this), false );
		document.removeEventListener( 'mouseup', this.mouseup.bind(this), false );

		window.removeEventListener( 'keydown', this.keydown.bind(this), false );
		window.removeEventListener( 'keyup', this.keyup.bind(this), false );

	};

	

};
export { TrackballControls };