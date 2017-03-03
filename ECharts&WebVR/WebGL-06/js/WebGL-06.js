var requestAnimationFrame = window.requestAnimationFrame 
        || window.mozRequestAnimationFrame
        || window.webkitRequestAnimationFrame
        || window.msRequestAnimationFrame;
window.requestAnimationFrame = requestAnimationFrame;

var scene = camera = renderer = id = stat = null;
var isMoving = false;
var a = 0.005;
var v = 0;
var keyA = keyS = keyD = keyW = false;

function init(){
	// stats
	stat = new Stats();
	stat.domElement.cssText = "position:absolute; right:0; top:0";
	document.body.appendChild(stat.domElement);

	// renderer
	var renderer = new THREE.WebGLRenderer({
		canvas: document.getElementById("mainCanvas"),
		antialias:true
	});
	renderer.setClearColor(0x666666);
	renderer.shadowMap.enabled = true;
	renderer.shadowMapSoft = true;

	// scene
	var scene = new THREE.Scene();

	// camera 
	var cameraPers = new THREE.PerspectiveCamera(60,16/9,1,100);
	cameraPers.position.set(-8,6,10);
	cameraPers.lookAt(new THREE.Vector3(0,0,0));
	scene.add(cameraPers);

	// light
	var light = new THREE.SpotLight(0xffffff,3, 100, Math.PI / 3, 30);

	light.position.set(-10,15,-5);
	light.target = new THREE.Object3D(0,0,0);

	light.shadow.camera.near = 1;
	light.shadow.camera.far = 100;
	light.shadow.camera.fov = 30;
	light.shadow.mapSize.width = 3000;
	light.shadow.mapSize.height = 3000;
	light.castShadow = true;
	var helper = new THREE.CameraHelper(light.shadow.camera);
	scene.add(helper);

	scene.add(light);

	// control
	var controls = new THREE.TrackballControls(cameraPers);
	controls.addEventListener('change',function(){
		renderer.render(scene,cameraPers);
	});

	controls.rotateSpeed = 2.0;

	function animate(){
		requestAnimationFrame(animate);
		controls.update();
	}

	animate();
	renderer.render(scene,cameraPers);

	// object
	var texture1 = new THREE.TextureLoader().load('../../obj/lietu2.jpg');
	texture1.wrapS = texture1.wrapT = THREE.RepeatWrapping;
	texture1.repeat.set(10,10);
	var plane = new THREE.Mesh(new THREE.PlaneGeometry(50,50),
		new THREE.MeshLambertMaterial({
			color: 0xffffff,
			map: texture1
		})
	);
	plane.rotation.x = -Math.PI / 2;

	plane.receiveShadow = true;

	scene.add(plane);

	// loader
	var onProgress = function ( xhr ) {  
        if ( xhr.lengthComputable ) {  
        	var percentComplete = xhr.loaded / xhr.total * 100;  
        }  
    };  
  
	var onError = function ( xhr ) { }; 

	var mtlLoader = new THREE.MTLLoader();
	mtlLoader.setTexturePath('../../obj/Protect_Van/');
	mtlLoader.setPath('../../obj/Protect_Van/');
	mtlLoader.load('Protect_Van.mtl',function(materials){
		materials.preload();

		var objLoader = new THREE.OBJLoader();
		objLoader.setMaterials(materials);
		objLoader.setPath('../../obj/Protect_Van/');
		objLoader.load('Protect_Van.obj',function(object){
			object.rotation.y = Math.PI;
			object.children[0].castShadow = true;
			object.children[1].castShadow = true;
			object.children[0].receiveShadow = true;
			object.children[1].receiveShadow = true;

			var pivot = new THREE.Object3D();
			pivot.position = object.position;
			pivot.add(object);

			scene.add(pivot);

			//render
			function draw(){
				stat.begin();

				keyCheck();

				carMove();

				cameraPers.lookAt(pivot.position);

				renderer.render(scene,cameraPers);

				id = requestAnimationFrame(draw);

				stat.end();
			}

			function keyCheck(){
				document.onkeydown = function(event){	//move
					var e = event || window.event || arguments.callee.caller.arguments[0];
					if(e && e.keyCode == 87){
						keyW = true;
					}
					if(e && e.keyCode == 83){
						keyS = true;
					}
					if(e && e.keyCode == 65){
						keyA = true;
					}
					if(e && e.keyCode == 68){
						keyD = true;
					}
				}

				document.onkeyup = function(event){	//stop
					var e = event || window.event || arguments.callee.caller.arguments[0];
					if(e && e.keyCode == 87){
						keyW = false;
					}
					if(e && e.keyCode == 83){
						keyS = false;
					}
					if(e && e.keyCode == 65){
						keyA = false;
					}
					if(e && e.keyCode == 68){
						keyD = false;
					}
				}
			}

			function carMove(){
				document.getElementById("data").innerHTML = 'speed: ' + Math.abs(v).toFixed(2);	// show speed

				if(keyW)carMoveAbove();
				if(keyA && keyS === false)carTurnLeft();
				if(keyD && keyS === false)carTurnRight();

				if(keyS){
					if(keyA)carTurnRight();
					if(keyD)carTurnLeft();
					carMoveBack();
				}

				if(keyW === false && keyS === false){
					isMoving = false;

					if(v > 0){
						v -= 0.005;
						if(v < 0)v = 0;
					}
					if(v < 0){
						v += 0.005;		
						if(v > 0)v = 0;
					} 
					pivot.translateZ(v);	//inertia
				}

				function carMoveAbove(){
					isMoving = true;
					if(v > -0.2)v -= a;
					pivot.translateZ(v);
				}

				function carMoveBack(){
					isMoving = true;
					if(v < 0.2)v += a;
					pivot.translateZ(v);
				}

				function carTurnLeft(){
					isMoving = true;
					pivot.rotation.y += Math.PI/128;
				}

				function carTurnRight(){
					isMoving = true;
					pivot.rotation.y -= Math.PI/128;
				}
			}

			id = requestAnimationFrame(draw);

		},onProgress,onError);
	});
}

function stop(){
	if(id !== null){
		cancelAnimationFrame(id);
		id = null;
	}
}

init();