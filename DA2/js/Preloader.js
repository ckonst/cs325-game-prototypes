"use strict";

GameStates.makePreloader = function( game ) {

	var background = null;
	var preloadBar = null;

	var ready = false;

    return {
    
        preload: function () {
    
            //Add loading screen assets
            background = game.add.sprite(-150, -80, 'preloaderBackground');
    
            // Title Screen Assets
			game.load.atlas('playButton', 'assets/img/play_button2.png', 'assets/img/play_button.json');
            game.load.audio('titleMusic', ['assets/audio/TitleScreen2.ogg']);
            game.load.image('titlePage', 'assets/img/MenuBG.png');
			game.load.image('Title', 'assets/img/TheHalfwayChild.png');
			
            //Main Game assets
			game.load.audio('GameBGM', ['assets/audio/GameBGM2.ogg']);
			game.load.audio('jump', ['assets/audio/jump2.ogg']);
			game.load.spritesheet('girl', 'assets/img/girl.png', 64, 64);
			game.load.tilemap('level1', 'assets/tilemaps/json/level1.json', null, Phaser.Tilemap.TILED_JSON);
			game.load.image('tiles', 'assets/tilemaps/tiles/foresttiles1.png');
			game.load.image('front', 'assets/img/forestfront.png');
			game.load.image('mid', 'assets/img/forestmid.png');
			game.load.image('back', 'assets/img/forestback.png');
			
			
			
        },
    
        create: function () {
    
            //	Once the load has finished we disable the crop because we're going to sit in the update loop for a short while as the music decodes
            //preloadBar.cropEnabled = false;
    
        },
    
        update: function () {
    
            //	You don't actually need to do this, but I find it gives a much smoother game experience.
            //	Basically it will wait for our audio file to be decoded before proceeding to the MainMenu.
            //	You can jump right into the menu if you want and still play the music, but you'll have a few
            //	seconds of delay while the mp3 decodes - so if you need your music to be in-sync with your menu
            //	it's best to wait for it to decode here first, then carry on.
            
            //	If you don't have any music in your game then put the game.state.start line into the create function and delete
            //	the update function completely.
            
            if (game.cache.isSoundDecoded('titleMusic') && ready == false)
            {
                ready = true;
                game.state.start('MainMenu');
            }
    
        }
    
    };
};
