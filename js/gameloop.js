var player_pos = [25, 25]; // x, y
var player_size = [15, 30]; // x, y
var bomb1_pos = [-1, -1]; // x, y
var player_speed = 2; // pixel per tick

function start_game () {
  draw_background();
  draw_player(Player, player_pos, player_size);
  setInterval(onTimerTick, 33); // 33 milliseconds = ~ 30 frames per sec
}






function onTimerTick() {

  //move player
  try_move_player();
  //todo
  //bombs
}

function try_move_player() { //only move so far
  if (movLeft) {
    if (true) {
      player_pos[1] -= player_speed;
    }
  }
  if (movRight) {
    player_pos[1] += player_speed;
  }
  if (movUp) {
    player_pos[0] -= player_speed;
  }
  if (movDown) {
    player_pos[0] += player_speed;
  }
  draw_background(); //ATTENTION unclean
  draw_bombs();
  draw_player(Player, player_pos, player_size);
}

function lay_bomb( ) {
  bomb1_pos[1] = Math.trunc((player_pos[1]+player_size[0]/2)/tile_size);
  bomb1_pos[0] = Math.trunc((player_pos[0]+player_size[1]/2)/tile_size);
}

function draw_bombs() {
  draw_block(Bomb, bomb1_pos[1], bomb1_pos[0]);
}