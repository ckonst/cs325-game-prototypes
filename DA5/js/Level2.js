"use strict";

GameStates.makeLevel2 = function( game, shared ) {
	var cs1 = ["I was awoken again in the middle of the winter,", "in the middle of the night.", "My body was flying through the forest",
	"I flew for a while...", "...with no exit in sight."];
	var cs2 = ["I feel my consciousness fading once more...", "whether I am asleep or awake, I am still unsure."];
	var line, c;
	var charIndex = 0;
	var lineIndex = 0;
	var charDelay = 25;
	var lineDelay = 75;
	var text1, text2;
	var textbox;
	var player;
	var facing = 'right';
	var text_timer = 0, cutscene1_timer = 0;
	var cursors;
	var jumpButton;
	var wasd;
	var jumped;
	var music, hit_sound;
	var played1 = false, text1 = false; //flags for cutscenes
	var map, layer;
	var back, mid, front;
	var completed = false;
	var style = { font: "bold 32px Lucida Console", fill: "#C1EAF0", boundsAlignH: "center", boundsAlignV: "middle" };
	var style2 = { font: "bold 16px Lucida Console", fill: "#ffffff", boundsAlignH: "center", boundsAlignV: "middle" };	
	var counter;
	var time; //keeps track of in game time
	var finished = false;
	
	//rhythm UI stuff
	var arrows = [];
	var arrowData = [];
	var arrowUI, upLight, downLight, leftLight, rightLight;
	var arrow;
	var dir;
	var prev = 0, next = 0;
	
	const tolerance = 300;
	const directions = ['arrowUp','arrowDown','arrowLeft','arrowRight'];
	
	const gravity = 0;
	
	function render () {

		game.debug.text(game.time.physicsElapsed, 32, 32);
		game.debug.body(player);
		game.debug.bodyInfo(player, 16, 24);

		}
		
	function Complete() {
		completed = true;
		nextLine(text2, cs2);
	}
		
	function spawnArrow(i)
	{
		dir = Math.floor(Math.random() * 4);
		if(i > 0 && i > arrowData.length - 1)
		{
			//if the data is very close together, calculate the opposite direction and use that instead of a random direction.
			if((arrowData[i] - arrowData[i - 1]) <= tolerance || (arrowData[i + 1] - arrowData[i]) <= tolerance)
			{
				switch(dir){
					case 0:	
						//up
						dir = 3;
						break;
					case 1:	
						//down
						dir = 2;
						break;
					case 2:	
						//left
						dir = 0;
						break;
					case 3:	
						//right
						dir = 2;
						break;
				}
			}
		}
		//depending on which direction the arrow is, adjust the y spawn position.
		switch(dir){
			case 0:	
				//up
				arrow = game.add.sprite(game.width, 0, directions[dir]);
				arrow.tint = 0xabb4cc;
				arrow.data = 0;
				prev = 0;
				break;
			case 1:	
				//down
				arrow = game.add.sprite(game.width, 245/4, directions[dir]);
				arrow.tint = 0xabb4cc;
				arrow.data = 1;
				prev = 1;
				break;
			case 2:	
				//left
				arrow = game.add.sprite(game.width, (245/4) * 2, directions[dir]);
				arrow.tint = 0xabb4cc;
				arrow.data = 2;
				prev = 2;
				break;
			case 3:	
				//right
				arrow = game.add.sprite(game.width, (245/4) * 3, directions[dir]);
				arrow.tint = 0xabb4cc;
				arrow.data = 3;
				prev = 3;
				break;
			}
		
		game.physics.enable(arrow, Phaser.Physics.ARCADE);
		arrow.scale.setTo(.25, .25);
		arrow.body.velocity.x = -500;
		arrow.alpha = 1.0;
		arrows.push(arrow);
	}
	function destroyArrow()
	{
		arrows[0].destroy();
		arrows.shift();
	}
	function detectHit(direction){
		if(arrows[0])
		{
			if(direction === arrows[0].data)
			{
				if (arrows[0].body.x < 229 && arrows[0].body.x > 100 )
				{
					//hit
					destroyArrow();
					player.animations.stop('idle', true);
					player.animations.play('rightFly', 7, false, false);
					hit_sound.play();
				}
				else
				{
					//miss
			
				}
			}
		}
	}
	
	function quitGame() {

        //  Here you should destroy anything you no longer need.
        //  Stop music, delete sprites, purge caches, free resources, all that good stuff.
		music.stop();	
        player.destroy();
		text1.destroy();
		text2.destroy();
        game.state.start('MainMenu');

    }
	
	function textDisappear(text) {
		textbox.alpha = 0.0;
		text.alpha = 0.0;
		text.kill();
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
			
			textbox = game.add.sprite(0, 60, 'textBox');
			textbox.tint = 0xabb4cc;
			
			text1 = game.add.text(32, 512, '', style2);
			text2 = game.add.text(32, 512, '', style2);
			text1.tint = 0x9dcfd4;
			text2.tint = 0x9dcfd4;
			text1.setShadow(3, 3, 'rgba(0,0,0,0.85)', 2);
			text2.setShadow(3, 3, 'rgba(0,0,0,0.85)', 2);
			nextLine(text1, cs1);

			game.physics.arcade.gravity.y = gravity;
			
			player = game.add.sprite(game.width/2, game.height - (32*10), 'girl');
			
			player.animations.add('awaken', [265, 264, 263, 262, 261, 260], 6, false);
			player.animations.add('left', [117, 118, 119, 120, 121, 122, 123, 124, 125], 9, true);
			player.animations.add('right', [143, 144, 145, 145, 146, 147, 148, 149, 150], 9, true);
			player.animations.add('rightFly', [39, 40, 41, 42, 43, 44, 45], 7, true);
			player.animations.add('idle', [44], 1,  true);
			
			game.physics.enable(player, Phaser.Physics.ARCADE);
			game.physics.arcade.TILE_BIAS = 32;
			
			player.body.immovable = false;
			player.body.setSize(28, 46, 18, 14);
			player.angle = 70;
			player.animations.play('rightFly', 7, true);
			
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
			cursors.up.onDown.add(function(){detectHit(0)});
			cursors.down.onDown.add(function(){detectHit(1)});
			cursors.left.onDown.add(function(){detectHit(2)});
			cursors.right.onDown.add(function(){detectHit(3)});
			wasd.up.onDown.add(function(){detectHit(0)});
			wasd.down.onDown.add(function(){detectHit(1)});
			wasd.left.onDown.add(function(){detectHit(2)});
			wasd.right.onDown.add(function(){detectHit(3)});
			
			//rhythm stuff
			arrowUI = game.add.sprite(100, 0.5, 'arrows');
			upLight = game.add.sprite(100, 0.5, 'upL');
			downLight = game.add.sprite(100, 0.5, 'downL');
			leftLight = game.add.sprite(100, 0.5, 'leftL');
			rightLight = game.add.sprite(100, 0.5, 'rightL');
			
			arrowUI.tint = 0xabb4cc;
			
			upLight.tint = 0xabb4cc;
			downLight.tint = 0xabb4cc;
			leftLight.tint = 0xabb4cc;
			rightLight.tint = 0xabb4cc;
			
			arrowUI.scale.setTo(.25, .25);
			
			upLight.scale.setTo(.25, .25);
			downLight.scale.setTo(.25, .25);
			leftLight.scale.setTo(.25, .25);
			rightLight.scale.setTo(.25, .25);
			
			upLight.alpha = 0.0;
			downLight.alpha = 0.0;
			leftLight.alpha = 0.0;
			rightLight.alpha = 0.0;
			
			arrowUI.tint = 0xffffff;
			arrows = new Array();
			arrowData = game.cache.getText('data2').split('\n');
			
			for(var i = 0; i < arrowData.length; i++)
			{
				if(arrowData[i]*1000 === 0)
					continue;
				arrowData[i] = arrowData[i]*1000;
				
				game.time.events.add(arrowData[i] - (((game.width -168)/500) * 1000) + 100, function(){spawnArrow(i);}, this);
			}
			
			//audio
			music = game.add.audio('Rhythm1');
			hit_sound = game.add.audio('blip');
			music.volume = 1.0;
			hit_sound.volume = .5;
			music.onStop.addOnce(Complete, this);
			music.play();	
			
			time = game.time.now;
			text_timer = time + 3000;
			cutscene1_timer = time + 1000;
			game.camera.flash(0xffffff, 500);
		},

		update: function() {
			//render();
			var time = game.time.now;
			
			this.front.tilePosition.x -= 20;
			this.mid.tilePosition.x -= 8;
			this.back.tilePosition.x -= 1;
			
			if(!played1)
				{	
					if(time >= cutscene1_timer)
					{
						played1 = true;
						player.animations.play('rightFly', 7, false, false);
						player.animations.stop();
					}
				}
				
			counter++;
			if(player !== null && player.body !== null)
			{
				player.body.velocity.y = (Math.sin(.005 * time) * 50);
				player.scale.setTo((Math.sin(.0005 * time) * 0.75) + 1.5 , (Math.sin(.0005 * time) * 0.75) + 1.5);
			}	
					
			if(!player.animations.getAnimation('rightFly').isPlaying)
			{
				player.animations.play('idle');
			}
			
			// if the arrow was missed then destroy it.
			if(arrows[0])
			{
				if(arrows[0].body)
				{
						if(arrows[0].body.x <= 0)
					{
						destroyArrow();
					}
				}
			}
			
			// control visual feedback
			if(cursors.up.isDown || wasd.up.isDown)
			{
				upLight.alpha = 1.0;
			}
			else {
				upLight.alpha = 0.0;
			}
			if(cursors.down.isDown || wasd.down.isDown)
			{
				downLight.alpha = 1.0;
			}
			else {
				downLight.alpha = 0.0;
			}
			if(cursors.left.isDown || wasd.left.isDown)
			{
				leftLight.alpha = 1.0;
			}
			else {
				leftLight.alpha = 0.0;
			}
			if(cursors.right.isDown || wasd.right.isDown)
			{
				rightLight.alpha = 1.0;
			}
			else {
				rightLight.alpha = 0.0;
			}
			
			if(finished)
				return;
			
			if(completed)
				{
					finished = true;
					//game completed, quit game
					game.camera.fade(0x39465c, 7000);
					game.time.events.add(8000, quitGame, this);
				}
		}	
	};
}