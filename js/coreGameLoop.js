/*INDEX*/
/*
start game
core game loop
pictures
var game area
player
background
bomb
*/

/********************/
/*   Declarations   */
/********************/
var explosion = new Audio('./sound/Bomb1.mp3');
explosion.volume = 0.2;

/* Game Area (Canvas) */
var myGameArea = {
    canvas: document.getElementById("gameCanvas"),
    start: function () {
        this.canvas.width = 665;
        this.canvas.height = 455;
        this.context = this.canvas.getContext("2d");
        //document.body.insertBefore(this.canvas, document.body.childNodes[0]);
        this.interval = setInterval(updateGameArea, 33);
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

var bombHandler = {
    bombCounter : 0,
    bombs : []
};

var globalPlayerSizeMultiplier = 0.5;
var globalTileSize = 35;
var gameStarted = false;

/********************
*     Functions     *
*********************/

function startGame(position) {
    myImageFactory = new ImageFactory();
    myGameArea.start();

    myBackground = new background(myGameArea.context, globalTileSize);
    myPlayer = new player(myGameArea.context, position, globalPlayerSizeMultiplier, 3);
    players = new otherPlayers();
}

function updateGameArea() {
    if (movLeft || movRight || movUp || movDown) {
        myPlayer.tryMove();
    }

    // redraw background if sth changed
    if (myBackground.layerDirty) {
        myBackground.update();
        myPlayer.update();
        myBackground.layerDirty = false;

        if (players.playerCount != 0) {
            players.players.forEach(element => {
                element.update();
            });
        }
    }

    // redraw player if sth changed
    if (myPlayer.layerDirty) {
        myPlayer.update();
        myPlayer.layerDirty = false;
        myPlayer.layerDirty2 = true;
        playerMoved(myPlayer.pos, myPlayer.imageCounter, myPlayer.currentDirection);
    } else if (myPlayer.layerDirty2) {
        myPlayer.imageCounter = 0;
        myPlayer.layerDirty2 = false;
        myPlayer.update();
        playerMoved(myPlayer.pos, myPlayer.imageCounter, myPlayer.currentDirection);
    }

    if (players.playerCount != 0) {
        players.players.forEach(element => {
            if (element.layerDirty) element.update();
        });
    }

    myPlayer.updateBomb();
}


/********************/
/*     Objects      */
/********************/

/* Player Object
 * Contains vars and funcitons to move and draw the player + check functions*/
function player(context, position, playerSizeMultiplier, walkSpeed) {
    this.imageCounter = 0;
    this.currentDirection = directions.down;
    this.oldDirection = this.currentDirection;
    this.ctx = context;
    this.playerSizeMultiplier = playerSizeMultiplier;
    this.walkSpeed = walkSpeed;
    this.diagonalMoveDivisior = 1.4;
    this.layerDirty = true;
    this.layerDirty2 = false;
    this.collsionCorrection = 10 * playerSizeMultiplier;

    this.stats = {
        kills: 0,
        bombPowerup: 0,
        speedPowerup: 0
    };

    this.dimensions = {
        width: 64 * playerSizeMultiplier,
        height: 100 * playerSizeMultiplier
    };

    this.speed = {
        speedX: 0,
        speedY: 0
    };

    this.pos = {
        x: (position.x * globalTileSize),
        y: (position.y * globalTileSize) - globalTileSize / 2
    };

    this.bomb = [
        new bomb(this.ctx, 4000, 1000, 2, 1),
        new bomb(this.ctx, 4000, 1000, 2, 0),
        new bomb(this.ctx, 4000, 1000, 2, 0)
    ];

    this.BlockCoord = [
        [1, 1],
        [1, 1],
        [1, 1],
        [1, 1],
        [1, 1],
        [1, 1]
    ];

    this.oldBlockCoord = [
        [1, 1],
        [1, 1],
        [1, 1],
        [1, 1],
        [1, 1],
        [1, 1]
    ];

    /*moves player when possible
     * updates the direction + image counter
     * also checks if players moves diagonally */
    this.tryMove = function () {
        if (!gameStarted) return;
        var moved = false;
        var movedDiagonally = false;

        if (movLeft) {
            if (this.possibleMove(this.pos.x + this.collsionCorrection, this.pos.y + this.dimensions.height / 2, -this.walkSpeed, 0) &&
                this.possibleMove(this.pos.x + this.collsionCorrection, this.pos.y + this.dimensions.height, -this.walkSpeed, 0)) {
                this.speed.speedX = -this.walkSpeed;
                moved = true;
            }
            this.currentDirection = directions.left;
        }
        if (movRight && !movLeft) {
            if (this.possibleMove(this.pos.x + this.dimensions.width - this.collsionCorrection, this.pos.y + this.dimensions.height / 2, this.walkSpeed, 0) &&
                this.possibleMove(this.pos.x + this.dimensions.width - this.collsionCorrection, this.pos.y + this.dimensions.height, this.walkSpeed, 0)) {
                this.speed.speedX = this.walkSpeed;
                moved = true;
            }
            this.currentDirection = directions.right;
        }
        if (movUp) {
            if (this.possibleMove(this.pos.x + this.collsionCorrection, this.pos.y + this.dimensions.height / 2, 0, -this.walkSpeed) &&
                this.possibleMove(this.pos.x + this.dimensions.width - this.collsionCorrection, this.pos.y + this.dimensions.height / 2, 0, -this.walkSpeed)) {
                this.speed.speedY = -this.walkSpeed;
                if (moved)
                    movedDiagonally = true;
                else
                    moved = true;
            }
            this.currentDirection = directions.up;
        }
        if (movDown && !movUp) {
            if (this.possibleMove(this.pos.x + this.collsionCorrection, this.pos.y + this.dimensions.height, 0, this.walkSpeed) &&
                this.possibleMove(this.pos.x + this.dimensions.width - this.collsionCorrection, this.pos.y + this.dimensions.height, 0, this.walkSpeed)) {
                this.speed.speedY = this.walkSpeed;
                if (moved)
                    movedDiagonally = true;
                else
                    moved = true;
            }
            this.currentDirection = directions.down;
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
        } else
            return false;
    };

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
                this.drawPlayer(myImageFactory.left[this.imageCounter]);
                break;
            case directions.right:
                this.drawPlayer(myImageFactory.right[this.imageCounter]);
                break;
            case directions.up:
                this.drawPlayer(myImageFactory.back[this.imageCounter]);
                break;
            case directions.down:
                this.drawPlayer(myImageFactory.front[this.imageCounter]);
                break;
        }
    };

    // draws the player
    this.drawPlayer = function (img) {
        for (var i = 0; i < 6; ++i) { //draw blocks behind player
            myBackground.drawBlock(this.oldBlockCoord[i][0], this.oldBlockCoord[i][1]);
        }
        this.oldBlockCoord = this.BlockCoord;

        myGameArea.context.drawImage(img, this.pos.x, this.pos.y, this.dimensions.width, this.dimensions.height);
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
        this.pos.x += this.speed.speedX;
        this.pos.y += this.speed.speedY;
    };

    // resets the speed; else player won't stop moving ~
    this.resetSpeed = function () {
        this.speed.speedX = 0;
        this.speed.speedY = 0;
    };

    //gives upper left and lower right corner in background coords
    this.convertPlayerPos = function () {
        this.BlockCoord[0][0] = Math.trunc((this.pos.x) / myBackground.tileSize); //upper left
        this.BlockCoord[0][1] = Math.trunc((this.pos.y) / myBackground.tileSize);

        this.BlockCoord[1][0] = Math.trunc((this.pos.x + this.dimensions.width) / myBackground.tileSize); //upper right
        this.BlockCoord[1][1] = Math.trunc((this.pos.y) / myBackground.tileSize);

        this.BlockCoord[2][0] = Math.trunc((this.pos.x) / myBackground.tileSize); //lower left
        this.BlockCoord[2][1] = Math.trunc((this.pos.y + this.dimensions.height) / myBackground.tileSize);

        this.BlockCoord[3][0] = Math.trunc((this.pos.x + this.dimensions.width) / myBackground.tileSize); //lower right
        this.BlockCoord[3][1] = Math.trunc((this.pos.y + this.dimensions.height) / myBackground.tileSize);

        this.BlockCoord[4][0] = Math.trunc((this.pos.x) / myBackground.tileSize); //middle left
        this.BlockCoord[4][1] = Math.trunc((this.pos.y + this.dimensions.height / 2) / myBackground.tileSize);

        this.BlockCoord[5][0] = Math.trunc((this.pos.x + this.dimensions.width) / myBackground.tileSize); //middle right
        this.BlockCoord[5][1] = Math.trunc((this.pos.y + this.dimensions.height / 2) / myBackground.tileSize);
    };

    this.layBomb = async function () {
        for (var i = 0; i < 3; ++i) {
            if (this.bomb[i].status == 1) {
                this.bomb[i].pos.y = Math.trunc((this.pos.y + (this.dimensions.height / 4) * 3) / myBackground.tileSize);
                this.bomb[i].pos.x = Math.trunc((this.pos.x + this.dimensions.width / 2) / myBackground.tileSize);
                this.bomb[i].status = 2;
                this.bomb[i].layerDirty = true;
                await sleep(this.bomb[i].bombTimer);
                this.bomb[i].bombExplode();
                return;
            }
        }
    };

    this.updateBomb = function () {
        for (var i = 0; i < 3; ++i) {
            this.bomb[i].drawBomb();
        }
    };

    this.killPlayer = function (x, y) {
        for (var i = 2; i < 6; ++i) {
            if (this.BlockCoord[i][0] == x && this.BlockCoord[i][1] == y) { //player dead
                alert('you dead!');
            }
        }
    };

    this.convertPlayerPos();
}

