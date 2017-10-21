
function simulate(dataArr, width, height, depth) {
    function DataHolder() {
      this.width = width;
      this.height = height;
      this.depth = depth;
  
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
  
    var dataHolder = new DataHolder();
    dataHolder.data = dataArr;
  
    function each(data, func) {
      for (var x = 0; x < width; x++) {
        for (var y = 0; y < height; y++) {
          for (var z = 0; z < depth; z++) {
            func(data.g(x, y, z), x, y, z);
          }
        }
      }
    }
  
    function map(data, func) {
      var newData = new DataHolder();
      each(data, function(val, x, y, z) {
        newData.s(func(val, x, y, z), x, y, z);
      });
      return newData;
    }
  
    var newData = map(dataHolder, function(val, xpos, ypos, zpos) {
      var num_alive = 0;
      for (var xx = -1; xx <= 1; xx++) {
        for (var yy = -1; yy <= 1; yy++) {
          for (var zz = -1; zz <= 1; zz++) {
            if (xx == 0 && yy == 0 && zz == 0) continue;
            if (dataHolder.g(xpos + xx, ypos + yy, zpos + zz) === true)
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
  
    return newData.data;
  }

  window.simulate = simulate