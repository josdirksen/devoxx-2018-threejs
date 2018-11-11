(function () {init()})();

function init() {

  // get a renderer and attach to html dom element
  var renderer = new THREE.WebGLRenderer({antialias: true});
  renderer.setClearColor(0xb4c8fc);
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.vr.enabled = true;
  document.getElementById("webgl-output").appendChild(renderer.domElement);

  document.body.appendChild( WEBVR.createButton( renderer ) );
  
  var scene = new THREE.Scene();

  // add a ground plane
  var groundPlane = new THREE.PlaneGeometry(2000, 2000);
  var planeMesh = new THREE.Mesh(groundPlane, new THREE.MeshLambertMaterial({color: 0xafff91}));
  planeMesh.rotation.x = -0.5*Math.PI;
  scene.add(planeMesh);

  // sete the skybox
  scene.background = new THREE.CubeTextureLoader()
	.setPath( 'skybox/' )
	.load( [

    'SunSetLeft2048.png',
    'SunSetRight2048.png',
		'SunSetUp2048.png',
		'SunSetDown2048.png',
		'SunSetFront2048.png',
		'SunSetBack2048.png'
	] );

  // add some fog
  scene.fog = new THREE.Fog(new THREE.Color(0xaaaaaa), 0, 1000)

  // camera container
  var cameraContainer = new THREE.Object3D();
  cameraContainer.position.set(100, 100, 1100);
  cameraContainer.lookAt(new THREE.Vector3(0, 100, 0));
  scene.add(cameraContainer);

  // define the camera
  var camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 10, 1500);
  camera.position.set(0, 0, 0);
  // camera.lookAt(new THREE.Vector3(100,-300,1100))
  cameraContainer.add(camera);

  // lock the intial look direction so we can use that to slowly move the camera
  var initialLookAtDirection = cameraContainer.getWorldDirection().divideScalar(5)
  
  // add some lights
  var light = new THREE.DirectionalLight();
  light.position.set(200, 300, 300);
  scene.add(light);
  scene.add(new THREE.AmbientLight(0x3c3c3c))

  // render a simple city
  var city  = new THREEx.ProceduralCity(renderer, 10000)
  scene.add(city);

  // kick off rendering
  renderer.setAnimationLoop(render)
  function render() {
    renderer.render(scene, camera);
    cameraContainer.position.add(initialLookAtDirection);
  }

  window.addEventListener( 'resize', onWindowResize, false );
  function onWindowResize() {
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