/* Multiplayer player object
 * */
function playerObject(position, id) {
    this.id = id;
    this.layerDirty = true;
    this.imageCounter = 0;
    this.currentDirection = directions.down;

    this.BlockCoord = [
        [1, 1],
        [1, 1],
        [1, 1],
        [1, 1],
        [1, 1],
        [1, 1]
    ];

    this.oldBlockCoord = [
        [1, 1],
        [1, 1],
        [1, 1],
        [1, 1],
        [1, 1],
        [1, 1]
    ];

    this.blockCoords = {
        x: position.x,
        y: position.y
    };

    this.pos = {
        x: (position.x * globalTileSize),
        y: (position.y * globalTileSize) - globalTileSize / 2
    };

    this.dimensions = {
        width: 64 * globalPlayerSizeMultiplier,
        height: 100 * globalPlayerSizeMultiplier
    };

    this.stats = {
        kills: 0
    };

    this.update = function () {
        // draw block behind player and draw player
        this.convertPlayerPos();
        this.drawBlockCoords();
        switch (this.currentDirection) {
            case directions.left:
                this.drawPlayer(myImageFactory.left[this.imageCounter]);
                break;
            case directions.right:
                this.drawPlayer(myImageFactory.right[this.imageCounter]);
                break;
            case directions.up:
                this.drawPlayer(myImageFactory.back[this.imageCounter]);
                break;
            case directions.down:
                this.drawPlayer(myImageFactory.front[this.imageCounter]);
                break;
        }

        this.layerDirty = false;
    };

    this.drawPlayer = function (img) {
        myGameArea.context.drawImage(img, this.pos.x, this.pos.y, this.dimensions.width, this.dimensions.height);
    };

    this.drawBlockCoords = function () {
        for (var i = 0; i < 6; ++i) { //draw blocks behind player
            myBackground.drawBlock(this.oldBlockCoord[i][0], this.oldBlockCoord[i][1]);
        }
        this.oldBlockCoord = this.BlockCoord;
    };

    //gives upper left and lower right corner in background coords
    this.convertPlayerPos = function () {
        this.BlockCoord[0][0] = Math.trunc((this.pos.x) / myBackground.tileSize); //upper left
        this.BlockCoord[0][1] = Math.trunc((this.pos.y) / myBackground.tileSize);

        this.BlockCoord[1][0] = Math.trunc((this.pos.x + this.dimensions.width) / myBackground.tileSize); //upper right
        this.BlockCoord[1][1] = Math.trunc((this.pos.y) / myBackground.tileSize);

        this.BlockCoord[2][0] = Math.trunc((this.pos.x) / myBackground.tileSize); //lower left
        this.BlockCoord[2][1] = Math.trunc((this.pos.y + this.dimensions.height) / myBackground.tileSize);

        this.BlockCoord[3][0] = Math.trunc((this.pos.x + this.dimensions.width) / myBackground.tileSize); //lower right
        this.BlockCoord[3][1] = Math.trunc((this.pos.y + this.dimensions.height) / myBackground.tileSize);

        this.BlockCoord[4][0] = Math.trunc((this.pos.x) / myBackground.tileSize); //middle left
        this.BlockCoord[4][1] = Math.trunc((this.pos.y + this.dimensions.height / 2) / myBackground.tileSize);

        this.BlockCoord[5][0] = Math.trunc((this.pos.x + this.dimensions.width) / myBackground.tileSize); //middle right
        this.BlockCoord[5][1] = Math.trunc((this.pos.y + this.dimensions.height / 2) / myBackground.tileSize);
    };

    this.convertPlayerPos();
}

