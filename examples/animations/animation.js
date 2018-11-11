(function () {init()})();

function init() {

  // get a renderer and attach to html dom element
  var renderer = new THREE.WebGLRenderer({antialias: true});
  renderer.setClearColor(0x5c5c5c);
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.getElementById("webgl-output").appendChild(renderer.domElement);

  // define the scene
  var scene = new THREE.Scene();
  var camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 300);
  camera.position.set(0, 30, 30);

  var mixer;
  // load the gopher
  var fbxLoader = new THREE.FBXLoader();
    fbxLoader.load('../assets/duke/duke_1.fbx', duke => {

      // make it a bit smaller
      duke.scale.set(0.03, 0.03, 0.03);

      // remove unwanted elements from the scene
      duke.children.splice(6,1);
      duke.children.splice(4,1);
      duke.children.splice(2,1);

      // add
      scene.add(duke);

      mixer = new THREE.AnimationMixer(duke);
      var animation = duke.animations[0];
      var animationAction = mixer.clipAction(animation);
      animationAction.setLoop(THREE.LoopPingPong);
      animationAction.play();
  }, e => console.log(e), f => console.log(f))

  // add some lights
  var light = new THREE.DirectionalLight();
  light.position.z = 50;
  light.position.y = 50;
  scene.add(light);
  scene.add(new THREE.AmbientLight(0x5c5c5c))

  // kick off rendering
  renderer.setAnimationLoop(render)
  var clock = new THREE.Clock();
  function render() {
    renderer.render(scene, camera);
    if (mixer) mixer.update(clock.getDelta());
  }
  
  var orbitControls = new THREE.OrbitControls(camera, renderer.domElement)
  var clock = new THREE.Clock();

  window.addEventListener( 'resize', onWindowResize, false );
  function onWindowResize() {
    orbitControls.update(clock.getDelta());
    renderer.setSize( window.innerWidth, window.innerHeight );
  }  
}
