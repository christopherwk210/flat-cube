;(function() {
  /**
   * Execute a callback i number of times
   * @param {Function} cb Callback function
   * @param {number} i Iterations
   */
  var repeat = function(cb, i) {
    while(i > 0) {
      cb();
      i--;
    }
  }

  /**
   * FlatCube constructor
   * @param {object} [e] Options object
   * @param {Array<string>} [e.colors] The colors to use for the cube faces
   * @param {number} [e.width=3] Height of cube
   * @param {number} [e.height=3] Width of cube
   * @param {Element} [e.el=document.body] Element to append cube and controls to
   */
  window.FlatCube = function(e) {
    e = e || {};

    this.colors = e.colors || [
      'red',
      'orange',
      'yellow',
      'green',
      'blue',
      'violet'
    ];

    this.width = e.width || 3;
    this.height = e.height || 3;
    this.el = e.el || document.body;

    // Set up cube data model
    this.cube = this.generateCubeModel();    

    // Create cube view
    this.createCubeView(this.width, this.height, this.el);
  };

  /**
   * Returns a proper cube object with each side containing 6 unique number pieces.
   */
  window.FlatCube.prototype.generateCubeModel = function() {
    var cube = { sides: {} };
    var faces = ['top', 'front', 'right', 'back', 'left', 'bottom'];

    for (var i = 0; i < faces.length; i++) {
      var face = faces[i];
      cube.sides[face] = [i, i, i];
    }

    return cube;
  };

  /**
   * Appends the proper cube face view into the DOM.
   */
  window.FlatCube.prototype.createCubeView = function(width, height, el) {
    var container = document.createElement('div');

    /**
     * Creates a row of the cube view
     * @param {number} row The current row
     */
    var createRow = function(row) {
      var rowElement = document.createElement('div');
      rowElement.className = 'row';

      var leftButton = document.createElement('button');
      leftButton.innerText = '⬅️';
      rowElement.appendChild(leftButton);

      repeat(function() {
        var piece = document.createElement('span');
        piece.className = 'piece';
        rowElement.appendChild(piece);
      }, width);

      var rightButton = document.createElement('button');
      rightButton.innerText = '➡️';
      rowElement.appendChild(rightButton);

      return rowElement;
    }

    // Create top button row
    var topRowElement = document.createElement('div');
    topRowElement.className = 'row';
    repeat(function() {
      var upButton = document.createElement('button');
      upButton.innerText = '⬆️';
      topRowElement.appendChild(upButton);
    }, width);
    container.appendChild(topRowElement);

    // Create each row
    for (var h = 0; h < height; h++) {
      var row = createRow(h);
      container.appendChild(row);
    }

    // Create bottom button row
    var bottomRowElement = document.createElement('div');
    bottomRowElement.className = 'row';
    repeat(function() {
      var downButton = document.createElement('button');
      downButton.innerText = '⬇️';
      bottomRowElement.appendChild(downButton);
    }, width);
    container.appendChild(bottomRowElement);

    // Append view to DOM
    el.appendChild(container);
  };
})();