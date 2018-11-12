(function () {init()})();

function init() {

var envMap = new THREE.CubeTextureLoader()
	.setPath( 'flowers/' )
	.load( [
    'right.png',
    'left.png',
		'top.png',
		'bottom.png',
		'front.png',
		'back.png'
  ] );

  // get a renderer and attach to html dom element
  var renderer = new THREE.WebGLRenderer({antialias: true});
  renderer.setClearColor(0x000000);
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.getElementById("webgl-output").appendChild(renderer.domElement);

  var scene = new THREE.Scene();

  // define the camera
  var camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 200);
  camera.position.set(0, 10, 10);
  camera.lookAt(new THREE.Vector3(0, 0, 0))

  var material = new THREE.MeshStandardMaterial();
  material.envMap = envMap;
  var normalTextureLoader = new THREE.TextureLoader();
  var normalTexture = normalTextureLoader.load("Engraved_Metal_003_NORM.jpg");

  var controls = new function () {
    this.color = material.color.getStyle();
    this.emissive = material.emissive.getStyle();

    this.addNormalMap = function() {
      material.normalMap = normalTexture;
      material.needsUpdate = true;
    };

    this.removeNormalMap = function() {
      material.normalMap = null;
      material.needsUpdate = true;
    }
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

  gui.add(controls, 'addNormalMap');
  gui.add(controls, 'removeNormalMap');

  var cubeGeom = new THREE.CubeGeometry(3, 4, 5);
  var cubeMesh = new THREE.Mesh(cubeGeom, material);
  scene.add(cubeMesh);

  // add some lights
  var light = new THREE.DirectionalLight();
  light.position.set(200, 300, 300);
  scene.add(light);
  scene.add(new THREE.AmbientLight(0x5c5c5c))

  // kick off rendering
  renderer.setAnimationLoop(render)
  function render() {
    renderer.render(scene, camera);
    cubeMesh.rotation.y += 0.01
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
