function init() {

  // use the defaults
  var stats = initStats();

  // create a scene, that will hold all our elements such as objects, cameras and lights.
  var scene = new THREE.Scene();
  scene.fog = new THREE.Fog(new THREE.Color(0xffffff), 0, 400)

  // create a camera, which defines where we're looking at.
  var camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
  camera.position.set(100, 30, 40);
  camera.lookAt(new THREE.Vector3(10, 0, 0));

  // create a render and set the size
  var renderer = new THREE.WebGLRenderer({antialias: true});
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap; 
  renderer.setClearColor(new THREE.Color(0xFFFFFF));
  renderer.setSize(window.innerWidth, window.innerHeight);
  var groundGeom = new THREE.PlaneGeometry(10000, 10000, 4, 4);
  var groundMesh = new THREE.Mesh(groundGeom, new THREE.MeshStandardMaterial({
    color: 0x777777,
    
  }));

  
  groundMesh.rotation.x = -Math.PI / 2;
  groundMesh.position.y = -7.5;
  groundMesh.receiveShadow = true
  scene.add(groundMesh);

  var sphereGeometry = new THREE.SphereGeometry(14, 20, 20);
  var cubeGeometry = new THREE.BoxGeometry(15, 15, 15);
  var planeGeometry = new THREE.PlaneGeometry(14, 14, 4, 4);

  var meshMaterial = new THREE.MeshStandardMaterial({color: 0xaaff00, roughness: 0.7, metalness: 0.0});
  var sphere = new THREE.Mesh(sphereGeometry, meshMaterial);
  sphere.castShadow = true;
  var cube = new THREE.Mesh(cubeGeometry, meshMaterial);
  cube.castShadow = true;
  var plane = new THREE.Mesh(planeGeometry, meshMaterial);

  var selectedMesh = cube;

  // position the sphere
  sphere.position.x = 0;
  sphere.position.y = 3;
  sphere.position.z = 2;

  cube.position = sphere.position;
  plane.position = sphere.position;

  // add the sphere to the scene
  scene.add(cube);

  // add subtle ambient lighting
  var ambientLight = new THREE.AmbientLight(0x0c0c0c);
  scene.add(ambientLight);

  // add spotlight for the shadows
  var spotLight = new THREE.DirectionalLight(0xffffff);
  spotLight.position.set(60, 100, 80)
  spotLight.castShadow = true;
  spotLight.shadow.camera.left = -20
  spotLight.shadow.camera.right = 20
  spotLight.shadow.camera.bottom = -20
  spotLight.shadow.camera.top = 20
  scene.add(spotLight);

  // add the output of the renderer to the html element
  document.getElementById("webgl-output").appendChild(renderer.domElement);

  // call the render function
  var step = 0;
  var oldContext = null;

  var controls = new function () {
    this.rotationSpeed = 0.02;
    this.bouncingSpeed = 0.03;
    this.selectedMesh = "cube";
  };

  var gui = new dat.GUI();
  addBasicMaterialSettings(gui, controls, meshMaterial);

  // var trackBallControls = initTrackballControls(camera, renderer);
  var orbitControls = new THREE.OrbitControls(camera, renderer.domElement)

  loadGopher(meshMaterial).then(function(gopher) {
    gopher.scale.x = 4;
    gopher.scale.y = 4;
    gopher.scale.z = 4;

    gui.add(controls, 'selectedMesh', ["cube", "sphere", "plane", "gopher"]).onChange(function (e) {

      scene.remove(plane);
      scene.remove(cube);
      scene.remove(sphere);
      scene.remove(gopher);

      switch (e) {
        case "cube":
          scene.add(cube);
          selectedMesh = cube;
          break;
        case "sphere":
          scene.add(sphere);
          selectedMesh = sphere;
          break;
        case "plane":
          scene.add(plane);
          selectedMesh = plane;
          break;
        case "gopher":
          scene.add(gopher);
          selectedMesh = gopher;
          break;
      }
    });
  });


  var clock = new THREE.Clock()
  render();
  
  function render() {
    stats.update();
    
    orbitControls.update(clock.getDelta());

    // selectedMesh.rotation.y = step += 0.01;
    // render using requestAnimationFrame
    requestAnimationFrame(render);
    renderer.render(scene, camera);
  }

}