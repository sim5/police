'use strict';


var game = new Phaser.Game(800, 600, Phaser.CANVAS, 'game', {preload: preload, create: create, update: update});

function preload() {

game.load.audio('music','assets/scary.mp3');
game.load.audio('jump','assets/jump.mp3');
game.load.image('city', 'assets/jail.jpg');
game.load.image('ground','assets/platforms.png');    
game.load.image('spike','assets/spike.png');
game.load.image('prisoner','assets/prisoner.png');
game.load.spritesheet('dude', 'assets/dude.png', 32, 48);
game.load.spritesheet('police', 'assets/pol.png', 32,50 );
game.load.spritesheet('mouse', 'assets/mouse.png', 50,50);

}

var player;
var keys = Phaser.Keyboard;
var platforms;
var polices;
var music;
var jump;
var world;
var mouse;
var mice;

var background;
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
    

    game.physics.startSystem(Phaser.Physics.ARCADE);


    background = game.add.tileSprite(0,0, 2500, 597, 'city');
    
  stateText = game.add.text(game.world.centerX,game.world.centerY,' ', { font: '84px Arial', fill: '#fff' });
    stateText.anchor.setTo(0.5, 0.5);
    stateText.visible = false;
	

    prisonerBody = game.add.group();
    prisonerBody.enableBody = true;
	
		prisoner = prisonerBody.create(2300, 210, 'prisoner');
        		prisoner.scale.setTo(.1, .1);
					prisoner.body.immovable = true;
   
   
   
    platforms = game.add.group();
    platforms.enableBody = true;
	
	spikes = game.add.group();
	 spikes.enableBody = true;
   
  
    map(platforms);

    
    player = game.add.sprite(32, game.world.height - 150, 'police');
    game.physics.arcade.enable(player);
   
    player.body.bounce.y = 0.2;
    player.body.gravity.y  = 400;
    player.body.collideWorldBounds = true;
    

	  player.animations.add('stand', [0,1], 10, true);
    player.animations.add('left', [4, 5, 6, 7], 10, true);
    player.animations.add('right', [8, 9, 10, 11], 10, true);


	
  
    mice = game.add.group();
    createmouse();
    

    game.camera.follow(player);
   game.time.events.loop(Phaser.Timer.SECOND, mouseMove, this); 
}

function update(){
   
    game.physics.arcade.collide(player, platforms);
 
    game.physics.arcade.collide(mice, platforms);

  
    game.physics.arcade.overlap(player, mice, playerKill, null, this);
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
	
	
    


}

function lockOnFollow() {
    game.camera.follow(player, Phaser.Camera.FOLLOW_LOCKON);
}

function map(platforms) {


    game.world.setBounds(0,0, 2500, 597);

    var plat = platforms.create(350, 400, 'ground');
    plat.body.immovable = true;
	
	trap = spikes.create(450, 350, 'spike');
        		trap.scale.setTo(.2, .2);
					trap.body.immovable = true;
	
	    plat = platforms.create(50, 500, 'ground');
    plat.body.immovable = true;
	plat.scale.setTo(.5,1);
	


    plat = platforms.create(650, 250, 'ground');
    plat.body.immovable = true;
	
		trap = spikes.create(750, 200, 'spike');
        		trap.scale.setTo(.2, .2);
					trap.body.immovable = true;

    plat = platforms.create(200, 150, 'ground');
    plat.body.immovable = true;
	
		trap = spikes.create(350, 100, 'spike');
        		trap.scale.setTo(.2, .2);
					trap.body.immovable = true;
    
	var plat = platforms.create(1100, 225, 'ground');
    plat.body.immovable = true;
	
		trap = spikes.create(1250, 175, 'spike');
        		trap.scale.setTo(.2, .2);
					trap.body.immovable = true;

    plat = platforms.create(1400, 255, 'ground');
    plat.body.immovable = true;
	
		trap = spikes.create(1500, 205, 'spike');
        		trap.scale.setTo(.2, .2);
					trap.body.immovable = true;

    plat = platforms.create(1900, 350, 'ground');
    plat.body.immovable = true;
	
		trap = spikes.create(2100, 300, 'spike');
        		trap.scale.setTo(.2, .2);
					trap.body.immovable = true;
	
	    plat = platforms.create(2000, 250, 'ground');
    plat.body.immovable = true;
	
		trap = spikes.create(2100, 200, 'spike');
        		trap.scale.setTo(.2, .2);
					trap.body.immovable = true;

}










function createmouse() {

    for (var i=0; i<10; i++) {
	mouse = mice.create(game.rnd.integerInRange(200, 2000), game.rnd.integerInRange(100, 200), 'mouse');
	game.physics.arcade.enable(mouse);
	mouse.body.gravity.y = 300;
	mouse.body.collideWorldBounds = true;
	mouse.animations.add('left',[4,5,6,7],10,true);
	mouse.animations.add('right',[8,9,10,11], 10, true);

	}
}

function playerKill(player, mice) {

   
   
	player.reset(32, game.world.height - 150);
    
}

function playerDie(player, spikes) {


	player.reset(32, game.world.height - 150);
    
}

function win(player, prisonerBody) {


	player.reset(32, game.world.height - 150);
  stateText.text=" You Win! \n Press F5 to restart";
        stateText.visible = true;
}



function mouseMove ()
    {
	

	mice.forEach(function(mouse) {
	
	 if (mouse.body.onFloor())
    {
mouse.kill();

    }
    var x = Math.round(Math.random());
    if(x == 1)
    {
	if(mouse.body.touching.down)
	{
	    	mouse.animations.play('left');
	mouse.body.velocity.x = -150;
	}
	
	

	
    }
	    if(x == 0)
	    {
	if(mouse.body.touching.down)
	{
	    mouse.animations.play('right');
	mouse.body.velocity.x = 150;
	}
	
    }
	}, this);
    }








