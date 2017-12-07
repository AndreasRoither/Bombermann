/********************/
/*     Functions    */
/********************/

function startGame() {
  myGameArea.start();
  myBackground = new background(myGameArea.context, 35);
  myPlayer = new player(myGameArea.context, 36, 36, 0.4, 3);

  // TODO: start game loop here instead of setinterval from mygamearea
}

function updateGameArea() {
  if (movLeft || movRight || movUp || movDown) {
    myPlayer.tryMove();
  }
  else {
    myPlayer.imageCounter = 0;
  }

  if (myBackground.layerDirty) {
    myBackground.update();
    myBackground.layerDirty = false;
  }

  if (myPlayer.layerDirty) {
    myPlayer.update();
    myPlayer.layerDirty = false;
  }
}

/********************/
/*   Declarations   */
/********************/

/* contains all player image paths */
var playerImages = {
  tileCount: 8,
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

/* contains all tile image paths */
var tileImages = {
  tileCount: 3,
  tiles: [
    './img/Blocks/BackgroundTile.png',
    './img/Blocks/SolidBlock.png',
    './img/Blocks/ExplodableBlock.png'
  ]
};

/* Image factory to create an image
 * returns image; */
var createImage = function (src, title) {
  var img = new Image();
  img.src = src;
  img.alt = title;
  img.title = title;
  return img;
};

/* Game Area (Canvas) */
var myGameArea = {
  canvas: document.getElementById("gameCanvas"),
  start: function () {
    this.canvas.width = 665;
    this.canvas.height = 455;
    this.context = this.canvas.getContext("2d");
    document.body.insertBefore(this.canvas, document.body.childNodes[0]);
    this.interval = setInterval(updateGameArea, 33);
    this.keys = [];
  },
  clear: function () {
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }
};

/* direction enum to distinguish directions */
var directions = {
  left: 1,
  right: 2,
  up: 3,
  down: 4
};

/********************/
/*     Objects      */
/********************/

/* Player Object 
 * Contains vars and funcitons to move and draw the player + check functions*/
function player(context, x, y, playerSizeMultiplier, walkSpeed) {
  this.imageCounter = 0;
  this.currentDirection = directions.down;
  this.oldDirection = this.currentDirection;
  this.ctx = context;
  this.playerSizeMultiplier = playerSizeMultiplier;
  this.walkSpeed = walkSpeed;
  this.diagonalMoveDivisior = 1.4;
  this.layerDirty = true;

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

  this.BlockCoord =
  [[1,1],
   [1,1],
   [1,1],
   [1,1],
   [1,1],
   [1,1]];

  this.oldBlockCoord =
  [[1,1],
   [1,1],
   [1,1],
   [1,1],
   [1,1],
   [1,1]];

  this.front = [];
  this.back = [];
  this.left = [];
  this.right = [];

  // crreate and initialize images from the image paths and push it into the arrays
  for (var i = 0; i < playerImages.tileCount; i++) {
    this.front.push(createImage(playerImages.frontImgs[i], "Bomberman Front"));
    this.back.push(createImage(playerImages.backImgs[i], "Bomberman Back"));
    this.left.push(createImage(playerImages.leftImgs[i], "Bomberman Left"));
    this.right.push(createImage(playerImages.rightImgs[i], "Bomberman Right"));
  }

  /*moves player when possible
  * updates the direction + image counter
  * also checks if players moves diagonally */
  this.tryMove = function() {
    var moved = false;
    var movedDiagonally = false;

    if (movLeft) {
      if (this.possibleMove(this.pos.posX, this.pos.posY+(this.dimensions.height * playerSizeMultiplier)/2, -this.walkSpeed, 0) && 
          this.possibleMove(this.pos.posX, this.pos.posY+this.dimensions.height * playerSizeMultiplier, -this.walkSpeed, 0)) {
        this.currentDirection = directions.left;
        this.speed.speedX = -this.walkSpeed;
        moved = true;
      }
    }
    if (movRight) {
      if (this.possibleMove(this.pos.posX+this.dimensions.width * playerSizeMultiplier, this.pos.posY+(this.dimensions.height * playerSizeMultiplier)/2, this.walkSpeed, 0) && 
          this.possibleMove(this.pos.posX+this.dimensions.width * playerSizeMultiplier, this.pos.posY+this.dimensions.height * playerSizeMultiplier, this.walkSpeed, 0)) {
        this.currentDirection = directions.right;
        this.speed.speedX = this.walkSpeed;
        moved = true;
      }
    }
    if (movUp) {
      if (this.possibleMove(this.pos.posX, this.pos.posY+(this.dimensions.height * playerSizeMultiplier)/2, 0, -this.walkSpeed) && 
          this.possibleMove(this.pos.posX+this.dimensions.width * playerSizeMultiplier, this.pos.posY+(this.dimensions.height * playerSizeMultiplier)/2, 0, -this.walkSpeed)) {
        this.currentDirection = directions.up;
        this.speed.speedY = -this.walkSpeed;
        if (moved)
          movedDiagonally = true;
        else
          moved = true;
      }
    }
    if (movDown) {
      if (this.possibleMove(this.pos.posX, this.pos.posY+this.dimensions.height * playerSizeMultiplier, 0, this.walkSpeed) && 
          this.possibleMove(this.pos.posX+this.dimensions.width * playerSizeMultiplier, this.pos.posY+this.dimensions.height * playerSizeMultiplier, 0, this.walkSpeed)) {
        this.currentDirection = directions.down;
        this.speed.speedY = this.walkSpeed;
        if (moved)
          movedDiagonally = true;
        else
          moved = true;
      }
    }

    // move speed is to high if moved diagonally, so we lower it
    if (movedDiagonally) {
      this.speed.speedX = this.speed.speedX / this.diagonalMoveDivisior;
      this.speed.speedY = this.speed.speedY / this.diagonalMoveDivisior;
    }

    this.newPos();
    this.resetSpeed();
    this.convertPlayerPos();
    this.layerDirty = true;

    // update image counter and return true if moved
    if (moved) {
      this.updateImageCounter();
      return true;
    }
    else
      return false;
  }

  //checks if a single Point can be moved
  this.possibleMove = function (x, y, dx, dy) {
    if (myBackground.map[Math.trunc((y + dy) / myBackground.tileSize)]
                        [Math.trunc((x + dx) / myBackground.tileSize)] == 0) {
      return true;
    }
    return false;
  };

  // draws player according to the current looking direction
  this.update = function () {
    switch (this.currentDirection) {
      case directions.left:
        this.drawPlayer(this.left[this.imageCounter], this.pos, this.dimensions, this.playerSizeMultiplier);
        break;
      case directions.right:
        this.drawPlayer(this.right[this.imageCounter], this.pos, this.dimensions, this.playerSizeMultiplier);
        break;
      case directions.up:
        this.drawPlayer(this.back[this.imageCounter], this.pos, this.dimensions, this.playerSizeMultiplier);
        break;
      case directions.down:
        this.drawPlayer(this.front[this.imageCounter], this.pos, this.dimensions, this.playerSizeMultiplier);
        break;
    }
  };

  // draws the player
  this.drawPlayer = function (img, pos, size, playerSizeMultiplier) {
    for (var i=0; i<6;++i) { //draw blocks behind player
      myBackground.drawBlock(this.oldBlockCoord[i][0], this.oldBlockCoord[i][1]);
      console.log(this.oldBlockCoord[i][0], this.oldBlockCoord[i][1]);
    }
    this.oldBlockCoord = this.BlockCoord;

    myGameArea.context.drawImage(img, pos.posX, pos.posY, size.width * playerSizeMultiplier, size.height * playerSizeMultiplier);
  };

  /* updates image counter
   * determines which frame of the player should be drawn*/
  this.updateImageCounter = function () {
    if (this.currentDirection != this.oldDirection) {
      imageCounter = 0;
      this.oldDirection = this.currentDirection;
    }

    if (this.imageCounter < 7) {
      this.imageCounter = this.imageCounter + 1;
    } else {
      this.imageCounter = 0;
    }
  };

  // set new position of the player
  this.newPos = function () {
    this.pos.posX += this.speed.speedX;
    this.pos.posY += this.speed.speedY;
  };

  // resets the speed; else player won't stop moving ~
  this.resetSpeed = function () {
    this.speed.speedX = 0;
    this.speed.speedY = 0;
  };

  //gives upper left and lower right corner in background coords
  this.convertPlayerPos = function() {
    this.BlockCoord[0][0] = Math.trunc((this.pos.posX)/myBackground.tileSize); //upper left
    this.BlockCoord[0][1] = Math.trunc((this.pos.posY)/myBackground.tileSize);

    this.BlockCoord[1][0] = Math.trunc((this.pos.posX)/myBackground.tileSize); //lower left
    this.BlockCoord[1][1] = Math.trunc((this.pos.posY+(this.dimensions.height * playerSizeMultiplier))/myBackground.tileSize);
    
    this.BlockCoord[2][0] = Math.trunc((this.pos.posX+(this.dimensions.width * playerSizeMultiplier))/myBackground.tileSize); //upper right
    this.BlockCoord[2][1] = Math.trunc((this.pos.posY)/myBackground.tileSize);
  
    this.BlockCoord[3][0] = Math.trunc((this.pos.posX+(this.dimensions.width * playerSizeMultiplier))/myBackground.tileSize); //lower right
    this.BlockCoord[3][1] = Math.trunc((this.pos.posY+(this.dimensions.height * playerSizeMultiplier))/myBackground.tileSize);

    this.BlockCoord[4][0] = Math.trunc((this.pos.posX)/myBackground.tileSize); //middle left
    this.BlockCoord[4][1] = Math.trunc((this.pos.posY+(this.dimensions.height * playerSizeMultiplier)/2)/myBackground.tileSize);

    this.BlockCoord[5][0] = Math.trunc((this.pos.posX+(this.dimensions.width * playerSizeMultiplier))/myBackground.tileSize); //middle right
    this.BlockCoord[5][1] = Math.trunc((this.pos.posY+(this.dimensions.height * playerSizeMultiplier)/2)/myBackground.tileSize);

  }

}

/* Background Object 
 * contains vars and functions to draw the background*/
function background(context, tileSize) {
  this.tiles = [];
  this.tileSize = tileSize;
  this.height = 0;
  this.width = 0;
  this.ctx = context;
  this.layerDirty = true;

  this.dimensions = {
    width: 13,
    height: 19
  };
  
  this.map = [
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 0, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1],
    [1, 0, 0, 2, 2, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 1, 2, 1, 2, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1],
    [1, 0, 0, 2, 2, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1],
    [1, 0, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1],
    [1, 0, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1],
    [1, 0, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
  ];

  // create new images and push them into the tiles array
  for (var i = 0; i < tileImages.tileCount; i++) {
    this.tiles.push(createImage(tileImages.tiles[i], "Tile"));
  }

  // update function draws the background
  this.update = function () {
    this.drawBackground();
  };

  // draw_background draws background according to the matrix (this.map)
  this.drawBackground = function () {
    for (var y = 0; y < this.dimensions.width; ++y) {
      for (var x = 0; x < this.dimensions.height; ++x) {
        this.drawBlock(x, y);
      }
    }
  };

  // draws a block to the context
  this.drawBlock = function (x, y) {
    switch (this.map[y][x]) {
      case 0: //background
        this.draw_image(this.ctx, this.tiles[0], x, y);
        break;
      case 1: //solid
        this.draw_image(this.ctx, this.tiles[1], x, y);
        break;
      case 2: //explodable
        this.draw_image(this.ctx, this.tiles[2], x, y);
        break;
    }
  };

  this.draw_image = function (ctx, img, x, y){
    ctx.drawImage(img, this.tileSize * x, this.tileSize * y, this.tileSize, this.tileSize);
  }
}

