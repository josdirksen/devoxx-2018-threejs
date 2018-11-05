(function () {init()})();

function init() {

  // get a renderer and attach to html dom element
  var renderer = new THREE.WebGLRenderer({antialias: true});
  renderer.setClearColor(0xaaaaaa);
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.getElementById("webgl-output").appendChild(renderer.domElement);

  var scene = new THREE.Scene();

  // setup the envmap
  var envMap = new THREE.CubeTextureLoader()
	.setPath( 'skybox/' )
	.load( [
    'SunSetLeft2048.png',
    'SunSetRight2048.png',
		'SunSetUp2048.png',
		'SunSetDown2048.png',
		'SunSetFront2048.png',
		'SunSetBack2048.png'
  ] );
  
  // add a ground plane
  var groundPlane  = new THREE.PlaneGeometry(2000, 2000);
  var planeMesh = new THREE.Mesh(groundPlane, new THREE.MeshLambertMaterial({color: 0xccccff}));
  planeMesh.rotation.x = -0.5*Math.PI;
  planeMesh.translateZ(-1.5);
  scene.add(planeMesh);  

  scene.fog = new THREE.Fog(new THREE.Color(0xaaaaaa), 0, 50);
  scene.background = envMap;

  // define the camera
  var camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 200);
  camera.position.set(0, 10, 10);
  camera.lookAt(new THREE.Vector3(0, 0, 0))

  var material = new THREE.MeshStandardMaterial();

  // load the gopher
  var ll = new THREE.FBXLoader();
  ll.load('../assets/gopher.fbx', gopher => {
    gopher.scale.set(0.01, 0.01, 0.01);
    gopher.translateY(-2);

    // copy original settings
    var origMat = gopher.children[0].material;
    material.envMap = envMap;
    material.color = origMat.color;
    material.emissive = origMat.emissive;
    material.emissiveIntensity = origMat.emissiveIntensity;
    gopher.children[0].material = material;

    scene.add(gopher);

    var controls = new function () {
      this.color = material.color.getStyle();
      this.emissive = material.emissive.getStyle();
    };

    var gui = new dat.GUI();

    addBasicMaterialSettings(gui, controls, material);
    var spGui = gui.addFolder("THREE.MeshStandardMaterial");
    spGui.addColor(controls, 'color').onChange(function (e) {
      material.color.setStyle(e)
    });
    spGui.addColor(controls, 'emissive').onChange(function (e) {
      material.emissive = new THREE.Color(e);
    });
    spGui.add(material, 'metalness', 0, 1, 0.01);
    spGui.add(material, 'roughness', 0, 1, 0.01);
    spGui.add(material, 'wireframe');
    spGui.add(material, 'wireframeLinewidth', 0, 20);

  }, e => console.log(e), f => console.log(f))

  // add some lights
  var light = new THREE.DirectionalLight();
  light.position.set(200, 300, 300);
  scene.add(light);
  scene.add(new THREE.AmbientLight(0x5c5c5c))

  // kick off rendering
  renderer.setAnimationLoop(render)
  function render() {
    renderer.render(scene, camera);
  }

  

  var orbitControls = new THREE.OrbitControls(camera, renderer.domElement)
  var clock = new THREE.Clock();

  window.addEventListener( 'resize', onWindowResize, false );
  function onWindowResize() {
    orbitControls.update(clock.getDelta());
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize( window.innerWidth, window.innerHeight );
  }  
}


// For VR.
// - Disable initial camera position
// - add:
//   - renderer.vr.enabled = true;
//   - document.body.appendChild( WEBVR.createButton( renderer ) );
