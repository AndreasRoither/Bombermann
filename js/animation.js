/********************/
/*     Functions    */
/********************/

function startGame() {
    myGameArea.start();
    myBackground = new background(myGameArea.context, 35);
    myGamePiece = new player(myGameArea.context, 36, 36, 0.7, 4);

    // TODO: start game loop here instead of setinterval from mygamearea
}

function updateGameArea() {
    myGameArea.clear();

    myBackground.update();
    myGamePiece.resetSpeed();

    if (!checkInput()) {
        myGamePiece.imageCounter = 0;
    } else {
        if (myGamePiece.possibleToMove(myBackground.tileSize))
            myGamePiece.newPos();
    }

    myGamePiece.update();

    //myGameArea.context.rect(myGamePiece.pos.posX, myGamePiece.pos.posY, 1, 1);
    //myGameArea.context.strokeStyle = "blue";
    //myGameArea.context.stroke();
}

/* checks if input is one of the desired keys and
 * updates the direction + image counter
 * also checks if players moves diagonally */
function checkInput() {
    var moved = false;
    var movedDiagonally = false;

    if (myGameArea.keys && myGameArea.keys[37]) {
        myGamePiece.currentDirection = directions.left;
        myGamePiece.speed.speedX = -myGamePiece.walkSpeed;
        moved = true;
    }
    if (myGameArea.keys && myGameArea.keys[39]) {
        myGamePiece.currentDirection = directions.right;
        myGamePiece.speed.speedX = myGamePiece.walkSpeed;
        moved = true;
    }
    if (myGameArea.keys && myGameArea.keys[38]) {
        myGamePiece.currentDirection = directions.up;
        myGamePiece.speed.speedY = -myGamePiece.walkSpeed;
        if (moved)
            movedDiagonally = true;
        else
            moved = true;
    }
    if (myGameArea.keys && myGameArea.keys[40]) {
        myGamePiece.currentDirection = directions.down;
        myGamePiece.speed.speedY = myGamePiece.walkSpeed;
        if (moved)
            movedDiagonally = true;
        else
            moved = true;
    }

    // move speed is to high if moved diagonally, so we reset it
    if (movedDiagonally) {
        myGamePiece.speed.speedX = myGamePiece.speed.speedX / myGamePiece.diagonalMoveDivisior;
        myGamePiece.speed.speedY = myGamePiece.speed.speedY / myGamePiece.diagonalMoveDivisior;
    }

    // update image counter and return true if moved
    if (moved) {
        myGamePiece.updateImageCounter();
        return true;
    } else
        return false;
}

/********************/
/*   Declarations   */
/********************/
var myGamePiece;

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
var createImage = function(src, title) {
    var img = new Image();
    img.src = src;
    img.alt = title;
    img.title = title;
    return img;
};

