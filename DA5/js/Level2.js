"use strict";

GameStates.makeLevel2 = function( game, shared ) {
	var cs1 = ["I was awoken again in the middle of the winter,", "in the middle of the night.", "My body was flying through the forest",
	"I flew for a while...", "...with no end in sight."];
	var cs2 = ["", ""];
	var line, c;
	var charIndex = 0;
	var lineIndex = 0;
	var charDelay = 25;
	var lineDelay = 75;
	var text2, text3, text4;
	var textbox;
	var player;
	var facing = 'left';
	var jumpTimer = 0, movement_timer_x = 0, movement_timer_y = 0, text_timer = 0, cutscene1_timer = 0;
	var cursors;
	var jumpButton;
	var wasd;
	var jumped;
	var music, jump_sound;
	var played1 = false, text1 = false; //flags for cutscenes
	var map, layer;
	var back, mid, front;
	var completed = false;
	var style = { font: "bold 32px Lucida Console", fill: "#C1EAF0", boundsAlignH: "center", boundsAlignV: "middle" };
	var style2 = { font: "bold 16px Lucida Console", fill: "#ffffff", boundsAlignH: "center", boundsAlignV: "middle" };	
	
	//rhythm stuff
	var arrows = [];
	var arrowData = [];
	var arrowUI;
	var arrow;
	var skeleton;
	var randy;
	const directions = ['arrowUp','arrowDown','arrowLeft','arrowRight'];
	
	const gravity = 0;
	
	function render () {

		game.debug.text(game.time.physicsElapsed, 32, 32);
		game.debug.body(player);
		game.debug.bodyInfo(player, 16, 24);

		}
		
	function Complete() {
		completed = true;
	}
		
	function spawnArrow()
	{
		randy = Math.floor(Math.random() * 4);
		if(randy === 0) 
			arrow = game.add.sprite(game.width, 0, directions[randy]);
		else
			arrow = game.add.sprite(game.width, 245/4, directions[randy]);
		game.physics.enable(arrow, Phaser.Physics.ARCADE);
		arrow.scale.setTo(.25, .25);
		arrow.body.velocity.x = -500;
		arrows.push(arrow);
		console.log("hi");
	}
	function destroyArrow()
	{
		arrows.shift();
	}
	
	function quitGame() {

        //  Here you should destroy anything you no longer need.
        //  Stop music, delete sprites, purge caches, free resources, all that good stuff.
		music.stop();	
        player.destroy();
		text3.destroy();
		text4.destroy();
        game.state.start('MainMenu');

    }
	
	function textDisappear(text) {
		textbox.alpha = 0.0;
		text.alpha = 0.0;
	}
	
	function nextLine(txt, str) {

		if (lineIndex === str.length)
		{
			//  We're finished
			lineIndex = 0;
			charIndex = 0;
			game.time.events.add(5000, function(){textDisappear(txt);}, this);
			return;
		}
		
		textbox.alpha = 1.0;
		
		//  get next line
		line = str[lineIndex];

		// reset char index
		charIndex = 0;

		//  Call the 'nextChar' function once for each char in the line (line.length)
		game.time.events.repeat(charDelay, line.length, function(){nextChar(txt, str);}, this);

		//  Advance to the next line
		lineIndex++;

	}
	
	function nextChar(txt, str)
	{
		//get the current char
		c = line.charAt(charIndex);
		
		//  Add the next char into the string
		if (c !== null)
		{
			txt.text = txt.text.concat(c);
		}
		
		//last character
		if(charIndex === line.length - 1)
		{
			//  Add a carriage return
			txt.text = txt.text.concat("\n");
			
			//Go to the next line
			game.time.events.add(lineDelay, function(){nextLine(txt, str);}, this);
		}
		
		charIndex++;
	}

	return {
		create: function() {
			
			game.physics.startSystem(Phaser.Physics.ARCADE);

			game.stage.backgroundColor = '#39465c';
			this.back = this.game.add.tileSprite(0, 
            0, 
            1137, 
            640, 
            'back2'
			);

			this.mid = this.game.add.tileSprite(0, 
            0, 
            1137, 
            640, 
            'mid2'
			);

			this.front = this.game.add.tileSprite(0, 
            0, 
            1137, 
            640, 
            'front2'
			); 
			this.back.scale.setTo(1.25, 1.25);
			this.mid.scale.setTo(1.25, 1.25);
			this.front.scale.setTo(1.25, 1.25);
			
			this.back.tint = 0x39465c;
			this.mid.tint = 0x39465c;
			this.front.tint = 0x39465c;
	
			//this.map = game.add.tilemap('level2');
			//game.add.tilemap('level1c');
			
			//  Now add in the tileset
			//this.map.addTilesetImage('WinterFront', 'tiles2');
			
			//this.map.setCollisionBetween(1,24);
	
			//  Create the layer
			//this.layer = this.map.createLayer('Level2Layer');
			//  Resize the world
			//this.layer.resizeWorld();
			
			//  Un-comment this on to see the collision tiles
			//this.layer.debug = true;
			
			
			textbox = game.add.sprite(0, 60, 'textBox');
			
			text3 = game.add.text(32, 512, '', style2);
			text4 = game.add.text(4096, 512, '', style2);
			text3.setShadow(3, 3, 'rgba(0,0,0,0.5)', 2);
			text4.setShadow(3, 3, 'rgba(0,0,0,0.5)', 2);
			nextLine(text3, cs1);

			game.physics.arcade.gravity.y = gravity;
			
			player = game.add.sprite(game.width/2, game.height - (32*7), 'girl');
			
			player.animations.add('awaken', [265, 264, 263, 262, 261, 260], 6, false);
			player.animations.add('left', [117, 118, 119, 120, 121, 122, 123, 124, 125], 9, true);
			player.animations.add('right', [143, 144, 145, 145, 146, 147, 148, 149, 150], 9, true);
			
			game.physics.enable(player, Phaser.Physics.ARCADE);
			game.physics.arcade.TILE_BIAS = 32;

			//player.body.bounce.y = 0.2;
			//player.body.collideWorldBounds = true;
			
			player.body.immovable = false;
			player.body.setSize(28, 46, 18, 14);
			
			game.camera.follow(player, 0.1, 0.1);
			game.camera.deadzone = null;
			
			//controls
			cursors = game.input.keyboard.createCursorKeys();
			wasd = {
				up: game.input.keyboard.addKey(Phaser.Keyboard.W),
				down: game.input.keyboard.addKey(Phaser.Keyboard.S),
				left: game.input.keyboard.addKey(Phaser.Keyboard.A),
				right: game.input.keyboard.addKey(Phaser.Keyboard.D),
			};
			jumpButton = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
			
			//rhythm stuff
			arrowUI = game.add.sprite(100, 0.5, 'arrows');
			arrowUI.scale.setTo(.25, .25);
			arrowUI.tint = 0xffffff;
			arrows = new Array();
			arrowData = game.cache.getText('data2').split('\n');
			
			for(var i = 0; i < arrowData.length; i++)
			{
				if(arrowData[i]*1000 === 0)
					continue;
				game.time.events.add((arrowData[i]*1000 - ((game.width -100)/500) *1), function(){spawnArrow();}, this);
				//game.time.events.add((arrowData[i]*1000 + ((game.width -100)/500) *1), function(){destroyArrow();}, this);
			}
			
			//audio
			music = game.add.audio('Rhythm1');
			music.volume = 1.0;
			jump_sound = game.add.audio('jump');
			music.onStop.addOnce(Complete, this);
			music.play();	
			
			var time = game.time.now;
			text_timer = time + 3000;
			cutscene1_timer = time + 1000;
			game.camera.flash(0xffffff, 500);
		},

		update: function() {
			//render();
			var time = game.time.now;
			var collided;
			//collided = game.physics.arcade.collide(player, layer);
			this.front.tilePosition.x -= 20;
			this.mid.tilePosition.x -= 8;
			this.back.tilePosition.x -= 1;
			
			for(var i = 0; i < arrows.length; i++)
			{
				
			}
			
			if(!played1)
				{	
					
					if(time >= cutscene1_timer)
					{
						played1 = true;
						player.animations.play('right', 18 , true);
						player.animations.stop();
						return;
					}
					player.animations.play('awaken', 6, false);
					return;
				}
				
				if(completed)
				{
					//game completed, quit game
					nextLine(text4, cs2);
					game.time.events.add(1000, quitGame, this);
				}
			
			
			
		}	
	};
}