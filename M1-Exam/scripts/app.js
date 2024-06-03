var config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 1000 },
            debug: false
        }
    },
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};

var game = new Phaser.Game(config);
var player;
var cursors;
var cats;
var bombs;
var score = 0;
var catsCollected = 0;
var scoreText;
var catsCollectedText;
var gameOver = false;
var gameOverText;

function preload() {
    this.load.image('sky', 'assets/images/Sky.png');
    this.load.image('Ground', 'assets/images/platform.png');
    this.load.image('cat', 'assets/images/cat.png');
    this.load.image('bomb', 'assets/images/bomb.png');
    this.load.image('catcher', 'assets/images/catcher.png');
}

function create() {
    var sky = this.add.image(0, 0, 'sky');
    sky.setOrigin(0, 0);
    sky.setScale(config.width / sky.width, config.height / sky.height);

    var platforms = this.physics.add.staticGroup();
    platforms.create(400, 580, 'Ground').setScale(2).refreshBody();

    player = this.physics.add.sprite(100, 400, 'catcher');
    player.setBounce(0.2);
    player.setCollideWorldBounds(true);
    player.setScale(0.3);

    cats = this.physics.add.group({
        key: 'cat',
        repeat: 0,
        setXY: { x: Phaser.Math.Between(50, 750), y: 0 }
    });

    cats.children.iterate(function (child) {
        child.setScale(0.3);
        child.setBounceY(Phaser.Math.FloatBetween(0.4, 0.8));
    });

    this.physics.add.collider(cats, platforms);
    this.physics.add.collider(player, platforms);

    this.physics.add.overlap(player, cats, collectCat, null, this);

    cursors = this.input.keyboard.createCursorKeys();

    bombs = this.physics.add.group();

    this.physics.add.collider(bombs, platforms);
    this.physics.add.collider(player, bombs, hitBomb, null, this);

    scoreText = this.add.text(16, 16, 'Score: 0', { fontSize: '32px', fill: '#000' });
    catsCollectedText = this.add.text(600, 16, 'Cats: 0', { fontSize: '32px', fill: '#000' });

    gameOverText = this.add.text(400, 300, 'Game Over', { fontSize: '64px', fill: '#000' });
    gameOverText.setOrigin(0.5);
    gameOverText.setVisible(false);
}

function collectCat(player, cat) {
    cat.disableBody(true, true);

    score += 10;
    scoreText.setText('Score: ' + score);

    catsCollected++;
    catsCollectedText.setText('Cats: ' + catsCollected);

    var x = Phaser.Math.Between(50, 750);
    var y = Phaser.Math.Between(50, 300);
    var newCat = cats.create(x, y, 'cat');
    newCat.setScale(0.3);
    newCat.setBounceY(Phaser.Math.FloatBetween(0.4, 0.8));

    var bombX = Phaser.Math.Between(0, 800);
    var bomb = bombs.create(bombX, 16, 'bomb');
    bomb.setScale(0.3);
    bomb.setBounce(1);
    bomb.setCollideWorldBounds(true);
    bomb.setVelocity(Phaser.Math.Between(-200, 200), 20);
}

function hitBomb(player, bomb) {
    this.physics.pause();

    player.setTint(0xff0000);
    player.setVisible(false);

    gameOverText.setVisible(true);

    gameOver = true;
}

function update() {
    if (!player || gameOver) return;

    if (cursors.left.isDown) {
        player.setVelocityX(-160);
    } else if (cursors.right.isDown) {
        player.setVelocityX(160);
    } else {
        player.setVelocityX(0);
    }

    if (cursors.up.isDown && player.body.touching.down) {
        player.setVelocityY(-330);
    }
}
