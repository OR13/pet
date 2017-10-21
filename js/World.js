function DataHolder(world) {
  this.width = world.width;
  this.height = world.height;
  this.depth = world.depth;

  this.data = [];
}
DataHolder.prototype.s = function(val, x, y, z) {
  if (this.data[x] === undefined) this.data[x] = [];
  if (this.data[x][y] === undefined) this.data[x][y] = [];

  this.data[x][y][z] = val;
};
DataHolder.prototype.g = function(x, y, z) {
  x = (x + this.width) % this.width;
  y = (y + this.height) % this.height;
  z = (z + this.depth) % this.depth;

  try {
    return this.data[x][y][z];
  } catch (e) {}

  return false;
};

function World(size) {
  var SIDE = Math.pow(size, 1 / 3) | 0;
  this.height = SIDE;
  this.width = SIDE;
  this.depth = SIDE;

  CAMERA_FAR = SIDE * 2;

  this.data = new DataHolder(this);

  // initialize world data
  this.data = this.map(function(v, x, y, z) {
    return Math.random() >= DENSITY ? true : false;
  });

  this.__particles = new THREE.Geometry();
}

World.prototype.each = function(func) {
  for (var x = 0; x < this.width; x++) {
    for (var y = 0; y < this.height; y++) {
      for (var z = 0; z < this.depth; z++) {
        func.call(this, this.data.g(x, y, z), x, y, z);
      }
    }
  }
};

World.prototype.map = function(func) {
  var newData = new DataHolder(this);
  this.each(function(val, x, y, z) {
    newData.s(func.call(this, val, x, y, z), x, y, z);
  });
  return newData;
};

World.prototype.render = function() {
  var i = 0;
  this.each(function(data, x, y, z) {
    if (data === true) {
      var particle = this.__particles.vertices[i];
      if (particle == undefined) {
        particle = new THREE.Vector3(0, 0, 0);
        this.__particles.vertices[i] = particle;
      }
      particle.x = x - this.width / 2;
      particle.y = y - this.height / 2;
      particle.z = z - this.depth / 2;
      i++;
    }
  });

  for (var j = i; j < this.__particles.vertices.length; j++) {
    this.__particles.vertices[j].z = 100000;
    this.__particles.vertices[j].y = 0;
    this.__particles.vertices[j].x = 0;
  }

  this.__particles.verticesNeedUpdate = true;

  // draw!
  renderer.render(scene, camera);
  this.__particles.vertices.splice(i, this.__particles.vertices.length - i);
};

World.prototype.step = function() {
  this.data = this.map(function(val, xpos, ypos, zpos) {
    var num_alive = 0;
    for (var xx = -1; xx <= 1; xx++) {
      for (var yy = -1; yy <= 1; yy++) {
        for (var zz = -1; zz <= 1; zz++) {
          if (xx == 0 && yy == 0 && zz == 0) continue;
          if (this.data.g(xpos + xx, ypos + yy, zpos + zz) === true)
            num_alive++;
        }
      }
    }

    if (val === true && num_alive < 2) return false; // Any live cell with fewer than two live neighbours dies, as if caused by under-population.
    if (val === true && num_alive <= 4) return true; // Any live cell with two or three live neighbours lives on to the next generation.
    if (val === false && num_alive < 5) return false; // Any dead cell with exactly three live neighbours becomes a live cell, as if by reproduction.
    if (val === false && num_alive <= 5) return true; // Any dead cell with exactly three live neighbours becomes a live cell, as if by reproduction.
    return false;
  });
};

window.DataHolder = DataHolder
window.World = World