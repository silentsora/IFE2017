// 考虑做成加载后先加载普通模型，实际模型加载完成后再替换车体 

Physijs.scripts.worker = '../../src/physijs_worker.js';
Physijs.scripts.ammo = '../src/ammo.js';

(function init(){
	window.requestAnimationFrame = window.requestAnimationFrame 
	    || window.mozRequestAnimationFrame
	    || window.webkitRequestAnimationFrame
	    || window.msRequestAnimationFrame;

	var scene = camera = renderer = id = stat = null;
	var isMoving = false;
	var needNewRoad = 0;
	var a = 0.005;
	var v = 0;
	var keyA = keyS = keyD = keyW = false;

	var pivot = new Physijs.BoxMesh(
		new THREE.BoxGeometry(3,4,6),
		new THREE.MeshBasicMaterial({color: 0xffffff})
	);
	pivot.position.y = 2;

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
	var scene = new Physijs.Scene({fixedTimeStep: 1/60});
	scene.addEventListener('update',function(){/*
		keyCheck();

		carMove();

		roadUpdate();

		cameraPers.lookAt(pivot.position);

		light.position.z = pivot.position.z - 30;;
		light.target = pivot;*/
	})

	// camera 
	var cameraPers = new THREE.PerspectiveCamera(60,16/9,1,400);
	cameraPers.position.set(0,6,-20);
	cameraPers.lookAt(new THREE.Vector3(0,0,0));
	pivot.add(cameraPers);

	// light
	var light = new THREE.DirectionalLight(0xffffff,2);

	light.position.set(30,30,-30);

	light.shadow.camera.near = 1;
	light.shadow.camera.far = 100;
	light.shadow.mapSize.width = 3000;
	light.shadow.mapSize.height = 3000;
	light.castShadow = true;

	scene.add(light);

	// control
	var controls = new THREE.TrackballControls(cameraPers);
	controls.addEventListener('change',function(){
		renderer.render(scene,cameraPers);
	});

	controls.rotateSpeed = 2.0;

	// object
	var box = new Physijs.BoxMesh(
		new THREE.CubeGeometry(2,2,2),
		new THREE.MeshBasicMaterial({color: 0xffffff})
	);
	box.position.set(0,10,0)
	scene.add(box);

	var roadGeometry = new THREE.BoxGeometry(40,1,500);

	var roadTexture = Physijs.createMaterial(
		new THREE.MeshLambertMaterial({ map: new THREE.TextureLoader().load( '../../obj/road.jpg' ) }),
		.8, // high friction
		.4 // low restitution
	);
	roadTexture.map.wrapS = roadTexture.map.wrapT = THREE.RepeatWrapping;
	roadTexture.map.repeat.set(1,12.5);

	function createRoad(x,y,z){
		let road = new Physijs.BoxMesh(
			roadGeometry,
			roadTexture,
			0
		);
		road.position.set(x,y,z);
		road.__dirtyPosition = true;
		road.receiveShadow = true;
		return road;
	}

	var roadA = createRoad(0,-0.5,-500);
	var roadB = createRoad(0,-0.5,0);
	var roadC = createRoad(0,-0.5,500);

	scene.add(roadA);
	scene.add(roadB);
	scene.add(roadC);

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
			// transform into physijs object
			var model = object;
			for (let x in model.children){
				let material = Physijs.createMaterial(
					model.children[x].material,
					1,
					0
				);
				let mesh = new Physijs.BoxMesh(
					model.children[x].geometry,
					material,
					1
				);
				mesh.castShadow = true;
				mesh.receiveShadow = true;

				pivot.add(mesh);
			}
		},onProgress,onError);
	});

	//render
	scene.add(pivot);
	scene.simulate();
	id = requestAnimationFrame(draw);

	function draw(){
		stat.begin();

		keyCheck();

		carMove();

		roadUpdate();

		cameraPers.lookAt(pivot.position);

		light.position.z = pivot.position.z - 30;;
		light.target = pivot;

		controls.update();
		scene.simulate();
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
		// show speed and position
		document.getElementById("data").innerHTML = 
			'speed: ' + Math.abs(v).toFixed(2) + '<br>'	+
			'x: ' + pivot.position.x.toFixed(2) + '<br>' +
			'y: ' + pivot.position.y.toFixed(2) + '<br>' +
			'z: ' + pivot.position.z.toFixed(2);

		checkDirection();
		//checkBorder();

		function checkDirection(){
			if(keyW)carMoveAbove();
			if(keyA && keyS === false)carTurnLeft();
			if(keyD && keyS === false)carTurnRight();

			if(keyS){
				if(keyA)carTurnRight();
				if(keyD)carTurnLeft();
				carMoveBack();
			}

			isMoving = true;

			if(keyW === false && keyS === false){
				isMoving = false;

				// inertia
				if(v > 0){
					v -= 0.02;
					if(v < 0)v = 0;
				}
				if(v < 0){
					v += 0.02;		
					if(v > 0)v = 0;
				} 
				pivot.translateZ(v);	
				pivot.__dirtyPosition = true;
			}
		}

		function carMoveAbove(){
			if(v < 0.5)v += 4*a;
			else if(v < 2)v += a;
			pivot.translateZ(v);
			pivot.__dirtyPosition = true;
			//pivot.setLinearVelocity(new THREE.Vector3(0,0,v*10));
		}

		function carMoveBack(){
			if(v > -0.5)v -= 4*a;
			else if(v > -2)v -= a;
			pivot.translateZ(v);
			pivot.__dirtyPosition = true;
		}

		function carTurnLeft(){
			/*pivot.setAngularVelocity(
				new THREE.Vector3(0,3,0)
			);*/
			pivot.rotation.y += Math.PI/128;
			pivot.__dirtyRotation = true;
		}

		function carTurnRight(){
			pivot.rotation.y -= Math.PI/128;
			pivot.__dirtyRotation = true;
		}

		// 边界检查
		function checkBorder(){
			if (pivot.position.x > 20){
				pivot.position.x = 20;
				impact();
			}
			if (pivot.position.x < -20){
				pivot.position.x = -20;
				impact();
			}
		}

		// 碰撞函数
		function impact(){
			v = -v;
			if (v < 0) v += 0.4;
			else v = 0;
		}
	}

	function roadUpdate(){
		var carZ = pivot.position.z;

		// 在roadB范围内，不需要加载新道路，参数为0
		if (roadB.position.z - 250 <= carZ && carZ <= roadB.position.z + 250){
			needNewRoad = 0;
		}

		// 进入roadC范围，需要加载新道路并销毁原roadA，参数为1
		if (roadC.position.z - 250 < carZ && carZ < roadC.position.z + 250){	
			needNewRoad = 1;
		}

		// 进入roadA范围，需要加载新道路并销毁原roadC，参数为-1
		if (roadA.position.z - 250 < carZ && carZ < roadA.position.z + 250){	
			needNewRoad = -1;
		}

		switch(needNewRoad){
			case 1:
				var roadEnd = roadC.position.z + 250;
				roadA.position.z = roadB.position.z;
				roadB.position.z = roadC.position.z;
				roadC.position.z = roadEnd + 250;
				console.log('new road is ready');
				break;
			case -1:
				var roadEnd = roadA.position.z - 250;
				roadC.position.z = roadB.position.z;
				roadB.position.z = roadA.position.z;
				roadA.position.z = roadEnd - 250;
				console.log('new road is ready');
				break;
			default:
				break;
		}
		roadA.__dirtyPosition = true;
		roadB.__dirtyPosition = true;
		roadC.__dirtyPosition = true;
	}
})();

function stop(){
	if (id !== null){
		cancelAnimationFrame(id);
		id = null;
	}
}