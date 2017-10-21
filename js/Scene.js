
// get the DOM element to attach to
// - assume we've got jQuery to hand
var $container = document.getElementById("container");

// create a WebGL renderer, camera
// and a scene
var renderer = new THREE.WebGLRenderer();
renderer.setClearColor(0x0f1720, 1);
var camera = new THREE.PerspectiveCamera(VIEW_ANGLE, ASPECT, NEAR, FAR);
var scene = new THREE.Scene();

// start the renderer
renderer.setSize(WIDTH, HEIGHT);

// attach the render-supplied DOM element
$container.appendChild(renderer.domElement);

// and the camera
scene.add(camera);


