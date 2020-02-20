"use strict";

GameStates.makeGame2 = function( game, shared ) {
	var cs1 = ["When I woke up, I had no idea where I was, or how I got there.", "The straightforward pathway had been lost...",
	"In this dark forest where I make my sojourn,", "I can only hope that I find a way out."]
	var cs2 = ["Ahead of me lies a clearing, past that more wood.", "I grow tired and decide to rest for the night."]
	var line = [];
	var wordIndex = 0;
	var lineIndex = 0;
	var wordDelay = 120;
	var lineDelay = 400;
	var text1, text2, text3, text4
	var player, player_health;
	var facing = 'left';
	var jumpTimer = 0, movement_timer_x = 0, movement_timer_y = 0, text_timer = 0, cutscene1_timer = 0;
	var cursors;
	var jumpButton;
	var bg;
	var wasd;
	var jumped;
	var music, jump_sound;
	var played1 = false, text1 = false; //flags for cutscenes
	var textfade1, textfade2;
	var map, layer;
	var back, mid, front;
	var completed = false;
	
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
        game.state.start('MainMenu');

    }
	
	function nextLine() {

		if (lineIndex === cs1.length)
		{
			//  We're finished
			lineIndex = 0;
			wordIndex = 0;
			return;
		}

		//  Split the current line on spaces, so one word per array element
		line = cs1[lineIndex].split(' ');

		//  Reset the word index to zero (the first word in the line)
		wordIndex = 0;

		//  Call the 'nextWord' function once for each word in the line (line.length)
		game.time.events.repeat(wordDelay, line.length, nextWord, this);

		//  Advance to the next line
		lineIndex++;

	}
	function nextWord() {

		//  Add the next word onto the text string, followed by a space
		text3.text = text3.text.concat(line[wordIndex] + " ");

		//  Advance the word index to the next word in the line
		wordIndex++;

		//  Last word?
		if (wordIndex === line.length)
		{
			//  Add a carriage return
			text3.text = text3.text.concat("\n");

			//  Get the next line after the lineDelay amount of ms has elapsed
			game.time.events.add(lineDelay, nextLine, this);
		}
	}

	function nextLine2() {

		if (lineIndex === cs2.length)
		{
			//  We're finished
			lineIndex = 0;
			wordIndex = 0;
			return;
		}

		//  Split the current line on spaces, so one word per array element
		line = cs2[lineIndex].split(' ');

		//  Reset the word index to zero (the first word in the line)
		wordIndex = 0;

		//  Call the 'nextWord' function once for each word in the line (line.length)
		game.time.events.repeat(wordDelay, line.length, nextWord2, this);

		//  Advance to the next line
		lineIndex++;

		}
	function nextWord2() {

		//  Add the next word onto the text string, followed by a space
		text4.text = text4.text.concat(line[wordIndex] + " ");

		//  Advance the word index to the next word in the line
		wordIndex++;

		//  Last word?
		if (wordIndex === line.length)
		{
			//  Add a carriage return
			text4.text = text4.text.concat("\n");

			//  Get the next line after the lineDelay amount of ms has elapsed
			game.time.events.add(lineDelay, nextLine2, this);
		}
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
			layer = map.createLayer('Tile Layer 1');
			//  Resize the world
			layer.resizeWorld();
			
			
			
			
			//  Un-comment this on to see the collision tiles
			//  layer.debug = true;

			var style = { font: "bold 32px Lucida Console", fill: "#C1EAF0", boundsAlignH: "center", boundsAlignV: "middle" };
			var style2 = { font: "bold 16px Lucida Console", fill: "#ffffff", boundsAlignH: "center", boundsAlignV: "middle" };	
			text1 = game.add.text(0, 0, "\[a\] and \[d\] to move\n", style);
			text1.setShadow(3, 3, 'rgba(0,0,0,0.5)', 2);
			text1.setTextBounds(0, 0, 800, 100);
			text2 = game.add.text(0, 0, "\[space\] to jump\n", style);
			text2.setShadow(3, 3, 'rgba(0,0,0,0.5)', 2);
			text2.setTextBounds(0, 75, 800, 100);
			text1.alpha = 0.0;
			text2.alpha = 0.0;
			game.add.tween(text1).to( { alpha: 1.0 }, 2000, "Linear", true);
			game.add.tween(text2).to( { alpha: 1.0 }, 2000, "Linear", true);
			textfade1 = game.add.tween(text1).to( { alpha: 0.0 }, 5000, "Linear", false);
			textfade2 = game.add.tween(text2).to( { alpha: 0.0 }, 5000, "Linear", false);
			text3 = game.add.text(32, 512, '', style2);
			text4 = game.add.text(4096, 512, '', style2);
			text3.setShadow(3, 3, 'rgba(0,0,0,0.5)', 2);
			text4.setShadow(3, 3, 'rgba(0,0,0,0.5)', 2);
			nextLine(cs1, text3);

			game.physics.arcade.gravity.y = gravity;
			
			player = game.add.sprite(0, 432, 'girl');
			
			player.animations.add('awaken', [265, 264, 263, 262, 261, 260], 6, false);
			player.animations.add('left', [117, 118, 119, 120, 121, 122, 123, 124, 125], 9, true);
			player.animations.add('right', [143, 144, 145, 145, 146, 147, 148, 149, 150], 9, true);
			
			

			game.physics.enable(player, Phaser.Physics.ARCADE);

			//player.body.bounce.y = 0.2;
			//player.body.collideWorldBounds = true;
			
			player.body.immovable = false;
			player.body.setSize(28, 46, 18, 14);
			
			player_health = 2000;
			
			game.camera.follow(player);
			
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
					nextLine2();
					game.time.events.add(6000, quitGame, this);
					completed = true;
				}
			}
			
			var onFloor = player.body.onFloor();
			
			
			if(player.body.blocked.down){
				player.body.velocity.y = 0;
				onFloor = true;
				jumpTimer = 0;
				console.log('COLLIDE!\n');
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
				this.front.x += 0.25;
				this.mid.x += 0.1;
				this.back.x += 0.02;
					player.animations.play('left', 18, true);
				if(player.body !== null)
					player.body.velocity.x = -315;
				if (facing !== 'left')
					facing = 'left';
			}
			if (cursors.right.isDown || wasd.right.isDown)
			{	
				this.front.x -= 0.25;
				this.mid.x -= 0.1;
				this.back.x -= 0.02;
					player.animations.play('right', 18 , true);
				if(player.body !== null)
					player.body.velocity.x = 315;
				if (facing !== 'right')
					facing = 'right';
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