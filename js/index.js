function processWorld() {
  if (paused) return;
  MT.process(window.simulate, function(data) {
    world.data.data = data;
    currentTimeout = setTimeout(processWorld, STEP_RATE);

    let new_hash =  "0x" + keccak256(JSON.stringify(data));
    if (new_hash == window.world_hash){
      ALL_DEAD = true;
      paused = true;
    }
    window.world_hash = new_hash
    document.getElementById("world_hash").innerText = window.world_hash;

  })(world.data.data, world.width, world.height, world.depth);
}

function renderWorld() {
  if (paused) return;

  requestAnimationFrame(renderWorld);

  var ctime = new Date().getTime() / (1  * 10000);

  camera.position.x = CAMERA_FAR * Math.cos(ctime);
  camera.position.z = CAMERA_FAR * Math.sin(ctime);
  camera.lookAt(center_point);

  world.render();
}

function run() {
  paused = false;
  renderWorld();
  processWorld();
}

function stop() {
  clearTimeout(currentTimeout);
  paused = true;
}

function stopRandomly() {
  let s = Math.random()
  setTimeout(() => {
    paused = true;
  }, 10 * s * 1000);
}

function startOver() {
  stop();
  if (particleSystem) {
    scene.remove(particleSystem);
  }

  world = new window.World(NUM_PARTICLES);
  var pMaterial = new THREE.PointCloudMaterial({
    color: 0x38ddb3,
    size: 1,
    transparent: true,
    opacity: 1,
    fog: false,
    sizeAttenuation: true
  });

  particleSystem = new THREE.PointCloud(world.__particles, pMaterial);

  // add it to the scene
  scene.add(particleSystem);

  world.render();
  // stopRandomly();

  run();
}
startOver();
