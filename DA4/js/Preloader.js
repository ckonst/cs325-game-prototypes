"use strict";

GameStates.makePreloader = function( game ) {

	var background = null;
	var preloadBar = null;

	var ready = false;

    return {
    
        preload: function () {
    
            //Add loading screen assets
            background = game.add.sprite(0, -240, 'preloaderBackground');
    
            // Title Screen Assets
			game.load.atlas('playButton', 'assets/img/play_button4.png', 'assets/img/play_button4.json');
            game.load.audio('titleMusic', 'assets/audio/game4Title.ogg');
            game.load.image('titlePage', 'assets/img/mainMenuBG.png');
			
            //Main Game assets
			game.load.audio('eHurt', 'assets/audio/EnemyHurt.ogg');
			game.load.audio('eShoot', 'assets/audio/EnemyShoot.ogg');
			
			game.load.audio('gameBGM', 'assets/audio/game4BGM.ogg');
			
			game.load.audio('pHurt', 'assets/audio/PlayerHurt.ogg');
			game.load.audio('pShoot', 'assets/audio/PlayerShoot.ogg');
			
			game.load.audio('phase', 'assets/audio/EnemyPhase.ogg');
			
			game.load.audio('eDefeat', 'assets/audio/EnemyDefeat.ogg');
			
			game.load.image('bc', 'assets/img/biggieCheeseClear.png');
			game.load.image('cd', 'assets/img/chickenDinner.jpg');
			game.load.image('co', 'assets/img/ChickenOmegaPix.png');
			game.load.image('cutlery1', 'assets/img/Cutlery1Clear.png');
			game.load.image('cutlery2', 'assets/img/Cutlery2.png');
			game.load.image('cutlery3', 'assets/img/Cutlery3.png');
			game.load.image('cutlery4', 'assets/img/Cutlery4.png');
			game.load.image('cutlery5', 'assets/img/Cutlery5.png');
			game.load.image('egg', 'assets/img/EggPix.png');
			game.load.image('eggSplat', 'assets/img/eggSplatPix.png');
			game.load.image('bg', 'assets/img/GameBG4.jpg');
			game.load.image('salm', 'assets/img/Salmonella.png');
			
			//End Screen
			game.load.audio('EndScreen', 'assets/audio/game4Victory.mp3');
			
			
			
			
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
