var myGamePiece;

function startGame() {
  myGameArea.start();
  myBackground = new background(myGameArea.context, 35);
  myGamePiece = new player(myGameArea.context, 70, 35, 0.5, 7);
  //myGamePiece = new component(30, 30, "red", 10, 120);
}

var playerImages = {
  tileCount : 8,
  frontImgs: [
    "./img/Bomberman/Front/Bman_F_f00.png",
    "./img/Bomberman/Front/Bman_F_f01.png",
    "./img/Bomberman/Front/Bman_F_f02.png",
    "./img/Bomberman/Front/Bman_F_f03.png",
    "./img/Bomberman/Front/Bman_F_f04.png",
    "./img/Bomberman/Front/Bman_F_f05.png",
    "./img/Bomberman/Front/Bman_F_f06.png",
    "./img/Bomberman/Front/Bman_F_f07.png"
  ],
  backImgs: [
    "./img/Bomberman/Back/Bman_B_f00.png",
    "./img/Bomberman/Back/Bman_B_f01.png",
    "./img/Bomberman/Back/Bman_B_f02.png",
    "./img/Bomberman/Back/Bman_B_f03.png",
    "./img/Bomberman/Back/Bman_B_f04.png",
    "./img/Bomberman/Back/Bman_B_f05.png",
    "./img/Bomberman/Back/Bman_B_f06.png",
    "./img/Bomberman/Back/Bman_B_f07.png"
  ],
  rightImgs: [
    "./img/Bomberman/Right/Bman_F_f00.png",
    "./img/Bomberman/Right/Bman_F_f01.png",
    "./img/Bomberman/Right/Bman_F_f02.png",
    "./img/Bomberman/Right/Bman_F_f03.png",
    "./img/Bomberman/Right/Bman_F_f04.png",
    "./img/Bomberman/Right/Bman_F_f05.png",
    "./img/Bomberman/Right/Bman_F_f06.png",
    "./img/Bomberman/Right/Bman_F_f07.png"
  ],
  leftImgs: [
    "./img/Bomberman/Left/Bman_F_f00.png",
    "./img/Bomberman/Left/Bman_F_f01.png",
    "./img/Bomberman/Left/Bman_F_f02.png",
    "./img/Bomberman/Left/Bman_F_f03.png",
    "./img/Bomberman/Left/Bman_F_f04.png",
    "./img/Bomberman/Left/Bman_F_f05.png",
    "./img/Bomberman/Left/Bman_F_f06.png",
    "./img/Bomberman/Left/Bman_F_f07.png"
  ]
};

var tileImages = {
  tileCount : 3,
  tiles: [
    './img/Blocks/BackgroundTile.png',
    './img/Blocks/SolidBlock.png',
    './img/Blocks/ExplodableBlock.png'
  ]
};

// Image factory
var createImage = function (src, title) {
  var img = new Image();
  img.src = src;
  img.alt = title;
  img.title = title;
  return img;
};

var myGameArea = {
  canvas: document.getElementById("gameCanvas"),
  start: function () {
    this.canvas.width = 700;
    this.canvas.height = 500;
    this.context = this.canvas.getContext("2d");
    document.body.insertBefore(this.canvas, document.body.childNodes[0]);
    this.interval = setInterval(updateGameArea, 33);
    this.keys = [];

    // Event listener
    window.addEventListener('keydown', function (e) {
      myGameArea.keys = (myGameArea.keys || []);
      myGameArea.keys[e.keyCode] = (e.type == "keydown");
  })
  window.addEventListener('keyup', function (e) {
      myGameArea.keys[e.keyCode] = (e.type == "keydown");
  })
  },
  clear: function () {
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }
};

var directions = {
  left: 1,
  right: 2,
  up: 3,
  down: 4
};

function player(context, x, y, playerSize, walkSpeed) {
  this.gamearea = myGameArea;
  this.imageCounter = 0;
  this.currentDirection = directions.down;
  this.oldDirection = this.currentDirection;
  this.ctx = context;
  this.playerSize = playerSize;
  this.walkSpeed = walkSpeed;
  this.diagonalMoveDivisior = 1.4;

  this.dimensions = {
    width: 64,
    height: 100
  };

  this.speed = {
    speedX: 0,
    speedY: 0
  };

  this.pos = {
    posX: x,
    posY: y
  };

  this.front = [];
  this.back = [];
  this.left = [];
  this.right = [];

  for (var i = 0; i < playerImages.tileCount; i++) {
    this.front.push(createImage(playerImages.frontImgs[i], "Bomberman Front"));
    this.back.push(createImage(playerImages.backImgs[i], "Bomberman Back"));
    this.left.push(createImage(playerImages.leftImgs[i], "Bomberman Left"));
    this.right.push(createImage(playerImages.rightImgs[i], "Bomberman Right"));
  }

  // Functions
  this.update = function () {
    switch (this.currentDirection) {
      case directions.left:
        draw_player(this.left[this.imageCounter], this.pos, this.dimensions, this.playerSize);
        break;
      case directions.right:
        draw_player(this.right[this.imageCounter], this.pos, this.dimensions, this.playerSize);
        break;
      case directions.up:
        draw_player(this.back[this.imageCounter], this.pos, this.dimensions, this.playerSize);
        break;
      case directions.down:
        draw_player(this.front[this.imageCounter], this.pos, this.dimensions, this.playerSize);
        break;
    }
  };

  this.updateImageCounter = function () {
    if (this.currentDirection != this.oldDirection){
      imageCounter = 0;
      this.oldDirection = this.currentDirection;
    }

    if (this.imageCounter < 7) {
      this.imageCounter = this.imageCounter + 1;
    }
    else {
      this.imageCounter = 0;
    }
  };

  this.newPos = function () {
    this.pos.posX += this.speed.speedX;
    this.pos.posY += this.speed.speedY;
  };

  this.resetSpeed = function () {
    this.speed.speedX = 0;
    this.speed.speedY = 0;
  };

  this.possibleToMove = function (tileSize) {
    var newPos = {
      posX : (this.pos.posX + this.speed.speedX),
      posY : (this.pos.posY + this.speed.speedY)
    };
    console.log(this.pos.posX);
    if (possible_move(this.pos, newPos, tileSize))
      return true;
    else
      return false;
  };
}