function otherPlayers() {
    this.players = [];
    this.playerCount = 0;
}

/* Background Object
 * contains vars and functions to draw the background*/
function background(context, tileSize) {
    this.tileSize = tileSize;
    this.height = 0;
    this.width = 0;
    this.ctx = context;
    this.layerDirty = true;

    this.dimensions = {
        width: 19,
        height: 13
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

    // update function draws the background
    this.update = function () {
        this.drawBackground();
    };

    // draw_background draws background according to the matrix (this.map)
    this.drawBackground = function () {
        for (var y = 0; y < this.dimensions.height; ++y) {
            for (var x = 0; x < this.dimensions.width; ++x) {
                this.drawBlock(x, y);
            }
        }
    };

    // draws a block to the context
    this.drawBlock = function (x, y) {
        switch (this.map[y][x]) {
            case 0: //background
                this.draw_image(this.ctx, myImageFactory.tiles[0], x, y);
                break;
            case 1: //solid
                this.draw_image(this.ctx, myImageFactory.tiles[1], x, y);
                break;
            case 2: //explodable
                this.draw_image(this.ctx, myImageFactory.tiles[2], x, y);
                break;
        }
    };

    this.draw_image = function (ctx, img, x, y) {
        ctx.drawImage(img, this.tileSize * x, this.tileSize * y, this.tileSize, this.tileSize);
    };
}

/*everything with bombs*/
function bomb(context, bombTimer, explodeTimer, explosionRadius, status) {
    this.flameCounter = 0;
    this.bombTimer = bombTimer;
    this.explodeTimer = explodeTimer;
    this.explosionRadius = explosionRadius;
    this.status = status; //status: 0 dormant, 1 owned, 2 layed, 3 exploding
    this.ctx = context;
    this.layerDirty = true;

    this.pos = {
        x: 0,
        y: 0
    };

    this.bombExplode = async function () {
        this.status = 3;
        this.makeExplosion();
        explosion.play();
        myBackground.layerDirty = true;
        await sleep(this.explodeTimer);
        this.bombOver();
    };

    this.bombOver = function () {
        this.status = 1;
        myBackground.layerDirty = true;
        this.layerDirty = false;
    };

    this.makeExplosion = function () {
        var enable_x_pos = true;
        var enable_y_pos = true;
        var enable_x_neg = true;
        var enable_y_neg = true;
        for (var i = 1; i <= this.explosionRadius; i++) {
            if (enable_x_pos) {
                if (myBackground.map[this.pos.y][this.pos.x + i] == 2) { //remove block
                    myBackground.map[this.pos.y][this.pos.x + i] = 0;
                    enable_x_pos = false;
                } else if (myBackground.map[this.pos.y][this.pos.x + i] == 1) { //solid block
                    enable_x_pos = false;
                }
            }
            if (enable_y_pos) {
                if (myBackground.map[this.pos.y + i][this.pos.x] == 2) { //remove block
                    myBackground.map[this.pos.y + i][this.pos.x] = 0;
                    enable_y_pos = false;
                } else if (myBackground.map[this.pos.y + i][this.pos.x] == 1) { //solid block
                    enable_y_pos = false;
                }
            }
            if (enable_x_neg) {
                if (myBackground.map[this.pos.y][this.pos.x - i] == 2) { //remove block
                    myBackground.map[this.pos.y][this.pos.x - i] = 0;
                    enable_x_neg = false;
                } else if (myBackground.map[this.pos.y][this.pos.x - i] == 1) { //solid block
                    enable_x_neg = false;
                }
            }
            if (enable_y_neg) {
                if (myBackground.map[this.pos.y - i][this.pos.x] == 2) { //remove block
                    myBackground.map[this.pos.y - i][this.pos.x] = 0;
                    enable_y_neg = false;
                } else if (myBackground.map[this.pos.y - i][this.pos.x] == 1) { //solid block
                    enable_y_neg = false;
                }
            }
        }
    };


    this.drawBomb = function () {
        if (this.status == 2) {
            this.drawBlock(this.ctx, myImageFactory.bombs[0], this.pos.x, this.pos.y);
        } else if (this.status == 3) {
            this.drawBlock(this.ctx, myImageFactory.bombs[0], this.pos.x, this.pos.y);
            myPlayer.killPlayer(this.pos.x, this.pos.y);
            this.updateFlameCounter();
            //flames
            for (var i = 1; i <= this.explosionRadius; i++) {
                var enable_x_pos = true;
                var enable_y_pos = true;
                var enable_x_neg = true;
                var enable_y_neg = true;
                for (var i = 1; i <= this.explosionRadius; i++) {
                    if (enable_x_pos) {
                        if (myBackground.map[this.pos.y][this.pos.x + i] == 0) { //flames
                            myBackground.drawBlock(this.pos.x + i, this.pos.y);

                            this.drawBlock(this.ctx, myImageFactory.flames[this.flameCounter], this.pos.x + i, this.pos.y);

                            myPlayer.killPlayer(this.pos.x + i, this.pos.y);
                        } else if (myBackground.map[this.pos.y][this.pos.x + i] == 1) { //solid block
                            enable_x_pos = false;
                        }
                    }
                    if (enable_y_pos) {
                        if (myBackground.map[this.pos.y + i][this.pos.x] == 0) { //flames
                            myBackground.drawBlock(this.pos.x, this.pos.y + i);

                            this.drawBlock(this.ctx, myImageFactory.flames[this.flameCounter], this.pos.x, this.pos.y + i);

                            myPlayer.killPlayer(this.pos.x, this.pos.y + i);
                        } else if (myBackground.map[this.pos.y + i][this.pos.x] == 1) { //solid block
                            enable_y_pos = false;
                        }
                    }

                    if (enable_x_neg) {
                        if (myBackground.map[this.pos.y][this.pos.x - i] == 0) { //flames
                            myBackground.drawBlock(this.pos.x - i, this.pos.y);

                            this.drawBlock(this.ctx, myImageFactory.flames[this.flameCounter], this.pos.x - i, this.pos.y);

                            myPlayer.killPlayer(this.pos.x - i, this.pos.y);
                        } else if (myBackground.map[this.pos.y][this.pos.x - i] == 1) { //solid block
                            enable_x_neg = false;
                        }
                    }
                    if (enable_y_neg) {
                        if (myBackground.map[this.pos.y - i][this.pos.x] == 0) { //flames
                            myBackground.drawBlock(this.pos.x, this.pos.y - i);

                            this.drawBlock(this.ctx, myImageFactory.flames[this.flameCounter], this.pos.x, this.pos.y - i);

                            myPlayer.killPlayer(this.pos.x, this.pos.y - i);
                        } else if (myBackground.map[this.pos.y - i][this.pos.x] == 1) { //solid block
                            enable_y_neg = false;
                        }
                    }
                }
            }
        }
    };

    this.drawBlock = function (ctx, img, x, y) {
        ctx.drawImage(img, myBackground.tileSize * x, myBackground.tileSize * y, myBackground.tileSize, myBackground.tileSize);
    };

    /* updates image counter
     * determines which frame of the player should be drawn*/
    this.updateFlameCounter = function () {
        if (this.flameCounter < 4) {
            this.flameCounter++;
        } else {
            this.flameCounter = 0;
        }
    };
}

function calculateCoords(position) {
    position.x = (position.x * globalTileSize);
    position.y = (position.y * globalTileSize) - globalTileSize / 2;
}

//helper
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}