(function () {init()})();

function init() {

  // get a renderer and attach to html dom element
  var renderer = new THREE.WebGLRenderer();
  renderer.setClearColor(0xcccccc);
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.getElementById("webgl-output").appendChild(renderer.domElement);

  // define the camera
  var camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 100);
  camera.position.set(10, 4, 4);
  camera.lookAt(new THREE.Vector3(0,0,0))

  // create a scene and add the mesh
  var scene = new THREE.Scene();
  var cubeGeometry = new THREE.BoxGeometry(4, 2, 2);
  var material = new THREE.MeshNormalMaterial();
  var mesh = new THREE.Mesh(cubeGeometry, material);
  scene.add(mesh);

  // kick off rendering
  render()
  function render() {
    renderer.render(scene, camera);
    requestAnimationFrame(render);
    mesh.rotation.x += 0.005;
    mesh.rotation.y += 0.005;
    mesh.rotation.z += 0.005;
  }
}

  // 1. Add normalhelper
  // var sphere = new THREE.SphereGeometry(2, 10, 10);
  // var mesh = new THREE.Mesh(sphere, new THREE.MeshNormalMaterial({flatShading: true}));
  // var normalHelper = new THREE.FaceNormalsHelper(mesh);
  // mesh.add(normalHelper);

  // 2. Add standard material and lighting
  // var material = new THREE.MeshStandardMaterial({color: 0xff0000, roughness: 0.7, metalness: 0.0});
  //
  // var dirLight = new THREE.DirectionalLight();
  // dirLight.position.set(5, 4, 4);
  // scene.add(dirLight);

  // var ambientLight = new THREE.AmbientLight(0x2c2c2c);
  // scene.add(ambientLight);