/* Game Area (Canvas) */
var myGameArea = {
    canvas: document.getElementById("gameCanvas"),
    start: function() {
        this.canvas.width = 700;
        this.canvas.height = 500;
        this.context = this.canvas.getContext("2d");
        document.body.insertBefore(this.canvas, document.body.childNodes[0]);
        this.interval = setInterval(updateGameArea, 50);
        this.keys = [];

        // Event listener
        window.addEventListener('keydown', function(e) {
            myGameArea.keys = (myGameArea.keys || []);
            myGameArea.keys[e.keyCode] = (e.type == "keydown");
        })
        window.addEventListener('keyup', function(e) {
            myGameArea.keys[e.keyCode] = (e.type == "keydown");
        })
    },
    clear: function() {
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

    this.dimensions = {
        width: 64,
        height: 100
    };

    this.speed = {
        speedX: 0,
        speedY: 0
    };

    this.drawPosition = {
        posX: x,
        posY: y
    }

    this.pos = {
        posX: (this.drawPosition.posX + (this.dimensions.width / 2) * this.playerSizeMultiplier),
        // - 3 is pixel correction
        posY: (this.drawPosition.posY + (this.dimensions.height) * this.playerSizeMultiplier) - 3,
    };

    this.front = [];
    this.back = [];
    this.left = [];
    this.right = [];

    // create and initialize images from the image paths and push it into the arrays
    for (var i = 0; i < playerImages.tileCount; i++) {
        this.front.push(createImage(playerImages.frontImgs[i], "Bomberman Front"));
        this.back.push(createImage(playerImages.backImgs[i], "Bomberman Back"));
        this.left.push(createImage(playerImages.leftImgs[i], "Bomberman Left"));
        this.right.push(createImage(playerImages.rightImgs[i], "Bomberman Right"));
    }

    // draws player according to the current looking direction
    this.update = function() {
        switch (this.currentDirection) {
            case directions.left:
                this.drawPlayer(this.left[this.imageCounter], this.drawPosition, this.dimensions, this.playerSizeMultiplier);
                break;
            case directions.right:
                this.drawPlayer(this.right[this.imageCounter], this.drawPosition, this.dimensions, this.playerSizeMultiplier);
                break;
            case directions.up:
                this.drawPlayer(this.back[this.imageCounter], this.drawPosition, this.dimensions, this.playerSizeMultiplier);
                break;
            case directions.down:
                this.drawPlayer(this.front[this.imageCounter], this.drawPosition, this.dimensions, this.playerSizeMultiplier);
                break;
        }
    };

    /* updates image counter
     * determines which frame of the player should be drawn*/
    this.updateImageCounter = function() {
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
    this.newPos = function() {
        this.pos.posX += this.speed.speedX;
        this.pos.posY += this.speed.speedY;
        this.drawPosition.posX += this.speed.speedX;
        this.drawPosition.posY += this.speed.speedY;
    };

    // resets the speed; else player won't stop moving ~
    this.resetSpeed = function() {
        this.speed.speedX = 0;
        this.speed.speedY = 0;
    };

    // check if it is possible to move
    this.possibleToMove = function(tileSize) {
        var moveAmount = {
            posX: this.speed.speedX,
            posY: this.speed.speedY
        };

        if (this.possible_move(this.pos, moveAmount, tileSize))
            return true;
        else
            return false;
    };

    //checks if a single Point can be moved
    this.possible_move = function(pos, moveAmount, tileSize) {
        /* important! if you just set temPos = pos and change tempPos,
         * pos will be changed as well */
        var tempPos = {
            posX: pos.posX,
            posY: pos.posY
        };

        /* collision detection
         * checks if player can move to a position by checking
         * two coordinates; uses playerSizeMultiplier and dimension of player*/
        switch (this.currentDirection) {
            case directions.left:
                tempPos.posX -= (this.dimensions.width * this.playerSizeMultiplier) / 4;
                var yTemp1 = tempPos.posY - (this.dimensions.height * this.playerSizeMultiplier) / 3;

                var x = Math.trunc((tempPos.posX + moveAmount.posX) / tileSize);
                var y1 = Math.trunc((tempPos.posY + moveAmount.posY) / tileSize);
                var y2 = Math.trunc((yTemp1 + moveAmount.posY) / tileSize);

                if (!(myBackground.map[y1][x] == 0 && myBackground.map[y2][x] == 0))
                    return false;
                break;

            case directions.right:
                tempPos.posX += (this.dimensions.width * this.playerSizeMultiplier) / 4;
                var yTemp1 = tempPos.posY - (this.dimensions.height * this.playerSizeMultiplier) / 3;

                var x = Math.trunc((tempPos.posX + moveAmount.posX) / tileSize);
                var y1 = Math.trunc((tempPos.posY + moveAmount.posY) / tileSize);
                var y2 = Math.trunc((yTemp1 + moveAmount.posY) / tileSize);

                if (!(myBackground.map[y1][x] == 0 && myBackground.map[y2][x] == 0))
                    return false;
                break;

            case directions.up:
                tempPos.posY -= (this.dimensions.height * this.playerSizeMultiplier) / 3;

                var xTemp1 = pos.posX - (this.dimensions.width * this.playerSizeMultiplier) / 4;
                var xTemp2 = pos.posX + (this.dimensions.width * this.playerSizeMultiplier) / 4;

                var x1 = Math.trunc((xTemp1 + moveAmount.posX) / tileSize);
                var x2 = Math.trunc((xTemp2 + moveAmount.posX) / tileSize);
                var y1 = Math.trunc((tempPos.posY + moveAmount.posY) / tileSize);

                if (!(myBackground.map[y1][x1] == 0 && myBackground.map[y1][x2] == 0))
                    return false;
                break;

            case directions.down:
                var xTemp1 = pos.posX - (this.dimensions.width * this.playerSizeMultiplier) / 4;
                var xTemp2 = pos.posX + (this.dimensions.width * this.playerSizeMultiplier) / 4;

                var x1 = Math.trunc((xTemp1 + moveAmount.posX) / tileSize);
                var x2 = Math.trunc((xTemp2 + moveAmount.posX) / tileSize);
                var y1 = Math.trunc((tempPos.posY + moveAmount.posY) / tileSize);

                if (!(myBackground.map[y1][x1] == 0 && myBackground.map[y1][x2] == 0))
                    return false;
                break;
        }
        return true;
    };

    // draws the player
    this.drawPlayer = function(img, pos, size, playerSizeMultiplier) {
        myGameArea.context.drawImage(img, pos.posX, pos.posY, size.width * playerSizeMultiplier, size.height * playerSizeMultiplier);
    };
}

/* Background Object 
 * contains vars and functions to draw the background*/
function background(context, tileSize) {
    this.tiles = [];
    this.tileSize = tileSize;
    this.height = 0;
    this.width = 0;
    this.ctx = context;

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
    this.update = function() {
        this.draw_background(this.ctx, this.map, this.dimensions, this.tiles, this.tileSize);
    };

    // draw_background draws background according to the matrix (this.map)
    this.draw_background = function(ctx, background, dimensions, tiles, tileSize) {
        for (var y = 0; y < dimensions.width; ++y) {
            for (var x = 0; x < dimensions.height; ++x) {
                switch (background[y][x]) {
                    case 0: //background
                        this.draw_block(ctx, tiles[0], x, y, tileSize);
                        break;
                    case 1: //solid
                        this.draw_block(ctx, tiles[1], x, y, tileSize);
                        break;
                    case 2: //explodable
                        this.draw_block(ctx, tiles[2], x, y, tileSize);
                        break;
                }
            }
        }
    };

    // draws a block to the context
    this.draw_block = function(ctx, img, x, y, tileSize) {
        ctx.drawImage(img, tileSize * x, tileSize * y, tileSize, tileSize);
    };
}