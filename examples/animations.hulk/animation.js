(function () {init()})();

function init() {

  // get a renderer and attach to html dom element
  var renderer = new THREE.WebGLRenderer({antialias: true});
  renderer.setClearColor(0x5c5c5c);
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap; 
  document.getElementById("webgl-output").appendChild(renderer.domElement);

  // define the scene
  var scene = new THREE.Scene();
  scene.fog = new THREE.Fog(0x5c5c5c, 60, 200);
  var camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 300);
  camera.position.set(0, 30, 30);

  var mixer;
  var fbxLoader = new THREE.FBXLoader();
    fbxLoader.load('../assets/hulk/h3.fbx', hulk => {

      hulk.scale.set(7, 7, 7);

      console.log(hulk);
      // make it a bit smaller
      hulk.children[2].material.transparent = false;
      hulk.children[2].material.opacity = 1;
      hulk.children[2].castShadow = true;
      hulk.children[4].material.transparent = false;
      hulk.children[4].material.opacity = 1;
      hulk.children[4].castShadow = true;
      hulk.children[5].material.transparent = false;
      hulk.children[5].material.opacity = 1;
      hulk.children[5].castShadow = true;
      hulk.children[7].material.transparent = false;
      hulk.children[7].material.opacity = 1;
      hulk.children[7].castShadow = true;

      // add
      scene.add(hulk);

      // 1, 2, 3, 0

      mixer = new THREE.AnimationMixer(hulk);
      var animationAction0 = mixer.clipAction(hulk.animations[1]);
      var animationAction1 = mixer.clipAction(hulk.animations[2]);
      var animationAction2 = mixer.clipAction(hulk.animations[3]);
      var animationAction3 = mixer.clipAction(hulk.animations[0]);

      animationAction0.setLoop(THREE.LoopOnce).play();
      mixer.addEventListener( 'finished', function( e ) {
        if (e.action === animationAction0) {
          animationAction1.reset().setLoop(THREE.LoopOnce).play();
        } else if (e.action === animationAction1) {
          animationAction2.reset().setLoop(THREE.LoopOnce).play();
        } else if (e.action === animationAction2) {
          animationAction3.reset().setLoop(THREE.LoopOnce).play();
        } else if (e.action === animationAction3) {
          animationAction0.reset().setLoop(THREE.LoopOnce).play();
        }
      }); 
  }, e => console.log(e), f => console.log(f))

  // add some lights
  var light = new THREE.SpotLight();
  light.position.x = -20;
  light.position.z = 20;
  light.position.y = 30;
  light.castShadow = true;
  light.shadow.mapSize.width = 1024;  // default
  light.shadow.mapSize.height = 1024; // default
  light.shadow.camera.near = 0.5;       // default
  light.shadow.camera.far = 80      // default
  scene.add(light);

  scene.add(new THREE.AmbientLight(0x888888));

  // floor
  var floor = new THREE.Mesh(new THREE.PlaneGeometry(1000,1000), new THREE.MeshPhongMaterial(0xffffff))
  floor.rotateX(-0.5*Math.PI);
  floor.receiveShadow = true;
  scene.add(floor);
  // scene.add(new THREE.AmbientLight(0x5c5c5c))

  // kick off rendering
  renderer.setAnimationLoop(render)
  var clock = new THREE.Clock();

  function render() {
    renderer.render(scene, camera);
    var delta = clock.getDelta()
    if (mixer) mixer.update(delta);
    orbitControls.update(delta);
  }
  
  var orbitControls = new THREE.OrbitControls(camera, renderer.domElement)
  var clock = new THREE.Clock();

  window.addEventListener( 'resize', onWindowResize, false );
  function onWindowResize() {
  
    renderer.setSize( window.innerWidth, window.innerHeight );
  }  
}
