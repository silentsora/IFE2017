function init(){
	// renderer
	var renderer = new THREE.WebGLRenderer({
		canvas: document.getElementById("mainCanvas")
	});
	renderer.setClearColor(0x666666);
	renderer.shadowMap.enabled = true;
	renderer.shadowMapSoft = true;

	// scene
	var scene = new THREE.Scene();

	// camera 
	var cameraPers = new THREE.PerspectiveCamera(30,4/3,1,20);
	cameraPers.position.set(-4,3,5);
	cameraPers.lookAt(new THREE.Vector3(0,0,0));
	scene.add(cameraPers);

	// object
	var plane = new THREE.Mesh(new THREE.PlaneGeometry(6,6),
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

	var cube2 = new THREE.Mesh(new THREE.CubeGeometry(1,0.15,3),
		new THREE.MeshLambertMaterial({
			color: 0xffffff
		})
	);
	cube2.position.y = -0.25;

	var cylinder = new THREE.Mesh(new THREE.CylinderGeometry(0.5,0.5,1.8,18,3),
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

    cube1.castShadow = true;
	cube2.castShadow = true;
	cylinder.castShadow = true;
	torus1.castShadow = true;
	torus2.castShadow = true;
	torus3.castShadow = true;
	torus4.castShadow = true;
	plane.receiveShadow = true;
	cube1.receiveShadow = true;
	cube2.receiveShadow = true;
	cylinder.receiveShadow = true;

	scene.add(plane,cube1,cube2,cylinder,torus1,torus2,torus3,torus4);

	// light
	var light = new THREE.SpotLight(0xffffff,1.3, 100, Math.PI / 4, 25);
	light.position.set(-6,5,-2);
	light.target = cube1;

	light.shadow.camera.near = 1;
	light.shadow.camera.far = 15;
	light.shadow.camera.fov = 30;
	light.castShadow = true;

	scene.add(light);

	// render
	renderer.render(scene,cameraPers);
}