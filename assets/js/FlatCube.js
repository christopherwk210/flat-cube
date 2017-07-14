;(function() {
  /**
   * Execute a callback i number of times
   * @param {Function} cb Callback function
   * @param {number} i Iterations
   */
  var repeat = function(cb, i) {
    var n = 0;
    while(n < i) {
      cb(n);
      n++;
    }
  }

  /**
   * Returns a column of a 2D array as a new array, taken
   * from https://stackoverflow.com/a/7848073/5952139
   * @param {Array} matrix Array
   * @param {number} col Column
   */
  var getCol = function(matrix, col) {
    var column = [];
    for (var i = 0; i < matrix.length; i++) {
      column.push(matrix[i][col]);
    }
    return column;
  }

  /**
   * Sets a column in a 2D array.
   * @param {Array} matrix Array to set
   * @param {number} col Column
   * @param {Array} value Array of values to set, must be same height as matrix array
   */
  var setCol = function(matrix, col, value) {
    for (var y = 0; y < matrix.length; y++) {
      matrix[y][col] = value[y];
    }
  }

  /**
   * FlatCube constructor
   * @param {object} [e] Options object
   * @param {Array<string>} [e.colors] CSS colors to use for the cube faces
   * @param {number} [e.width=3] Height of cube
   * @param {number} [e.height=3] Width of cube
   * @param {Element} [e.el=document.body] Element to append cube and controls to
   */
  window.FlatCube = function(e) {
    e = e || {};

    // Options
    this.colors = e.colors || [
      'white',
      'red',
      'blue',
      'orange',
      'green',
      'yellow'
    ];
    this.width = e.width || 3;
    this.height = e.height || 3;
    this.el = e.el || document.body;

    // Control
    this.cubePieceElements = [];
    this.lookingAt = 'front';

    // Set up cube data model
    this.cube = this.generateCubeModel();    

    // Create cube view
    this.createCubeView(this.width, this.height, this.el);

    // Initial update
    this.updateView();
  };

  /**
   * Returns a proper cube object with each side containing 6 unique number pieces.
   */
  window.FlatCube.prototype.generateCubeModel = function() {
    var cube = { sides: {} };
    var faces = ['top', 'front', 'right', 'back', 'left', 'bottom'];

    for (var i = 0; i < faces.length; i++) {
      var face = faces[i];
      cube.sides[face] = [];
      repeat(function() {
        cube.sides[face].push([i, i, i])
      }, 3);
    }

    return cube;
  };

  /**
   * Appends the proper cube face view into the DOM.
   */
  window.FlatCube.prototype.createCubeView = function(width, height, el) {
    var selfRef = this;
    var container = document.createElement('div');

    /**
     * Creates a row of the cube view
     * @param {number} row The current row
     */
    var createRow = function(row) {
      var rowElement = document.createElement('div');
      rowElement.className = 'row';

      // Create left button
      var leftButton = document.createElement('button');
      leftButton.innerText = '⬅️';
      leftButton.setAttribute('data-row', row);
      leftButton.addEventListener('click', (function(e) {
        var row = e.srcElement.getAttribute('data-row');
        this.rotateRow(row, true);
      }).bind(this));
      rowElement.appendChild(leftButton);

      var pieceElements = [];

      // Create inner pieces
      repeat(function() {
        var piece = document.createElement('span');
        piece.className = 'piece';
        rowElement.appendChild(piece);
        pieceElements.push(piece);
      }, width);

      // Keep a reference to the elements
      this.cubePieceElements.push(pieceElements);

      // Create right button
      var rightButton = document.createElement('button');
      rightButton.innerText = '➡️';
      rightButton.setAttribute('data-row', row);
      rightButton.addEventListener('click', (function(e) {
        var row = e.srcElement.getAttribute('data-row');
        this.rotateRow(row, false);
      }).bind(this));
      rowElement.appendChild(rightButton);

      return rowElement;
    }

    // Create top button row
    var topRowElement = document.createElement('div');
    topRowElement.className = 'row';
    repeat(function(i) {
      var upButton = document.createElement('button');
      upButton.innerText = '⬆️';
      upButton.setAttribute('data-col', i);
      upButton.addEventListener('click', function(e) {
        var col = e.srcElement.getAttribute('data-col');
        selfRef.rotateColumn(col, true);
      });
      topRowElement.appendChild(upButton);
    }, width);
    container.appendChild(topRowElement);

    // Create each row
    for (var h = 0; h < height; h++) {
      var row = createRow.bind(this, h)();
      container.appendChild(row);
    }

    // Create bottom button row
    var bottomRowElement = document.createElement('div');
    bottomRowElement.className = 'row';
    repeat(function(i) {
      var downButton = document.createElement('button');
      downButton.innerText = '⬇️';
      downButton.setAttribute('data-col', i);
      downButton.addEventListener('click', function(e) {
        var col = e.srcElement.getAttribute('data-col');
        selfRef.rotateColumn(col, false);
      });
      bottomRowElement.appendChild(downButton);
    }, width);
    container.appendChild(bottomRowElement);

    // Append view to DOM
    el.appendChild(container);
  };

  /**
   * Updates the pieces on the DOM to have the correct background according to the model
   */
  window.FlatCube.prototype.updateView = function() {
    var currentFaceModel = this.cube.sides[this.lookingAt];

    // Loop through the model
    for (var h = 0; h < currentFaceModel.length; h++) {
      for (var w = 0; w < currentFaceModel[h].length; w++) {
        var currentPiece = this.cubePieceElements[h][w];
        var colorIndex = currentFaceModel[h][w];

        // Apply the correct background
        currentPiece.style.background = this.colors[colorIndex];
      }
    }
  };

  /**
   * Rotates the given column in a direction
   * @param {number} col The column to rotate
   * @param {boolean} direction Rotate the column up if true, down if false
   */
  window.FlatCube.prototype.rotateColumn = function(col, direction) {
    var frontCol = getCol(this.cube.sides['front'], col),
        topCol = getCol(this.cube.sides['top'], col),
        backCol = getCol(this.cube.sides['back'], col),
        bottomCol = getCol(this.cube.sides['bottom'], col),
        leftCol = getCol(this.cube.sides['left'], col),
        rightCol = getCol(this.cube.sides['right'], col);
    
    switch(this.lookingAt) {
      case 'front': {
        if (direction) {
          setCol(this.cube.sides['front'], col, bottomCol);
          setCol(this.cube.sides['top'], col, frontCol);
          setCol(this.cube.sides['back'], col, topCol);
          setCol(this.cube.sides['bottom'], col, backCol);
        } else {
          setCol(this.cube.sides['front'], col, topCol);
          setCol(this.cube.sides['top'], col, backCol);
          setCol(this.cube.sides['back'], col, bottomCol);
          setCol(this.cube.sides['bottom'], col, frontCol);
        }
        break;
      }
    }

    // Update View
    this.updateView();
  };

  /**
   * Rotates the given row in a direction
   * @param {number} row The row to rotate
   * @param {boolean} direction Rotate the row left if true, right if false
   */
  window.FlatCube.prototype.rotateRow = function(row, direction) {
    var frontRow = this.cube.sides['front'][row],
        topRow = this.cube.sides['top'][row],
        backRow = this.cube.sides['back'][row],
        bottomRow = this.cube.sides['bottom'][row],
        leftRow = this.cube.sides['left'][row],
        rightRow = this.cube.sides['right'][row];
    
    switch(this.lookingAt) {
      case 'front': {
        if (direction) {
          this.cube.sides['front'][row] = rightRow;
          this.cube.sides['left'][row] = frontRow;
          this.cube.sides['back'][row] = leftRow;
          this.cube.sides['right'][row] = backRow;
        } else {
          this.cube.sides['front'][row] = leftRow;
          this.cube.sides['left'][row] = backRow;
          this.cube.sides['back'][row] = rightRow;
          this.cube.sides['right'][row] = frontRow;
        }
        break;
      }
    }

    // Update View
    this.updateView();
  }
})();