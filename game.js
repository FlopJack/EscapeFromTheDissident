var game = new Phaser.Game(800, 600, Phaser.AUTO, '', { preload: preload, create: create, update: update, render: render });

function preload() {
    game.load.image('map', 'asset/foret.png');
    game.load.image('player', 'asset/player.png');
    game.load.image('bullet', 'asset/bullet.png')
    game.load.image('pinata', 'asset/pinata.jpg');
    game.load.image('playerWP', 'asset/jesus.png');
    game.load.image('ennemy', 'asset/soral.png');
    game.load.audio('chancla', 'asset/audio/risitas-la-chancla.mp3');
    game.load.audio('poliment', 'asset/audio/SoralIntro.mp3');
    game.load.audio('deja','asset/audio/deja.mp3');

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
var soundSoral;
var song;

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
	player1.health=10;

    //SOUND
    sound = game.add.audio('chancla');
    soundSoral = game.add.audio('poliment');
    song=game.add.audio('deja');



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
     game.physics.arcade.enable(ennemys);
     
	

    //WEAPON
    weapon = game.add.weapon(30, 'bullet');
    weapon.bulletKillType = Phaser.Weapon.KILL_WORLD_BOUNDS;
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
		en.health=50;
        game.physics.arcade.enable(en);
        en.body.collideWorldBounds = true;
        en.body.setCircle();
		
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
    song.play();

}

function killEnnemyWeapon(weapon, enemy1) {

  enemy1.damage(5); 
  weapon.kill();
 
 console.log(enemy1.health);
  
}

function followPlayer(ennemys){
 game.physics.arcade.moveToObject(ennemys,player1,150);
 
}

function killPlayer(player1,enemy1){
	
  player1.damage(1);

  song.stop();
 
	
}

function update() {

    player1.body.velocity.x = 0;
    player1.body.velocity.y = 0;
    ennemys.forEach(followPlayer);
	

    if (touches.up.isDown) {

        player1.body.velocity.y = -300;
    } else {
        if (touches.down.isDown) {
            player1.body.velocity.y = 300;
        }
    }
    if (touches.left.isDown) {
        player1.body.velocity.x = -300;
    } else {
        if (touches.right.isDown) {
            player1.body.velocity.x = 300;
        }
    }
    if (powerUp == "true") {
        if (firebuttonUP.isDown) {
            weapon.fireAngle = Phaser.ANGLE_UP;
            weapon.fire();
            sound.play();
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
	game.physics.arcade.collide(ennemys);
	game.physics.arcade.collide(player1,ennemys,followPlayer);
  
}



function render() {

    game.debug.body(player1);
    game.debug.text("La bête va être lacher: " + game.time.events.duration.toFixed(0), 32, 32);

}