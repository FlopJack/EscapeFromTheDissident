var game = new Phaser.Game(800, 600, Phaser.AUTO, '', { preload: preload, create: create, update: update, render: render });

function preload() {
    game.load.image('map', 'asset/foret.png');
    game.load.image('player', 'asset/player.png');
    game.load.image('bullet', 'asset/shmup-bullet.png')
    game.load.image('pinata', 'asset/pinata.jpg');
    game.load.image('playerWP', 'asset/jesus.png');
    game.load.image('ennemy', 'asset/soral.png');
    game.load.audio('chancla', 'asset/audio/risitas-la-chancla.mp3');
    game.load.audio('poliment', 'asset/audio/SoralIntro.mp3');

}
var touches;
var player1;
var weapon;
var powerUp;
var firebuttonUP;
var firebuttonDOWN;
var firebuttonRIGHT;
var firebuttonLEFT;
var sound;
var ennemys;
var hp;
var soundSoral;

function create() {

    game.add.tileSprite(0, 0, 1920, 1920, 'map');
    game.world.setBounds(0, 0, 1920, 1920);

    //FULLSCREEN
    game.scale.fullScreenScaleMode = Phaser.ScaleManager.EXACT_FIT;
    game.input.onDown.add(gofull, this);

    //PHYSICS
    game.physics.startSystem(Phaser.Physics.ARCADE);

    //PLAYER1
    player1 = game.add.sprite(game.world.centerX, game.world.centerY, 'player');
    game.physics.arcade.enable(player1);
    player1.body.collideWorldBounds = true;
    player1.body.fixedRotation = true;

    //SOUND
    sound = game.add.audio('chancla');
    soundSoral = game.add.audio('poliment');




    //CAMERA
    game.camera.follow(player1, Phaser.Camera.FOLLOW_LOCKON, 0.1, 0.1);

    //ITEM
    kippa = game.add.sprite(game.world.randomX, game.world.randomY, 'pinata');
    game.physics.arcade.enable(kippa);
    kippa.body.collideWorldBounds = true;
    kippa.body.fixedRotation = true;

    //ENNEMIES 
    ennemys = game.add.group();
    ennemys.enableBody = true;
    ennemys.physicsBodyType = Phaser.Physics.ARCADE;
    game.time.events.repeat(Phaser.Timer.SECOND * 2, 1, createEnnemy, this);

    //WEAPON
    weapon = game.add.weapon(30, 'bullet');
    weapon.bulletKillType = Phaser.Weapon.KILL_WORLD_BOUNDS;
    //vitesse des balles
    weapon.bulletSpeed = 600;
    weapon.trackSprite(player1, false);
    game.physics.arcade.enable(weapon);






    //KEYS MOVEMENT
    touches = game.input.keyboard.createCursorKeys();

    firebuttonUP = game.input.keyboard.addKey(Phaser.KeyCode.Z);
    firebuttonDOWN = game.input.keyboard.addKey(Phaser.KeyCode.S);
    firebuttonRIGHT = game.input.keyboard.addKey(Phaser.KeyCode.D);
    firebuttonLEFT = game.input.keyboard.addKey(Phaser.KeyCode.Q);



}

//ENNEMIES
function createEnnemy() {


    for (var i = 0; i < 5; i++) {
        var en = ennemys.create(game.world.randomX, game.world.randomY, 'ennemy');

        en.name = 'enememy1'

        //ennemy.body.collideWorldBounds = true;
    }   
    soundSoral.play();
}


function gofull() {

    if (game.scale.isFullScreen) {
        game.scale.stopFullScreen();
    }
    else {
        game.scale.startFullScreen(false);
    }

}

function getKippa(player1, kippa) {
    powerUp = "true";
    kippa.kill();
    player1.loadTexture('playerWP', 0);
    sound.play();

}

function killEnnemyWeapon(weapon, enem) {

    enem.kill();
    console.log("BOOBS!");

}





function update() {

    player1.body.velocity.x = 0;
    player1.body.velocity.y = 0;

    if (touches.up.isDown) {

        player1.body.velocity.y = -600;
    } else {
        if (touches.down.isDown) {
            player1.body.velocity.y = 600;
        }
    }
    if (touches.left.isDown) {
        player1.body.velocity.x = -600;
    } else {
        if (touches.right.isDown) {
            player1.body.velocity.x = 600;
        }
    }
    if (powerUp == "true") {
        if (firebuttonUP.isDown) {
            weapon.fireAngle = Phaser.ANGLE_UP;
            weapon.fire();
        } else {

            if (firebuttonDOWN.isDown) {

                weapon.fireAngle = Phaser.ANGLE_DOWN;
                weapon.fire();
            }
        }
        if (firebuttonLEFT.isDown) {
            weapon.fireAngle = Phaser.ANGLE_LEFT;
            weapon.fire();
        } else {
            if (firebuttonRIGHT.isDown) {
                weapon.fireAngle = Phaser.ANGLE_RIGHT;
                weapon.fire();
            }
        }

    }
    //COLLISION 
    game.physics.arcade.collide(player1, kippa, getKippa);
    game.physics.arcade.overlap(weapon.bullets, ennemys, killEnnemyWeapon, null, this);

}



function render() {

    //game.debug.cameraInfo(game.camera, 32, 32);
    //  game.debug.bodyInfo(player1, 32, 500);
    game.debug.text("Time until event: " + game.time.events.duration.toFixed(0), 32, 32);

}