(function () {init()})();

function init() {

  // get a renderer and attach to html dom element
	var renderer	= new THREE.WebGLRenderer({antialias: true, alpha: true});
	renderer.setClearColor(new THREE.Color('lightgrey'), 0)
	renderer.setSize( 640, 480 );
	renderer.domElement.style.position = 'absolute'
	renderer.domElement.style.top = '0px'
	renderer.domElement.style.left = '0px'
	document.body.appendChild( renderer.domElement );

  // define the camera
  var scene = new THREE.Scene();
  var camera = new THREE.PerspectiveCamera();
  scene.add(camera);

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
  })
  
  var markerControls = new THREEx.ArMarkerControls(arToolkitContext, camera, {
		type : 'pattern',
		patternUrl : './patt.hiro',
		changeMatrixMode: 'cameraTransformMatrix'
  })

	// as we do changeMatrixMode: 'cameraTransformMatrix', start with invisible scene
  scene.visible = false

  var light = new THREE.DirectionalLight();
  light.position.set(200, 300, 300);
  scene.add(light);
  scene.add(new THREE.AmbientLight(0x5c5c5c))

  // add a flamingo
  var mixer;
  var loader = new THREE.GLTFLoader();
  loader.load( 'flamingo.gltf', function ( gltf ) {
    console.log(gltf);
    var mesh = gltf.scene.children[ 0 ];
    console.log(mesh);
    mesh.scale.set( 0.015, 0.015, 0.015);
    mesh.position.y = 0;
    scene.add( mesh );
    mixer = new THREE.AnimationMixer( mesh );
    mixer.clipAction( gltf.animations[ 0 ] ).setDuration( 1 ).play();
  });

  var clock = new THREE.Clock();

  // kick off rendering
  renderer.setAnimationLoop(render);

  function render() {
    if( arToolkitSource.ready === false )	{
    } else {
      arToolkitContext.update( arToolkitSource.domElement)
      scene.visible = camera.visible
    } 

    if (mixer) mixer.update(clock.getDelta());
    renderer.render(scene, camera);
  }

  function onResize(){
		arToolkitSource.onResize()	
		arToolkitSource.copySizeTo(renderer.domElement)	
		if( arToolkitContext.arController !== null ){
			arToolkitSource.copySizeTo(arToolkitContext.arController.canvas)	
		}	
  }

}