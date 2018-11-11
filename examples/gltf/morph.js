(function () {init()})();

function init() {

  // get a renderer and attach to html dom element
  var renderer = new THREE.WebGLRenderer({antialias: true});
  renderer.setClearColor(0x3f3f3f);
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.getElementById("webgl-output").appendChild(renderer.domElement);

  var scene = new THREE.Scene();

  // define the camera
  var camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 200);
  camera.position.set(10, 40, 70);
  camera.lookAt(new THREE.Vector3(0, 70, 0))

  // add some lights
  var light = new THREE.DirectionalLight();
  light.position.set(200, 300, 300);
  scene.add(light);
  scene.add(new THREE.AmbientLight(0x5c5c5c))
  
  var mixer;
  var loader = new THREE.GLTFLoader();
  loader.load( 'flamingo.gltf', function ( gltf ) {
    console.log(gltf);
    var mesh = gltf.scene.children[ 0 ];
    console.log(mesh);
    mesh.scale.set( 0.35, 0.35, 0.35);
    mesh.position.y = 0;
    scene.add( mesh );
    mixer = new THREE.AnimationMixer( mesh );
    mixer.clipAction( gltf.animations[ 0 ] ).setDuration( 1 ).play();
  });

  // kick off rendering
  var clock = new THREE.Clock();
  var orbitControls = new THREE.OrbitControls(camera, renderer.domElement);
  renderer.setAnimationLoop(render)
  
  function render() {
    renderer.render(scene, camera);
    if (mixer) mixer.update(clock.getDelta());
    orbitControls.update(clock.getDelta())
  }
  
  window.addEventListener( 'resize', onWindowResize, false );
  function onWindowResize() {
    orbitControls.update(clock.getDelta());
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize( window.innerWidth, window.innerHeight );
  }  
}