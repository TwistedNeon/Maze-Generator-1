//Canvas size
const cwidth = 500;
const cheight = 500;
//Dimensions of maze
var cols;
var rows;
//Density of maze generator
var w = 20;
//Array of cells
var grid = [];
//Current cell variable
var current;
//Allows generator to back track and find a new path
var stack = [];
//Declare variable for random start position
var rs;

//Starts Here
function setup() {
  //Creating space for maze
  var canvas = createCanvas(cwidth, cheight);
  //Setting position of maze to center of screen
  canvas.position((windowWidth - cwidth) / 2, (windowHeight - cheight) / 2);
  //Calculating amount of cols and rows
  cols = floor(cwidth / w);
  rows = floor(cheight / w);
  //Speed of program
  frameRate(60);
  //Go through all cols per row and make a "Cell" object with properties
  for (var j = 0; j < rows; j++) {
    for (var i = 0; i < cols; i++) {
      //Creating objects
      var cell = new Cell(i, j);
      //Adding objects to array
      grid.push(cell);
    }
  }
  //Calculating random start position in maze
  rs = floor(random(0, rows * cols - 1));
  current = grid[rs];
}

//Cleaning up window
function windowResized() {
  canvas.position((windowWidth - cwidth) / 2, (windowHeight - cheight) / 2);
}

//Yay let's actually see something happen
function draw() {
  //Display each "Cell" in array
  for (var i = 0; i < grid.length; i++) {
    //Calls function of "Cell" object
    grid[i].show();
  }
  //Set current cell to visited
  current.visited = true;
  //Give current cell some color to show progress of generator
  current.highlight();
  //STEP 1 of algorithm
  var next = current.checkNeighbors();
  if (next) {
    next.visited = true;
    //STEP 2 of algorithm
    stack.push(current);
    //STEP 3 of algorithm
    removeWalls(current, next);
    //STEP 4 of algorithm
    current = next;
  } else if (stack.length > 0) {
    current = stack.pop();
  }
}

//Function to check edge cases for neighbor cells and return correct index for adjacent cells
function index(i, j) {
  if (i < 0 || j < 0 || i > cols - 1 || j > rows - 1) {
    return -1;
  } else {
    return i + j * cols;
  }
}

function Cell(i, j) {
  //i for cols
  this.i = i;
  //j for rows
  this.j = j;
  //Give each cell all 4 walls by default
  this.walls = [true, true, true, true];
  //Each cell is initially un-visited
  this.visited = false;

  //Function to check adjacent cells
  this.checkNeighbors = function() {
    var neighbors = [];
    var top = grid[index(i, j - 1)];
    var right = grid[index(i + 1, j)];
    var bottom = grid[index(i, j + 1)];
    var left = grid[index(i - 1, j)];
    //If the "index" is valid for the grid AND it hasn't been visited yet"
    if (top && !top.visited) {
      neighbors.push(top);
    }
    if (right && !right.visited) {
      neighbors.push(right);
    }
    if (bottom && !bottom.visited) {
      neighbors.push(bottom);
    }
    if (left && !left.visited) {
      neighbors.push(left);
    }
    //Randomly select a neighbor and go there
    if (neighbors.length > 0) {
      var r = floor(random(0, neighbors.length));
      return neighbors[r];
      //Otherwise go to stack
    } else {
      return undefined;
    }
  };

  //Function to show generation of maze happening, like a progress bar
  this.highlight = function() {
    var x = this.i * w;
    var y = this.j * w;
    noStroke();
    fill("#ed7003");
    rect(x, y, w, w);
  };

  //Function to individually display each wall for each cell
  this.show = function() {
    var x = this.i * w;
    var y = this.j * w;
    stroke("#ed0380");
    if (this.walls[0]) {
      line(x, y, x + w, y);
    }
    if (this.walls[1]) {
      line(x + w, y, x + w, y + w);
    }
    if (this.walls[2]) {
      line(x + w, y + w, x, y + w);
    }
    if (this.walls[3]) {
      line(x, y + w, x, y);
    }
    //Turns visited cells to a different color, showing it can't be visited again, until stack
    if (this.visited) {
      noStroke();
      fill("#03ede5");
      rect(x, y, w, w);
    }
  };
}

//Function to visually remove walls to make the maze path
function removeWalls(a, b) {
  var cellDifx = a.i - b.i;
  if (cellDifx === 1) {
    a.walls[3] = false;
    b.walls[1] = false;
  } else if (cellDifx === -1) {
    a.walls[1] = false;
    b.walls[3] = false;
  }
  var cellDify = a.j - b.j;
  if (cellDify === 1) {
    a.walls[0] = false;
    b.walls[2] = false;
  } else if (cellDify === -1) {
    a.walls[2] = false;
    b.walls[0] = false;
  }
}
