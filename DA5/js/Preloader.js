"use strict";

GameStates.makePreloader = function (game) {

	var background = null;
	var preloadBar = null;

	var ready = false;

	return {

		preload: function () {

			// Add loading screen assets
			background = game.add.sprite(-300, -75, 'PreloaderBackground');
			background.scale.setTo(1.5, 1);

			// Title Screen Assets
			game.load.atlas('PlayButton', 'assets/img/Menu/PlayButton.png', 'assets/img/Menu/PlayButton.json');
			game.load.audio('TitleMusic', ['assets/audio/Menu/TitleScreen.ogg']);
			game.load.image('TitlePage', 'assets/img/Menu/MenuBG.png');
			game.load.image('Title', 'assets/img/Menu/TheHalfwayChild.png');

			// Level 1 assets
			game.load.audio('BGM1', ['assets/audio/Level1/BGM1.ogg']);
			game.load.audio('Jump', ['assets/audio/Jump.ogg']);
			game.load.spritesheet('Girl', 'assets/img/SpriteSheet/Girl.png', 64, 64);
			game.load.tilemap('Level1', 'assets/tilemaps/json/Level1.json', null, Phaser.Tilemap.TILED_JSON);
			game.load.image('Tiles1', 'assets/img/Level1/ForestTiles.png');

			game.load.image('Front1', 'assets/img/Level1/ForestFront.png');
			game.load.image('Mid1', 'assets/img/Level1/ForestMid.png');
			game.load.image('Back1', 'assets/img/Level1/ForestBack.png');

			// Level 2 assets
			game.load.image('Front2', 'assets/img/Level2/ForestFront.png');
			game.load.image('Mid2', 'assets/img/Level2/ForestMid.png');
			game.load.image('Back2', 'assets/img/Level2/ForestBack.png');
			game.load.image('Tiles2', 'assets/img/Level2/TileFront.png');

			game.load.image('UpL', 'assets/img/UI/UpLight.png');
			game.load.image('DownL', 'assets/img/UI/DownLight.png');
			game.load.image('LeftL', 'assets/img/UI/LeftLight.png');
			game.load.image('RightL', 'assets/img/UI/RightLight.png');

			game.load.tilemap('Level2', 'assets/tilemaps/json/Level2.json', null, Phaser.Tilemap.TILED_JSON);
			game.load.audio('BGM2', ['assets/audio/Level2/BGM2.mp3']);
			game.load.audio('Blip', ['assets/audio/Level2/Blip.mp3']);
			game.load.text('RhythmData1', 'assets/rhythmMaps/Level2/RhythmMap1.txt');

			// UI assets
			game.load.image('Arrows', 'assets/img/UI/ArrowsStaticVertical.png');
			game.load.image('ArrowUp', 'assets/img/UI/UpSolid.png');
			game.load.image('ArrowLeft', 'assets/img/UI/LeftSolid.png');
			game.load.image('ArrowDown', 'assets/img/UI/DownSolid.png');
			game.load.image('ArrowRight', 'assets/img/UI/RightSolid.png');
			game.load.image('TextBox', 'assets/img/UI/TextBox1.png');
			game.load.image('MutedIcon', 'assets/img/UI/Muted.png');
			game.load.image('UnmutedIcon', 'assets/img/UI/Unmuted.png');
		},

		create: function () {

			//	Once the load has finished we disable the crop because we're going to sit in the update loop for a short while as the music decodes
			//preloadBar.cropEnabled = false;

		},

		update: function () {

			//	wait for our audio file to be decoded before proceeding to the MainMenu.

			if (game.cache.isSoundDecoded('TitleMusic') && ready == false) {
				ready = true;
				game.state.start('MainMenu');
			}

		}

	};
};
