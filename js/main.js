'use strict';


var game = new Phaser.Game(800, 600, Phaser.CANVAS, 'game', {preload: preload, create: create, update: update});

function preload() {

game.load.audio('music','assets/scary.mp3');
game.load.audio('jump','assets/jump.mp3');
game.load.image('city', 'assets/jail.jpg');
game.load.image('street', 'assets/street.png');
game.load.image('ground','assets/platforms.png');    
game.load.image('another-bg','assets/another_bg.png');    
game.load.image('heart','assets/heart.png');
game.load.image('spike','assets/spike.png');
game.load.image('prisoner','assets/prisoner.png');
game.load.spritesheet('dude', 'assets/dude.png', 32, 48);
//game.load.spritesheet('cat', 'assets/Burgercat_main.png',32,40, 14);
game.load.spritesheet('cat', 'assets/pol.png', 32,50 );
game.load.spritesheet('baddie', 'assets/baddie.png', 32,32);

}

var player;
var enemy;
var keys = Phaser.Keyboard;
var platforms;
var cursors;
var cats;
var music;
var jump;
var world;
var hearts;
var enemy;
var enemies;
var scoreText;
var score = 0;
var levelExist = false;
var isDead = false;
var bgtile;
var ground;
var spikes;
var trap;
var prisoner;
var prisonerBody;
var stateText;

function create(){
    music = game.add.audio('music');
    music.volume = 0.3;
    music.loop = true;
    music.play();
    jump = game.add.audio('jump');
    
    //Physics time!
    game.physics.startSystem(Phaser.Physics.ARCADE);

    //The background
    //Side scrolling background
    bgtile = game.add.tileSprite(0,0, 9999, 597, 'city');
    
  stateText = game.add.text(game.world.centerX,game.world.centerY,' ', { font: '84px Arial', fill: '#fff' });
    stateText.anchor.setTo(0.5, 0.5);
    stateText.visible = false;
	

    prisonerBody = game.add.group();
    prisonerBody.enableBody = true;
	
		prisoner = prisonerBody.create(2300, 210, 'prisoner');
        		prisoner.scale.setTo(.1, .1);
					prisoner.body.immovable = true;
   
   
    //adding platforms and it's physics
    platforms = game.add.group();
    platforms.enableBody = true;
	
	spikes = game.add.group();
	 spikes.enableBody = true;
   
   /*
    ground = platforms.create(0, game.world.height - 10, 'platform');

    //Scale it to fit the game width and such
    ground.scale.setTo(50,1);
    ground.body.immovable = true;
    */
    //Ledge time
   // makePlatforms();
    part1(platforms);

    //Making them players
 //   player = game.add.sprite(32, game.world.height - 150, 'dude');
    player = game.add.sprite(32, game.world.height - 150, 'cat');
    game.physics.arcade.enable(player);
   
    player.body.bounce.y = 0.2;
    player.body.gravity.y  = 400;
    player.body.collideWorldBounds = true;
    
    //Adding their animations
	  player.animations.add('stand', [0,1], 10, true);
    player.animations.add('left', [4, 5, 6, 7], 10, true);
    player.animations.add('right', [8, 9, 10, 11], 10, true);

    
    //Adding hearts
    hearts = game.add.group();
    hearts.enableBody = true;
	


    game.time.events.repeat(Phaser.Timer.SECOND*2, 500, createHearts, this); 
    

    //Adding enmies
    enemies = game.add.group();
    //enemies.enableBody = true;
    createEnemy();
    
    scoreText = game.add.text(16, 16, 'Hearts: '+ score, { fontSize: '32px', fill: '#000'});

    

   // player.anchor.setTo(0.5,0.5);
    game.camera.follow(player);
   game.time.events.loop(Phaser.Timer.SECOND, enemyMove, this); 
}

function update(){
    //Constantly update them game physics doe
    game.physics.arcade.collide(player, platforms);
    game.physics.arcade.collide(hearts, platforms);
    game.physics.arcade.collide(enemies, platforms);

    //adding overlap to trigger functions when they overlap
    game.physics.arcade.overlap(player, hearts, collectHearts, null, this);
    game.physics.arcade.overlap(player, enemies, playerKill, null, this);
			    game.physics.arcade.overlap(player, prisonerBody, win, null, this);
		
			    game.physics.arcade.overlap(player, spikes, playerDie, null, this);
    
    player.body.velocity.x = 0;

    if (game.input.keyboard.isDown(keys.LEFT))
    {
	player.body.velocity.x = -175;
	player.animations.play('left');
    }
    else if (game.input.keyboard.isDown(keys.RIGHT))
    {
	player.body.velocity.x = 175;
	player.animations.play('right');
    }
    else
    {
	player.body.velocity.x = 0;
	player.animations.play('stand');
	
	player.frame = 6;
    }
    
    //Jump functions
    if (game.input.keyboard.isDown(keys.UP) && player.body.touching.down)
    {
	jump.volume = 0.5;
	jump.play();
	player.body.velocity.y = -425;


    }
	 if (player.body.onFloor())
    {
player.reset(32, game.world.height - 150);


    }
    

  /* enemies.forEach(function(enemy) {
    var x = Math.round(Math.random());
    if(x == 1)
    {
	if(enemy.body.touching.down)
	{
	    enemy.body.velocity.y = -400;
	}
	enemy.animations.play('left');
	enemy.body.velocity.x = -150;
	
    }
    if(x == 0)
    {
	if(enemy.body.touching.down)
	{
	    enemy.body.velocity.y = -400;
	}
	enemy.animations.play('right');
	enemy.body.velocity.x = 150;
    }
   }, this);*///enemies.forEach(enemyMove,game.physics, false, 200);
    updateScore(score);
}

