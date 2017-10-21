
// set the scene size
var WIDTH = window.innerWidth,
HEIGHT = window.innerHeight - 128;

// set some camera attributes
var VIEW_ANGLE = 45,
ASPECT = WIDTH / HEIGHT,
NEAR = .1,
FAR = 1000;
const STEP_RATE = .4 * 1000

let CAMERA_FAR = 1;
const NUM_PARTICLES = 1 * 1000;
const DENSITY = .7

var MT = new Multithread(2);

var particleSystem;
var paused = true;
var currentTimeout;

var world;

var center_point = new THREE.Vector3(0, 0, 0);
let ALL_DEAD = false;