/* ****************** */
/* Decalre Player var */
/* ****************** */
var player_pos = [35, 35]; // x, y in Abs coords
var player_pos_block = [[1,1],[1,1]]; // x, y in Block coords
var player_size = [15, 30]; // x, y
var player_speed = 3; // pixel per tick
var layer_dirty = true; //draw layer if true

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

/* ************* */
/* Decalre Bombs */
/* ************* */
var bomb_timer = 4000;
var explode_timer = 500;
var explosion_radius = 2;
var bomb_pos = [[-1, -1, 1], // x, y, status: 0 dormant, 1 owned, 2 layed, 3 exploding
                [-1, -1, 0],
                [-1, -1, 0]];

/* *********************** */
/* Start Game Button event */
/* *********************** */
function start_game () {
  setInterval(onTimerTick, 33); // 33 milliseconds = ~ 30 frames per sec
}

/* ************** */
/* Main Game Loop */
/* ************** */
function onTimerTick() {
  //move player
  try_move_player();
  if (layer_dirty) {
    draw_background(background); //ATTENTION unclean
    draw_bombs();
    draw_player(Player, player_pos, player_size);
    layer_dirty = false;
  }
  //todo
  //bombs
}

/* ************************** */
/* Moves Player when possible */
/* ************************** */
function try_move_player() {
  if (movLeft) {
    if (possible_move(player_pos[0], player_pos[1], -1*player_speed, 0) && 
        possible_move(player_pos[0], player_pos[1]+player_size[1], -1*player_speed, 0)) {
      player_pos[0] -= player_speed;
      layer_dirty = true;
    }
  }
  if (movRight) {
    if (possible_move(player_pos[0]+player_size[0], player_pos[1], player_speed, 0) && 
        possible_move(player_pos[0]+player_size[0], player_pos[1]+player_size[1], player_speed, 0)) {
      player_pos[0] += player_speed;
      layer_dirty = true;
    }
  }
  if (movUp) {
    if (possible_move(player_pos[0], player_pos[1], 0, -1*player_speed) && 
        possible_move(player_pos[0]+player_size[0], player_pos[1], 0, -1*player_speed)) {
      player_pos[1] -= player_speed;
      layer_dirty = true;
    }
  }
  if (movDown) {
    if (possible_move(player_pos[0], player_pos[1]+player_size[1], 0, player_speed) &&
        possible_move(player_pos[0]+player_size[0], player_pos[1]+player_size[1], 0, player_speed)) {
      player_pos[1] += player_speed;
      layer_dirty = true;
    }
  }
  if (layer_dirty) {
    player_pos_block = convert_player_pos();
  }
}

/* *********************** */
/* Lays Bomb when possible */
/* *********************** */
function lay_bomb( ) {
  for (var i = 0; i<3; ++i) {
    if (bomb_pos[i][2] == 1) {
      bomb_pos[i][1] = Math.trunc((player_pos[1]+player_size[1]/2)/tile_size);
      bomb_pos[i][0] = Math.trunc((player_pos[0]+player_size[0]/2)/tile_size);
      bomb_pos[i][2] = 2;
        setTimeout(function(){bomb_explode(i);}, bomb_timer);
      layer_dirty = true;
      return;
    }
  }
}

function bomb_explode(n) {
  bomb_pos[n][2] = 3;
  make_explosion(n);
  setTimeout(function(){bomb_over(n);}, explode_timer);
  layer_dirty = true;
}

function bomb_over(n) {
  bomb_pos[n][2] = 1;
  layer_dirty = true;
}



