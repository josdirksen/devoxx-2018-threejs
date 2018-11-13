(function () {init()})();

function init() {

  // get a renderer and attach to html dom element
	var renderer	= new THREE.WebGLRenderer({antialias: true, alpha: true});
	renderer.setClearColor(new THREE.Color('lightgrey'), 0)
  renderer.setSize( 640, 480 );
  renderer.autoClear = false;
	renderer.domElement.style.position = 'absolute'
	renderer.domElement.style.top = '0px'
	renderer.domElement.style.left = '0px'
	document.body.appendChild( renderer.domElement );

  // define the camera
  var scene = new THREE.Scene();
  var scene2 = new THREE.Scene();

  var camera = new THREE.PerspectiveCamera();
  var camera2 = new THREE.PerspectiveCamera();

  scene.add(camera);
  scene2.add(camera2);

  // Ar.Js initialization stuff
  var arToolkitSource = new THREEx.ArToolkitSource({ sourceType : 'webcam' })
  arToolkitSource.init(function onReady(){
		onResize()
  })
	var arToolkitContext = new THREEx.ArToolkitContext({
		cameraParametersUrl: './camera_para.dat',
    detectionMode: 'mono',
    maxDetectionRate: 30,
		canvasWidth: 80*3,
		canvasHeight: 60*3
	})
	arToolkitContext.init(function onCompleted(){
		camera.projectionMatrix.copy( arToolkitContext.getProjectionMatrix() );
		camera2.projectionMatrix.copy( arToolkitContext.getProjectionMatrix() );
  })
  
  var markerControls = new THREEx.ArMarkerControls(arToolkitContext, camera, {
		type : 'pattern',
		patternUrl : './patt.hiro',
		changeMatrixMode: 'cameraTransformMatrix'
  })

  var markerControls2 = new THREEx.ArMarkerControls(arToolkitContext, camera2, {
		type : 'pattern',
		patternUrl : './patt.kanji',
		changeMatrixMode: 'cameraTransformMatrix'
  })

	// as we do changeMatrixMode: 'cameraTransformMatrix', start with invisible scene
  scene.visible = false
  scene2.visible = false

  var light = new THREE.DirectionalLight();
  light.position.set(200, 300, 300);
  scene.add(light);
  scene.add(new THREE.AmbientLight(0x5c5c5c))

  // add a flamingo
  var mixer;
  var loader = new THREE.GLTFLoader();
  loader.load( 'flamingo.gltf', function ( gltf ) {
    var mesh = gltf.scene.children[ 0 ];
    mesh.scale.set( 0.015, 0.015, 0.015);
    mesh.position.y = 0;
    scene.add( mesh );
    mixer = new THREE.AnimationMixer( mesh );
    mixer.clipAction( gltf.animations[ 0 ] ).setDuration( 1 ).play();
  });

  var mixer2;
  var loader2 = new THREE.FBXLoader();
  
  loader2.load( 'hulk7.fbx', function ( mesh ) {

    mesh.translateZ(0.5);

    // somehow the mesh is invisble fix this
    mesh.children[0].material.transparent = false;
    mesh.children[0].material.opacity = 1;
    mesh.children[3].material.transparent = false;
    mesh.children[3].material.opacity = 1;
    mesh.children[8].material.transparent = false;
    mesh.children[8].material.opacity = 1;
    mesh.children[9].material.transparent = false;
    mesh.children[9].material.opacity = 1;

    scene2.add(mesh)
    mixer2 = new THREE.AnimationMixer( mesh );
    mixer2.clipAction( mesh.animations[ 0 ] ).setDuration( 2 ).play();
  }, e=> console.log(e), f => console.log(f));

  var clock = new THREE.Clock();

  // kick off rendering
  renderer.setAnimationLoop(render);

  function render() {
    renderer.clear();
    if( arToolkitSource.ready === false )	{
    } else {
      arToolkitContext.update( arToolkitSource.domElement)
      scene.visible = camera.visible
    } 
    scene2.visible = camera2.visible

    var delta = clock.getDelta();
    if (mixer) mixer.update(delta);
    if (mixer2) mixer2.update(delta);
    renderer.render(scene, camera);
    renderer.render(scene2, camera2);
  }

  function onResize(){
		arToolkitSource.onResize()	
		arToolkitSource.copySizeTo(renderer.domElement)	
		if( arToolkitContext.arController !== null ){
			arToolkitSource.copySizeTo(arToolkitContext.arController.canvas)	
		}	
  }

}