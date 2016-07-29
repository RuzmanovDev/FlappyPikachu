var mainState = {
    preload: function () {
        // This function will be executed at the beginning
        // That's where we load the images and sounds

        game.load.image('pikachu', 'images/piakachu.png');
        game.load.image('wallpaper', 'images/wallpaper.png');
        game.load.image('pipe', 'images/pipe.png');
        game.load.audio('jump', 'pikachu.wav');
    },
    create: function () {
        // This function is called after the preload function
        // Here we set up the game, display sprites, etc.

        game.stage.backgroundColor = '#000';

        var sprite = game.add.sprite(game.world.X, game.world.Y, 'wallpaper');

        game.physics.startSystem(Phaser.Physics.ARCADE);

        this.pikachu = game.add.sprite(50, 50, 'pikachu');
        this.pikachu.width = 40;
        this.pikachu.height = 40;
        this.pikachu.anchor.setTo(-0.2, 0.5);

        game.physics.arcade.enable(this.pikachu);

        this.pipes = game.add.group();

        // Add gravity to the bird to make it fall
        this.pikachu.body.gravity.y = 1000;

        // Call the 'jump' function when the spacekey is hit
        var spaceKey = game.input.keyboard.addKey(
            Phaser.Keyboard.SPACEBAR);
        spaceKey.onDown.add(this.jump, this);

        this.timer = game.time.events.loop(1500, this.addRowOfPipes, this);

        this.score = 0;
        this.labelScore = game.add.text(20, 20, "0",
            { font: "30px Arial", fill: "#ffffff" });

        this.jumpSound = game.add.audio('jump');

    },

    update: function () {
        // This function is called 60 times per second
        // It contains the game's logic

        if (this.pikachu.y < 0 || this.pikachu.y > 490)
            this.restartGame();

        if (this.pikachu.angle < 20)
            this.pikachu.angle += 1;

        game.physics.arcade.overlap(this.pikachu, this.pipes, this.restartGame, null, this);
    },

    jump: function () {
        // Add a vertical velocity to the bird
        this.pikachu.body.velocity.y = -350;
        this.jumpSound = game.add.audio('jump');
        this.jumpSound.play(); 
        // animate the pikachu
        game.add.tween(this.pikachu).to({ angle: -20 }, 100).start();
    },

    addOnePipe: function (x, y) {
        // Create a pipe at the position x and y
        var pipe = game.add.sprite(x, y, 'pipe');
        pipe.height = 70;

        // Add the pipe to our previously created group
        this.pipes.add(pipe);

        // Enable physics on the pipe
        game.physics.arcade.enable(pipe);

        // Add velocity to the pipe to make it move left
        pipe.body.velocity.x = -200;

        // Automatically kill the pipe when it's no longer visible
        pipe.checkWorldBounds = true;
        pipe.outOfBoundsKill = true;
    },

    addRowOfPipes: function () {
        // Randomly pick a number between 1 and 5
        // This will be the hole position
        var hole = Math.floor(Math.random() * 2) + 1;

        this.score += 1;
        this.labelScore.text = this.score;

        // Add the 6 pipes
        // With one big hole at position 'hole' and 'hole + 1'
        for (var i = 0; i < 8; i++) {
            if (i != hole && i != hole + 1) {
                this.addOnePipe(500, i * 60 + 10);

            }
        }
    },

    // Restart the game
    restartGame: function () {
        // Start the 'main' state, which restarts the game
        game.state.start('main');
    }
};

// Initialize Phaser, and create a 400px by 490px game
var game = new Phaser.Game(800, 450);

// Add the 'mainState' and call it 'main'
game.state.add('main', mainState);

// Start the state to actually start the game
game.state.start('main');