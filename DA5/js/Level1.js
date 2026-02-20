"use strict";

GameStates.makeLevel1 = function (game, shared) {
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
	var jumpTimer = 0, movementTimerX = 0, movementTimerY = 0, textTimer = 0, cutscene1Timer = 0;
	var cursors;
	var jumpButton;
	var wasd;
	var jumped;
	var music, jump_sound;
	var played1 = false, text1 = false; // flags for cutscenes
	var textfade1, textfade2;
	var map, layer;
	var completed = false;
	var textbox;

	const gravity = 1500;

	function render() {

		game.debug.text(game.time.physicsElapsed, 32, 32);
		game.debug.body(player);
		game.debug.bodyInfo(player, 16, 24);

	}

	function quitGame() {
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
		if (lineIndex === str.length) {
			//  We're finished
			lineIndex = 0;
			charIndex = 0;
			game.time.events.add(5000, function () { textDisappear(txt); }, this);
			return;
		}
		textbox.alpha = 1.0;

		//  get next line
		line = str[lineIndex];

		// reset char index
		charIndex = 0;

		//  Call the 'nextChar' function once for each char in the line (line.length)
		game.time.events.repeat(charDelay, line.length, function () { nextChar(txt, str); }, this);

		//  Advance to the next line
		lineIndex++;

	}

	function nextChar(txt, str) {
		// get the current char
		c = line.charAt(charIndex);

		//  add the next char into the string
		if (c !== null) {
			txt.text = txt.text.concat(c);
		}

		// last character
		if (charIndex === line.length - 1) {
			//  add a carriage return
			txt.text = txt.text.concat("\n");

			// go to the next line
			game.time.events.add(lineDelay, function () { nextLine(txt, str); }, this);
		}

		charIndex++;
	}

	return {
		create: function () {

			game.physics.startSystem(Phaser.Physics.ARCADE);

			game.stage.backgroundColor = '#abb4cc';

			this.back = this.game.add.tileSprite(0,
				0,
				4800,
				this.game.cache.getImage('Back1').height,
				'Back1'
			);
			// this.back.fixedToCamera = true;

			this.mid = this.game.add.tileSprite(0,
				0,
				4800,
				this.game.cache.getImage('Mid1').height,
				'Mid1'
			);
			// this.mid.fixedToCamera = true;

			this.front = this.game.add.tileSprite(0,
				0,
				4800,
				this.game.cache.getImage('Front1').height,
				'Front1'
			);
			// this.front.fixedToCamera = true;

			map = game.add.tilemap('Level1');
			//game.add.tilemap('level1c');

			//  Now add in the tileset
			map.addTilesetImage('tileset', 'Tiles1');

			map.setCollisionBetween(1, 24);

			var muteButton = game.add.button(game.world.width - 50, 50, 'MutedIcon', toggleMute, this);
			muteButton.fixedToCamera = true;
			muteButton.scale.set(0.5, 0.5);
			muteButton.anchor.set(0.5);
			function toggleMute() {
				shared.isMuted = !shared.isMuted; // Toggle state
				game.sound.mute = shared.isMuted; // Apply mute state to game sound
				muteButton.loadTexture(shared.isMuted ? 'MutedIcon' : 'UnmutedIcon');
				if (!music.isPlaying && !shared.isMuted) {
					music.play();
				}
			}

			//  Create the layer
			layer = map.createLayer('Level1Layer');
			//  Resize the world
			layer.resizeWorld();

			//  Un-comment this on to see the collision tiles
			// layer.debug = true;

			textbox = game.add.sprite(0, 60, 'TextBox');
			textbox.fixedToCamera = true;
			textbox.tint = 0xabb4cc;

			var style = { font: "bold 32px Lucida Console", fill: "#C1EAF0", boundsAlignH: "center", boundsAlignV: "middle" };
			var style2 = { font: "bold 16px Lucida Console", fill: "#ffffff", boundsAlignH: "center", boundsAlignV: "middle" };
			text1 = game.add.text((1137 / 2) - (32 * 12), 0, "\[a\] and \[d\] to move\n", style);
			text1.fixedToCamera = true;
			text1.tint = 0x9dcfd4;
			text1.setShadow(3, 3, 'rgba(0,0,0,0.85)', 2);
			text1.setTextBounds(0, 0, 800, 100);
			text2 = game.add.text((1137 / 2) - (32 * 12), 0, "\[space\] to jump\n", style);
			text2.fixedToCamera = true;
			text2.tint = 0x9dcfd4;
			text2.setShadow(3, 3, 'rgba(0,0,0,0.85)', 2);
			text2.setTextBounds(0, 75, 800, 100);
			text1.alpha = 1.0;
			text2.alpha = 1.0;
			textfade1 = game.add.tween(text1).to({ alpha: 0.0 }, 4000, "Linear", false);
			textfade2 = game.add.tween(text2).to({ alpha: 0.0 }, 4000, "Linear", false);
			text3 = game.add.text(32, 512, '', style2);
			text3.fixedToCamera = true;
			text3.tint = 0x9dcfd4;
			text4 = game.add.text(32, 512, '', style2);
			text4.fixedToCamera = true;
			text4.tint = 0x9dcfd4;
			text3.setShadow(3, 3, 'rgba(0,0,0,0.85)', 2);
			text4.setShadow(3, 3, 'rgba(0,0,0,0.85)', 2);

			nextLine(text3, cs1);

			game.physics.arcade.gravity.y = gravity;

			player = game.add.sprite(0, 432, 'Girl');

			player.animations.add('Awaken', [265, 264, 263, 262, 261, 260], 6, false);
			player.animations.add('Left', [117, 118, 119, 120, 121, 122, 123, 124, 125], 9, true);
			player.animations.add('Right', [143, 144, 145, 145, 146, 147, 148, 149, 150], 9, true);

			game.physics.enable(player, Phaser.Physics.ARCADE);
			game.physics.arcade.TILE_BIAS = 32;

			//player.body.bounce.y = 0.2;
			//player.body.collideWorldBounds = true;

			player.body.immovable = false;
			player.body.setSize(28, 46, 18, 14);

			player.tint = 0xabb4cc;

			game.camera.follow(player, 0.1, 0.1);
			game.camera.deadzone = null;


			// controls
			cursors = game.input.keyboard.createCursorKeys();
			wasd = {
				up: game.input.keyboard.addKey(Phaser.Keyboard.W),
				down: game.input.keyboard.addKey(Phaser.Keyboard.S),
				left: game.input.keyboard.addKey(Phaser.Keyboard.A),
				right: game.input.keyboard.addKey(Phaser.Keyboard.D),
			};
			jumpButton = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);

			// audio
			music = game.add.audio('BGM1');
			music.volume = 1.0;
			jump_sound = game.add.audio('Jump');
			music.loopFull();

			var time = game.time.now;
			textTimer = time + 3000;
			cutscene1Timer = time + 1000;
			game.camera.flash(0xffffff, 500);

		},

		update: function () {
			//render();
			var time = game.time.now;
			var collided;
			collided = game.physics.arcade.collide(player, layer);

			if (!played1) {

				if (time >= cutscene1Timer) {
					played1 = true;
					player.animations.play('Right', 18, true);
					return;
				}
				player.animations.play('Awaken', 6, false);
				return;
			}
			if (!text1) {
				if (time >= textTimer) {
					text1 = true;
				}
			}
			else {
				textfade1.start();
				textfade2.start();
			}
			if (player.body.x >= 4288) {
				if (!completed) {
					// game completed, quit game
					nextLine(text4, cs2);
					game.camera.fade(0x39465c, 3000);
					game.time.events.add(7000, quitGame, this);
					completed = true;
				}
			}

			var onFloor = player.body.onFloor();


			if (player.body.blocked.down) {
				player.body.velocity.y = 0;
				onFloor = true;
				jumpTimer = 0;
				//console.log('COLLIDE!\n');
			}


			if (player.body.x < 0 || player.body.x > 4800 || player.body.y > 640) {
				// player dies
				// respawn
				player.body.x = 0;
				if (player.body.y > 432) {
					player.body.y = 432;
					player.body.velocity.y = 0;
				}
				this.front.x = 0;
				this.mid.x = 0;
				this.back.x = 0;

			}

			if (player.body !== null)
				player.body.velocity.x = 0;

			if (!cursors.left.isDown
				&& !wasd.left.isDown
				&& !cursors.right.isDown
				&& !wasd.right.isDown) {
				player.animations.stop();
			}

			if (cursors.left.isDown || wasd.left.isDown) {
				if (game.camera.x > 0 && game.camera.x < 4800 - 1137) {
					this.front.x += 1;
					this.mid.x += 0.4;
					this.back.x += 0.05;
				}
				player.animations.play('Left', 18, true);
				if (player.body !== null)
					player.body.velocity.x = -315;
				if (facing !== 'left')
					facing = 'left';
			}
			else {
				player.idleFrame = 117;
			}

			if (cursors.right.isDown || wasd.right.isDown) {
				if (game.camera.x > 0 && game.camera.x < 4800 - 1137) {
					this.front.x -= 1;
					this.mid.x -= 0.4;
					this.back.x -= 0.05;
				}
				player.animations.play('Right', 18, true);
				if (player.body !== null)
					player.body.velocity.x = 315;
				if (facing !== 'right')
					facing = 'right';
			}
			else {
				player.idleFrame = 117;
			}
			if (time >= jumpTimer) {
				jumped = false;
			}
			if (jumpButton.isDown && onFloor && time > jumpTimer) {
				jump_sound.play();
				if (player.body !== null)
					player.body.velocity.y = -900;
				jumpTimer = time + 300;
				jumped = true;
			}
			else if (!onFloor && jumped) {
				if (player.body !== null)
					player.body.velocity.y = ((jumpTimer + 200 - (game.time.now)) / 600.0) * (-900.0);
			}

		}
	};

}