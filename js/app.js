var game = true;

// Enemies our player must avoid
var Enemy = function(startX, startY, speed) {
    // Variables applied to each of our instances go here,
    // we've provided one for you to get started
    this.x = startX;
    this.y = startY;
    this.speed = speed;
    this.won = false;

    // The image/sprite for our enemies, this uses
    // a helper we've provided to easily load images
    this.sprite = 'images/enemy-bug.png';
};

// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks
Enemy.prototype.update = function(dt) {
    // You should multiply any movement by the dt parameter
    // which will ensure the game runs at the same speed for
    // all computers.
    this.x += this.speed * dt;
    if (this.x > ctx.canvas.width) {
        this.x = -100;
        this.speed = 60 * Math.floor(Math.random() * 4 + 1);
    }

    // Check for collision detection between the player
    // and the enemy and reseting player's position
    var leftX = this.x - 70;
    var rightX = this.x + 70;
    var topY = this.y - 50;
    var bottomY = this.y + 50;

    if (player.x > leftX && player.x < rightX && player.y > topY && player.y < bottomY) {
        player.reset();
    }
};

// Draw the enemy on the screen if the game is not won yet,
// required method for game
Enemy.prototype.render = function() {
    if (!this.won) {
        ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
    }
};

// The key the player must claim to win
var Key = function(y) {
    this.x = 101 * (Math.floor(Math.random() * 5));
    this.y = y;
    this.won = false;
    this.sprite = 'images/Key.png';
}

Key.prototype.update = function(dt) {
    // Check for collision detection between the player 
    // and the key and the player claiming the key
    var leftX = this.x - 70;
    var rightX = this.x + 70;
    var topY = this.y - 50;
    var bottomY = this.y + 50;

    if (player.x > leftX && player.x < rightX && player.y > topY && player.y < bottomY) {
        this.won = true;
    }

};

// Draw the key on the screen if the player didn't claim it
Key.prototype.render = function() {
    if (!this.won) {
        ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
    }
};

Key.prototype.reset = function() {
    this.x = 101 * (Math.floor(Math.random() * 5));
    this.won = false;
};

// The final destination for the player after claiming the key
var TheEnd = function(x, y) {
    this.x = x;
    this.y = y;
    this.sprite = 'images/Selector.png';
}

TheEnd.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

// Now write your own player class
// This class requires an update(), render() and
// a handleInput() method.
var Player = function(dt) {
    this.startX = 205;
    this.startY = 390;
    this.x = this.startX;
    this.y = this.startY;
    this.stepX = 101;
    this.stepY = 83;
    this.sprite = 'images/char-horn-girl.png';
}

Player.prototype.update = function(dt) {
    // Checking if the player has reached his final destination 
    // and took the key to win the game
    if (this.x == 306 && this.y == -25) {
        if (key.won) {
            this.won = true;
            winGame.won = true;
            allEnemies.forEach(function(enemy) {
                enemy.won = true;
            });
        }
        //If the player stepped on the water, he will lose the game
    } else if (this.x != 306 && this.y == -25) {
        this.reset();
    }

};

Player.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

// Checking which keyboard key is pressed to move the player in it's direction
Player.prototype.handleInput = function(key) {
    switch (key) {
        case 'left':
            if (this.x > this.stepX) {
                this.x -= this.stepX;
            }
            break;

        case 'right':
            if (this.x < ctx.canvas.width - this.stepX) {
                this.x += this.stepX;
            }
            break;

        case 'up':
            if (this.y > 50) {
                this.y -= this.stepY;
            }
            break;

        case 'down':
            if (this.y < this.startY) {
                this.y += this.stepY;
            }
            break;
    }
}

// Reseting the player's position
Player.prototype.reset = function(dt) {
    this.x = this.startX;
    this.y = this.startY;
    if (key.won) {
        key.reset();
    }
};

// Winning the game
var WinGame = function(x, y) {
    this.x = x;
    this.y = y;
    this.won = false;
    this.sprite = 'images/you-win.png';
}

//Only show when the player wins
WinGame.prototype.render = function() {
    if (this.won) {
        ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
    }
};

// Now instantiate your objects.
// Place all enemy objects in an array called allEnemies
// Place the player object in a variable called player
var allEnemies = [new Enemy(0, 60, 290),
    new Enemy(0, 140, 200),
    new Enemy(0, 230, 400)
];
var key = new Key(140);
var theEnd = new TheEnd(303, 48);
player = new Player();
winGame = new WinGame(-50, 100);

// This listens for key presses and sends the keys to your
// Player.handleInput() method. You don't need to modify this.
document.addEventListener('keyup', function(e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };

    player.handleInput(allowedKeys[e.keyCode]);
});