function lockOnFollow() {
    game.camera.follow(player, Phaser.Camera.FOLLOW_LOCKON);
}

function part1(platforms) {

//    bgtile = game.add.tileSprite(0,0, 1340, 597, 'city');
    game.world.setBounds(0,0, 9999, 597);

    var ledge = platforms.create(350, 400, 'ground');
    ledge.body.immovable = true;
	
	trap = spikes.create(450, 350, 'spike');
        		trap.scale.setTo(.2, .2);
					trap.body.immovable = true;
	
	    ledge = platforms.create(50, 500, 'ground');
    ledge.body.immovable = true;
	ledge.scale.setTo(.5,1);
	


    ledge = platforms.create(650, 250, 'ground');
    ledge.body.immovable = true;
	
		trap = spikes.create(750, 200, 'spike');
        		trap.scale.setTo(.2, .2);
					trap.body.immovable = true;

    ledge = platforms.create(200, 150, 'ground');
    ledge.body.immovable = true;
	
		trap = spikes.create(350, 100, 'spike');
        		trap.scale.setTo(.2, .2);
					trap.body.immovable = true;
    
	var ledge = platforms.create(1100, 225, 'ground');
    ledge.body.immovable = true;
	
		trap = spikes.create(1250, 175, 'spike');
        		trap.scale.setTo(.2, .2);
					trap.body.immovable = true;

    ledge = platforms.create(1400, 255, 'ground');
    ledge.body.immovable = true;
	
		trap = spikes.create(1500, 205, 'spike');
        		trap.scale.setTo(.2, .2);
					trap.body.immovable = true;

    ledge = platforms.create(1900, 350, 'ground');
    ledge.body.immovable = true;
	
		trap = spikes.create(2100, 300, 'spike');
        		trap.scale.setTo(.2, .2);
					trap.body.immovable = true;
	
	    ledge = platforms.create(2000, 250, 'ground');
    ledge.body.immovable = true;
	
		trap = spikes.create(2100, 200, 'spike');
        		trap.scale.setTo(.2, .2);
					trap.body.immovable = true;

}





function randomHeight() {
    var width = 800;
    return Math.random()*(width - (game.world.height - 150) + 150);
}

function createHearts() {
    var y = randomHeight();
    var heart = hearts.create(game.world.randomX, y, 'heart');
    heart.body.gravity.y = 400;
    heart.body.bounce.y = 0.8;
}

//Sprites of enemies
function createEnemy() {

    for (var i=0; i<6; i++) {
	enemy = enemies.create(game.world.randomX, game.rnd.integerInRange(100, 600), 'baddie');
	game.physics.arcade.enable(enemy);
	enemy.body.gravity.y = 400;
	enemy.body.bounce.y = 0.2;
	enemy.animations.add('left',[0,1],10,true);
	enemy.animations.add('right',[2, 3], 10, true);
	enemy.body.collideWorldBounds = true;
	}
}

function playerKill(player, enemies) {

    score-=1;
    updateScore(parseInt(score));
    if(score <= 0) 
    {
	//player.kill();
	score = 0;
	player.reset(32, game.world.height - 150);
    }
}

function playerDie(player, spikes) {


	player.reset(32, game.world.height - 150);
    
}

function win(player, prisonerBody) {


	player.reset(32, game.world.height - 150);
  stateText.text=" You Win! \n Press F5 to restart";
        stateText.visible = true;
}



function enemyMove ()
    {
	enemies.forEach(function(enemy) {
    var x = Math.round(Math.random());
    if(x == 1)
    {
	if(enemy.body.touching.down)
	{
	    enemy.body.velocity.y = -400;
	}
	enemy.animations.play('left');
	enemy.body.velocity.x = -150;
	
    }
	    if(x == 0)
	    {
	if(enemy.body.touching.down)
	{
	    enemy.body.velocity.y = -400;
	}
	enemy.animations.play('right');
	enemy.body.velocity.x = 150;
    }
	}, this);
    }



function collectHearts(player, hearts) {
    
    hearts.kill();
    score+= 1;
    updateScore(parseInt(score));

}



function updateScore(score) {
    scoreText.setText("Hearts: " + score);
}

