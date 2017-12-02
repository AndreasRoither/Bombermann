var player_pos = [35, 35]; // x, y
var player_size = [15, 30]; // x, y
var bomb1_pos = [-1, -1]; // x, y
var player_speed = 3; // pixel per tick

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



function start_game () {
  draw_background(background);
  draw_player(Player, player_pos, player_size);
  setInterval(onTimerTick, 33); // 33 milliseconds = ~ 30 frames per sec
}

function onTimerTick() {

  //move player
  try_move_player();
  //todo
  //bombs
}

function try_move_player() {
  if (movLeft) {
    if (possible_move(player_pos[0], player_pos[1], -1*player_speed, 0) && 
        possible_move(player_pos[0], player_pos[1]+player_size[1], -1*player_speed, 0)) {
      player_pos[0] -= player_speed;
    }
  }
  if (movRight) {
    if (possible_move(player_pos[0]+player_size[0], player_pos[1], player_speed, 0) && 
        possible_move(player_pos[0]+player_size[0], player_pos[1]+player_size[1], player_speed, 0)) {
      player_pos[0] += player_speed;
    }
  }
  if (movUp) {
    if (possible_move(player_pos[0], player_pos[1], 0, -1*player_speed) && 
        possible_move(player_pos[0]+player_size[0], player_pos[1], 0, -1*player_speed)) {
      player_pos[1] -= player_speed;
    }
  }
  if (movDown) {
    if (possible_move(player_pos[0], player_pos[1]+player_size[1], 0, player_speed) &&
        possible_move(player_pos[0]+player_size[0], player_pos[1]+player_size[1], 0, player_speed)) {
      player_pos[1] += player_speed;
    }
  }
  draw_background(background); //ATTENTION unclean
  draw_bombs();
  draw_player(Player, player_pos, player_size);
}

function lay_bomb( ) {
  bomb1_pos[1] = Math.trunc((player_pos[1]+player_size[0]/2)/tile_size);
  bomb1_pos[0] = Math.trunc((player_pos[0]+player_size[1]/2)/tile_size);
}

function draw_bombs() {
  draw_block(Bomb, bomb1_pos[0], bomb1_pos[1]);
}

function possible_move(x, y, dx, dy) {
  console.log("x: ", x, "y: ", y, "dx: ", dx, "dy: ", dy);
  if (background[Math.trunc((y+dy)/tile_size)][Math.trunc((x+dx)/tile_size)] == 0) {
    return true;
  }
  return false;
}