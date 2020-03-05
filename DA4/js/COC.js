"use strict";

GameStates.makeGame = function( game, shared ) {
	var cs1 = ["WASD or Arrow Keys to move","\[space\] to shoot","Defeat Chicken Omega as fast as possible.", "Avoid salmonella from raw eggs."];
	var line = [];
	var wordIndex = 0;
	var lineIndex = 0;
	var wordDelay = 200;
	var lineDelay = 1200;
	var text, skipText;
	var bg;
	var music, eHurt, eShoot, pHurt, pShoot, phase;
	var tutFlag = true;
	var Chicken;
	var hover = false;
	var hitBox = null;
	var style = { font: "bold 18px Lucida Console", fill: "#FFFFFF"};
	var score, timer;
	var wasd, cursors;
	var salmonellaFlag = false;
	var winFlag = false;
	var deathTimer = 0;
	var eggs = [];
	var cutlery = [];
	var egg;
	var knife = null;
	var shoot_button;
	var player;
	var directionX = 'none', directionY = 'up', lastX = 'none', lastY = 'up';
	var HP = 100;
	var projectileTimer = 0;
	var eggTimer = 0;
	var eDefeat;
	var eggFlag = true;
	var phase;
	var phaseSound;
	var phase2Flag = true, phase3Flag = false;
	
	const salmonellaTime = 60000;
	const gravity = 400;
	const eSpeed = 400;
	const pSpeed = 300;
	
	function gameStart() {
		score = game.add.text(0,10, "", style);
			score.setShadow(3, 3, 'rgba(0,0,0,0.5)', 2);
		timer = game.add.text(350,10, "", style);
			timer.setShadow(3, 3, 'rgba(0,0,0,0.5)', 2);
		bg.alpha = 1.0;
		tutFlag = false;
		text.alpha = 0.0;
		skipText.alpha = 0.0;
		Chicken.alpha = 1.0;
		Chicken.body.velocity.x = eSpeed;
		
		player = game.add.sprite(400, 530, 'bc');
		game.physics.enable(player, Phaser.Physics.ARCADE);
		player.body.allowGravity = false;
		player.body.collideWorldBounds = true;
		player.anchor.setTo(0.5, 0.5);
		player.scale.x = 0.2;
		player.scale.y = 0.2;
		
		music.loopFull();
	}
	
	function eggPop(x,y,i,phase)
	{
		egg = game.add.sprite(x, y - 10, 'egg');
		game.physics.enable(egg, Phaser.Physics.ARCADE);
		egg.body.allowGravity = false;
		egg.body.collideWorldBounds = true;
		egg.angle = game.physics.arcade.moveToXY(egg, player.x, player.y, 150 * phase);
		egg.body.setSize(51, 70);
		switch(phase){
		case 1:
			egg.scale.x = 1.0;
			egg.scale.y = 1.0;
			break;
		case 2:
			egg.scale.x = .75;
			egg.scale.y = .75;
			break;
		case 3:
			egg.scale.x = .5;
			egg.scale.y = .5;
			break;
		}

		eggs.push(egg);
		eShoot.play();
		if(i % 10 === 0)
			eggFlag = true;
	}
	
	function eggDestroy(egg)
	{
		egg.destroy();
	}
	
	function render () {

		game.debug.text(game.time.physicsElapsed, 32, 32);

	}
	
	function quitGame() {

        //  Here you should destroy anything you no longer need.
        //  Stop music, delete sprites, purge caches, free resources, all that good stuff.
		music.stop();	
		bg.destroy();
		if(winFlag)
		{
			var time = game.time.now;
			shared.victory = true;
			shared.yourTime = time;
			if(shared.yourTime < shared.fastestTime)
			{
				shared.fastestTime = shared.yourTime;
			}
		}
		else
			shared.victory = false;

		phase2Flag = true, phase3Flag = false;
		eggFlag = true;
		HP = 100;
		projectileTimer = 0;
		eggTimer = 0;
		tutFlag = true;
		hover = false;
		hitBox = null;
		salmonellaFlag = false;
		winFlag = false;
		deathTimer = 0;
		eggs = [];
		cutlery = [];
		knife = null;
		phase = 1;
        game.state.start('EndScreen');

    }
	
	function nextLine() {

		if (lineIndex === cs1.length)
		{
			//  We're finished
			lineIndex = 0;
			wordIndex = 0;
			if(tutFlag)
				gameStart();
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
		text.text = text.text.concat(line[wordIndex] + " ");

		//  Advance the word index to the next word in the line
		wordIndex++;

		//  Last word?
		if (wordIndex === line.length)
		{
			//  Add a carriage return
			text.text = text.text.concat("\n");

			//  Get the next line after the lineDelay amount of ms has elapsed
			game.time.events.add(lineDelay, nextLine, this);
		}
	}
			
	return {
		create: function() {

			game.physics.startSystem(Phaser.Physics.ARCADE);

			bg = game.add.sprite(-75, -300, 'bg');
			bg.alpha = 0.25;
			
			text = game.add.text(10, 10, "", style);
					text.setShadow(3, 3, 'rgba(0,0,0,0.5)', 2);
					text.setTextBounds(0, 0, 400, 100);
					
			nextLine(cs1, text);
			
			skipText = game.add.text(10, 550, "Left click to continue", style);
			
			Chicken = game.add.sprite(0, 0, 'co');
			Chicken.alpha = 0.0;
			game.physics.enable(Chicken, Phaser.Physics.ARCADE);
			Chicken.body.collideWorldBounds = true;
			Chicken.body.allowGravity = false;
			Chicken.body.immovable = true;
			Chicken.anchor.setTo(0.5, 0.5);
			Chicken.body.setSize(77, 130);

			game.physics.arcade.gravity.y = gravity;

			//controls
			game.input.mouse.capture = true;
			cursors = game.input.keyboard.createCursorKeys();
			wasd = {
				up: game.input.keyboard.addKey(Phaser.Keyboard.W),
				down: game.input.keyboard.addKey(Phaser.Keyboard.S),
				left: game.input.keyboard.addKey(Phaser.Keyboard.A),
				right: game.input.keyboard.addKey(Phaser.Keyboard.D),
			};
			shoot_button = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
			
			
			
			//audio
			music = game.add.audio('gameBGM');
			music.volume = .6;
			
			eHurt = game.add.audio('eHurt');
			eShoot = game.add.audio('eShoot');
			
			pHurt = game.add.audio('pHurt');
			pShoot = game.add.audio('pShoot');
			
			phaseSound = game.add.audio('phase');
			
			eDefeat = game.add.audio('eDefeat');
			
			phase = 1;
		},

		update: function() {
			//render();
			var time = game.time.now;
			var mouseClick;
			
			mouseClick = game.input.activePointer.leftButton.isDown;
			
			//in tutorial
			if(tutFlag){
				if(mouseClick)
				{
					gameStart();
				}
				return;
			}
			
			//in game
			
			var knifeCollided, eggCollided;
			
			//Win Condition
			if(HP < 0)
				{
					//game over
					winFlag = true; //you won
					eDefeat.play();
					quitGame();
				}
			
			//Failure condition
			if(salmonellaFlag) //if you have salmonella, you will die 
			{
				if(deathTimer === 0)
				{
					deathTimer = time + salmonellaTime;
				}
				timer.setText("Salmonella will kill you in: " + Math.floor((deathTimer - time) / 1000));
				if (time >= deathTimer)
				{
					//game over
					winFlag = false; // you lost
					quitGame();	
				}
			}
			
			score.setText("BOSS HP: " + HP + "\%");
			if(HP < 66 && phase2Flag)
			{
				phase = 2;
				phaseSound.play();
				phase2Flag = false;
				phase3Flag = true;
			}
			if(HP < 33 && phase3Flag)
			{
				phase = 3;
				phaseSound.play();
				phase3Flag = false;
			}
			
			//player movement X
			if (cursors.left.isDown || wasd.left.isDown)
			{
				if(player.body !== null)
					player.body.velocity.x = -pSpeed;

				if (directionX != 'left')
				{
					directionX = 'left';
				}
			}
			else if (cursors.right.isDown || wasd.right.isDown)
			{
				if(player.body !== null)
					player.body.velocity.x = pSpeed;

				if (directionX != 'right')
				{
					directionX = 'right';
				}
			}
			else
			{
				if(player.body !== null)
					player.body.velocity.x = 0;
				if (directionX != 'none')
				{
					directionX = 'none';
				}
			}
			//player movement Y
			if (cursors.up.isDown || wasd.up.isDown)
			{
				if(player.body !== null)
					player.body.velocity.y = -pSpeed;

				if (directionY != 'up')
				{
					directionY = 'up';
				}
			}
			else if (cursors.down.isDown || wasd.down.isDown)
			{
				if(player.body !== null)
					player.body.velocity.y = pSpeed;

				if (directionY!= 'down')
				{
					directionY = 'down';
				}
			}
			else
			{
				if(player.body !== null)
					player.body.velocity.y = 0;
				if (directionY!= 'none')
				{
					directionY = 'none';
				}
			}
			
			//player shooting
			if(shoot_button.isDown && time > projectileTimer)
			{
				var randy = Math.floor((Math.random() * 5) + 1);
				switch (randy){
					case 1:
						knife = game.add.sprite(player.x, player.y - 45, 'cutlery1');
						knife.scale.x = 0.25;
						knife.scale.y = 0.25;
						break;
					case 2:
						knife = game.add.sprite(player.x, player.y - 45, 'cutlery2');
						knife.scale.x = 0.1;
						knife.scale.y = 0.1;
						break;
					case 3:
						knife = game.add.sprite(player.x, player.y - 45, 'cutlery3');
						knife.scale.x = 0.1;
						knife.scale.y = 0.1;
						break;
					case 4:
						knife = game.add.sprite(player.x, player.y - 45, 'cutlery4');
						knife.scale.x = 0.15;
						knife.scale.y = 0.15;
						break;
					case 5:
						knife = game.add.sprite(player.x, player.y - 45, 'cutlery5');
						knife.scale.x = 0.05;
						knife.scale.y = 0.05;
						break;
				}
				game.physics.enable(knife, Phaser.Physics.ARCADE);
						knife.anchor.setTo(0.5, 0.5);
						
				if(directionY === 'up')
					knife.body.velocity.y = -500;
				else if(directionY === 'down')
					knife.body.velocity.y = 500;
				if(directionX === 'left')
					knife.body.velocity.x = -500;
				else if(directionX === 'right')
					knife.body.velocity.x = 500;
				if(directionX === 'none' && directionY === 'none')
				{
					if(lastX === 'left')
						knife.body.velocity.x = -500;
					if(lastX === 'right')
						knife.body.velocity.x = 500;
					if(lastY === 'up')
						knife.body.velocity.y = -500;
					if(lastY === 'down')
						knife.body.velocity.y = 500;
				}
				if(directionX !== 'none' || directionY !== 'none') 
				{
					lastX = directionX;
					lastY = directionY;
				}
				
				if(knife.body.velocity.y !== 0)
					knife.body.angularVelocity = knife.body.velocity.y;
				else if(knife.body.velocity.x !== 0)
					knife.body.angularVelocity = knife.body.velocity.x;
				else 
					knife.body.angularVelocity = -500;
					
				knife.body.collideWorldBounds = true;
				knife.body.allowGravity = false;
				knife.body.immovable = true;
				cutlery.push(knife);
				projectileTimer = time + 500;
				pShoot.play();
			}
			
			//knife(s) hit enemy
			for(var i = 0; i < cutlery.length; i++)
			{
				var cur = cutlery[i];
				knifeCollided = game.physics.arcade.collide(cur, Chicken);
				if(knifeCollided) {
				//enemy takes damage
				HP -= 2;
				eHurt.play();
				cur.destroy();
				}
				
				//knife(s) hit world bound
				if(cur !== null && cur.body !== null)
				{
					if(cur.body.blocked.down === true ||
					cur.body.blocked.up === true ||
					cur.body.blocked.left === true ||
					cur.body.blocked.right === true)
					{
						cutlery[i].destroy();
					}
				}
			}
			
			//Chicken shooting
			if(time >= eggTimer && eggFlag)
			{
				eggTimer = time + 10000;
				for(var i = 0; i < phase * 10; i++)
				{
					game.time.events.add(200 * i, function() {eggPop(Chicken.x, Chicken.y, i, phase)}, this);
				}
				eggFlag = false;
			}
			
			//egg collision
			for(var i = 0; i < eggs.length; i++)
			{
				var cur = eggs[i];
				eggCollided = game.physics.arcade.collide(cur, player);
				if(eggCollided) //you got hit!
				{
					pHurt.play();
					var randy = Math.floor((Math.random()* 30) + 1);
					if(randy === 1)
					{ // you have salmonella!
						salmonellaFlag = true;
						var salm = game.add.sprite(300, -5, 'salm');
						salm.scale.x = 0.04;
						salm.scale.y = 0.04;
					}
					var splat = game.add.sprite(cur.x, cur.y, 'eggSplat');
					game.time.events.add(1500, function(){eggDestroy(splat)}, this);
					switch(phase){
							case 1:
								splat.scale.x = 1.0;
								splat.scale.y = 1.0;
								break;
							case 2:
								splat.scale.x = .75;
								splat.scale.y = .75;
								break;
							case 3:
								splat.scale.x = .5;
								splat.scale.y = .5;
								break;
							}
					cur.destroy();
				
				}
				
				if(cur !== null && cur.body !== null)
				{
					if(
					cur.body.blocked.down === true ||
					cur.body.blocked.up === true ||
					cur.body.blocked.left === true ||
					cur.body.blocked.right === true)
					{
					var splat = game.add.sprite(cur.x, cur.y, 'eggSplat');
					game.time.events.add(1500, function(){eggDestroy(splat)}, this);
					switch(phase){
							case 1:
								splat.scale.x = 1.0;
								splat.scale.y = 1.0;
								break;
							case 2:
								splat.scale.x = .75;
								splat.scale.y = .75;
								break;
							case 3:
								splat.scale.x = .5;
								splat.scale.y = .5;
								break;
							}
						cur.destroy();
					}
				}
				
			}
			
			
			
			//Chicken's movement
			if(Chicken !== null && Chicken.body !== null)
				{
					Chicken.body.velocity.y = (Math.sin(.0005 * time) * eSpeed * 2);
					
					if(Chicken.body.blocked.down === true)
					{
						Chicken.body.velocity.y = -eSpeed;
					}
					if(Chicken.body.blocked.up === true)
					{
						Chicken.body.velocity.y = eSpeed;
					}
					if(Chicken.body.blocked.left === true)
					{
						Chicken.body.velocity.x = eSpeed;
					}
					if(Chicken.body.blocked.right === true)
					{
						Chicken.body.velocity.x = -eSpeed;
					}
				}
			
			
		}
	};

}