/* ************************ */
/* Various helper functions */
/* ************************ */
//draws all Bombs
function draw_bombs() {
  for (var n = 0; n<3; ++n) {
    if (bomb_pos[n][2] == 2) {
      draw_block(Bomb, bomb_pos[n][0], bomb_pos[n][1]);
    }
    else if (bomb_pos[n][2] == 3) {
      draw_block(Bomb, bomb_pos[n][0], bomb_pos[n][1]);
      kill_player(bomb_pos[n][0], bomb_pos[n][1]);
      for (var i=1; i<=explosion_radius; i++) {
        var enable_x_pos = true;
        var enable_y_pos = true;
        var enable_x_neg = true;
        var enable_y_neg = true;
        for (var i=1; i<=explosion_radius; i++) {
          if (enable_x_pos) {
            if (background[bomb_pos[n][1]][bomb_pos[n][0]+i] == 0) { //flames
              draw_block(Flame, bomb_pos[n][0]+i, bomb_pos[n][1]);
              kill_player(bomb_pos[n][0]+i, bomb_pos[n][1]);
            }
            else if (background[bomb_pos[n][1]][bomb_pos[n][0]+i] == 1) { //solid block
              enable_x_pos = false;
            }
          }
          if (enable_y_pos) {
            if (background[bomb_pos[n][1]+i][bomb_pos[n][0]] == 0) { //flames
              draw_block(Flame, bomb_pos[n][0], bomb_pos[n][1]+i);
              kill_player(bomb_pos[n][0], bomb_pos[n][1]+i);
            }
            else if (background[bomb_pos[n][1]+i][bomb_pos[n][0]] == 1) { //solid block
              enable_y_pos = false;
            }
          }
      
          if (enable_x_neg) {
            if (background[bomb_pos[n][1]][bomb_pos[n][0]-i] == 0) { //flames
              draw_block(Flame, bomb_pos[n][0]-i, bomb_pos[n][1]);
              kill_player(bomb_pos[n][0]-i, bomb_pos[n][1]);
            }
            else if (background[bomb_pos[n][1]][bomb_pos[n][0]-i] == 1) { //solid block
              enable_x_neg = false;
            }
          }
          if (enable_y_neg) {
            if (background[bomb_pos[n][1]-i][bomb_pos[n][0]] == 0) { //flames
              draw_block(Flame, bomb_pos[n][0], bomb_pos[n][1]-i);
              kill_player(bomb_pos[n][0], bomb_pos[n][1]-i);
            }
            else if (background[bomb_pos[n][1]-i][bomb_pos[n][0]] == 1) { //solid block
              enable_y_neg = false;
            }
          }
        }
      }
    }
  }
}

//checks if a single Point can be moved
function possible_move(x, y, dx, dy) {
  //console.log("x: ", x, "y: ", y, "dx: ", dx, "dy: ", dy);
  if (background[Math.trunc((y+dy)/tile_size)][Math.trunc((x+dx)/tile_size)] == 0) {
    return true;
  }
  return false;
}

//removes 1 explodable block
function make_explosion(n) {
  var enable_x_pos = true;
  var enable_y_pos = true;
  var enable_x_neg = true;
  var enable_y_neg = true;
  for (var i=1; i<=explosion_radius; i++) {
    if (enable_x_pos) {
      if (background[bomb_pos[n][1]][bomb_pos[n][0]+i] == 2) { //remove block
        background[bomb_pos[n][1]][bomb_pos[n][0]+i] = 0;
        enable_x_pos = false;
      }
      else if (background[bomb_pos[n][1]][bomb_pos[n][0]+i] == 1) { //solid block
        enable_x_pos = false;
      }
    }
    if (enable_y_pos) {
      if (background[bomb_pos[n][1]+i][bomb_pos[n][0]] == 2) { //remove block
        background[bomb_pos[n][1]+i][bomb_pos[n][0]] = 0;
        enable_y_pos = false;
      }
      else if (background[bomb_pos[n][1]+i][bomb_pos[n][0]] == 1) { //solid block
        enable_y_pos = false;
      }
    }

    if (enable_x_neg) {
      if (background[bomb_pos[n][1]][bomb_pos[n][0]-i] == 2) { //remove block
        background[bomb_pos[n][1]][bomb_pos[n][0]-i] = 0;
        enable_x_neg = false;
      }
      else if (background[bomb_pos[n][1]][bomb_pos[n][0]-i] == 1) { //solid block
        enable_x_neg = false;
      }
    }
    if (enable_y_neg) {
      if (background[bomb_pos[n][1]-i][bomb_pos[n][0]] == 2) { //remove block
        background[bomb_pos[n][1]-i][bomb_pos[n][0]] = 0;
        enable_y_neg = false;
      }
      else if (background[bomb_pos[n][1]-i][bomb_pos[n][0]] == 1) { //solid block
        enable_y_neg = false;
      }
    }
  }
}

//gives upper left and lower right corner in background coords
function convert_player_pos () {
  var pos=[[0,0],
           [0,0]];
  pos[0][0] = Math.trunc((player_pos[0])/tile_size);
  pos[0][1] = Math.trunc((player_pos[1])/tile_size);
  pos[1][0] = Math.trunc((player_pos[0]+player_size[0])/tile_size);
  pos[1][1] = Math.trunc((player_pos[1]+player_size[1])/tile_size);
  return pos;
}

function kill_player (x, y) {
  for (var i=0; i<2; ++i) {
    if (player_pos_block[i][0]==x && player_pos_block[i][1]==y) { //player dead
      alert('you dead!');
    }
  }
}