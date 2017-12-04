var myGamePiece;

function startGame() {
  myGameArea.start();
  myGamePiece = new player(3, 3);
  //myGamePiece = new component(30, 30, "red", 10, 120);
}

var playerImages = {
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

var myGameArea = {
  canvas: document.getElementById("gameCanvas"),
  start: function () {
    this.canvas.width = 500;
    this.canvas.height = 500;
    this.context = this.canvas.getContext("2d");
    document.body.insertBefore(this.canvas, document.body.childNodes[0]);
    this.interval = setInterval(updateGameArea, 20);
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

function component(width, height, color, x, y) {
  this.gamearea = myGameArea;
  this.width = width;
  this.height = height;
  this.speedX = 0;
  this.speedY = 0;
  this.x = x;
  this.y = y;

  // functions
  this.update = function () {
    ctx = myGameArea.context;
    ctx.fillStyle = color;
    ctx.fillRect(this.x, this.y, this.width, this.height);
  };

  this.newPos = function () {
    this.x += this.speedX;
    this.y += this.speedY;
  };
}

var directions = {
  left: 1,
  right: 2,
  up: 3,
  down: 4
};

function player(x, y) {
  this.gamearea = myGameArea;
  this.imageCounter = 0;
  this.currentDirection = directions.down;

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

  for (var i = 0; i < 8; i++) {
    this.front.push(createImage(playerImages.frontImgs[i], "Bomberman Front"));
    this.back.push(createImage(playerImages.backImgs[i], "Bomberman Back"));
    this.left.push(createImage(playerImages.leftImgs[i], "Bomberman Left"));
    this.right.push(createImage(playerImages.rightImgs[i], "Bomberman Right"));
  }

  // Functions
  this.update = function () {
    ctx = myGameArea.context;

    switch (this.currentDirection) {
      case directions.left:
        draw_player(this.left[this.imageCounter], this.pos, this.dimensions);
        break;
      case directions.right:
        draw_player(this.right[this.imageCounter], this.pos, this.dimensions);
        break;
      case directions.up:
        draw_player(this.back[this.imageCounter], this.pos, this.dimensions);
        break;
      case directions.down:
        draw_player(this.front[this.imageCounter], this.pos, this.dimensions);
        break;
    }

    this.updateImageCounter = function () {
      
    }
  };

  this.newPos = function () {
    this.pos.posX += this.speed.speedX;
    this.pos.posY += this.speed.speedY;
  };
}

function updateGameArea() {
  myGameArea.clear();

  myGamePiece.speed.speedX = 0;
  myGamePiece.speed.speedY = 0;

  if (myGameArea.keys && myGameArea.keys[37]) {
    myGamePiece.currentDirection = directions.left;
    myGamePiece.im
    myGamePiece.speed.speedX = -2;
  }
  if (myGameArea.keys && myGameArea.keys[39]) {
    myGamePiece.currentDirection = directions.right;
    myGamePiece.speed.speedX = 2;
  }
  if (myGameArea.keys && myGameArea.keys[38]) {
    myGamePiece.currentDirection = directions.up;
    myGamePiece.speed.speedY = -2;
  }
  if (myGameArea.keys && myGameArea.keys[40]) {
    myGamePiece.currentDirection = directions.down;
    myGamePiece.speed.speedY = 2;
  }

  myGamePiece.newPos();
  myGamePiece.update();
}

function draw_player(img, pos, size) {
  myGameArea.context.drawImage(
    img,
    pos.posX,
    pos.posY,
    size.width,
    size.height
  );
}

// Image factory
var createImage = function (src, title) {
  var img = new Image();
  img.src = src;
  img.alt = title;
  img.title = title;
  return img;
};