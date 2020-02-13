"use strict";

GameStates.makePreloader = function( game ) {

	var background = null;
	var preloadBar = null;

	var ready = false;

    return {
    
        preload: function () {
    
            //Add loading screen assets
            background = game.add.sprite(-200, 0, 'preloaderBackground');
            preloadBar = game.add.sprite(200, 250, 'preloaderBar');
    
            //	This sets the preloadBar sprite as a loader sprite.
            //	What that does is automatically crop the sprite from 0 to full-width
            //	as the files below are loaded in.
            game.load.setPreloadSprite(preloadBar);
    
            // Title Screen Assets
			game.load.atlas('playButton', 'assets/img/play_button.png', 'assets/img/play_button.json');
            game.load.audio('titleMusic', ['assets/audio/TitleScreen.ogg']);
            game.load.image('titlePage', 'assets/img/TitleBG.png');
			game.load.image('Title', 'assets/img/BCC.png');
			
            //Main Game assets
			game.load.audio('GameBGM', ['assets/audio/GameBGM.ogg']);
			game.load.image('cheese', 'assets/img/biggie-cheese-small.png');
			game.load.image('cobble', 'assets/img/cobblestone_texture.png');
			game.load.image('background', 'assets/img/background.png');
			game.load.image('pepe', 'assets/img/trumpy.png');
			game.load.image('L', 'assets/img/smallL.png');
			
			//Victory Screen
			game.load.image('Win', 'assets/img/BiggieCheese.jpg');
			
			
			
        },
    
        create: function () {
    
            //	Once the load has finished we disable the crop because we're going to sit in the update loop for a short while as the music decodes
            preloadBar.cropEnabled = false;
    
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
