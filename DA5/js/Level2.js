"use strict";

GameStates.makeLevel2 = function( game, shared ) {
	var cs1 = ["I was awoken again in the middle of the winter, in the middle of the night.", "I once again fear for my life.",
	"These skeletons aimed there bows at me...", "...and forced me to dance to their tune."];
	var cs2 = ["", ""];
	var line, c;
	var charIndex = 0;
	var lineIndex = 0;
	var charDelay = 25;
	var lineDelay = 75;
	var text2, text3, text4;
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
	
	const gravity = 0;
	
	function render () {

		game.debug.text(game.time.physicsElapsed, 32, 32);
		game.debug.body(player);
		game.debug.bodyInfo(player, 16, 24);

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
	
	function nextLine(txt, str) {

		if (lineIndex === str.length)
		{
			//  We're finished
			lineIndex = 0;
			charIndex = 0;
			return;
		}

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
		console.log(txt.text);
		console.log(lineIndex);
		console.log(charIndex);
		console.log(line.length);
		
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
	
			this.map = game.add.tilemap('level2');
			//game.add.tilemap('level1c');
			
			//  Now add in the tileset
			this.map.addTilesetImage('snow', 'tiles2');
			
			this.map.setCollisionBetween(1,24);
	
			//  Create the layer
			this.layer = this.map.createLayer('Tile Layer 1');
			//  Resize the world
			this.layer.resizeWorld();
			
			//  Un-comment this on to see the collision tiles
			// layer.debug = true;

			var style = { font: "bold 32px Lucida Console", fill: "#C1EAF0", boundsAlignH: "center", boundsAlignV: "middle" };
			var style2 = { font: "bold 16px Lucida Console", fill: "#ffffff", boundsAlignH: "center", boundsAlignV: "middle" };	
			text3 = game.add.text(32, 512, '', style2);
			text4 = game.add.text(4096, 512, '', style2);
			text3.setShadow(3, 3, 'rgba(0,0,0,0.5)', 2);
			text4.setShadow(3, 3, 'rgba(0,0,0,0.5)', 2);
			nextLine(text3, cs1);

			game.physics.arcade.gravity.y = gravity;
			
			player = game.add.sprite(0, 336, 'girl');
			
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
			
			//audio
			music = game.add.audio('GameBGM');
			music.volume = 1.0;
			jump_sound = game.add.audio('jump');
			music.loopFull();	

			var time = game.time.now;
			text_timer = time + 3000;
			cutscene1_timer = time + 1000;
			game.camera.flash(0xffffff, 500);
		},

		update: function() {
			//render();
			var time = game.time.now;
			var collided;
			collided = game.physics.arcade.collide(player, layer);
			
			if(!played1)
				{	
					
					if(time >= cutscene1_timer)
					{
						played1 = true;
						player.animations.play('right', 18 , true);
						return;
					}
					player.animations.play('awaken', 6, false);
					return;
				}
			if(player.body.x >= 4288)
			{
				if(!completed)
				{
					//game completed, quit game
					nextLine(text4, cs2);
					game.time.events.add(6000, quitGame, this);
					completed = true;
				}
			}
			
			var onFloor = player.body.onFloor();
			
			
			if(player.body.blocked.down){
				player.body.velocity.y = 0;
				onFloor = true;
				jumpTimer = 0;
				//console.log('COLLIDE!\n');
			}	
			
			
			if(player.body.x < 0 || player.body.x > 4800 || player.body.y > 640)
			{
				//player dies
				//respawn
				player.body.x = 0;
				if (player.body.y > 432)
				{
					player.body.y = 432;
					player.body.velocity.y = 0;
				}
				this.front.x = 0;
				this.mid.x  = 0;
				this.back.x  = 0;
				
			}

			if(player.body !== null)
				player.body.velocity.x = 0;

			if(!cursors.left.isDown 
			&& !wasd.left.isDown 
			&& !cursors.right.isDown 
			&& !wasd.right.isDown){
				player.animations.stop();
			}

			if (cursors.left.isDown || wasd.left.isDown)
			{
				if(game.camera.x > 0 && player.body.velocity.x != 0)
				{
					this.front.x += 0.25;
					this.mid.x += 0.1;
					this.back.x += 0.02;
				}
					player.animations.play('left', 18, true);
				if(player.body !== null)
					player.body.velocity.x = -315;
				if (facing !== 'left')
					facing = 'left';
			}
			else {
				player.idleFrame = 117;
				
			}
			if (cursors.right.isDown || wasd.right.isDown)
			{	
				if(game.camera.x > 0 && player.body.velocity.x != 0)
				{
					this.front.x -= 0.25;
					this.mid.x -= 0.1;
					this.back.x -= 0.02;
				}
					player.animations.play('right', 18, true);
				if(player.body !== null)
					player.body.velocity.x = 315;
				if (facing !== 'right')
					facing = 'right';
			}
			else {
				player.idleFrame = 117;
				
			}
			if (time >= jumpTimer)
			{
				jumped = false;
			}
			if (jumpButton.isDown && onFloor && time > jumpTimer)
			{
				jump_sound.play();
				if(player.body !== null)
					player.body.velocity.y = -900; 
				jumpTimer = time + 300;
				jumped = true;
			}
			else if (!onFloor && jumped) 
			{
				if(player.body !== null)
					player.body.velocity.y = ((jumpTimer + 200  - (game.time.now))/600.0) * (-900.0);
			}
			
		}		
	};

}