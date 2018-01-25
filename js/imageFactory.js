/********************
*   Image Factory   *
*********************/

// image factory loads all images
function ImageFactory() {
  this.loaded = false;
  this.loadingImgs = 0;
  this.callback = null;

  /* contains all player image paths */
  this.playerImages = {
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
  this.tileImages = {
    tileCount: 7,
    tiles: [
      './img/Blocks/SolidBlock.png',
      './img/Blocks/BackgroundTile.png',
      './img/Blocks/ExplodableBlock.png',
      './img/Powerups/BombPowerup.png',
      './img/Powerups/FlamePowerup.png',
      './img/Powerups/SpeedPowerup.png',
      './img/Powerups/VirusPowerup.png'
    ]
  };

  this.bombImages = {
    bombCount: 1,
    bombs: [
      './img/Bomb/Bomb_f01.png',
    ]
  };

  this.flameImages = {
    flameCount: 5,
    flames: [
      './img/Flame/Flame_f00.png',
      './img/Flame/Flame_f01.png',
      './img/Flame/Flame_f02.png',
      './img/Flame/Flame_f03.png',
      './img/Flame/Flame_f04.png',
    ]
  };

  /* Image factory to create an image
  * returns image; */
  this.createImage = function (src, title) {
    var img = new Image();
    var base = this;
    this.loadingImgs++;

    img.src = src;
    img.alt = title;
    img.title = title;

    // add event listeners for callbacks
    img.addEventListener('error', function () {
      base.loadingImgs--;
    });

    img.onload = function () {
      base.loadingImgs--;

      if (base.loadingImgs == 0) {
        if (base.loaded) {
          base.callback();
        }
      }
    }
    return img;
  };

  this.front = [];
  this.back = [];
  this.left = [];
  this.right = [];
  this.tiles = [];
  this.bombs = [];
  this.flames = [];

  this.load = function (callback) {
    this.callback = callback;

    // create and initialize images from the image paths and push it into the arrays
    for (var i = 0; i < this.playerImages.tileCount; i++) {
      this.front.push(this.createImage(this.playerImages.frontImgs[i], "Bomberman Front"));
      this.back.push(this.createImage(this.playerImages.backImgs[i], "Bomberman Back"));
      this.left.push(this.createImage(this.playerImages.leftImgs[i], "Bomberman Left"));
      this.right.push(this.createImage(this.playerImages.rightImgs[i], "Bomberman Right"));
    }

    // create new images and push them into the tiles array
    for (var i = 0; i < this.tileImages.tileCount; i++) {
      this.tiles.push(this.createImage(this.tileImages.tiles[i], "Tile"));
    }

    // create new images and push them into the bomb array
    for (var i = 0; i < this.bombImages.bombCount; i++) {
      this.bombs.push(this.createImage(this.bombImages.bombs[i], "Bomb"));
    }

    // create new images and push them into the flame array
    for (var i = 0; i < this.flameImages.flameCount; i++) {
      this.flames.push(this.createImage(this.flameImages.flames[i], "Flame"));
    }

    this.loaded = true;
  }
}