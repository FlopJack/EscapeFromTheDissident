var game = new Phaser.Game(800, 600, Phaser.AUTO, '', { preload: preload, create: create, update: update, render: render });


function preload() {
  

    game.load.image('bullet', 'asset/bullet.png')
    game.load.image('pinata', 'asset/pinata.jpg');
   
    game.load.image('ennemy', 'asset/soral.png');

   


    game.load.tilemap('map','asset/map/test/laby2.json',null,Phaser.Tilemap.TILED_JSON);
    game.load.image('tiles','asset/map/test/dungeon_tiles.png');
    game.load.image('col','asset/map/base_out_atlas.png');


    game.load.spritesheet('nPlayer','asset/kemal.png',24,24);

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
var map;
var layer;
var item;
var obstacleGroup;
var wallkable=[73];
var pathToFollow = [];



function create() {
    var pathfinder= new EasyStar.js(); 
 


    map=game.add.tilemap( 'map');
    map.addTilesetImage('terrain','tiles');
  
    game.world.setBounds(0, 0, 1920, 1920);
    layer = map.createLayer('Calque de Tile 1');

    layer.resizeWorld();
    map.setCollision([536871083,2684354731,1610612907,171,122]);
   
    //FULLSCREEN
    game.scale.fullScreenScaleMode = Phaser.ScaleManager.EXACT_FIT;
    game.input.onDown.add(gofull, this);


    //PHYSICS
    game.physics.startSystem(Phaser.Physics.ARCADE);

    //NEW PLAYER 
    player1=game.add.sprite(game.world.randomX,game.world.randomY,'nPlayer');
    //player1.anchor.setTo(0.5,0.5);
    //player1.animations.add('marche',[0,4.65],10,true);
    game.physics.arcade.enable(player1);
    player1.body.collideWorldBounds = true;
    player1.body.fixedRotation = true;
	player1.health=10;

    //SOUND
 


    //CAMERA
  
    game.camera.follow(player1, Phaser.Camera.FOLLOW_LOCKON);

    //ITEM
    item= game.add.sprite(game.world.randomX, game.world.randomY, 'pinata');
    game.physics.arcade.enable(item);
    item.body.collideWorldBounds = true;
    item.body.fixedRotation = true;

    //ENNEMIES 
    ennemys = game.add.group();
    ennemys.enableBody = true;
    ennemys.physicsBodyType = Phaser.Physics.ARCADE;
    game.time.events.repeat(Phaser.Timer.SECOND * 1, 1, createEnnemy, this);
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


//PATH FINDING

pathfinder.setGrid(map.layers[0].data, wallkable);


}

function findPathTo(tilex, tiley) {
    pathfinder.setCallbackFunction(function(path) {
        trail.destroy(true, true);
        if (path === null) {
            return;
        }

        var ilen = path.length;
        for (let i = 0; i < ilen; i++) {
            var marker = game.add.graphics(path[i].x * 32, path[i].y * 32);
            marker.data.cellX = path[i].x;
            marker.data.cellY = path[i].y;
            trail.add(marker);
            marker.lineStyle(2, 0xAB4642, 0.8);
            marker.drawRect(8, 8, 16, 16);
        }
        pathToFollow = path;
    });

    pathfinder.preparePathCalculation([layer.getTileX(sprite.x), layer.getTileY(sprite.y)], [tilex,tiley]);
    pathfinder.calculatePath();
}
function followPath() {
    if (!pathToFollow.length || followingPath) {
        return;
    }
    var next = pathToFollow.shift();
    if (!next) {
        return;
    }
    // remove the lit path as we walk it
    trail.forEach((marker) => {
        if (marker.data.cellX === next.x && marker.data.cellY === next.y) {
            marker.destroy();
        }
    });

    var x = (next.x * 32) + 2;
    var y = (next.y * 32) + 2;
     console.log("moving to", x, y, next);
    followingPath = true;
    movingTween.target = player1;
    movingTween.timeline = [];
    movingTween.to({x, y}, 300); 
    movingTween.start();
}



//ENNEMIES
function createEnnemy() {


    for (var i = 0; i < 5; i++) {
        var en = ennemys.create(game.world.randomX, game.world.randomY, 'ennemy');

        en.name = 'enememy1'
		en.health=50;
        game.physics.arcade.enable(en);
        en.body.collideWorldBounds = true;
        en.body.fixedRotation=true;
		
    }   
   
}



function gofull() {

    if (game.scale.isFullScreen) {
        game.scale.stopFullScreen();
    }
    else {
        game.scale.startFullScreen(false);
    }

}

function getItem(player1, item) {
    powerUp = "true";
    item.kill();
   


}

function killEnnemyWeapon(weapon, enemy1) {

  enemy1.damage(5); 
  weapon.kill();
 
 console.log(enemy1.health);
  
}

function bulletCollideWord(weapon){

    weapon.kill();
}
function followPlayer(ennemys){
 game.physics.arcade.moveToObject(ennemys,player1,150);
 
}

function killPlayer(player1,enemy1){
	
  player1.damage(1);

  
 
	
}

function update() {
    followPath();
    game.physics.arcade.collide(player1, layer);
    game.physics.arcade.collide(ennemys, layer);
    game.physics.arcade.collide(weapon.bullets,layer,bulletCollideWord);
    player1.body.velocity.x = 0;
    player1.body.velocity.y = 0;
    ennemys.forEach(followPlayer);
   

    if (touches.up.isDown) {

        player1.body.velocity.y = -300;
        player1.scale.x=1;
        player1.play('marche');
    } else {
        if (touches.down.isDown) {
            player1.body.velocity.y = 300;
            player1.scale.x=1;
            player1.play('marche');

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
    game.physics.arcade.collide(player1, item, getItem);
    game.physics.arcade.overlap(weapon.bullets, ennemys, killEnnemyWeapon, null, this);
	game.physics.arcade.collide(ennemys);
    game.physics.arcade.collide(player1,ennemys,followPlayer);
    //game.physics.arcade.overlap(weapon.bullets,)
    if (firebuttonUP.isDown)
    {
        blocked = true;
        findPathTo(layer.getTileX(marker.x), layer.getTileY(marker.y));
    }

}



function render() {

    //game.debug.body(player1);
  //  game.debug.spriteInfo(player1, 32, 32);
    game.debug.text("La bête va être lacher: " + game.time.events.duration.toFixed(0), 32, 32);

}