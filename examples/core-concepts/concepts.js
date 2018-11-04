function init() {

  // use the defaults
  var stats = initStats();

  // create a scene, that will hold all our elements such as objects, cameras and lights.
  var scene = new THREE.Scene();
  scene.fog = new THREE.Fog(new THREE.Color(0xaaaaaa), 0, 200)

  // create a camera, which defines where we're looking at.
  var camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
  camera.position.set(20, 50, 50);
  camera.lookAt(new THREE.Vector3(10, 0, 0));

  // create a render and set the size
  var renderer = new THREE.WebGLRenderer({antialias: true});
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap; 
  renderer.setClearColor(new THREE.Color(0xaaaaaa));
  renderer.setSize(window.innerWidth, window.innerHeight);

  // add subtle ambient lighting
  var ambientLight = new THREE.AmbientLight(0x0c0c0c);
  scene.add(ambientLight);

  var groundGeom = new THREE.PlaneGeometry(10000, 10000, 4, 4);
  var groundMesh = new THREE.Mesh(groundGeom, new THREE.MeshStandardMaterial({
    color: 0xcccccc,
    roughness: 0.7, metalness: 0.0
  }));

  
  groundMesh.rotation.x = -Math.PI / 2;
  groundMesh.position.y = -7.5;
  groundMesh.receiveShadow = true
  scene.add(groundMesh);

  // add directionLight for the shadows
  var dirLight = new THREE.DirectionalLight(0xffffff);
  dirLight.position.set(100, 100, 80)
  scene.add(dirLight);

  var backLight = new THREE.DirectionalLight(0xffffff);
  backLight.position.set(-50, 100, -80)
  scene.add(backLight);

  var gridHelper = new THREE.GridHelper(50, 100)
  scene.add(gridHelper)

  var axesHelper = new THREE.AxesHelper( 25 );
  scene.add( axesHelper );

  // add the output of the renderer to the html element
  document.getElementById("webgl-output").appendChild(renderer.domElement);

  var loadedGeom = new THREE.Geometry();
  loadModel().then(model => {
    var bufferGem = model.children[0].geometry
    bufferGem.scale(0.2, 0.2 ,0.2)
    loadedGeom.fromBufferGeometry(bufferGem)
  });

  // call the render function
  var gui = new dat.GUI();
  var control = {
    showVertices: function() {
        addAsVertices(loadedGeom.clone())
    },
    showEdges: function() {
       addAsLines(loadedGeom.clone()) 
    },
    showMesh: function() {
       addAsMesh(loadedGeom.clone()) 
    },
    showFaces: function() {
       addAsFaces(loadedGeom.clone()) 
    }
  }
  gui.add(control, 'showVertices');
  gui.add(control, 'showEdges');
  gui.add(control, 'showFaces');
  gui.add(control, 'showMesh');
  var orbitControls = new THREE.OrbitControls(camera, renderer.domElement)

  var clock = new THREE.Clock()
  render();
  
  function render() {
    renderer.render(scene, camera);
    stats.update();
    orbitControls.update(clock.getDelta());
    requestAnimationFrame(render);
  }

  function addAsFaces(geometry) {
    var mm = scene.getObjectByName("group")
    if (mm != undefined) {
      scene.remove(mm);
    }
    mm = new THREE.Group();
    mm.name = "group"

    geometry.faces.forEach(face => {
      face.color.setRGB(Math.random(), Math.random(), Math.random())
    });
    var faceMat = new THREE.MeshStandardMaterial({roughness: 0.7, metalness: 0.0, flatShading: true, vertexColors: THREE.FaceColors});
    var mesh = new THREE.Mesh(geometry, faceMat)
    mm.add(mesh)
    scene.add(mm)
  }


  function addAsMesh(geometry) {
    var mm = scene.getObjectByName("group")
    if (mm != undefined) {
      scene.remove(mm);
    }
    mm = new THREE.Group();
    mm.name = "group"

    var textureLoader = new THREE.TextureLoader();
    geometry.computeVertexNormals();
    var mat = new THREE.MeshStandardMaterial({roughness: 0.7, metalness: 0.0, flatShading: true});
    mat.map = textureLoader.load("../assets/fox/texture.png")
    var mesh = new THREE.Mesh(geometry, mat)
    mm.add(mesh)
    scene.add(mm)
  }

  function addAsLines(geometry) {
    var lines = scene.getObjectByName("group")
    if (lines != undefined) {
      scene.remove(lines);
    }
    lines = new THREE.Group();
    lines.name = "group"

    var wireFrame = new THREE.MeshBasicMaterial({wireframe: true, color: 0xff0000})
    lines.add(new THREE.Mesh(geometry, wireFrame));
    scene.add(lines)
  }

  function addAsVertices(geometry) {
    var vertices = scene.getObjectByName("group")
    if (vertices != undefined) {
      scene.remove(vertices);
    }

    var defMaterial = new THREE.MeshBasicMaterial({color: 0xff0000});
    vertices = new THREE.Group();
    vertices.name = "group";

    geometry.vertices.forEach(vertex => {
      var miniSphere = new THREE.SphereGeometry(0.1, 0.1, 0.1);
      var miniMesh = new THREE.Mesh(miniSphere, defMaterial);
      miniMesh.position.copy(vertex);

      vertices.add(miniMesh);
    });

    scene.add(vertices);
  }

  function loadModel() {
    var loader = new THREE.OBJLoader();
    var p = new Promise(function(resolve) {
        loader.load('../assets/fox/fox.obj', function (loadedMesh) {
          resolve(loadedMesh);
        });
    });
  
    return p;
  }
}