/* draw_canvas.js */
var c = document.getElementById("gamearea");
var ctx = c.getContext("2d");
var tile_size = 25;

/* ********************** */
/* Decalre Block-Pictures */
/* ********************** */
var Portal = new Image();
Portal.src = './img/Blocks/Portal.png';
var BackgroundTile = new Image();
BackgroundTile.src = './img/Blocks/BackgroundTile.png';
var SolidBlock = new Image();
SolidBlock.src = './img/Blocks/SolidBlock.png';
var ExplodableBlock = new Image();
ExplodableBlock.src = './img/Blocks/ExplodableBlock.png';
var Bomb = new Image();
Bomb.src = './img/Bomb/Bomb_f01.png';
var Player = new Image();
Player.src = './img/Bomberman/test.png';

/* ****************** */
/* Decalre Background */
/* ****************** */
var background = [
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

/* **************** */
/* Canvas Functions */
/* **************** */

function draw_block (img, x, y) {
  ctx.drawImage(img, tile_size*x, tile_size*y, tile_size, tile_size);
}

function draw_background () {
  for (var y = 0; y<13; ++y) { //heigth
    for (var x = 0; x<19; ++x) {  //width

      switch(background[y][x]) {
        case 0: //background
          draw_block(BackgroundTile, x, y);
          break;
        case 1: //solid
          draw_block(SolidBlock, x, y);
          break;
        case 2: //explodable
          draw_block(ExplodableBlock, x, y);
          break;
      }
    }
  }
}

function draw_player (img, pos, size) {
  ctx.drawImage(img, pos[1], pos[0], size[0], size[1]);
}
