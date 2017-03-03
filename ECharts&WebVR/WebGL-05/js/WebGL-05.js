var requestAnimationFrame = window.requestAnimationFrame 
        || window.mozRequestAnimationFrame
        || window.webkitRequestAnimationFrame
        || window.msRequestAnimationFrame;
window.requestAnimationFrame = requestAnimationFrame;

var scene = camera = renderer = id = stat = null;
var isMoving = false;
var a = 0.002;
var v = 0;
var keyA = keyS = keyD = keyW = false;

init();

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
	var cameraPers = new THREE.PerspectiveCamera(60,16/9,1,30);
	cameraPers.position.set(-4,3,5);
	cameraPers.lookAt(new THREE.Vector3(0,0,0));
	scene.add(cameraPers);

	// object
	var plane = new THREE.Mesh(new THREE.PlaneGeometry(20,20),
		new THREE.MeshLambertMaterial({
			color: 0xcffccc
		})
	);
	plane.position.y = -0.7;
	plane.rotation.x = -Math.PI / 2;

	var cube1 = new THREE.Mesh(new THREE.CubeGeometry(1,1,1),
		new THREE.MeshLambertMaterial({
    		color: 0xffffff
    	})
    );
	cube1.position.z = -1;

	var cube2 = new THREE.Mesh(new THREE.CubeGeometry(1,0.15,2),
		new THREE.MeshLambertMaterial({
    		color: 0xffffff
    	})
    );
	cube2.position.y = -0.25;
	cube2.position.z = 0.5;

	var cylinder = new THREE.Mesh(new THREE.CylinderGeometry(0.5,0.5,1.8,36,3),
		new THREE.MeshLambertMaterial({
    		color: 0xffffff
    	})
    );
	cylinder.position.set(0,0.2,0.5);
	cylinder.rotation.x = -Math.PI / 2; //90degree

	var torus1 = new THREE.Mesh(new THREE.TorusGeometry(0.2,0.08,8,20),
		new THREE.MeshLambertMaterial({
    		color: 0xffffff
    	})
    );
    torus1.position.set(0.5,-0.45,-1);
    torus1.rotation.y = Math.PI / 2;

	var torus2 = new THREE.Mesh(new THREE.TorusGeometry(0.2,0.08,8,20),
		new THREE.MeshLambertMaterial({
    		color: 0xffffff
    	})
    );
    torus2.position.set(0.5,-0.45,1);
    torus2.rotation.y = Math.PI / 2;

	var torus3 = new THREE.Mesh(new THREE.TorusGeometry(0.2,0.08,8,20),
		new THREE.MeshLambertMaterial({
    		color: 0xffffff
    	})
    );
    torus3.position.set(-0.5,-0.45,-1);
    torus3.rotation.y = Math.PI / 2;
    
	var torus4 = new THREE.Mesh(new THREE.TorusGeometry(0.2,0.08,8,20),
		new THREE.MeshLambertMaterial({
    		color: 0xffffff
    	})
    );
    torus4.position.set(-0.5,-0.45,1);
    torus4.rotation.y = Math.PI / 2;

    var car = new THREE.Group();
	car.add(cube1,cube2,cylinder,torus1,torus2,torus3,torus4);

	var pivot = new THREE.Object3D();
	pivot.position = car.position;
	pivot.add(car);

    cube1.castShadow = true;
	cube2.castShadow = true;
	cylinder.castShadow = true;
	torus1.castShadow = true;
	torus2.castShadow = true;
	torus3.castShadow = true;
	torus4.castShadow = true;

	cube1.receiveShadow = true;
	cube2.receiveShadow = true;
	cylinder.receiveShadow = true;
	torus1.receiveShadow = true;
	torus2.receiveShadow = true;
	torus3.receiveShadow = true;
	torus4.receiveShadow = true;

	plane.receiveShadow = true;

	scene.add(plane,pivot);

	// light
	var light = new THREE.SpotLight(0xffffff,1.3, 100, Math.PI / 3, 30);

	light.position.set(-6,5,-4);
	light.target = cube1;

	light.shadow.camera.near = 1;
	light.shadow.camera.far = 30;
	light.shadow.camera.fov = 30;
	light.shadow.mapSize.width = 3000;
	light.shadow.mapSize.height = 3000;
	light.castShadow = true;
	var helper = new THREE.CameraHelper(light.shadow.camera);
	scene.add(helper);

	scene.add(light);

	// render
	function draw(){
		stat.begin();

		keyCheck();

		carMove();

		cameraPers.lookAt(pivot.position);

		renderer.render(scene,cameraPers);

		id = requestAnimationFrame(draw);

		stat.end();
	}

	id = requestAnimationFrame(draw);

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
				v -= 0.003;
				if(v < 0)v = 0;
			}
			if(v < 0){
				v += 0.003;		
				if(v > 0)v = 0;
			} 
			pivot.translateZ(v);	//inertia
		}

		if(!isMoving){
			torus1.rotation.y = Math.PI/2; 
			torus3.rotation.y = Math.PI/2;	//torus reset
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
			torus1.rotation.y = Math.PI/2 + Math.PI/16;
			torus3.rotation.y = Math.PI/2 + Math.PI/16;
		}

		function carTurnRight(){
			isMoving = true;
			pivot.rotation.y -= Math.PI/128;
			torus1.rotation.y = Math.PI/2 - Math.PI/16;
			torus3.rotation.y = Math.PI/2 - Math.PI/16;
		}
	}
}

function stop(){
	if(id !== null){
		cancelAnimationFrame(id);
		id = null;
	}
}