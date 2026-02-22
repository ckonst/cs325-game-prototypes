"use strict";

GameStates.makeMainMenu = function (game, shared) {

	var music = null;
	var playButton = null;
	var title;
	var bg;

	function startGame(pointer) {
		//	Ok, the Play Button has been clicked or touched, so let's stop the music (otherwise it'll carry on playing)
		music.stop();

		//	And start the actual game
		game.state.start('Level1');
	}
	// go to fullscreen mode
	function gofull() {
		/*	if (game.scale.isFullScreen)
			{
				game.scale.stopFullScreen();
			}
			else
			{
				game.scale.startFullScreen(false);
			}
		*/
		game.scale.startFullScreen(false);
	}

	return {

		create: function () {

			game.input.onDown.addOnce(function () {
				if (game.sound.usingWebAudio && game.sound.context.state !== 'running') {
					game.sound.context.resume();
					game.sound.mute = shared.isMuted;
				}
			});

			music = game.add.audio('TitleMusic');
			music.loopFull();

			bg = game.add.sprite(0, 0, 'TitlePage');
			bg.tint = 0xffffff;
			title = game.add.sprite((1137 / 2) - 400, 0, 'Title');
			title.tint = 0x2e7794;

			playButton = game.add.button((1137 / 2) - 96, 400, 'PlayButton', startGame, null, 'over', 'out', 'down');

			playButton.tint = 0x2e7794;

			// maintain aspect ratio
			game.scale.fullScreenScaleMode = Phaser.ScaleManager.SHOW_ALL;

			var muteButton = game.add.button(game.world.width - 50, 50, 'MutedIcon', toggleMute, this);
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
		},

		update: function () {
			//console.log("in main\n");
			game.input.onDown.add(gofull, this);
		},

	};
};
