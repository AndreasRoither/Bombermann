/* ****************** */
/* Decalre Player var */
/* ****************** */
var player_pos = [35, 35]; // x, y
var player_size = [15, 30]; // x, y
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
  draw_background(background); //ATTENTION unclean
  draw_bombs();
  draw_player(Player, player_pos, player_size);
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
      return;
    }
  }
}

function bomb_explode(n) {
  bomb_pos[n][2] = 3;
  make_explosion(n);
  setTimeout(function(){bomb_over(n);}, explode_timer);
}

function bomb_over(n) {
  bomb_pos[n][2] = 1;
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
      for (var i=1; i<=explosion_radius; i++) {
        var enable_x_pos = true;
        var enable_y_pos = true;
        var enable_x_neg = true;
        var enable_y_neg = true;
        for (var i=1; i<=explosion_radius; i++) {
          if (enable_x_pos) {
            if (background[bomb_pos[n][1]][bomb_pos[n][0]+i] == 0) { //flames
              draw_block(Flame, bomb_pos[n][0]+i, bomb_pos[n][1]);
            }
            else if (background[bomb_pos[n][1]][bomb_pos[n][0]+i] == 1) { //solid block
              enable_x_pos = false;
            }
          }
          if (enable_y_pos) {
            if (background[bomb_pos[n][1]+i][bomb_pos[n][0]] == 0) { //flames
              draw_block(Flame, bomb_pos[n][0], bomb_pos[n][1]+i);
            }
            else if (background[bomb_pos[n][1]+i][bomb_pos[n][0]] == 1) { //solid block
              enable_y_pos = false;
            }
          }
      
          if (enable_x_neg) {
            if (background[bomb_pos[n][1]][bomb_pos[n][0]-i] == 0) { //flames
              draw_block(Flame, bomb_pos[n][0]-i, bomb_pos[n][1]);
            }
            else if (background[bomb_pos[n][1]][bomb_pos[n][0]-i] == 1) { //solid block
              enable_x_neg = false;
            }
          }
          if (enable_y_neg) {
            if (background[bomb_pos[n][1]-i][bomb_pos[n][0]] == 0) { //flames
              draw_block(Flame, bomb_pos[n][0], bomb_pos[n][1]-i);
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