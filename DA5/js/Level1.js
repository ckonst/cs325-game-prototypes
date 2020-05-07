"use strict";

GameStates.makeLevel1 = function( game, shared ) {
	var cs1 = ["When I woke up, I had no idea where I was,", "or how I got there.", "The straightforward pathway had been lost...",
	"In this dark forest where I make my sojourn,", "I can only hope that I find a way out."]
	var cs2 = ["Ahead of me lies a clearing, past that more wood.", "I grow tired and decide to rest for the night."]
	var line, c;
	var charIndex = 0;
	var lineIndex = 0;
	var charDelay = 25;
	var lineDelay = 75;
	var text1, text2, text3, text4;
	var player;
	var facing = 'left';
	var jumpTimer = 0, movement_timer_x = 0, movement_timer_y = 0, text_timer = 0, cutscene1_timer = 0;
	var cursors;
	var jumpButton;
	var wasd;
	var jumped;
	var music, jump_sound;
	var played1 = false, text1 = false; //flags for cutscenes
	var textfade1, textfade2;
	var map, layer;
	var back, mid, front;
	var completed = false;
	var textbox;
	
	const gravity = 1500;
	
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
		text1.destroy();
		text2.destroy();
		text3.destroy();
		text4.destroy();
		music.destroy();
		layer.destroy();
		map.destroy();
		textbox.kill();
		this.back.destroy();
		this.mid.destroy();
		this.front.destroy();
		
		
			
        game.state.start('Level2');

    }
	
	function textDisappear(text) {
		textbox.alpha = 0.0;
		text.alpha = 0.0;
		textbox.x = 4016;
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
			
			game.stage.backgroundColor = '#abb4cc';
			//back = game.add.sprite(0, 0, 'back');
			//mid = game.add.sprite(0, 0, 'mid');
			//front = game.add.sprite(0, 0, 'front');
			this.back = this.game.add.tileSprite(0, 
            0, 
            4800, 
            this.game.cache.getImage('back').height, 
            'back'
        );

        this.mid = this.game.add.tileSprite(0, 
            0, 
            4800, 
            this.game.cache.getImage('mid').height, 
            'mid'
        );

        this.front = this.game.add.tileSprite(0, 
            0, 
            4800, 
            this.game.cache.getImage('front').height, 
            'front'
        ); 
				
			map = game.add.tilemap('level1');
			//game.add.tilemap('level1c');
			
			//  Now add in the tileset
			map.addTilesetImage('tileset', 'tiles');
			
			map.setCollisionBetween(1,24);
	
			//  Create the layer
			layer = map.createLayer('Level1Layer');
			//  Resize the world
			layer.resizeWorld();
				
			//  Un-comment this on to see the collision tiles
			// layer.debug = true;
			
			textbox = game.add.sprite(0, 60, 'textBox');
			textbox.tint = 0xabb4cc;
			
			var style = { font: "bold 32px Lucida Console", fill: "#C1EAF0", boundsAlignH: "center", boundsAlignV: "middle" };
			var style2 = { font: "bold 16px Lucida Console", fill: "#ffffff", boundsAlignH: "center", boundsAlignV: "middle" };	
			text1 = game.add.text((1137 / 2) - (32 * 12), 0, "\[a\] and \[d\] to move\n", style);
			text1.tint = 0x9dcfd4;
			text1.setShadow(3, 3, 'rgba(0,0,0,0.85)', 2);
			text1.setTextBounds(0, 0, 800, 100);
			text2 = game.add.text((1137 / 2) - (32 * 12), 0, "\[space\] to jump\n", style);
			text2.tint = 0x9dcfd4;
			text2.setShadow(3, 3, 'rgba(0,0,0,0.85)', 2);
			text2.setTextBounds(0, 75, 800, 100);
			text1.alpha = 0.0;
			text2.alpha = 0.0;
			game.add.tween(text1).to( { alpha: 1.0 }, 2000, "Linear", true);
			game.add.tween(text2).to( { alpha: 1.0 }, 2000, "Linear", true);
			textfade1 = game.add.tween(text1).to( { alpha: 0.0 }, 5000, "Linear", false);
			textfade2 = game.add.tween(text2).to( { alpha: 0.0 }, 5000, "Linear", false);
			text3 = game.add.text(32, 512, '', style2);
			text3.tint = 0x9dcfd4;
			text4 = game.add.text(4096, 512, '', style2);
			text4.tint = 0x9dcfd4;
			text3.setShadow(3, 3, 'rgba(0,0,0,0.85)', 2);
			text4.setShadow(3, 3, 'rgba(0,0,0,0.85)', 2);
			
			
			
			
		
			nextLine(text3, cs1);

			game.physics.arcade.gravity.y = gravity;
			
			player = game.add.sprite(0, 432, 'girl');
			
			player.animations.add('awaken', [265, 264, 263, 262, 261, 260], 6, false);
			player.animations.add('left', [117, 118, 119, 120, 121, 122, 123, 124, 125], 9, true);
			player.animations.add('right', [143, 144, 145, 145, 146, 147, 148, 149, 150], 9, true);
			
			game.physics.enable(player, Phaser.Physics.ARCADE);
			game.physics.arcade.TILE_BIAS = 32;

			//player.body.bounce.y = 0.2;
			//player.body.collideWorldBounds = true;
			
			player.body.immovable = false;
			player.body.setSize(28, 46, 18, 14);
			
			player.tint = 0xabb4cc;
			
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
			if(!text1)
			{
				if (time >= text_timer)
					{
						textfade1.start();
						textfade2.start();
						text1 = true;
					}	
			}
			if(player.body.x >= 4288)
			{
				if(!completed)
				{
					//game completed, quit game
					nextLine(text4, cs2);
					game.camera.fade(0x39465c, 5500);
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