function background(context, tileSize) {
  this.tiles = [];
  this.tileSize = tileSize;
  this.dimensions = {
    width: 13,
    height: 19
  };
  this.height = 0;
  this.width = 0;
  this.ctx = context;
  this.map = [
    [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
    [1,0,0,0,2,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
    [1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1],
    [1,0,0,2,2,2,0,0,0,0,0,0,0,0,0,0,0,0,1],
    [1,0,1,2,1,2,1,0,1,0,1,0,1,0,1,0,1,0,1],
    [1,0,0,2,2,2,0,0,0,0,0,0,0,0,0,0,0,0,1],
    [1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1],
    [1,0,0,0,2,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
    [1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1],
    [1,0,0,0,2,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
    [1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1],
    [1,0,0,0,2,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
    [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1]
    ];

  for (var i = 0; i < tileImages.tileCount; i++) {
    this.tiles.push(createImage(tileImages.tiles[i], "Tile"));
  }

  this.update = function () {
    draw_background(this.ctx, this.map, this.dimensions, this.tiles, this.tileSize);
  }
}


function updateGameArea() {
  myGameArea.clear();

  myBackground.update();
  myGamePiece.resetSpeed();

  if (!checkInput()) {
    myGamePiece.imageCounter = 0;
  }

  if (myGamePiece.possibleToMove(myBackground.tileSize))
    myGamePiece.newPos();
  myGamePiece.update();
}

function checkInput () {
  var moved = false;
  var movedDiagonally = false;

  if (myGameArea.keys && myGameArea.keys[37]) {
    myGamePiece.currentDirection = directions.left;
    myGamePiece.updateImageCounter();
    myGamePiece.speed.speedX = -myGamePiece.walkSpeed;
    moved = true;
  }
  if (myGameArea.keys && myGameArea.keys[39]) {
    myGamePiece.currentDirection = directions.right;
    myGamePiece.updateImageCounter();
    myGamePiece.speed.speedX = myGamePiece.walkSpeed;
    moved = true;
  }
  if (myGameArea.keys && myGameArea.keys[38]) {
    myGamePiece.currentDirection = directions.up;
    myGamePiece.updateImageCounter();
    myGamePiece.speed.speedY = -myGamePiece.walkSpeed;
    if (moved)
      movedDiagonally = true;
    else 
      moved = true;
  }
  if (myGameArea.keys && myGameArea.keys[40]) {
    myGamePiece.currentDirection = directions.down;
    myGamePiece.updateImageCounter();
    myGamePiece.speed.speedY = myGamePiece.walkSpeed;
    if (moved)
      movedDiagonally = true;
    else 
      moved = true;
  }

  if (movedDiagonally)
  {
    console.log("moved diagonally");
    myGamePiece.speed.speedX = myGamePiece.speed.speedX / myGamePiece.diagonalMoveDivisior;
    myGamePiece.speed.speedY = myGamePiece.speed.speedY / myGamePiece.diagonalMoveDivisior;
  }

  if (moved)
    return true;
  else
    return false;
}

function draw_player(img, pos, size, playerSize) {
  myGameArea.context.drawImage(
    img,
    pos.posX * playerSize,
    pos.posY * playerSize,
    size.width * playerSize,
    size.height * playerSize
  );
}

function draw_background (ctx, background, dimensions, tiles, tileSize) {
  for (var y = 0; y < dimensions.width; ++y) {
    for (var x = 0; x < dimensions.height; ++x) {

      switch(background[y][x]) {
        case 0: //background
          draw_block(ctx, tiles[0], x, y, tileSize);
          break;
        case 1: //solid
          draw_block(ctx, tiles[1], x, y, tileSize);
          break;
        case 2: //explodable
          draw_block(ctx, tiles[2], x, y, tileSize);
          break;
      }
    }
  }
}

function draw_block (ctx, img, x, y, tileSize) {
  ctx.drawImage(img, tileSize*x, tileSize*y, tileSize, tileSize);
}

//checks if a single Point can be moved
function possible_move(pos, newPos, tileSize) {
  if (myBackground.map[Math.trunc((pos.posY + newPos.posY)/tileSize)][Math.trunc((pos.posX + newPos.posX)/tileSize)] == 0) {
    return true;
  }
  return false;
}